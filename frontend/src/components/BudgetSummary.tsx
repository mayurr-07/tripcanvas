import { DollarSign, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Expense, ExpensePayload } from "../types/app";

interface BudgetSummaryProps {
  budget: number;
  expenses: Expense[];
  paidByLabel: string;
  onAddExpense: (payload: ExpensePayload) => void;
  onRemoveExpense: (expenseId: string) => void;
  readOnly?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function BudgetSummary({ budget, expenses, paidByLabel, onAddExpense, onRemoveExpense, readOnly = false }: BudgetSummaryProps) {
  const [form, setForm] = useState({ title: "", amount: "", category: "Transport" });

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalSpent;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.amount) {
      return;
    }

    onAddExpense({
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      paidBy: paidByLabel,
    });

    setForm({ title: "", amount: "", category: "Transport" });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
          <DollarSign className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Budget tracker</h3>
          <p className="text-sm text-slate-500">Watch spend across the whole trip in real time.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Budget</p>
          <p className="mt-2 font-semibold text-slate-950">{currencyFormatter.format(budget)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Spent</p>
          <p className="mt-2 font-semibold text-slate-950">{currencyFormatter.format(totalSpent)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Remaining</p>
          <p className="mt-2 font-semibold text-slate-950">{currencyFormatter.format(remaining)}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="group flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm transition-colors hover:bg-slate-100">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium text-slate-950">{expense.title}</p>
                <p className="text-slate-500">{expense.category} paid by {expense.paidBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-slate-950">{currencyFormatter.format(expense.amount)}</p>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onRemoveExpense(expense.id)}
                  className="opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            placeholder="Add expense"
          />
          <div className="grid grid-cols-[1fr_132px] gap-2">
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              placeholder="Amount"
            />
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            >
              <option>Transport</option>
              <option>Stay</option>
              <option>Food</option>
              <option>Experience</option>
            </select>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add expense
          </button>
        </form>
      )}
    </section>
  );
}