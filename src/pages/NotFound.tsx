import React from 'react';
    import { Link } from 'react-router-dom';
    import { ShieldAlert } from 'lucide-react';

    export default function NotFound() {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert size={64} className="text-primary mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-slate-600 mb-8 max-w-md">
            The page you are looking for doesn't exist or has been moved. Let's get you back to safety.
          </p>
          <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
            Go Home
          </Link>
        </div>
      );
    }