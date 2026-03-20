import asyncio
import json
import re
from typing import Any, Dict, List, Type, TypeVar

from openai import APIConnectionError, APIStatusError, AsyncOpenAI, RateLimitError
from pydantic import BaseModel, ValidationError

from app.core.config import get_settings
from app.schemas.models import NmapResponse, PhishingResponse, SafetyMode, TutorResponse

T = TypeVar("T", bound=BaseModel)


class AIServiceError(Exception):
    pass


class AIServiceTimeout(AIServiceError):
    pass


SYSTEM_PROMPT = """You are SafeNet AI — a friendly, trustworthy digital safety assistant helping everyday people in Africa.

Your audience includes students, market women, traders, okada riders, civil servants, and young people using WhatsApp, mobile money, and basic internet.

Core writing rules:
- Use simple, everyday English.
- Be warm, calm, and encouraging.
- Use practical African daily-life examples when useful (mobile money, banks, WhatsApp groups, cyber cafes, public Wi-Fi, small business payments).
- Avoid fear language and avoid technical jargon unless you explain it simply.
- Never ask for personal sensitive information.

MODE: PHISHING
When input starts with MODE: PHISHING:
- Analyze message/link for scam risk.
- Return structured result with:
  verdict: one of Safe, Suspicious, Dangerous
  explanation: one short paragraph in simple language
  red_flags: 3-7 short bullet-friendly warning signs
  actions: 3-5 immediate protective steps

MODE: NMAP
When input starts with MODE: NMAP:
- Translate raw Nmap scan into plain language for non-technical users.
- Return structured result with:
  summary: one simple sentence
  open_ports: list of explained open ports/services in plain words
  risk_level: one of Low, Medium, High, Very High
  risk_explanation: short simple paragraph with practical analogy
  next_steps: 3-6 simple actions user can take now

MODE: TUTOR
When input starts with MODE: TUTOR:
- Answer as a friendly cyber hygiene tutor.
- Keep response short and clear.
- End with one suggestion or a follow-up question.
- Return structured result with:
  answer: friendly answer text
"""


def _get_client() -> AsyncOpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise AIServiceError("AI service is not configured. Please set OPENAI_API_KEY.")

    return AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)


def _build_mode_prompt(mode: SafetyMode, user_input: str) -> str:
    if mode == SafetyMode.PHISHING:
        return f"MODE: PHISHING\n\n{user_input}"
    if mode == SafetyMode.NMAP:
        return f"MODE: NMAP\n\n{user_input}"
    return f"MODE: TUTOR\n\nUser: {user_input}"


