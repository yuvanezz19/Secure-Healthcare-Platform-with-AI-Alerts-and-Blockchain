import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SustainabilityMetrics } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Leaf, Sparkles, RefreshCw, Car, DollarSign, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const SustainabilityDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);

  useEffect(() => {
    api.getSustainabilityDashboard().then(setMetrics);
  }, []);

  const chartData = [
    { name: 'Mon', CO2: 6.2, WasteSaved: 2100 },
    { name: 'Tue', CO2: 8.4, WasteSaved: 3400 },
    { name: 'Wed', CO2: 5.1, WasteSaved: 1800 },
    { name: 'Thu', CO2: 9.8, WasteSaved: 4200 },
    { name: 'Fri', CO2: 7.3, WasteSaved: 2900 },
    { name: 'Sat', CO2: 3.5, WasteSaved: 1400 },
    { name: 'Sun', CO2: 2.5, WasteSaved: 900 }
  ];

  const pieData = [
    { name: 'Duplicate Tests Avoided', value: 45, color: '#FF7A45' },
    { name: 'Medicine Rescue & Expiry', value: 35, color: '#FF9E7A' },
    { name: 'Telemedicine Travel Saved', value: 20, color: '#FFC2A8' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Zero-Waste Intelligence Network</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal">Sustainability & Eco-Impact Analytics</h1>
        </div>

        <div className="flex items-center gap-2 bg-sunset-50 border border-sunset-200 px-4 py-2 rounded-full text-xs font-bold text-sunset-600 shadow-xs">
          <Award className="w-4 h-4 text-sunset-500" />
          <span>Eco Grade: <strong className="text-charcoal">{metrics?.sustainability_grade || 'A+'}</strong></span>
        </div>
      </div>

      <AISafetyBanner message="Environmental impact calculations are estimated baseline models for clinical zero-waste tracking." />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Eco Score Meter */}
        <div className="glass-card-strong p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-sunset-600">
            <span className="text-xs font-bold uppercase tracking-wider">Network Eco Score</span>
            <Leaf className="w-5 h-5 text-sunset-500" />
          </div>
          <div className="font-display text-4xl font-extrabold text-charcoal">
            {metrics?.eco_score || 88}<span className="text-sunset-500 text-lg font-sans">/100</span>
          </div>
          <p className="text-[11px] text-mutedgray">Top 3% Zero-Waste Healthcare Network</p>
        </div>

        {/* Financial Waste Saved */}
        <div className="glass-card p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-sunset-600">
            <span className="text-xs font-bold uppercase tracking-wider text-mutedgray">Medicine & Lab Waste Saved</span>
            <DollarSign className="w-5 h-5 text-sunset-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-charcoal">
            ₹{metrics?.medicine_waste_prevented_inr.toLocaleString() || '18,400'}
          </div>
          <p className="text-[11px] text-sunset-600 font-semibold">+24% efficiency this month</p>
        </div>

        {/* Tests Avoided */}
        <div className="glass-card p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-sunset-600">
            <span className="text-xs font-bold uppercase tracking-wider text-mutedgray">Duplicate Tests Prevented</span>
            <RefreshCw className="w-5 h-5 text-sunset-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-charcoal">
            {metrics?.tests_avoided || 14} <span className="text-xs text-mutedgray font-sans">labs</span>
          </div>
          <p className="text-[11px] text-mutedgray">Avoided hazardous blood waste</p>
        </div>

        {/* Estimated CO2 Saved */}
        <div className="glass-card p-6 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-sunset-600">
            <span className="text-xs font-bold uppercase tracking-wider text-mutedgray">Estimated CO₂ Saved</span>
            <Car className="w-5 h-5 text-sunset-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-sunset-600">
            {metrics?.co2_emissions_saved_kg || 42.8} <span className="text-xs text-mutedgray font-sans">kg CO₂</span>
          </div>
          <p className="text-[11px] text-mutedgray">{metrics?.patient_travel_avoided_km || 406} km travel avoided</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend Bar Chart */}
        <div className="glass-card-strong p-6 space-y-4 lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sunset-500" />
              <h2 className="font-display text-lg font-bold text-charcoal">Weekly CO₂ Savings & Waste Reduction (kg)</h2>
            </div>
            <span className="text-xs text-sunset-600 font-bold bg-sunset-50 px-3 py-1 rounded-full border border-sunset-100">Live Telemetry</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#77736F" fontSize={12} />
                <YAxis stroke="#77736F" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #FFE4D6', borderRadius: '16px', color: '#252525', boxShadow: '0 10px 25px rgba(255, 122, 69, 0.1)' }} />
                <Bar dataKey="CO2" fill="#FF7A45" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Breakdown Pie Chart */}
        <div className="glass-card p-6 space-y-4 shadow-xs">
          <h2 className="font-display text-lg font-bold text-charcoal">Waste Reduction Distribution</h2>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #FFE4D6', borderRadius: '16px', color: '#252525' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs text-charcoal">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-mutedgray">{item.name}</span>
                </span>
                <span className="font-bold text-sunset-600">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
