import { BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts';
import type { Expense } from "../types/app";
import { motion } from "framer-motion";

interface BudgetAnalyticsProps {
  expenses: Expense[];
  budget: number;
}

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9'];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function BudgetAnalytics({ expenses, budget }: BudgetAnalyticsProps) {
  const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const remaining = budget - totalSpent;
  const progress = Math.min(100, Math.round((totalSpent / (budget || 1)) * 100));

  const chartData = useMemo(() => {
    const grouped = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const timeData = useMemo(() => {
    // Group expenses by date (simple version)
    const grouped = expenses.reduce((acc, exp) => {
      const date = new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, amount]) => ({ date, amount })).slice(-5);
  }, [expenses]);

  return (
    <section className="rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.15)] backdrop-blur-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <TrendingUp className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">Budget Analytics</h3>
            <p className="text-[13px] font-medium text-slate-500">Track your spending at a glance.</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-2">
        {[
          { label: "Total Spent", value: totalSpent, icon: <TrendingUp className="h-4 w-4" />, color: "bg-slate-950 text-white" },
          { label: "Remaining", value: remaining, icon: <Zap className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-600" },
          { label: "Avg / Day", value: totalSpent / Math.max(1, expenses.length), icon: <BarChartIcon className="h-4 w-4" />, color: "bg-blue-50 text-blue-600" },
          { label: "Spend %", value: `${progress}%`, isCurrency: false, icon: <PieChartIcon className="h-4 w-4" />, color: "bg-slate-100 text-slate-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-4 border border-slate-50 shadow-sm ${stat.color === 'bg-slate-950 text-white' ? stat.color : 'bg-white'}`}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</p>
            <p className="mt-1 text-lg font-bold tracking-tight">
              {typeof stat.value === 'number' ? currencyFormatter.format(stat.value) : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 space-y-6">
        {/* Category Share */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
              <PieChartIcon className="h-4 w-4" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-slate-900">Category Split</h4>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend over Time */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
              <BarChartIcon className="h-4 w-4" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-slate-900">Spend History</h4>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
