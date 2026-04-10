import { CheckSquare2, Plus, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import type { ChecklistItem } from "../types/app";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle: (itemId: string) => void;
  onAddItem: (text: string, category: string) => void;
  onRemoveItem: (itemId: string) => void;
  readOnly?: boolean;
}

const CATEGORIES = ["Clothes", "Documents", "Electronics", "Essentials", "Toiletries", "Other"];

export function Checklist({ items, onToggle, onAddItem, onRemoveItem, readOnly = false }: ChecklistProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Essentials");

  const groupedItems = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    }, {} as Record<string, ChecklistItem[]>);
  }, [items]);

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  }, [items]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    onAddItem(text.trim(), category);
    setText("");
  };

  return (
    <section className="rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.15)] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <CheckSquare2 className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">Smart Packing</h3>
            <p className="text-[13px] font-medium text-slate-500">Grouped essentials for your trip.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tighter text-slate-950">{progress}%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Progress</p>
        </div>
      </div>

      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-[var(--accent)]"
        />
      </div>

      <div className="mt-10 space-y-8">
        {Object.entries(groupedItems).map(([cat, catItems]) => (
          <div key={cat}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{cat}</h4>
            <div className="mt-4 grid gap-2">
              <AnimatePresence mode="popLayout">
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "group flex items-center justify-between rounded-[1.25rem] px-5 py-4 transition-all duration-300",
                      item.completed ? "bg-emerald-50/50 text-emerald-900 border border-emerald-100/50" : "bg-slate-50 border border-transparent hover:bg-slate-100/50"
                    )}
                  >
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => onToggle(item.id)}
                      className="flex flex-1 min-w-0 items-center gap-4 text-left outline-none"
                    >
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                        item.completed ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200 group-hover:border-[var(--accent)]"
                      )}>
                        {item.completed && <CheckSquare2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className={cn("truncate text-sm font-medium transition-all duration-300", item.completed && "line-through opacity-50")}>
                        {item.text}
                      </span>
                    </button>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-4 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add item..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] placeholder:text-slate-400"
          />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 outline-none"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 active:scale-95">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </form>
      )}
    </section>
  );
}