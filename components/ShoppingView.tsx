'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, CheckCircle2, Circle, Trash2, DollarSign, ArrowRight, Package } from 'lucide-react';
import { ShoppingItem, ShoppingListName, PantryItem } from '@/types';

interface ShoppingViewProps {
  items: ShoppingItem[];
  onAddShoppingItem: (item: ShoppingItem) => void;
  onToggleItem: (id: string) => void;
  onMoveToPantry: (item: ShoppingItem) => void;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({
  items,
  onAddShoppingItem,
  onToggleItem,
  onMoveToPantry,
}) => {
  const [activeList, setActiveList] = useState<ShoppingListName>('Groceries');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(5.99);

  const listNames: ShoppingListName[] = ['Groceries', 'Apartment', 'Costco', 'Amazon', 'Target'];

  const filteredItems = items.filter(i => i.listName === activeList);
  const unboughtItems = filteredItems.filter(i => !i.isBought);
  const boughtItems = filteredItems.filter(i => i.isBought);

  const runningTotal = unboughtItems.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      listName: activeList,
      title: newItemTitle,
      quantity: newItemQty,
      unit: 'item',
      category: 'Produce',
      estimatedPrice: newItemPrice,
      isBought: false,
      addedAt: new Date().toISOString(),
    };

    onAddShoppingItem(newItem);
    setNewItemTitle('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
            <span>Multi-List Shopping Hub</span>
          </h1>
          <p className="text-xs text-slate-400">Organize shopping lists by store with real-time cost estimates and pantry sync.</p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 font-mono">
          Est. List Total: ${runningTotal.toFixed(2)}
        </div>
      </div>

      {/* Lists Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {listNames.map(list => {
          const listCount = items.filter(i => i.listName === list && !i.isBought).length;
          const isActive = activeList === list;

          return (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-950/40 border-purple-500/50 text-white ring-1 ring-purple-500/30'
                  : 'glass-panel border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{list}</span>
              {listCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">
                  {listCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleCreate} className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder={`Add item to ${activeList}... (e.g. Avocado, Paper towels)`}
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          required
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={newItemQty}
            onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none"
            placeholder="Qty"
          />

          <input
            type="number"
            step="0.5"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none"
            placeholder="Est $"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Items Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Needed Items ({unboughtItems.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {unboughtItems.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => onToggleItem(item.id)} className="p-1 text-slate-400 hover:text-purple-400">
                  <Circle className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Qty: {item.quantity} {item.unit} • Est ${item.estimatedPrice?.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onMoveToPantry(item)}
                title="Move to Pantry"
                className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20 text-[10px] font-bold flex items-center gap-1"
              >
                <Package className="w-3 h-3" />
                <span>To Pantry</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
