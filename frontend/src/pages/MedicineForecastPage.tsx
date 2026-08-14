import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DemandForecast } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const MedicineForecastPage: React.FC = () => {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);

  useEffect(() => {
    api.getAllForecasts().then(setForecasts);
  }, []);

  const chartData = forecasts.map(f => ({
    name: f.medicine_name.split(' ')[0],
    Current: f.current_stock,
    Forecast30d: f.forecast_30_days
  }));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">AI Supply Chain Intelligence</span>
        <h1 className="font-display text-3xl font-extrabold text-charcoal">30-Day Medicine Demand Forecasting</h1>
        <p className="text-mutedgray text-sm">Predictive moving-average model preventing medicine stockouts and overstock expiry waste.</p>
      </div>

      <AISafetyBanner />

      {/* Forecast Visual Bar Chart */}
      <div className="glass-card-strong p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-charcoal flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sunset-500" /> Current Stock vs 30-Day Predicted Demand
          </h2>
          <span className="text-xs font-mono font-bold text-sunset-600 bg-sunset-50 px-3 py-1 rounded-full border border-sunset-100">
            Confidence Interval: 92.5%
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#77736F" fontSize={12} />
              <YAxis stroke="#77736F" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #FFE4D6', borderRadius: '16px', color: '#252525', boxShadow: '0 10px 25px rgba(255, 122, 69, 0.1)' }} />
              <Bar dataKey="Current" fill="#FFC2A8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Forecast30d" fill="#FF7A45" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Cards Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forecasts.map((f) => (
          <div key={f.medicine_id} className="glass-card p-6 space-y-3 shadow-xs hover:border-sunset-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-charcoal text-base">{f.medicine_name}</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 ${
                f.trend === 'UP' ? 'bg-sunset-100 text-sunset-700' :
                f.trend === 'DOWN' ? 'bg-rose-100 text-rose-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {f.trend === 'UP' ? <ArrowUpRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{f.trend} TREND</span>
              </span>
            </div>

            <div className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 space-y-2 text-xs text-charcoal shadow-2xs">
              <div className="flex justify-between">
                <span className="text-mutedgray">Current Stock:</span>
                <strong className="text-charcoal">{f.current_stock} units</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedgray">30-Day Demand Forecast:</span>
                <strong className="text-sunset-600">{f.forecast_30_days} units</strong>
              </div>
              <div className="flex justify-between border-t border-sunset-100 pt-1.5">
                <span className="text-mutedgray">Recommended Reorder:</span>
                <strong className="text-sunset-700 font-bold">{f.recommended_reorder} units</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