def _extract_json_block(text: str) -> Dict[str, Any]:
    if not text:
        return {}

    stripped = text.strip()

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass

    fenced = re.search(r"```json\s*(\{.*?\})\s*```", stripped, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        try:
            return json.loads(fenced.group(1))
        except json.JSONDecodeError:
            return {}

    first = stripped.find("{")
    last = stripped.rfind("}")
    if first != -1 and last != -1 and first < last:
        try:
            return json.loads(stripped[first : last + 1])
        except json.JSONDecodeError:
            return {}

    return {}


def _to_list(value: Any, min_items: int = 1, max_items: int = 7) -> List[str]:
    if isinstance(value, list):
        items = [str(item).strip() for item in value if str(item).strip()]
    elif isinstance(value, str):
        lines = [line.strip("- *\t ") for line in value.splitlines() if line.strip()]
        items = [line for line in lines if line]
    else:
        items = []

    if not items:
        return []

    return items[:max(max_items, min_items)]


def _normalize_phishing(data: Dict[str, Any]) -> PhishingResponse:
    verdict = str(data.get("verdict", "Suspicious")).strip().title()
    if verdict not in {"Safe", "Suspicious", "Dangerous"}:
        verdict = "Suspicious"

    explanation = str(data.get("explanation", "This message has warning signs. Please verify before taking action.")).strip()

    red_flags = _to_list(data.get("red_flags"), min_items=3, max_items=7)
    if len(red_flags) < 3:
        red_flags = [
            "Unexpected request for money, PIN, or OTP.",
            "Message creates urgency to make you act quickly.",
            "Sender identity is not clearly verified.",
        ]

    actions = _to_list(data.get("actions"), min_items=3, max_items=5)
    if len(actions) < 3:
        actions = [
            "Do not click links or share secret codes.",
            "Verify using the official bank or telecom number.",
            "Block and report the sender.",
        ]

    return PhishingResponse(
        verdict=verdict,
        explanation=explanation,
        red_flags=red_flags,
        actions=actions,
    )


def _normalize_nmap(data: Dict[str, Any]) -> NmapResponse:
    summary = str(data.get("summary", "Your scan needs review, but you can improve safety with a few clear steps.")).strip()

    open_ports = _to_list(data.get("open_ports"), min_items=1, max_items=12)
    if not open_ports:
        open_ports = ["No clear open ports were extracted. Please paste full raw scan output."]

    risk_level = str(data.get("risk_level", "Medium")).strip().title()
    if risk_level not in {"Low", "Medium", "High", "Very High"}:
        risk_level = "Medium"

    risk_explanation = str(
        data.get(
            "risk_explanation",
            "Think of open ports like doors in a building. The more risky doors left open, the easier it is for attackers to enter.",
        )
    ).strip()

    next_steps = _to_list(data.get("next_steps"), min_items=3, max_items=6)
    if len(next_steps) < 3:
        next_steps = [
            "Close services you do not use.",
            "Update your system and router firmware.",
            "Restrict remote access to trusted networks only.",
        ]

    return NmapResponse(
        summary=summary,
        open_ports=open_ports,
        risk_level=risk_level,
        risk_explanation=risk_explanation,
        next_steps=next_steps,
    )


def _normalize_tutor(data: Dict[str, Any]) -> TutorResponse:
    answer = str(
        data.get(
            "answer",
            "You are doing the right thing by asking. Start with strong passwords and two-step verification. Would you like a quick checklist for WhatsApp safety?",
        )
    ).strip()

    return TutorResponse(answer=answer)


def _fallback_phishing(text: str) -> PhishingResponse:
    lowered = text.lower()
    risky_keywords = [
        "otp",
        "pin",
        "password",
        "urgent",
        "click",
        "link",
        "winner",
        "won",
        "verify account",
        "bank",
        "transfer",
        "limited time",
    ]
    hits = []
    for keyword in risky_keywords:
        pattern = r"\b" + re.escape(keyword).replace(r"\ ", r"\s+") + r"\b"
        if re.search(pattern, lowered):
            hits.append(keyword)

    if len(hits) >= 3:
        verdict = "Dangerous"
    elif len(hits) >= 1:
        verdict = "Suspicious"
    else:
        verdict = "Safe"

    if verdict == "Safe":
        explanation = "This message does not show strong scam patterns, but always verify unknown senders."
        red_flags = [
            "Unknown sender identity.",
            "Any unexpected request should be verified.",
            "Check links before opening.",
        ]
    else:
        explanation = "This message contains common scam patterns like urgency, link prompts, or secret code requests."
        red_flags = [
            "It pushes you to act quickly.",
            "It may ask for private information or codes.",
            "It includes suspicious payment or link instructions.",
        ]

    actions = [
        "Do not click unknown links or share OTP/PIN.",
        "Verify with official contact numbers.",
        "Block and report the sender.",
    ]

    return PhishingResponse(
        verdict=verdict,
        explanation=explanation,
        red_flags=red_flags,
        actions=actions,
    )


def _has_scam_signals(text: str) -> bool:
    lowered = text.lower()
    risky_keywords = [
        "otp",
        "pin",
        "password",
        "urgent",
        "immediately",
        "click",
        "link",
        "winner",
        "won",
        "verify account",
        "bank",
        "transfer",
        "limited time",
        "crypto",
        "gift card",
        "prize",
    ]
    for keyword in risky_keywords:
        pattern = r"\b" + re.escape(keyword).replace(r"\ ", r"\s+") + r"\b"
        if re.search(pattern, lowered):
            return True
    return False


def _fallback_nmap(scan_text: str) -> NmapResponse:
    lowered = scan_text.lower()
    open_count = lowered.count(" open ")

    if open_count >= 6:
        risk_level = "High"
    elif open_count >= 3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return NmapResponse(
        summary="Your scan was parsed using local fallback analysis.",
        open_ports=["Review listed open ports and keep only required services exposed."],
        risk_level=risk_level,
        risk_explanation="More open ports usually means a larger attack surface, like leaving more doors unlocked.",
        next_steps=[
            "Close unused services and ports.",
            "Update software and router firmware.",
            "Allow remote access only from trusted IP addresses.",
        ],
    )


def _fallback_tutor(question: str) -> TutorResponse:
    return TutorResponse(
        answer=(
            "I could not reach the cloud AI right now, but here is a safe rule: use strong unique passwords, "
            "enable two-step verification, and never share OTP codes. Ask again in a moment for a detailed answer."
        )
    )


async def call_safenet_ai(prompt: str, output_model: Type[T]) -> T:
    settings = get_settings()
    client = _get_client()

    response_schema = {
        "type": "json_schema",
        "json_schema": {
            "name": output_model.__name__,
            "strict": True,
            "schema": output_model.model_json_schema(),
        },
    }

    try:
        # First attempt: strict structured output.
        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=settings.openai_model,
                temperature=0.2,
                response_format=response_schema,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            ),
            timeout=settings.openai_timeout_seconds,
        )
    except APIStatusError:
        # Some OpenAI-compatible providers may reject strict json_schema.
        # Retry without response_format and rely on JSON extraction + normalization.
        response = await asyncio.wait_for(
            client.chat.completions.create(
                model=settings.openai_model,
                temperature=0.2,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            ),
            timeout=settings.openai_timeout_seconds,
        )
    except asyncio.TimeoutError as exc:
        raise AIServiceTimeout("AI service is taking too long. Please try again.") from exc
    except RateLimitError as exc:
        raise AIServiceError("AI service is busy right now. Please try again in a moment.") from exc
    except APIConnectionError as exc:
        raise AIServiceError("Could not reach AI service. Please try again soon.") from exc
    except Exception as exc:
        raise AIServiceError("Unexpected AI error. Please try again.") from exc

    content = response.choices[0].message.content if response.choices else ""
    parsed_dict = _extract_json_block(content)

    # Groq/OpenAI-compatible providers may return plain text for tutor mode.
    # If no JSON is detected, preserve the raw answer instead of using defaults.
    if output_model == TutorResponse and not parsed_dict and content.strip():
        parsed_dict = {"answer": content.strip()}

    try:
        return output_model.model_validate(parsed_dict)
    except ValidationError:
        if output_model == PhishingResponse:
            return _normalize_phishing(parsed_dict)  # type: ignore[return-value]
        if output_model == NmapResponse:
            return _normalize_nmap(parsed_dict)  # type: ignore[return-value]
        if output_model == TutorResponse:
            return _normalize_tutor(parsed_dict)  # type: ignore[return-value]

        raise AIServiceError("AI returned invalid response format.")


