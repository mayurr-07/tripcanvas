import { motion } from "framer-motion";
import { Compass, LogOut, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

interface NavbarProps {
  publicMode?: boolean;
  onCreateTrip?: () => void;
}

export function Navbar({ publicMode = false, onCreateTrip }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "z-30 w-full",
        publicMode
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-slate-950 uppercase">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
            <Compass className="h-5 w-5" />
          </span>
          TripCanvas
        </Link>

        {publicMode ? (
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-slate-900 transition hover:border-[var(--accent)]/50"
            >
              Login
            </Link>
            <Link to="/register" className="rounded-xl bg-slate-950 px-5 py-3 text-white transition hover:bg-slate-800">
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )
                }
              >
                Dashboard
              </NavLink>
            </nav>
            {onCreateTrip ? (
              <button
                type="button"
                onClick={onCreateTrip}
                className="hidden items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-20px_rgba(244,162,97,0.95)] transition hover:translate-y-[-1px] md:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Create Trip
              </button>
            ) : null}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
                {user?.avatar ?? "TC"}
              </div>
              <div className="hidden min-w-0 md:block">
                <p className="truncate text-sm font-semibold text-slate-950">{user?.name ?? "Traveler"}</p>
                <p className="truncate text-xs text-slate-500">Workspace owner</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}