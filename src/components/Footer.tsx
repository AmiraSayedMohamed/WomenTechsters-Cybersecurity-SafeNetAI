import React from 'react';
    import { Shield, Facebook, Twitter, MessageCircle, Mail } from 'lucide-react';

    const Footer = () => {
      return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-primary" size={28} />
                  <span className="font-serif text-2xl font-bold text-slate-900">SafeNet AI</span>
                </div>
                <p className="text-slate-600 max-w-md leading-relaxed">
                  Empowering everyday people across Africa with simple, fast, and private digital safety tools. 
                  Protecting your mobile money, social media, and family from online scams.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Tools</h4>
                <ul className="space-y-2 text-slate-600">
                  <li><a href="/phishing" className="hover:text-primary transition-colors">Scam Detector</a></li>
                  <li><a href="/nmap" className="hover:text-primary transition-colors">Network Translator</a></li>
                  <li><a href="/learning" className="hover:text-primary transition-colors">Learning Hub</a></li>
                  <li><a href="/learning" className="hover:text-primary transition-colors">AI Safety Tutor</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
                <div className="flex gap-4">
                  <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all">
                    <Facebook size={20} />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all">
                    <Twitter size={20} />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all">
                    <MessageCircle size={20} />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all">
                    <Mail size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <p>© 2026 SafeNet AI. Built for Women Techsters Capstone.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;