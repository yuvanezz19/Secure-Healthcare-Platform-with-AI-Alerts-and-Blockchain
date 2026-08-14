import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Prescription } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Search, FileText, Calendar, Plus, ArrowRight } from 'lucide-react';

export const PrescriptionHistoryPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getPrescriptions("DEMO-PAT-101").then(setPrescriptions);
  }, []);

  const filtered = prescriptions.filter(p =>
    p.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
    p.hospital_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Health Vault History</span>
          <h1 className="font-display text-3xl font-extrabold text-charcoal">Prescription Records</h1>
        </div>

        <Link
          to="/doctor/upload-prescription"
          className="btn-sunset-primary text-xs shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload & Verify New Prescription</span>
        </Link>
      </div>

      <AISafetyBanner />

      <div className="glass-card p-4 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-mutedgray" />
        <input
          type="text"
          placeholder="Filter prescriptions by doctor or hospital name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-sm text-charcoal w-full focus:outline-none placeholder:text-mutedgray"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="glass-card p-6 space-y-4 shadow-sm hover:border-sunset-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sunset-600 block">{p.doctor_name}</span>
                <span className="text-[11px] text-mutedgray">{p.hospital_name}</span>
              </div>
              <BlockchainBadge txHash={p.blockchain_tx_hash || "TX_0x98127391a"} />
            </div>

            <div className="flex items-center gap-2 text-xs text-mutedgray">
              <Calendar className="w-3.5 h-3.5 text-sunset-500" />
              <span>Prescription Date: {p.prescription_date}</span>
            </div>

            <div className="space-y-1.5 text-xs text-charcoal">
              <p className="font-semibold text-mutedgray">Prescribed Items ({p.medicines?.length || 0}):</p>
              <div className="flex flex-wrap gap-1.5">
                {p.medicines?.map((m, idx) => (
                  <span key={idx} className="bg-sunset-50/80 border border-sunset-100 text-charcoal px-3 py-1 rounded-full text-[11px] font-medium shadow-2xs">
                    {m.medicine_name} ({m.dosage})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-sunset-100 flex justify-end">
              <Link
                to={`/prescriptions/${p.id}`}
                className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1"
              >
                <span>View Complete Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
