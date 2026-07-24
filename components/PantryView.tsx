'use client';

import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { PantryItem, ShoppingItem } from '@/types';

interface PantryViewProps {
  pantryItems: PantryItem[];
  onAddShoppingItem: (item: ShoppingItem) => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  pantryItems,
  onAddShoppingItem,
}) => {
  const lowStock = pantryItems.filter(p => p.isLowStock);
  const normalStock = pantryItems.filter(p => !p.isLowStock);

  const handleRestock = (item: PantryItem) => {
    onAddShoppingItem({
      id: `shop_restock_${Date.now()}`,
      listName: 'Groceries',
      title: item.name,
      quantity: item.lowStockThreshold,
      unit: item.unit,
      category: item.category,
      estimatedPrice: 6.99,
      isBought: false,
      addedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-400" />
            <span>Household Pantry Inventory</span>
          </h1>
          <p className="text-xs text-slate-400">Track kitchen staples, low-stock thresholds, and restock items with 1-click.</p>
        </div>

        {lowStock.length > 0 && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lowStock.length} items running low!</span>
          </div>
        )}
      </div>

      {/* Low Stock Warnings */}
      {lowStock.length > 0 && (
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 space-y-3">
          <h3 className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Warning & Restock Suggestions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lowStock.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[10px] text-amber-300 mt-0.5">
                    Remaining: {item.quantity} {item.unit} (Threshold: {item.lowStockThreshold})
                  </p>
                </div>

                <button
                  onClick={() => handleRestock(item)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Restock</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Pantry Grid */}
      <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">All Inventory Staples ({pantryItems.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pantryItems.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">{item.category}</span>
                <span className={`text-[10px] font-bold ${item.isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {item.isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{item.name}</h4>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-white/5">
                <span>Quantity: <strong>{item.quantity} {item.unit}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
