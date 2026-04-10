import { motion } from "framer-motion";
import type { DayPlan } from "../types/app";
import { cn } from "../utils/cn";

interface DayColumnProps {
  days: DayPlan[];
  selectedDayId: string;
  onSelect: (dayId: string) => void;
}

function formatDayDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export function DayColumn({ days, selectedDayId, onSelect }: DayColumnProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Trip Days</p>
      <div className="mt-5 space-y-2">
        {days.map((day) => {
          const isActive = day.id === selectedDayId;

          return (
            <motion.button
              key={day.id}
              type="button"
              whileHover={{ x: 4 }}
              onClick={() => onSelect(day.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition",
                isActive ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              <span>
                <span className="block text-sm font-semibold">{day.label}</span>
                <span className={cn("text-xs", isActive ? "text-slate-300" : "text-slate-500")}>{formatDayDate(day.date)}</span>
              </span>
              <span className={cn("text-xs font-medium", isActive ? "text-[var(--accent)]" : "text-slate-400")}>{day.activities.length}</span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}