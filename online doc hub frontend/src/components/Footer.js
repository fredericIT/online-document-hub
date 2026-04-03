import React from 'react';

/* ── Inline SVG icons (no external dependency) ── */
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-nav mt-auto border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400"><ShieldIcon /></span>
              Support &amp; Contact
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our support team is available to assist you with any technical issues or document inquiries.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:ntawukuriryayofrederic817@gmail.com"
                className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <MailIcon />
                </div>
                ntawukuriryayofrederic817@gmail.com
              </a>
              <a
                href="tel:0789438061"
                className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <PhoneIcon />
                </div>
                0789438061
              </a>
            </div>
          </div>

          {/* Service Status Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-violet-400"><ClockIcon /></span>
              Service Status
            </h3>
            <div className="glass-card-static p-4 border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider">System Status</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Document processing and AI Chat are fully functional.
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <GlobeIcon />
              Global Document Hub Network
            </div>
          </div>

          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-black text-xl italic">D</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                DOCUMENT<span className="text-indigo-400">HUB</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm italic">
              "Empowering productivity through secure, intelligent document management and real-time collaboration."
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} Online Document Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
