import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { User, Stethoscope, Store, Building2, ArrowRight, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo.patient@vortexa.org');
  const [password, setPassword] = useState('patient123');
  const [loading, setLoading] = useState(false);

  const handleDemoSelect = (selectedRole: Role) => {
    loginAsDemo(selectedRole);
    if (selectedRole === 'PATIENT') navigate('/patient/dashboard');
    if (selectedRole === 'DOCTOR') navigate('/doctor/dashboard');
    if (selectedRole === 'PHARMACY') navigate('/pharmacy/dashboard');
    if (selectedRole === 'ADMIN') navigate('/admin/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      handleDemoSelect('PATIENT');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto py-14 px-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-charcoal">Sign In to VORTEXA</h1>
        <p className="text-mutedgray text-xs font-medium">Access your encrypted health vault or clinical workspace.</p>
      </div>

      {/* 1-Click Demo Login Cards */}
      <div className="glass-card-strong p-6 space-y-4 shadow-xl">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-sunset-600 block">Instant Demo Accounts</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDemoSelect('PATIENT')}
            className="p-3 bg-white/80 hover:bg-sunset-50 border border-sunset-100 rounded-2xl text-left space-y-1 transition-all duration-300 group shadow-xs hover:border-sunset-300"
          >
            <div className="flex items-center justify-between text-sunset-500">
              <User className="w-4 h-4" />
              <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">Patient</span>
            </div>
            <p className="text-xs font-bold text-charcoal group-hover:text-sunset-600">Alex Mercer</p>
            <p className="text-[10px] text-mutedgray">Vault Owner</p>
          </button>

          <button
            onClick={() => handleDemoSelect('DOCTOR')}
            className="p-3 bg-white/80 hover:bg-sunset-50 border border-sunset-100 rounded-2xl text-left space-y-1 transition-all duration-300 group shadow-xs hover:border-sunset-300"
          >
            <div className="flex items-center justify-between text-sunset-500">
              <Stethoscope className="w-4 h-4" />
              <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">Doctor</span>
            </div>
            <p className="text-xs font-bold text-charcoal group-hover:text-sunset-600">Dr. Sarah Jenkins</p>
            <p className="text-[10px] text-mutedgray">OCR Verifier</p>
          </button>

          <button
            onClick={() => handleDemoSelect('PHARMACY')}
            className="p-3 bg-white/80 hover:bg-sunset-50 border border-sunset-100 rounded-2xl text-left space-y-1 transition-all duration-300 group shadow-xs hover:border-sunset-300"
          >
            <div className="flex items-center justify-between text-sunset-500">
              <Store className="w-4 h-4" />
              <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">Pharmacy</span>
            </div>
            <p className="text-xs font-bold text-charcoal group-hover:text-sunset-600">Metro Pharmacy</p>
            <p className="text-[10px] text-mutedgray">Inventory Forecast</p>
          </button>

          <button
            onClick={() => handleDemoSelect('ADMIN')}
            className="p-3 bg-white/80 hover:bg-sunset-50 border border-sunset-100 rounded-2xl text-left space-y-1 transition-all duration-300 group shadow-xs hover:border-sunset-300"
          >
            <div className="flex items-center justify-between text-sunset-500">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">Admin</span>
            </div>
            <p className="text-xs font-bold text-charcoal group-hover:text-sunset-600">Hospital Admin</p>
            <p className="text-[10px] text-mutedgray">Audit & Metrics</p>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-charcoal">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-sunset-primary py-3.5 text-sm shadow-md"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
