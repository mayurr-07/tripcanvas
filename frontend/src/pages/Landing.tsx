import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, DollarSign, MapPin, Plane, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const featureSections = [
  {
    eyebrow: "Collaborate",
    title: "Keep everyone aligned without another spreadsheet.",
    description: "Invite owners, editors, and viewers into one calm planning space where every update is visible instantly.",
    visualTitle: "Shared trip context",
    lines: ["Owner sets the plan", "Editors shape each day", "Viewers follow the latest version"],
  },
  {
    eyebrow: "Itinerary",
    title: "Build each day like a living travel board.",
    description: "Drag activities into the right order, open details fast, and preserve the notes, files, and reservations the team needs.",
    visualTitle: "Day-by-day rhythm",
    lines: ["Morning arrival", "Afternoon workspace", "Evening dinner"],
  },
  {
    eyebrow: "Budget",
    title: "Track budget, docs, and packing in the same flow.",
    description: "From ticket PDFs to shared spend, TripCanvas keeps the practical pieces next to the plan instead of across tabs.",
    visualTitle: "Operational clarity",
    lines: ["Expenses stay visible", "Files remain attached", "Packing is shared"],
  },
];

function TravelBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="map-lines absolute inset-0 opacity-60" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M120 650C300 520 370 400 540 420C720 440 780 660 960 650C1140 640 1180 390 1320 300"
          stroke="rgba(244,162,97,0.38)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="14 16"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
        />
        <motion.path
          d="M180 260C310 210 470 180 650 250C840 324 900 250 1110 170"
          stroke="rgba(15,23,42,0.14)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="10 14"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>
      {[{ left: "16%", top: "24%" }, { left: "58%", top: "48%" }, { left: "78%", top: "22%" }].map((pin, index) => (
        <motion.div
          key={`${pin.left}-${pin.top}`}
          className="absolute"
          style={{ left: pin.left, top: pin.top }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--accent)] shadow-[0_20px_40px_-20px_rgba(15,23,42,0.24)]">
            <MapPin className="h-6 w-6" />
          </span>
        </motion.div>
      ))}
      <motion.div
        className="absolute left-[-10vw] top-[18vh] text-[var(--accent)]"
        animate={{ x: ["0vw", "120vw"], y: [0, -20, 12, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <Plane className="h-10 w-10 rotate-12" />
      </motion.div>
    </div>
  );
}

export function LandingPage() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white text-slate-950">
      <Navbar publicMode />

      <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_100%)]">
        <TravelBackdrop />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-10">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[clamp(3rem,8vw,7.2rem)] font-extrabold tracking-[-0.08em]"
            >
              TripCanvas
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 max-w-2xl text-[clamp(1.6rem,3.1vw,3rem)] font-semibold tracking-[-0.04em] text-slate-900"
            >
              Collaborative trip planning without the spreadsheet chaos.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
            >
              Design every day, coordinate every traveler, and keep the real travel details in one polished workspace.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start Planning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-[var(--accent)]/50"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {featureSections.map((section, index) => (
        <section key={section.title} className={index % 2 === 0 ? "bg-white" : "bg-[#fffaf5]"}>
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{section.eyebrow}</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-slate-950">{section.title}</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">{section.description}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#fffdf9_0%,#fdf1e7_100%)] p-10"
            >
              <div className="absolute inset-0 opacity-50 app-grid" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{section.visualTitle}</p>
                <div className="mt-8 space-y-6">
                  {section.lines.map((line, lineIndex) => (
                    <motion.div
                      key={line}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: lineIndex * 0.12 }}
                      className="flex items-center justify-between border-b border-slate-200/70 pb-4"
                    >
                      <p className="text-lg font-medium text-slate-900">{line}</p>
                      <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-12 lg:grid-cols-[1.2fr_1fr]"
          >
            <div>
              <p className="text-[clamp(2.5rem,5vw,4.4rem)] font-semibold tracking-[-0.05em]">Plan faster. Travel calmer.</p>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                TripCanvas brings itinerary building, member collaboration, files, packing, and budgets into one refined travel workflow.
              </p>
            </div>
            <div className="grid gap-5 text-sm text-slate-300 sm:grid-cols-2">
              <div className="space-y-3">
                <CalendarRange className="h-6 w-6 text-[var(--accent)]" />
                <p>Day-wise itinerary planning</p>
              </div>
              <div className="space-y-3">
                <Users className="h-6 w-6 text-[var(--accent)]" />
                <p>Role-based collaboration</p>
              </div>
              <div className="space-y-3">
                <DollarSign className="h-6 w-6 text-[var(--accent)]" />
                <p>Shared trip budget tracking</p>
              </div>
              <div className="space-y-3">
                <Plane className="h-6 w-6 text-[var(--accent)]" />
                <p>Reservations and attachments together</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}