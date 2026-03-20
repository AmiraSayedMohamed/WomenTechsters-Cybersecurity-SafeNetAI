import React, { useState } from 'react';
    import { AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { processSafetyRequest } from '../components/AIEngine';
    import type { SafetyResult } from '../components/AIEngine';
    import { motion, AnimatePresence } from 'framer-motion';

    const PhishingDetector = () => {
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState<SafetyResult | null>(null);

      const handleCheck = async () => {
        if (!input.trim()) return;
        setLoading(true);
        const res = await processSafetyRequest('PHISHING', input);
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
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Scam & Phishing Detector</h1>
              <p className="text-slate-600 mb-8">
                Paste any suspicious WhatsApp message, SMS, or email below. We'll tell you if it's safe.
              </p>

              <textarea
                className="w-full h-48 p-6 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all mb-6 text-lg"
                placeholder="Example: 'Congratulations! You have won 500,000 Naira. Click here to claim...'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                onClick={handleCheck}
                disabled={loading || !input.trim()}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Check Message Now'}
              </button>
            </div>

            <AnimatePresence>
              {result && result.success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className={`p-8 rounded-3xl border-2 flex items-start gap-6 ${
                    result.verdict === 'Safe' ? 'bg-emerald-50 border-emerald-200' :
                    result.verdict === 'Suspicious' ? 'bg-amber-50 border-amber-200' :
                    'bg-rose-50 border-rose-200'
                  }`}>
                    <div className="mt-1">
                      {result.verdict === 'Safe' ? <CheckCircle className="text-emerald-600" size={40} /> :
                       result.verdict === 'Suspicious' ? <AlertTriangle className="text-amber-600" size={40} /> :
                       <ShieldAlert className="text-rose-600" size={40} />}
                    </div>
                    <div>
                      <h2 className={`text-3xl font-black mb-2 ${
                        result.verdict === 'Safe' ? 'text-emerald-700' :
                        result.verdict === 'Suspicious' ? 'text-amber-700' :
                        'text-rose-700'
                      }`}>
                        {result.verdict || 'Suspicious'}
                      </h2>
                      <p className="text-slate-800 text-lg font-medium leading-relaxed">
                        {result.summary || 'Please check this message carefully.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-amber-500" />
                        Red Flags Found
                      </h3>
                      <ul className="space-y-3">
                        {result.redFlags?.map((flag, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} className="text-emerald-500" />
                        What to do now
                      </h3>
                      <ol className="space-y-3">
                        {result.steps?.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600">
                            <span className="font-bold text-primary">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <button
                    onClick={() => { setResult(null); setInput(''); }}
                    className="w-full py-4 text-slate-500 font-medium hover:text-primary transition-colors"
                  >
                    Check another message
                  </button>
                </motion.div>
              )}
              {result && !result.success && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {result.error || 'Failed to analyze this message. Please try again.'}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    };

    export default PhishingDetector;