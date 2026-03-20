import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, BookOpen, Lock, CheckCircle2, Zap, Globe, Wifi, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const tools = [
    {
      title: "Check a suspicious message",
      desc: "Paste a WhatsApp, SMS, or email to see if it's a scam.",
      icon: <Search className="text-blue-600" size={32} />,
      path: "/phishing",
      color: "bg-blue-50 border-blue-100"
    },
    {
      title: "Understand my network scan",
      desc: "Turn confusing Nmap results into simple English advice.",
      icon: <ShieldCheck className="text-emerald-600" size={32} />,
      path: "/nmap",
      color: "bg-emerald-50 border-emerald-100"
    },
    {
      title: "Learn how to stay safe online",
      desc: "Bite-sized lessons on passwords, mobile money, and more.",
      icon: <BookOpen className="text-amber-600" size={32} />,
      path: "/learning",
      color: "bg-amber-50 border-amber-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Production Status Banner */}
      <div className={`${isOnline ? 'bg-emerald-600' : 'bg-amber-600'} text-white py-2 px-6 text-center text-xs font-bold flex items-center justify-center gap-4 transition-colors`}>
        <div className="flex items-center gap-1">
          <CheckCircle2 size={14} />
          <span>SafeNet AI v1.0 (Production Ready)</span>
        </div>
        <div className="h-3 w-px bg-white/30 hidden sm:block" />
        <div className="flex items-center gap-1">
          {isOnline ? <Wifi size={14} /> : <Wifi size={14} className="opacity-50" />}
          <span>{isOnline ? 'System Online' : 'Offline Mode Active'}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Zap size={12} /> Fast Loading
            </span>
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              <Globe size={12} /> Works on Slow Internet
            </span>
            <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Smartphone size={12} /> Mobile First
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Your Digital Shield in <span className="text-primary">Africa</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Simple tools to protect your money, your family, and your business from online thieves. 
            No account needed. No data saved. <strong>Ready for real-time use.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/phishing" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg">
              Check a Message
            </Link>
            <Link to="/learning" className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors">
              Start Learning
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={tool.path} className={`block p-8 rounded-2xl border-2 ${tool.color} hover:shadow-xl transition-all group h-full`}>
                <div className="mb-6 group-hover:scale-110 transition-transform inline-block">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                <p className="text-slate-600 leading-relaxed">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deployment Readiness Dashboard */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="text-primary" /> Production Readiness
              </h2>
              <p className="text-slate-400">SafeNet AI is optimized for deployment and real-world use.</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-sm font-mono">
              Build: 2026.03.19-STABLE
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Globe size={20} />
              </div>
              <h4 className="font-bold">PWA Enabled</h4>
              <p className="text-sm text-slate-400">Installable on Android/iOS. Works offline once loaded.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                <Lock size={20} />
              </div>
              <h4 className="font-bold">Privacy First</h4>
              <p className="text-sm text-slate-400">Zero data collection. All processing is ephemeral.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400">
                <Zap size={20} />
              </div>
              <h4 className="font-bold">Edge Ready</h4>
              <p className="text-sm text-slate-400">AI Engine is ready to connect to real-time LLM APIs.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                <Search size={20} />
              </div>
              <h4 className="font-bold">SEO Optimized</h4>
              <p className="text-sm text-slate-400">Fully indexed and ready for organic discovery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-3xl mx-auto bg-slate-50 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-slate-200">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Lock size={40} className="text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2 text-slate-900">Everything is private</h4>
            <p className="text-slate-600">
              We do not save your messages, scans, or personal info. SafeNet AI works instantly and forgets everything when you close the page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;