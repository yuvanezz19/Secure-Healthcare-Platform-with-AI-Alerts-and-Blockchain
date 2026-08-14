import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface AISafetyBannerProps {
  message?: string;
  variant?: 'info' | 'warning' | 'alert';
}

export const AISafetyBanner: React.FC<AISafetyBannerProps> = ({
  message = "All AI extraction and safety alerts are advisory support tools. Final clinical decisions must be human-verified."
}) => {
  return (
    <div className="p-4 rounded-2xl bg-sunset-50/90 border border-sunset-200/80 text-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-xs backdrop-blur-md animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-sunset-100 flex items-center justify-center shrink-0 border border-sunset-200">
          <AlertTriangle className="w-4 h-4 text-sunset-500" />
        </div>
        <span className="text-charcoal font-medium">{message}</span>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 bg-white text-sunset-600 px-3.5 py-1.5 rounded-full border border-sunset-200 text-[11px] font-bold uppercase tracking-wider shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-sunset-500" />
        <span>AI Decision Support — Requires Human Verification</span>
      </div>
    </div>
  );
};
