import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LabReport, DuplicateTestResult } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { FileText, RefreshCw, AlertTriangle, CheckCircle2, Leaf, Search, ArrowRight } from 'lucide-react';

export const LabReportsPage: React.FC = () => {
  const [labs, setLabs] = useState<LabReport[]>([]);
  const [testInput, setTestInput] = useState('Complete Blood Count (CBC)');
  const [duplicateResult, setDuplicateResult] = useState<DuplicateTestResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    api.getLabReports("DEMO-PAT-101").then(setLabs);
  }, []);

  const handleCheckDuplicate = async () => {
    setChecking(true);
    try {
      const res = await api.checkDuplicateTest("DEMO-PAT-101", testInput);
      setDuplicateResult(res);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Zero-Waste Diagnostic Intelligence</span>
        <h1 className="font-display text-3xl font-extrabold text-charcoal">Lab Reports & Duplicate Test Prevention</h1>
        <p className="text-mutedgray text-sm">Prevents unnecessary repeated blood draws, reducing patient discomfort and hazardous laboratory waste.</p>
      </div>

      <AISafetyBanner />

      {/* Interactive Duplicate Test Inspector Tool */}
      <div className="glass-card-strong p-8 space-y-5 shadow-xl">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-sunset-500" />
          <h2 className="font-display text-lg font-bold text-charcoal">Doctor Pre-Order Duplicate Test Inspector</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-mutedgray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC) or Lipid Profile..."
              className="w-full bg-white/80 border border-sunset-100 rounded-full pl-10 pr-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            />
          </div>

          <button
            onClick={handleCheckDuplicate}
            disabled={checking}
            className="w-full sm:w-auto btn-sunset-primary px-6 py-2.5 text-xs shrink-0 shadow-md"
          >
            {checking ? 'Evaluating Lab History...' : 'Evaluate Duplicate Risk'}
          </button>
        </div>

        {duplicateResult && (
          <div className={`p-5 rounded-2xl border space-y-3 transition-all ${
            duplicateResult.is_duplicate ? 'bg-rose-50/70 border-rose-300 text-charcoal' : 'bg-white/80 border-sunset-100 text-charcoal'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-sm flex items-center gap-2">
                {duplicateResult.is_duplicate ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-rose-700">Potential Duplicate Diagnostic Test Detected!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sunset-500" />
                    <span className="text-sunset-700">No Duplicate Issue Found</span>
                  </>
                )}
              </span>

              {duplicateResult.is_duplicate && (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-extrabold">
                  REASON: WITHIN 30-DAY VALIDITY WINDOW
                </span>
              )}
            </div>

            <p className="text-xs text-mutedgray">{duplicateResult.message}</p>

            {duplicateResult.is_duplicate && (
              <div className="bg-white/90 p-3.5 rounded-xl border border-sunset-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sunset-700 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <Leaf className="w-4 h-4 text-sunset-500" />
                  <span>Environmental & Financial Impact Avoided:</span>
                </div>
                <span>Est. Waste Saved: <strong className="text-charcoal font-bold">₹{duplicateResult.waste_prevented_est_inr}</strong> • CO₂: <strong className="text-charcoal font-bold">{duplicateResult.co2_saved_kg} kg</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lab History Table */}
      <div className="glass-card p-6 space-y-4 shadow-sm">
        <h2 className="font-display text-lg font-bold text-charcoal">Patient Historical Lab Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-sunset-50 text-mutedgray uppercase font-semibold text-[10px] border-b border-sunset-100">
              <tr>
                <th className="p-3">Test Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Repeat Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunset-100">
              {labs.map((lb) => (
                <tr key={lb.id} className="hover:bg-sunset-50/50 transition-colors">
                  <td className="p-3 font-bold text-charcoal">{lb.test_name}</td>
                  <td className="p-3 text-mutedgray">{lb.category}</td>
                  <td className="p-3 text-mutedgray">{lb.test_date}</td>
                  <td className="p-3 text-sunset-600 font-medium">{lb.doctor_name}</td>
                  <td className="p-3">
                    <span className="bg-sunset-100 text-sunset-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {lb.status}
                    </span>
                  </td>
                  <td className="p-3 text-mutedgray">{lb.repeat_window_days} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
