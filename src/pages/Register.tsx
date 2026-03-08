import { motion } from "framer-motion";
import { ArrowRight, MapPin, Plane } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch {
      setError("Unable to create the account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_100%)] px-6 py-20"
    >
      <div className="map-lines absolute inset-0 opacity-60" />
      <motion.div
        className="absolute left-[-10vw] top-[20vh] text-[var(--accent)]"
        animate={{ x: ["0vw", "120vw"], y: [0, -12, 14, -8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Plane className="h-12 w-12 rotate-6" />
      </motion.div>
      {[{ left: "14%", top: "26%" }, { left: "66%", top: "22%" }, { left: "76%", top: "70%" }].map((pin, index) => (
        <motion.div
          key={`${pin.left}-${pin.top}`}
          className="absolute text-[var(--accent)]"
          style={{ left: pin.left, top: pin.top }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.4 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <MapPin className="h-6 w-6" />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_460px]">
        <motion.div initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <p className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-[-0.08em] text-slate-950">TripCanvas</p>
          <h1 className="mt-6 text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.05em] text-slate-900">
            Create a workspace for every shared trip.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Invite teammates, line up the itinerary, and keep reservations, docs, and budget together from the very first plan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-xl border border-white/70 bg-white/90 p-8 shadow-[0_34px_100px_-36px_rgba(15,23,42,0.34)] backdrop-blur-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Get Started</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Register</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                placeholder="Amelia Jones"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                placeholder="amelia@company.com"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                placeholder="Create a secure password"
              />
            </label>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Register"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-slate-950 underline decoration-[var(--accent)] underline-offset-4">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}