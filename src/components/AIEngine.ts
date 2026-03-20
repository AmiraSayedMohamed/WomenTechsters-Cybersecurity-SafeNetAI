export interface SafetyResult {
  success: boolean;
  verdict?: 'Safe' | 'Suspicious' | 'Dangerous';
  summary?: string;
  redFlags?: string[];
  steps?: string[];
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Very High';
  explanation?: string[];
  answer?: string;
  error?: string;
}

// Get API URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const HEALTH_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + '/health' || 'http://localhost:8000/health';
let onBackendWakingUp: ((message: string) => void) | null = null;

export function setBackendWakeupCallback(callback: (message: string) => void) {
  onBackendWakingUp = callback;
}

async function ensureBackendAwake(): Promise<boolean> {
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 2000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1 && onBackendWakingUp) {
        onBackendWakingUp(`جاري إيقاظ السيرفر... محاولة ${attempt} من ${MAX_RETRIES}`);
      }

      const response = await fetch(HEALTH_URL, {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        if (onBackendWakingUp) {
          onBackendWakingUp('✓ السيرفر جاهز، جاري معالجة طلبك...');
        }
        return true;
      }
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * attempt;
        if (onBackendWakingUp) {
          onBackendWakingUp(`السيرفر يستيقظ، لو سمحت انتظر... (${Math.ceil(delay / 1000)} ثواني)`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return false;
}

export async function processSafetyRequest(
  mode: string,
  text: string
): Promise<SafetyResult> {
  try {
        // Ensure backend is awake before making request
        const isAwake = await ensureBackendAwake();
        if (!isAwake) {
          return {
            success: false,
            error: 'Backend server is not responding. Please try again.',
          };
        }
    let endpoint = '';
    let payload: Record<string, string> = { text };

    switch (mode) {
      case 'PHISHING':
        endpoint = `${API_BASE_URL}/phishing/check`;
        payload = { text };
        break;
      case 'NMAP':
        endpoint = `${API_BASE_URL}/nmap/translate`;
        payload = { scan_text: text };
        break;
      case 'TUTOR':
        endpoint = `${API_BASE_URL}/tutor/chat`;
        payload = { question: text };
        break;
      default:
        return {
          success: false,
          error: `Unknown mode: ${mode}`,
        };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `API Error: ${response.status}`,
      };
    }

    const result = await response.json();

    if (mode === 'PHISHING') {
      return {
        success: true,
        verdict: result.verdict,
        summary: result.explanation,
        redFlags: Array.isArray(result.red_flags) ? result.red_flags : [],
        steps: Array.isArray(result.actions) ? result.actions : [],
      };
    }

    if (mode === 'NMAP') {
      return {
        success: true,
        riskLevel: result.risk_level,
        summary: result.summary,
        explanation: [result.risk_explanation].filter(Boolean),
        steps: Array.isArray(result.next_steps) ? result.next_steps : [],
      };
    }

    return {
      success: true,
      answer: result.answer,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
