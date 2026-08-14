import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

export const BlockchainAccessLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Immutable Security Ledger</span>
        <h1 className="font-display text-3xl font-extrabold text-charcoal">Blockchain Access & Audit Trail</h1>
        <p className="text-mutedgray text-sm">Every sensitive health data view, doctor verification, and consent event generates a cryptographically signed transaction block.</p>
      </div>

      <AISafetyBanner />

      <div className="glass-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sunset-500" />
            <h2 className="font-display text-lg font-bold text-charcoal">Cryptographic Transaction Records ({logs.length})</h2>
          </div>
          <span className="text-xs font-mono text-sunset-600 font-bold bg-sunset-50 px-3 py-1 rounded-full border border-sunset-100">
            Consensus: Hyperledger Fabric (Sim)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-sunset-50 text-mutedgray uppercase font-semibold text-[10px] border-b border-sunset-100">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor / User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Blockchain Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunset-100 font-mono">
              {logs.map((lg) => (
                <tr key={lg.id} className="hover:bg-sunset-50/50 transition-colors">
                  <td className="p-3 text-mutedgray font-sans">{new Date(lg.timestamp).toLocaleString()}</td>
                  <td className="p-3 font-bold text-charcoal font-sans">{lg.user_name}</td>
                  <td className="p-3 font-sans">
                    <span className="bg-sunset-100 text-sunset-700 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold">
                      {lg.role}
                    </span>
                  </td>
                  <td className="p-3 text-sunset-600 font-sans font-medium">{lg.action}</td>
                  <td className="p-3 text-mutedgray font-sans">{lg.resource}</td>
                  <td className="p-3">
                    <BlockchainBadge txHash={lg.blockchain_tx_hash || "TX_0x98127391a"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
