import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AIAlert } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { ShieldAlert, AlertTriangle, CheckCircle2, Filter } from 'lucide-react';

export const AISafetyAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);

  useEffect(() => {
    api.getAIAlerts("DEMO-PAT-101").then(setAlerts);
  }, []);

  const handleResolve = async (id: string) => {
    await api.resolveAIAlert(id);
    setAlerts(alerts.map(a => a.id === id ? { ...a, is_resolved: true } : a));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Clinical Decision Support</span>
        <h1 className="font-display text-3xl font-extrabold text-charcoal">AI Clinical Safety Alerts</h1>
        <p className="text-mutedgray text-sm">Transparent rule-based safety checking for allergy cross-reactivity, drug interactions, and duplicate medications.</p>
      </div>

      <AISafetyBanner message="All AI alerts are transparent advisory suggestions. Clinical judgment by licensed practitioner is mandatory." />

      <div className="space-y-4">
        {alerts.map((al) => (
          <div
            key={al.id}
            className={`p-6 rounded-3xl border transition-all ${
              al.is_resolved
                ? 'bg-white/40 border-sunset-100 opacity-60'
                : al.severity === 'HIGH' || al.severity === 'CRITICAL'
                ? 'glass-card border-rose-300 bg-rose-50/40 shadow-sm'
                : 'glass-card border-sunset-100 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sunset-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${al.severity === 'HIGH' ? 'text-rose-500' : 'text-sunset-500'}`} />
                <span className="font-display font-bold text-charcoal text-base">{al.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-rose-100 text-rose-700 px-3 py-0.5 rounded-full font-extrabold uppercase border border-rose-200">
                  {al.severity} SEVERITY
                </span>
                {al.is_resolved && (
                  <span className="text-[10px] bg-sunset-100 text-sunset-700 px-3 py-0.5 rounded-full font-bold">
                    HUMAN REVIEWED
                  </span>
                )}
              </div>
            </div>

            <div className="py-3 space-y-2 text-xs text-charcoal">
              <p><strong>Affected Medication/Item:</strong> <span className="text-sunset-600 font-bold">{al.affected_item}</span></p>
              <p className="text-mutedgray leading-relaxed">{al.details}</p>

              <div className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 text-xs space-y-1 shadow-xs">
                <span className="text-sunset-600 font-bold block">Recommended Clinical Action:</span>
                <p className="text-charcoal">{al.recommended_action}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-sunset-500 font-extrabold uppercase tracking-wider">{al.disclaimer}</span>
                {!al.is_resolved && (
                  <button
                    onClick={() => handleResolve(al.id)}
                    className="btn-sunset-primary px-4 py-2 text-xs shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledge & Resolve</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
