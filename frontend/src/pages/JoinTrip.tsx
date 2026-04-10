import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { joinTripRequest } from "../services/api";

export function JoinTripPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying invitation...");

  useEffect(() => {
    const joinTrip = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid invitation token.");
        return;
      }

      try {
        const response = await joinTripRequest(token);
        setStatus("success");
        setMessage(response.message || "Successfully joined the trip!");
        
        // Wait 2 seconds then redirect to the trip page
        setTimeout(() => {
          navigate(`/trips/${response.trip.id}`);
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Failed to join trip. The link may be invalid or expired.");
      }
    };

    joinTrip();
  }, [token, navigate]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6"
    >
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/70 bg-white/90 p-10 shadow-[0_40px_100px_-34px_rgba(15,23,42,0.24)] backdrop-blur-xl"
        >
          <div className="flex justify-center">
            {status === "loading" && (
              <Loader2 className="h-14 w-14 animate-spin text-[var(--accent)]" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            )}
            {status === "error" && (
              <XCircle className="h-14 w-14 text-rose-500" />
            )}
          </div>

          <h1 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            {status === "loading" ? "Joining Trip" : status === "success" ? "Welcome Aboard!" : "Invitation Error"}
          </h1>
          
          <p className="mt-4 text-slate-600">
            {message}
          </p>

          {status === "success" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[var(--accent)]"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to trip workspace...
            </motion.div>
          )}

          {status === "error" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 w-full rounded-xl bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Dashboard
            </button>
          )}
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium tracking-wide uppercase">TripCanvas Invite</span>
        </div>
      </div>
    </motion.main>
  );
}
