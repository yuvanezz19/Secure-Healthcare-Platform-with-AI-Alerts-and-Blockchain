import React from 'react';
import { Leaf, ShieldCheck, Lock, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 border-t border-sunset-100/80 py-10 text-xs text-charcoal mt-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sunset-100/80 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sunset-400 to-sunset-500 flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-charcoal text-base">VORTEXA-Sustain</span>
            <span className="text-sunset-300">•</span>
            <span className="text-sunset-600 font-medium">Your Health. Your Data. Zero Waste.</span>
          </div>

          <div className="flex items-center gap-4 text-mutedgray font-medium">
            <span className="flex items-center gap-1.5 hover:text-sunset-600 transition-colors">
              <Lock className="w-4 h-4 text-sunset-500" /> AES-256 Encrypted
            </span>
            <span className="flex items-center gap-1.5 hover:text-sunset-600 transition-colors">
              <ShieldCheck className="w-4 h-4 text-sunset-500" /> Cryptographic Ledger
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-mutedgray">
          <p>© 2026 VORTEXA-Sustain Intelligence Network. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5 bg-sunset-50/80 px-4 py-1.5 rounded-full text-[11px] text-sunset-600 border border-sunset-200/80 font-semibold shadow-xs">
            <Activity className="w-3.5 h-3.5 text-sunset-500" />
            <span>AI Decision Support — Requires Human Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
