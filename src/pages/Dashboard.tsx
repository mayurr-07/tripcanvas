import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, MapPinned, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { TripCard } from "../components/TripCard";
import { createTripRequest, getTripsRequest } from "../services/api";
import type { CreateTripPayload, Trip } from "../types/app";

const emptyForm: CreateTripPayload = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 4,
};

function CreateTripModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTripPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateTripPayload>(emptyForm);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate(form);
    setForm(emptyForm);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/35"
            aria-label="Close create trip modal"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-x-0 top-[10vh] z-50 mx-auto w-[min(92vw,34rem)] rounded-xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-24px_rgba(15,23,42,0.36)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Create Trip</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Plan a new shared journey</h3>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Trip title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  placeholder="Spring planning retreat"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Destination</span>
                <input
                  required
                  value={form.destination}
                  onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  placeholder="Copenhagen, Denmark"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Start date</span>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">End date</span>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Travelers</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.travelers}
                  onChange={(event) => setForm((current) => ({ ...current, travelers: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                />
              </label>
              <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
                Create Trip
              </button>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    getTripsRequest()
      .then((data) => setTrips(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateTrip = async (payload: CreateTripPayload) => {
    const trip = await createTripRequest(payload);
    setTrips((current) => [trip, ...current]);
    setCreateOpen(false);
    navigate(`/trip/${trip.id}`);
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#fffaf5]">
      <Navbar onCreateTrip={() => setCreateOpen(true)} />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Dashboard</p>
            <h1 className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold tracking-[-0.05em] text-slate-950">
              Every trip, itinerary, and traveler in one modern planning space.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Open an active workspace, add a new destination, and keep your team moving with a shared trip operating system.
            </p>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-34px_rgba(15,23,42,0.24)] sm:grid-cols-3">
            <div>
              <CalendarRange className="h-5 w-5 text-[var(--accent)]" />
              <p className="mt-3 text-sm text-slate-500">Active trips</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{trips.length}</p>
            </div>
            <div>
              <Users className="h-5 w-5 text-[var(--accent)]" />
              <p className="mt-3 text-sm text-slate-500">Travelers</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{trips.reduce((sum, trip) => sum + trip.travelers, 0)}</p>
            </div>
            <div>
              <MapPinned className="h-5 w-5 text-[var(--accent)]" />
              <p className="mt-3 text-sm text-slate-500">Destinations</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{new Set(trips.map((trip) => trip.destination)).size}</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={`loading-${index}`} className="h-56 animate-pulse rounded-xl bg-white/70" />
              ))
            : trips.map((trip) => <TripCard key={trip.id} trip={trip} onOpen={() => navigate(`/trip/${trip.id}`)} />)}
        </div>
      </section>

      <CreateTripModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateTrip} />
    </motion.main>
  );
}