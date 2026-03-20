import React from 'react';
    import { Theme } from '@radix-ui/themes';
    import '@radix-ui/themes/styles.css';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

    import Header from './src/components/Header';
    import Footer from './src/components/Footer';
    import Home from './src/pages/Home';
    import PhishingDetector from './src/pages/PhishingDetector';
    import NmapTranslator from './src/pages/NmapTranslator';
    import LearningHub from './src/pages/LearningHub';
    import About from './src/pages/About';
    import NotFound from './src/pages/NotFound';

    const App: React.FC = () => {
      return (
        <Theme appearance="light" accentColor="indigo" radius="large">
          <Router>
            <div className="flex flex-col min-h-screen font-sans selection:bg-primary/10 selection:text-primary">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/phishing" element={<PhishingDetector />} />
                  <Route path="/nmap" element={<NmapTranslator />} />
                  <Route path="/learning" element={<LearningHub />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="bottom-right" />
            </div>
          </Router>
        </Theme>
      );
    }

    export default App;