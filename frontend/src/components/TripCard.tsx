import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, Users } from "lucide-react";
import type { Trip } from "../types/app";

interface TripCardProps {
  trip: Trip;
  onOpen: () => void;
}

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export function TripCard({ trip, onOpen }: TripCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group w-full rounded-xl border border-slate-200 bg-white p-6 text-left shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)] transition hover:border-[var(--accent)]/50"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{trip.destination}</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{trip.title}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-[var(--accent)]" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--accent)]" />
              {trip.travelers} travelers
            </p>
          </div>
        </div>
        <span className="rounded-xl bg-slate-100 p-3 text-slate-500 transition group-hover:bg-[var(--accent)]/15 group-hover:text-[var(--accent)]">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </motion.button>
  );
}