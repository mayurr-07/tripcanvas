import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, Link, MapPinned, Plus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { TripCard } from "../components/TripCard";
import { useAuth } from "../context/AuthContext";
import { createTripRequest, getTripsRequest, joinTripRequest } from "../services/api";
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
  const { user } = useAuth();
  const [trips, setTrips] = useState<{ owned: Trip[]; shared: Trip[] }>({ owned: [], shared: [] });
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteValue, setInviteValue] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState({ type: "", text: "" });

  const fetchTrips = async () => {
    try {
      const data = await getTripsRequest();
      setTrips({ owned: data.ownedTrips, shared: data.sharedTrips });
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (payload: CreateTripPayload) => {
    const trip = await createTripRequest(payload);
    await fetchTrips();
    setCreateOpen(false);
    navigate(`/trip/${trip.id}`);
  };

  const handleJoinTrip = async () => {
    const input = inviteValue.trim();
    if (!input) return;
    
    setJoining(true);
    setJoinMsg({ type: "", text: "" });

    try {
      // Robust token extraction
      let token = input;
      if (token.includes("/")) {
        // Remove trailing slash if exists, then pop
        token = token.replace(/\/$/, "").split("/").pop() || token;
      }

      const res = await joinTripRequest(token);
      setJoinMsg({ type: "success", text: res.message });
      setInviteValue("");
      
      await fetchTrips();

      setTimeout(() => {
        navigate(`/trip/${res.trip.id}`);
      }, 1500);
    } catch (err: any) {
      setJoinMsg({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to join. Invalid or expired token." 
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#fffaf5]">
      <Navbar onCreateTrip={() => setCreateOpen(true)} />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Dashboard</p>
            <h1 className="mt-4 text-[clamp(2.2rem,4vw,3.7rem)] font-semibold tracking-[-0.05em] text-slate-950">
              Every trip, itinerary, and traveler in one workspace.
            </h1>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-white p-7 shadow-[0_30px_80px_-34px_rgba(15,23,42,0.24)] sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <CalendarRange className="h-5 w-5 text-[var(--accent)] mx-auto sm:mx-0" />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Trips</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {trips.owned.length + trips.shared.length}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <Users className="h-5 w-5 text-[var(--accent)] mx-auto sm:mx-0" />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Travelers</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {[...trips.owned, ...trips.shared].reduce((sum: number, t: Trip) => sum + t.members.length, 0)}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <MapPinned className="h-5 w-5 text-[var(--accent)] mx-auto sm:mx-0" />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Destinations</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {new Set([...trips.owned, ...trips.shared].map((t: Trip) => t.destination)).size}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Join Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mt-10 rounded-[2.5rem] border border-white bg-white/70 p-10 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.15)] backdrop-blur-md"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Join via Invite</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">Pasted an invite link or code? Collaborate with your team instantly.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Link className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  value={inviteValue}
                  onChange={(e) => setInviteValue(e.target.value)}
                  placeholder="Paste invite link or code..." 
                  className="w-full rounded-2xl border border-slate-100 bg-white px-11 py-4 text-sm outline-none transition focus:border-[var(--accent)] shadow-sm" 
                />
              </div>
              <button 
                onClick={handleJoinTrip}
                disabled={joining || !inviteValue.trim()}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-70 shadow-lg shadow-slate-950/20"
              >
                {joining ? "Joining..." : "Join Now"}
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          {joinMsg.text && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className={`mt-5 text-center text-sm font-bold ${joinMsg.type === "success" ? "text-emerald-600" : "text-rose-500"}`}
            >
              {joinMsg.text}
            </motion.p>
          )}
        </motion.div>

        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">My Trip Workspaces</h2>
            <div className="h-px flex-1 mx-6 bg-slate-100 hidden sm:block" />
            <span className="text-xs font-medium text-slate-400">{trips.owned.length} total</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }, (_, i) => (
                  <div key={`l-o-${i}`} className="h-64 animate-pulse rounded-[2.5rem] bg-white/70 shadow-sm" />
                ))
              : trips.owned.map((t) => <TripCard key={t.id} trip={t} userId={user?.id} onOpen={() => navigate(`/trip/${t.id}`)} />)}
          </div>
        </div>

        {trips.shared.length > 0 && (
          <div className="mt-20 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Shared Collaborations</h2>
              <div className="h-px flex-1 mx-6 bg-slate-100 hidden sm:block" />
              <span className="text-xs font-medium text-slate-400">{trips.shared.length} active</span>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {trips.shared.map((t) => <TripCard key={t.id} trip={t} userId={user?.id} onOpen={() => navigate(`/trip/${t.id}`)} />)}
            </div>
          </div>
        )}
      </section>

      <CreateTripModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateTrip} />
    </motion.main>
  );
}