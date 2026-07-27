import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GroceryCategory, GroceryItem } from '../types';
import { DrawerPanel } from './common/DrawerPanel';
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
  
  // Quick Input State
  const [quickInput, setQuickInput] = useState('');
  
  // Form State for detailed modal
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

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const val = quickInput.trim();
    const lower = val.toLowerCase();

    // Auto-detect category
    let cat: GroceryCategory = 'Produce';
    if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('cheese') || lower.includes('butter') || lower.includes('egg')) {
      cat = 'Dairy & Eggs';
    } else if (lower.includes('bread') || lower.includes('toast') || lower.includes('bakery') || lower.includes('bagel')) {
      cat = 'Bakery';
    } else if (lower.includes('water') || lower.includes('juice') || lower.includes('coffee') || lower.includes('tea') || lower.includes('soda') || lower.includes('wine')) {
      cat = 'Beverages';
    } else if (lower.includes('pizza') || lower.includes('ice cream') || lower.includes('frozen')) {
      cat = 'Frozen';
    } else if (lower.includes('soap') || lower.includes('shampoo') || lower.includes('towel')) {
      cat = 'Personal Care';
    } else if (lower.includes('rice') || lower.includes('pasta') || lower.includes('oil') || lower.includes('cereal')) {
      cat = 'Pantry';
    }

    addGroceryItem({
      name: val,
      category: cat,
      iconName: 'Apple'
    });

    setSelectedCategory('All');
    setQuickInput('');
  };

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

  // Food Emoji & Icon Dictionary
  const getFoodIcon = (name: string, iconName?: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('apple') || lower.includes('fruit') || lower.includes('berry') || lower.includes('strawberry')) return '🍎';
    if (lower.includes('banana')) return '🍌';
    if (lower.includes('avocado')) return '🥑';
    if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('dairy') || lower.includes('cream')) return '🥛';
    if (lower.includes('cheese')) return '🧀';
    if (lower.includes('egg')) return '🥚';
    if (lower.includes('bread') || lower.includes('sourdough') || lower.includes('toast') || lower.includes('bakery')) return '🍞';
    if (lower.includes('fish') || lower.includes('salmon') || lower.includes('tuna') || lower.includes('shrimp')) return '🐟';
    if (lower.includes('chicken') || lower.includes('meat') || lower.includes('steak') || lower.includes('beef')) return '🥩';
    if (lower.includes('coffee') || lower.includes('latte') || lower.includes('tea')) return '☕';
    if (lower.includes('water') || lower.includes('juice') || lower.includes('drink') || lower.includes('soda') || lower.includes('beverage')) return '🧃';
    if (lower.includes('wine') || lower.includes('beer')) return '🍷';
    if (lower.includes('pizza')) return '🍕';
    if (lower.includes('cookie') || lower.includes('cake') || lower.includes('chocolate') || lower.includes('donut') || lower.includes('snack')) return '🍪';
    if (lower.includes('carrot') || lower.includes('veggie') || lower.includes('salad') || lower.includes('tomato')) return '🥕';
    if (lower.includes('rice') || lower.includes('pasta') || lower.includes('noodle')) return '🍚';

    switch (iconName) {
      case 'Apple': return '🍎';
      case 'Carrot': return '🥕';
      case 'Milk': return '🥛';
      case 'Fish': return '🐟';
      case 'Coffee': return '☕';
      case 'Cake': return '🍰';
      case 'Package': return '📦';
      case 'Flame': return '🔥';
      case 'Wine': return '🍷';
      default: return '🛍️';
    }
  };

  const handleNameChange = (val: string) => {
    setNameInput(val);
    // Auto-detect matching category icon as user types
    const detected = getFoodIcon(val);
    if (detected === '🍎') setSelectedIcon('Apple');
    else if (detected === '🥕') setSelectedIcon('Carrot');
    else if (detected === '🥛') setSelectedIcon('Milk');
    else if (detected === '🐟') setSelectedIcon('Fish');
    else if (detected === '☕') setSelectedIcon('Coffee');
    else if (detected === '🍰') setSelectedIcon('Cake');
    else if (detected === '🍷') setSelectedIcon('Wine');
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

    setSelectedCategory('All');
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
            onClick={() => setIsAddModalOpen(prev => !prev)}
            className="btn-primary"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
          >
            <Plus size={14} /> {isAddModalOpen ? 'Close' : 'Add Item'}
          </button>
        </div>
      </div>

      {/* Clean & Simple Quick Add Input Bar */}
      <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '12px', fontSize: '1.1rem', pointerEvents: 'none' }}>
            {getFoodIcon(quickInput)}
          </span>
          <input
            type="text"
            placeholder="Type item name (e.g. Bananas, Milk, Bread)... hit Enter"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="btn-primary"
          style={{
            width: 'auto',
            padding: '0 16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
            opacity: quickInput.trim() ? 1 : 0.5,
            cursor: quickInput.trim() ? 'pointer' : 'default'
          }}
        >
          Add
        </button>
      </form>

      {/* Inline Detailed Add Form */}
      {isAddModalOpen && (
        <form 
          onSubmit={handleAddSubmit} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            padding: '14px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--bg-tertiary)', 
            border: '1px solid var(--accent-teal)', 
            marginBottom: '14px' 
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Item Name (e.g. Strawberries)"
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input-text"
              required
              autoFocus
              style={{ flex: 1 }}
            />
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as GroceryCategory)}
              className="input-text"
              style={{ width: '130px' }}
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Quantity / Notes (e.g. 2 lbs)"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              className="input-text"
              style={{ flex: 1 }}
            />

            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 18px', fontSize: '0.85rem' }}>
              Add to List
            </button>
          </div>
        </form>
      )}

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
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  {getFoodIcon(item.name, item.iconName)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{item.name}</span>
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
    </div>
  );
};

export default GroceryListCard;
