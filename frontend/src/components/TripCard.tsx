import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, Users } from "lucide-react";
import type { Trip } from "../types/app";

interface TripCardProps {
  trip: Trip;
  userId?: string;
  onOpen: () => void;
}

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export function TripCard({ trip, userId, onOpen }: TripCardProps) {
  const userMember = trip.members.find(m => m.id === userId);
  const role = userMember?.role || (trip.owner === userId ? "admin" : "viewer");

  const roleClasses = (r: string) => {
    switch (r?.toLowerCase()) {
      case "admin": return "bg-slate-950 text-white";
      case "editor": return "bg-[var(--accent)]/15 text-slate-900";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const timeAgo = (date: string) => {
    const r = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - r.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col w-full rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-[0_45px_100px_-50px_rgba(15,23,42,0.22)] transition hover:border-[var(--accent)]/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">{trip.destination}</p>
          <span className="h-1 w-1 rounded-full bg-slate-200" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Active {timeAgo(trip.updatedAt || "")}
          </p>
        </div>
        <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleClasses(role)}`}>
          {role}
        </span>
      </div>

      <div className="mt-5 flex-1 items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 group-hover:text-[var(--accent)] transition-colors">{trip.title}</h3>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] font-medium text-slate-500">
            <p className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-slate-300" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-300" />
              {trip.members.length} member{trip.members.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
        <div className="flex -space-x-2">
          {trip.members.slice(0, 3).map((m, idx) => (
            <div key={idx} className="h-7 w-7 rounded-full border-2 border-white bg-slate-950 text-[10px] flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-slate-100">
              {m.avatar}
            </div>
          ))}
          {trip.members.length > 3 && (
            <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 text-[9px] flex items-center justify-center font-bold text-slate-500 shadow-sm ring-1 ring-slate-100">
              +{trip.members.length - 3}
            </div>
          )}
        </div>
        <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
      </div>
    </motion.button>
  );
}