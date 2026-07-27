import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GroceryCategory, GroceryItem } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Apple, 
  Milk, 
  Fish, 
  Coffee, 
  Package, 
  Carrot, 
  Flame, 
  Cake, 
  Wine, 
  X 
} from 'lucide-react';

export const GroceryListCard: React.FC = () => {
  const { groceries, addGroceryItem, deleteGroceryItem, toggleGroceryItem, clearCompletedGroceries } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<GroceryCategory>('Produce');
  const [quantityInput, setQuantityInput] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Apple');

  const categories: (string | GroceryCategory)[] = [
    'All',
    'Produce',
    'Dairy & Eggs',
    'Pantry',
    'Bakery',
    'Frozen',
    'Beverages',
    'Personal Care',
    'Other'
  ];

  const iconOptions = [
    { name: 'Apple', label: 'Produce / Fruit' },
    { name: 'Carrot', label: 'Veggies' },
    { name: 'Milk', label: 'Dairy' },
    { name: 'Fish', label: 'Meat & Seafood' },
    { name: 'Coffee', label: 'Beverages' },
    { name: 'Cake', label: 'Bakery' },
    { name: 'Package', label: 'Pantry' },
    { name: 'Flame', label: 'Snacks & Hot' },
    { name: 'Wine', label: 'Drinks' },
    { name: 'ShoppingBag', label: 'General' }
  ];

  const renderIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'Apple': return <Apple size={size} color="var(--accent-rose)" />;
      case 'Carrot': return <Carrot size={size} color="var(--accent-amber)" />;
      case 'Milk': return <Milk size={size} color="var(--accent-blue)" />;
      case 'Fish': return <Fish size={size} color="var(--accent-teal)" />;
      case 'Coffee': return <Coffee size={size} color="var(--accent-purple)" />;
      case 'Cake': return <Cake size={size} color="var(--accent-rose)" />;
      case 'Package': return <Package size={size} color="var(--accent-indigo)" />;
      case 'Flame': return <Flame size={size} color="var(--accent-amber)" />;
      case 'Wine': return <Wine size={size} color="var(--accent-purple)" />;
      default: return <ShoppingBag size={size} color="var(--accent-primary)" />;
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? groceries 
    : groceries.filter(g => g.category === selectedCategory);

  const completedCount = groceries.filter(g => g.completed).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    addGroceryItem({
      name: nameInput.trim(),
      category: categoryInput,
      quantity: quantityInput.trim() || undefined,
      iconName: selectedIcon
    });

    setNameInput('');
    setQuantityInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="aura-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--accent-teal-soft)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-teal)'
          }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
              Smart Grocery List
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {groceries.length - completedCount} needed • {completedCount} bought
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {completedCount > 0 && (
            <button
              onClick={clearCompletedGroceries}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              title="Clear completed items"
            >
              Clear Done
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--accent-teal)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--accent-teal-soft)' : 'var(--bg-tertiary)',
                color: isSelected ? 'var(--accent-teal)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 800 : 500,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            <Sparkles size={24} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
            No grocery items in this category yet.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleGroceryItem(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: item.completed ? 'var(--bg-secondary)' : 'var(--bg-card)',
                border: item.completed ? '1px solid transparent' : '1px solid var(--border-color)',
                opacity: item.completed ? 0.6 : 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {renderIcon(item.iconName)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>
                    {item.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    {item.quantity && (
                      <span className="badge-pill" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.completed ? (
                  <CheckCircle2 size={18} color="var(--accent-teal)" />
                ) : (
                  <Circle size={18} color="var(--text-tertiary)" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroceryItem(item.id);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Delete item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Grocery Modal */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            className="animate-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Add Grocery Item
              </h3>
              <button className="icon-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Strawberries, Almond Milk..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as GroceryCategory)}
                    className="input-text"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label className="form-label">Quantity / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 lbs, 1 pack"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Choose Category Icon</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setSelectedIcon(opt.name)}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedIcon === opt.name ? '2px solid var(--accent-teal)' : '1px solid var(--border-color)',
                        background: selectedIcon === opt.name ? 'var(--accent-teal-soft)' : 'var(--bg-tertiary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={opt.label}
                    >
                      {renderIcon(opt.name, 20)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryListCard;
