import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Link, Loader2, Mail, MessageCircle, QrCode, X } from "lucide-react";
import { useEffect, useState } from "react";
import { generateInviteLinkRequest } from "../services/api";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  initialLink?: string;
}

export function InviteModal({ open, onClose, tripId, initialLink }: InviteModalProps) {
  const [inviteLink, setInviteLink] = useState(initialLink || "");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (initialLink) {
      setInviteLink(initialLink);
    }
  }, [initialLink]);

  useEffect(() => {
    if (open && !inviteLink && !initialLink) {
      handleGenerateLink();
    }
  }, [open, tripId, inviteLink, initialLink]);

  const [error, setError] = useState("");

  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateInviteLinkRequest(tripId);
      console.log("INVITE RESPONSE:", res);
      if (res.link && res.code) {
        setInviteLink(res.link);
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to generate invite link", err);
      setError("Server connection failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Join my trip workspace on TripCanvas! ${inviteLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("You're invited to a Trip Workspace");
    const body = encodeURIComponent(`Hey! I'm inviting you to collaborate on our trip details. Join here: ${inviteLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const inviteCode = inviteLink.split("/").pop() || "";

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
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px]"
            aria-label="Close invite modal"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-x-0 top-[15vh] z-50 mx-auto w-[min(92vw,28rem)] rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_40px_100px_-24px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Collaboration</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Invite team mates</h3>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                className="rounded-xl border border-slate-100 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
              Anyone with this link can join your trip workspace instantly to view and contribute to the itinerary.
            </p>

            <div className="mt-8 space-y-6">
              {!inviteLink && loading ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
                  <p className="text-xs font-medium text-slate-400">Generating secure invite link...</p>
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-rose-50 p-6 border border-rose-100 text-center">
                  <p className="text-sm font-semibold text-rose-600">{error}</p>
                  <button onClick={handleGenerateLink} className="mt-4 text-xs font-bold uppercase text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/30">Try Again</button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Share Link</p>
                      <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] transition hover:opacity-80">
                        <QrCode className="h-3 w-3" />
                        {showQR ? "Hide QR" : "Show QR"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showQR && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-4 flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inviteLink)}`} 
                              alt="Invite QR Code"
                              className="h-32 w-32 rounded-lg mix-blend-multiply"
                            />
                            <p className="mt-3 text-[10px] font-medium text-slate-400">Scan to join instantly</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          readOnly
                          value={inviteLink || "Generating link..."}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-xs font-medium text-slate-600 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex aspect-square items-center justify-center rounded-xl bg-slate-950 px-5 text-white transition hover:bg-slate-800 active:scale-95 shadow-sm"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={shareViaWhatsApp} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 transition hover:border-[var(--accent)] hover:bg-slate-50">
                      <MessageCircle className="h-4 w-4 text-emerald-500" />
                      WhatsApp
                    </button>
                    <button onClick={shareViaEmail} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 transition hover:border-[var(--accent)] hover:bg-slate-50">
                      <Mail className="h-4 w-4 text-sky-500" />
                      Email
                    </button>
                  </div>

                  <div className="rounded-2xl bg-slate-900 px-5 py-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invite Code</p>
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white uppercase">One-time Join</span>
                    </div>
                    <p className="mt-2 text-xl font-mono font-bold tracking-[0.2em] text-white">
                      {inviteCode || "••••-••••"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-7">
              <span className="text-xs font-medium text-slate-400">Collaborator Permissions</span>
              <span className="text-xs font-semibold text-slate-950 underline underline-offset-4 decoration-[var(--accent)]/30 cursor-help">Edit Access</span>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}