import React from 'react';
    import { Target, Users, Globe, ShieldCheck } from 'lucide-react';

    const About = () => {
      return (
        <div className="min-h-screen bg-white py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl font-bold text-slate-900 mb-8">About SafeNet AI</h1>
            
            <div className="prose prose-slate max-w-none mb-16">
              <p className="text-xl text-slate-600 leading-relaxed">
                SafeNet AI was born from a simple observation: while the internet is growing rapidly across Africa, 
                digital safety tools are often too complex, expensive, or written in technical jargon that everyday people can't use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">The Problem</h3>
                <p className="text-slate-600 leading-relaxed">
                  Market women, students, and traders are losing millions to WhatsApp scams and mobile money fraud because 
                  they don't have access to simple, fast safety checks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Globe size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">SDG Goals</h3>
                <p className="text-slate-600 leading-relaxed">
                  We contribute to SDG 9 (Industry, Innovation, and Infrastructure) and SDG 10 (Reduced Inequalities) 
                  by making cybersecurity accessible to everyone, regardless of their technical background.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-12 rounded-3xl border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Core Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="font-bold text-primary text-4xl mb-2">01</div>
                  <h4 className="font-bold mb-2">Simplicity</h4>
                  <p className="text-sm text-slate-500">No jargon. Just clear advice in everyday English.</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary text-4xl mb-2">02</div>
                  <h4 className="font-bold mb-2">Privacy</h4>
                  <p className="text-sm text-slate-500">We never save your data. Your safety is private.</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary text-4xl mb-2">03</div>
                  <h4 className="font-bold mb-2">Speed</h4>
                  <p className="text-sm text-slate-500">Works on slow internet and basic smartphones.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default About;