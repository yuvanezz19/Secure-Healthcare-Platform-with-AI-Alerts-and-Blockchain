import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { InventoryItem } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Package, Plus, Search, Filter } from 'lucide-react';

export const InventoryManagementPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [batch, setBatch] = useState(`BAT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [qty, setQty] = useState(100);
  const [expiry, setExpiry] = useState('2026-11-20');

  useEffect(() => {
    api.getInventory().then(setItems);
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = await api.addInventoryItem({
      medicine_name: name || "Azithromycin 500mg",
      batch_number: batch,
      quantity: Number(qty),
      expiry_date: expiry,
      reorder_level: 50,
      location: "Shelf E2",
      supplier: "Global Med",
      unit_price: 15.0
    });
    setItems([...items, newItem]);
    setShowAddModal(false);
  };

  const filtered = items.filter(i => i.medicine_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Pharmacy Inventory System</span>
          <h1 className="font-display text-3xl font-extrabold text-charcoal">Medicine Stock & Expiry Tracking</h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-sunset-primary text-xs shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock Entry</span>
        </button>
      </div>

      <AISafetyBanner />

      {/* Filter Bar */}
      <div className="glass-card p-4 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-mutedgray" />
        <input
          type="text"
          placeholder="Filter inventory by medicine name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-charcoal w-full focus:outline-none placeholder:text-mutedgray"
        />
      </div>

      {/* Inventory Table */}
      <div className="glass-card p-6 space-y-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-sunset-50 text-mutedgray uppercase font-semibold text-[10px] border-b border-sunset-100">
              <tr>
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Batch No</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Expiry Status</th>
                <th className="p-3">Location</th>
                <th className="p-3">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunset-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-sunset-50/50 transition-colors">
                  <td className="p-3 font-bold text-charcoal">{item.medicine_name}</td>
                  <td className="p-3 font-mono text-mutedgray">{item.batch_number}</td>
                  <td className="p-3 font-bold text-sunset-600">{item.quantity} units</td>
                  <td className="p-3 text-mutedgray">{item.expiry_date}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.expiry_status === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      item.expiry_status === 'NEAR_EXPIRY' ? 'bg-sunset-100 text-sunset-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.expiry_status}
                    </span>
                  </td>
                  <td className="p-3 text-mutedgray">{item.location}</td>
                  <td className="p-3 font-mono text-charcoal font-bold">₹{item.unit_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleAddItem} className="glass-card-strong p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-charcoal">Add Medicine Stock</h3>
            <input
              placeholder="Medicine Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Quantity"
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
              />
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="bg-white/80 border border-sunset-100 rounded-2xl px-4 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2.5 btn-sunset-glass text-xs">
                Cancel
              </button>
              <button type="submit" className="w-1/2 btn-sunset-primary py-2.5 text-xs font-bold shadow-md">
                Save Stock
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
