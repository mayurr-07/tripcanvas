import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import type { InvitePayload, MemberRole } from "../types/app";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (payload: InvitePayload) => Promise<void> | void;
}

const roles: MemberRole[] = ["Owner", "Editor", "Viewer"];

export function InviteModal({ open, onClose, onInvite }: InviteModalProps) {
  const [form, setForm] = useState<InvitePayload>({ name: "", email: "", role: "Editor" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onInvite(form);
    setForm({ name: "", email: "", role: "Editor" });
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
            aria-label="Close invite modal"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed inset-x-0 top-[12vh] z-50 mx-auto w-[min(92vw,30rem)] rounded-xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.32)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Invite Members</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Share the trip workspace</h3>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-slate-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  placeholder="Jordan Rivers"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                  placeholder="jordan@company.com"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Role</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as MemberRole }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Send Invite
              </button>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}