import React, { useState } from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { Shield, Menu, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const Header = () => {
      const [isOpen, setIsOpen] = useState(false);
      const location = useLocation();

      const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Phishing Check', path: '/phishing' },
        { name: 'Nmap Translator', path: '/nmap' },
        { name: 'Learning Hub', path: '/learning' },
        { name: 'About', path: '/about' },
      ];

      return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="text-white" size={24} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">SafeNet AI</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary border-b-2 border-primary' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/learning"
                className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Start Learning
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
              >
                <div className="flex flex-col p-6 gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium ${
                        location.pathname === link.path ? 'text-primary' : 'text-slate-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      );
    };

    export default Header;