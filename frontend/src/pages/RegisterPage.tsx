import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { User } from '../types';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('1996-08-12');
  const [bloodGroup, setBloodGroup] = useState('A+');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `PAT-${Date.now()}`,
      email: email || 'patient.new@vortexa.org',
      full_name: fullName || 'Jordan Rivera',
      role: 'PATIENT'
    };
    login(newUser, 'mock-jwt-token-xyz');
    navigate('/patient/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-charcoal">Patient Registration</h1>
        <p className="text-mutedgray text-xs font-medium">Create your encrypted Green Health Vault account.</p>
      </div>

      <form onSubmit={handleRegister} className="glass-card-strong p-6 space-y-4 shadow-xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-charcoal">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Jordan Rivera"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-charcoal">Email Address</label>
          <input
            type="email"
            placeholder="jordan@vortexa.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            >
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-charcoal">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            required
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-mutedgray pt-2">
          <ShieldCheck className="w-4 h-4 text-sunset-500 shrink-0" />
          <span>AES-256 field encryption protects all personal health records.</span>
        </div>

        <button
          type="submit"
          className="w-full btn-sunset-primary py-3 text-sm shadow-md"
        >
          <span>Create Encrypted Vault Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
