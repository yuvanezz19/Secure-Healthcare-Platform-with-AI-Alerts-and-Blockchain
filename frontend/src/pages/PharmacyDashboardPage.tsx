import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { InventoryItem, DemandForecast } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Store, AlertTriangle, TrendingUp, Package, RefreshCw, ArrowRight } from 'lucide-react';

export const PharmacyDashboardPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);

  useEffect(() => {
    api.getInventory().then(setItems);
    api.getAllForecasts().then(setForecasts);
  }, []);

  const criticalCount = items.filter(i => i.expiry_status === 'CRITICAL').length;
  const nearExpiryCount = items.filter(i => i.expiry_status === 'NEAR_EXPIRY').length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">PHARMACY INVENTORY INTELLIGENCE</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal">Metro Central Pharmacy</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/pharmacy/inventory" className="btn-sunset-glass text-xs shadow-xs">
            <span>Stock Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/pharmacy/forecast" className="btn-sunset-primary text-xs shadow-md">
            <span>Demand Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <AISafetyBanner />

      {/* Expiry Risk KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">Total Medicines Tracked</span>
          <p className="font-display text-3xl font-extrabold text-charcoal">{items.length} SKUs</p>
        </div>
        <div className="glass-card p-5 space-y-1 border border-rose-200 bg-rose-50/40 shadow-xs">
          <span className="text-xs text-rose-600 font-semibold uppercase">Critical Expiry (0-30 days)</span>
          <p className="font-display text-3xl font-extrabold text-rose-600">{criticalCount}</p>
        </div>
        <div className="glass-card p-5 space-y-1 border border-sunset-200 bg-sunset-50/40 shadow-xs">
          <span className="text-xs text-sunset-600 font-semibold uppercase">Near Expiry (31-90 days)</span>
          <p className="font-display text-3xl font-extrabold text-sunset-600">{nearExpiryCount}</p>
        </div>
        <div className="glass-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-mutedgray font-semibold uppercase">AI Redistribution Advice</span>
          <p className="font-display text-3xl font-extrabold text-sunset-500">3 Batches</p>
        </div>
      </div>

      {/* Critical Expiry Alerts */}
      <div className="glass-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-charcoal flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Critical & Near Expiry Medicines
          </h2>
          <span className="text-xs text-mutedgray">Color-Coded Expiry Risk</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white/80 p-4 rounded-2xl border border-sunset-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div>
                <span className="font-bold text-charcoal text-sm">{item.medicine_name}</span>
                <span className="text-mutedgray text-xs block">Batch: <span className="font-mono text-charcoal">{item.batch_number}</span> • Qty: <strong>{item.quantity}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                  item.expiry_status === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  item.expiry_status === 'NEAR_EXPIRY' ? 'bg-sunset-100 text-sunset-700 border border-sunset-200' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.expiry_status} ({item.days_to_expiry} days)
                </span>

                <button className="bg-sunset-50 hover:bg-sunset-100 text-sunset-700 border border-sunset-200 px-3.5 py-1.5 rounded-full font-semibold text-[11px] transition-colors">
                  Redistribute Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
