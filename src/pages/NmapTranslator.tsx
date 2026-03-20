import React, { useState } from 'react';
    import { Terminal, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
    import { Link } from 'react-router-dom';
  import { processSafetyRequest } from '../components/AIEngine.ts';
  import type { SafetyResult } from '../components/AIEngine.ts';
    import { motion, AnimatePresence } from 'framer-motion';

    const NmapTranslator = () => {
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState<SafetyResult | null>(null);

      const handleTranslate = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const res = await processSafetyRequest('NMAP', input);
        setResult(res as SafetyResult);
        setLoading(false);
      };

      return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-primary" size={32} />
                <h1 className="text-3xl font-bold text-slate-900">Nmap Results Translator</h1>
              </div>
              <p className="text-slate-600 mb-8">
                Paste your raw network scan results below. We'll explain what they mean for your safety in simple words.
              </p>

              <textarea
                className="w-full h-48 p-6 rounded-2xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-6"
                placeholder="Starting Nmap 7.80...&#10;Nmap scan report for 192.168.1.1&#10;PORT   STATE SERVICE&#10;80/tcp open  http..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                onClick={handleTranslate}
                disabled={loading || !input.trim()}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Explain This Scan'}
              </button>
            </div>

            <AnimatePresence>
              {result && result.success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className={`p-8 rounded-3xl border-2 ${
                    result.riskLevel === 'Low' ? 'bg-emerald-50 border-emerald-200' :
                    result.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-rose-50 border-rose-200'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Risk Level</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        result.riskLevel === 'Low' ? 'bg-emerald-200 text-emerald-800' :
                        result.riskLevel === 'Medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-rose-200 text-rose-800'
                      }`}>
                        {result.riskLevel}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{result.summary}</h2>
                    <div className="space-y-3">
                      {(result.explanation ?? []).map((exp, i) => (
                        <p key={i} className="text-slate-700 leading-relaxed">{exp}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-primary" />
                      Next Easy Steps
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {(result.steps ?? []).map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-700 font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { setResult(null); setInput(''); }}
                    className="w-full py-4 text-slate-500 font-medium hover:text-primary transition-colors"
                  >
                    Translate another scan
                  </button>
                </motion.div>
              )}
              {result && !result.success && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {result.error || 'Failed to translate this scan. Please try again.'}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    };

    export default NmapTranslator;