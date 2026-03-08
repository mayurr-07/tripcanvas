import { motion } from "framer-motion";
import { BusFront, Cloud, MapPin, Plane, TrainFront } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AnimatedTravelScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="map-lines absolute inset-0 opacity-70" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M70 290C250 180 380 180 500 250C640 332 710 428 920 378C1095 336 1190 186 1370 110"
          stroke="rgba(244,162,97,0.42)"
          strokeWidth="4"
          strokeDasharray="12 12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M120 770C290 730 430 680 610 700C810 722 930 820 1260 770"
          stroke="rgba(15,23,42,0.16)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M120 640C280 560 410 544 590 612C740 668 860 662 1040 592C1160 546 1250 520 1360 548"
          stroke="rgba(244,162,97,0.22)"
          strokeWidth="20"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
        />
      </svg>

      {[{ left: "12%", top: "22%" }, { left: "44%", top: "32%" }, { left: "72%", top: "24%" }, { left: "78%", top: "61%" }].map((pin, index) => (
        <motion.div
          key={`${pin.left}-${pin.top}`}
          className="absolute text-[var(--accent)]"
          style={{ left: pin.left, top: pin.top }}
          animate={{ y: [0, -12, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="rounded-full bg-white/90 p-3 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.3)]">
            <MapPin className="h-5 w-5" />
          </div>
        </motion.div>
      ))}

      {[{ left: "8%", top: "12%" }, { left: "66%", top: "9%" }, { left: "78%", top: "18%" }].map((cloud, index) => (
        <motion.div
          key={`${cloud.left}-${cloud.top}`}
          className="absolute text-slate-300/90"
          style={{ left: cloud.left, top: cloud.top }}
          animate={{ x: [0, 22, 0] }}
          transition={{ duration: 12 + index * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud className="h-14 w-14" />
        </motion.div>
      ))}

      <motion.div
        className="absolute left-[-12vw] top-[18vh] text-[var(--accent)]"
        animate={{ x: ["0vw", "128vw"], y: [0, -16, 18, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <Plane className="h-12 w-12 rotate-6" />
      </motion.div>

      <motion.div
        className="absolute left-[-18vw] top-[73vh] text-slate-900"
        animate={{ x: ["0vw", "130vw"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <TrainFront className="h-12 w-12" />
      </motion.div>

      <motion.div
        className="absolute left-[-18vw] top-[59vh] text-[var(--accent)]"
        animate={{ x: ["0vw", "128vw"], y: [0, -6, 10, -2, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 1.4 }}
      >
        <BusFront className="h-11 w-11" />
      </motion.div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "amelia@tripcanvas.app", password: "password123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      setError("Unable to log in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f1_100%)] px-6 py-20"
    >
      <AnimatedTravelScene />

      <div className="relative z-10 grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_460px] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <p className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-[-0.08em] text-slate-950">TripCanvas</p>
          <h1 className="mt-6 text-[clamp(2rem,4vw,3.6rem)] font-semibold tracking-[-0.05em] text-slate-900">
            Login to the journey control room.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Watch routes come alive while you step back into your team workspace, itinerary, and shared travel details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-xl border border-white/70 bg-white/90 p-8 shadow-[0_40px_120px_-38px_rgba(15,23,42,0.35)] backdrop-blur-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Welcome Back</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Use the demo account or connect your backend auth flow instantly.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to TripCanvas?{" "}
            <Link to="/register" className="font-semibold text-slate-950 underline decoration-[var(--accent)] underline-offset-4">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}