async def analyze_phishing(text: str) -> PhishingResponse:
    prompt = _build_mode_prompt(SafetyMode.PHISHING, text)
    try:
        result = await call_safenet_ai(prompt=prompt, output_model=PhishingResponse)
        normalized = _normalize_phishing(result.model_dump())

        # Guard against false positives when provider returns low-quality structured output.
        # If verdict is Suspicious but no scam signals exist, prefer local heuristic.
        if normalized.verdict == "Suspicious" and not _has_scam_signals(text):
            return _fallback_phishing(text)

        return normalized
    except (AIServiceError, AIServiceTimeout):
        return _fallback_phishing(text)


async def analyze_nmap(scan_text: str) -> NmapResponse:
    prompt = _build_mode_prompt(SafetyMode.NMAP, scan_text)
    try:
        result = await call_safenet_ai(prompt=prompt, output_model=NmapResponse)
        return _normalize_nmap(result.model_dump())
    except (AIServiceError, AIServiceTimeout):
        return _fallback_nmap(scan_text)


async def tutor_reply(question: str) -> TutorResponse:
    prompt = _build_mode_prompt(SafetyMode.TUTOR, question)
    try:
        result = await call_safenet_ai(prompt=prompt, output_model=TutorResponse)
        return _normalize_tutor(result.model_dump())
    except (AIServiceError, AIServiceTimeout):
        return _fallback_tutor(question)
