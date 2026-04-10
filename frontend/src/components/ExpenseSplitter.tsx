import { DollarSign, Plus, Trash2, Wallet } from "lucide-react";
import { useState, useMemo } from "react";
import type { Expense, ExpensePayload, TripMember } from "../types/app";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

interface ExpenseSplitterProps {
  expenses: Expense[];
  members: TripMember[];
  userId: string;
  onAddExpense: (payload: ExpensePayload) => void;
  onRemoveExpense: (expenseId: string) => void;
  readOnly?: boolean;
}

const CATEGORIES = ["Transportation", "Dining", "Activities", "Shopping", "Health", "Other"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ExpenseSplitter({ expenses, members, userId, onAddExpense, onRemoveExpense, readOnly = false }: ExpenseSplitterProps) {
  const [form, setForm] = useState({ title: "", amount: "", category: "Dining", splitAmong: members.map(m => m.id) });

  const balances = useMemo(() => {
    let owes = 0;
    let getsBack = 0;

    expenses.forEach(exp => {
      const share = exp.amount / (exp.splitAmong.length || 1);
      const isPayer = exp.paidBy === userId;
      const isInSplit = exp.splitAmong.includes(userId);

      if (isPayer) {
        const othersShare = exp.amount - (isInSplit ? share : 0);
        getsBack += othersShare;
      } else if (isInSplit) {
        owes += share;
      }
    });

    return { owes, getsBack, net: getsBack - owes };
  }, [expenses, userId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.amount || form.splitAmong.length === 0) return;

    onAddExpense({
      trip: "", // Set in parent
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      splitAmong: form.splitAmong,
    });

    setForm({ title: "", amount: "", category: "Dining", splitAmong: members.map(m => m.id) });
  };

  const toggleMember = (id: string) => {
    setForm(prev => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(id) 
        ? prev.splitAmong.filter(mId => mId !== id)
        : [...prev.splitAmong, id]
    }));
  };

  return (
    <section className="rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.15)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Wallet className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">Expense Splitter</h3>
            <p className="text-[13px] font-medium text-slate-500">Track and split costs with everyone.</p>
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="grid gap-3 grid-cols-2 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100"
        >
          <div className="flex items-center gap-2 text-emerald-600">
            <Wallet className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">You are owed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{currencyFormatter.format(balances.getsBack)}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-rose-50 p-5 border border-rose-100"
        >
          <div className="flex items-center gap-2 text-rose-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">You owe</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-700">{currencyFormatter.format(balances.owes)}</p>
        </motion.div>
      </div>

      {/* Add Expense Form */}
      {!readOnly && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
              <Plus className="h-4 w-4" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-slate-900">Add Expense</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Flight Tickets"
              className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Amount ($)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Split Among</label>
            <div className="flex flex-wrap gap-2">
              {members.map(member => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300",
                    form.splitAmong.includes(member.id) 
                      ? "bg-slate-950 border-slate-950 text-white shadow-md" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                    {member.avatar}
                  </span>
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <select 
                value={form.category}
                onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 outline-none shadow-sm"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 active:scale-95">
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Expense List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {expenses.map((expense) => (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-900">{expense.title}</h4>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                    <span className="truncate">{expense.category}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-200" />
                    <span className="whitespace-nowrap shrink-0">Split {expense.splitAmong.length} ways</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-base font-bold tracking-tight text-slate-900">{currencyFormatter.format(expense.amount)}</p>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onRemoveExpense(expense.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
