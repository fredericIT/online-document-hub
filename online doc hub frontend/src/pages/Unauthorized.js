import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/bg-auth.png" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[4px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-[22px] mb-5"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <svg className="h-9 w-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-3V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4zM8 7h8" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Access Denied</h1>
          <p className="mt-2.5 text-slate-400 text-base">You don't have <span className="text-red-400 font-semibold">permission</span> to view this</p>
        </div>

        <div className="glass-card-static p-10 text-center">
          <p className="text-lg text-slate-300 mb-8">
            This area is restricted. Please contact your administrator if you believe this is an error.
          </p>
          
          <Link to="/" className="btn-primary w-full py-3.5">
            Return to Dashboard
          </Link>
          
          <p className="text-xs text-slate-600 font-medium mt-8 uppercase tracking-widest">
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
