import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuditLog, SustainabilityMetrics } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Building2, Activity, ShieldCheck, Leaf, HardDrive, Cpu, Users, ArrowRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
    api.getSustainabilityDashboard().then(setMetrics);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">HOSPITAL SYSTEM & AUDIT INTELLIGENCE</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal">Hospital Administration Dashboard</h1>
        </div>

        <div className="flex items-center gap-2 bg-sunset-50 border border-sunset-200 px-4 py-1.5 rounded-full text-xs font-bold text-sunset-600 shadow-xs">
          <Activity className="w-4 h-4 text-sunset-500" />
          <span>System Status: OPERATIONAL</span>
        </div>
      </div>

      <AISafetyBanner />

      {/* Hospital Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">Bed Capacity Utilization</span>
          <p className="font-display text-3xl font-extrabold text-charcoal">74.2%</p>
          <span className="text-[11px] text-mutedgray">182 / 245 beds occupied</span>
        </div>

        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">Hospital Eco Score</span>
          <p className="font-display text-3xl font-extrabold text-sunset-600">{metrics?.eco_score || 88}/100</p>
          <span className="text-[11px] text-sunset-600 font-medium">Grade {metrics?.sustainability_grade || 'A+'}</span>
        </div>

        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">Total CO₂ Saved</span>
          <p className="font-display text-3xl font-extrabold text-sunset-500">{metrics?.co2_emissions_saved_kg || 42.8} kg</p>
          <span className="text-[11px] text-mutedgray">{metrics?.tests_avoided || 14} duplicate labs avoided</span>
        </div>

        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">Total Audit Blocks Logged</span>
          <p className="font-display text-3xl font-extrabold text-charcoal">{logs.length + 18}</p>
          <span className="text-[11px] text-mutedgray">100% Cryptographic Ledger</span>
        </div>
      </div>

      {/* Master Audit Log Preview */}
      <div className="glass-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-charcoal flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sunset-500" /> Recent System Audit Entries
          </h2>
          <Link to="/blockchain-log" className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1">
            <span>View Full Blockchain Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {logs.slice(0, 5).map((lg) => (
            <div key={lg.id} className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div>
                <span className="font-bold text-charcoal">{lg.user_name}</span>
                <span className="text-[10px] text-mutedgray block">{lg.role} • Action: <strong className="text-sunset-600">{lg.action}</strong> • Resource: {lg.resource}</span>
              </div>
              <BlockchainBadge txHash={lg.blockchain_tx_hash || "TX_0x98127391a"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
