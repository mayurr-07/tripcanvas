import { Building2, BusFront, Plane, Ticket } from "lucide-react";
import type { Reservation } from "../types/app";

interface ReservationCardProps {
  reservation: Reservation;
}

const iconMap = {
  Hotel: Building2,
  Flight: Plane,
  Bus: BusFront,
};

export function ReservationCard({ reservation }: ReservationCardProps) {
  const Icon = iconMap[reservation.type];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-slate-950">{reservation.title}</p>
            <p className="text-sm text-slate-500">{reservation.detail}</p>
          </div>
        </div>
        <Ticket className="h-4 w-4 text-slate-300" />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>{reservation.time}</span>
        <span className="font-medium text-slate-700">#{reservation.confirmationCode}</span>
      </div>
    </div>
  );
}