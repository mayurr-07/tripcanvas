import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, MessageSquare, Paperclip, Plus, Send, Users, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { BudgetSummary } from "../components/BudgetSummary";
import { Checklist } from "../components/Checklist";
import { CommentSection } from "../components/CommentSection";
import { DayColumn } from "../components/DayColumn";
import { InviteModal } from "../components/InviteModal";
import { Navbar } from "../components/Navbar";
import { ReservationCard } from "../components/ReservationCard";
import { useAuth } from "../context/AuthContext";
import { getTripRequest, inviteTripRequest, saveTripRequest } from "../services/api";
import type { Activity, ExpensePayload, Trip } from "../types/app";

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

function roleClasses(role: string) {
  if (role === "Owner") {
    return "bg-slate-950 text-white";
  }

  if (role === "Editor") {
    return "bg-[var(--accent)]/15 text-slate-900";
  }

  return "bg-slate-100 text-slate-600";
}

export function TripDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({ title: "", location: "", time: "" });

  useEffect(() => {
    getTripRequest(id)
      .then((data) => {
        if (data) {
          setTrip(data);
          setSelectedDayId(data.days[0]?.id ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const selectedDay = useMemo(() => trip?.days.find((day) => day.id === selectedDayId) ?? trip?.days[0] ?? null, [selectedDayId, trip]);
  const selectedActivity = useMemo(
    () => trip?.days.flatMap((day) => day.activities).find((activity) => activity.id === selectedActivityId) ?? null,
    [selectedActivityId, trip]
  );

  const updateTrip = async (nextTrip: Trip) => {
    setTrip(nextTrip);
    await saveTripRequest(nextTrip);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!trip || !selectedDay || !result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reordered = Array.from(selectedDay.activities);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const nextTrip = {
      ...trip,
      days: trip.days.map((day) => (day.id === selectedDay.id ? { ...day, activities: reordered } : day)),
    };

    await updateTrip(nextTrip);
  };

  const handleAddActivity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trip || !selectedDay || !activityForm.title.trim()) {
      return;
    }

    const nextActivity: Activity = {
      id: `activity-${crypto.randomUUID()}`,
      title: activityForm.title.trim(),
      location: activityForm.location.trim() || "Location pending",
      time: activityForm.time || "TBD",
      notes: "New activity added to the shared itinerary.",
      comments: [],
      attachments: [],
      reservations: [],
    };

    const nextTrip = {
      ...trip,
      days: trip.days.map((day) =>
        day.id === selectedDay.id ? { ...day, activities: [...day.activities, nextActivity] } : day
      ),
    };

    await updateTrip(nextTrip);
    setActivityForm({ title: "", location: "", time: "" });
  };

  const handleInvite = async (payload: { name: string; email: string; role: "Owner" | "Editor" | "Viewer" }) => {
    if (!trip) {
      return;
    }

    const nextTrip = await inviteTripRequest(trip.id, payload);

    if (nextTrip) {
      setTrip(nextTrip);
    }

    setInviteOpen(false);
  };

  const handleChecklistToggle = async (itemId: string) => {
    if (!trip) {
      return;
    }

    const nextTrip = {
      ...trip,
      checklist: trip.checklist.map((item) => (item.id === itemId ? { ...item, packed: !item.packed } : item)),
    };

    await updateTrip(nextTrip);
  };

  const handleChecklistAdd = async (label: string) => {
    if (!trip) {
      return;
    }

    const nextTrip = {
      ...trip,
      checklist: [...trip.checklist, { id: `check-${crypto.randomUUID()}`, label, packed: false }],
    };

    await updateTrip(nextTrip);
  };

  const handleExpenseAdd = async (payload: ExpensePayload) => {
    if (!trip) {
      return;
    }

    const nextTrip = {
      ...trip,
      expenses: [
        ...trip.expenses,
        { id: `expense-${crypto.randomUUID()}`, title: payload.title, amount: payload.amount, category: payload.category, paidBy: payload.paidBy },
      ],
    };

    await updateTrip(nextTrip);
  };

  const handleCommentAdd = async (message: string) => {
    if (!trip || !selectedActivity || !user) {
      return;
    }

    const nextTrip = {
      ...trip,
      days: trip.days.map((day) => ({
        ...day,
        activities: day.activities.map((activity) =>
          activity.id === selectedActivity.id
            ? {
                ...activity,
                comments: [
                  ...activity.comments,
                  {
                    id: `comment-${crypto.randomUUID()}`,
                    author: user.name,
                    avatar: user.avatar,
                    message,
                    createdAt: "Just now",
                  },
                ],
              }
            : activity
        ),
      })),
    };

    await updateTrip(nextTrip);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] text-slate-500">Loading trip workspace...</div>;
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fffaf5] px-6 text-center">
        <p className="text-3xl font-semibold text-slate-950">Trip not found</p>
        <Link to="/dashboard" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Trip Workspace</p>
              <h1 className="mt-4 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold tracking-[-0.05em] text-slate-950">{trip.title}</h1>
              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-[var(--accent)]" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--accent)]" />
                  {trip.travelers} travelers
                </span>
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-[var(--accent)]" />
                  Budget ${trip.budget.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Send className="h-4 w-4" />
              Invite members
            </button>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_340px]">
          <DayColumn days={trip.days} selectedDayId={selectedDay?.id ?? ""} onSelect={setSelectedDayId} />

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.26)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Itinerary Builder</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selectedDay?.label}</h2>
                  <p className="mt-2 text-sm text-slate-500">Drag activities to reshape the day in seconds.</p>
                </div>
                <p className="text-sm text-slate-400">{selectedDay?.activities.length ?? 0} items</p>
              </div>

              <div className="mt-6">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={selectedDay?.id ?? "day"}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                        {selectedDay?.activities.map((activity, index) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            index={index}
                            onSelect={() => setSelectedActivityId(activity.id)}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>

            <form onSubmit={handleAddActivity} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.26)]">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Add activity</h3>
                  <p className="text-sm text-slate-500">Capture the next stop, meeting, or reservation touchpoint.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_140px_auto]">
                <input
                  value={activityForm.title}
                  onChange={(event) => setActivityForm((current) => ({ ...current, title: event.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                  placeholder="Activity title"
                />
                <input
                  value={activityForm.location}
                  onChange={(event) => setActivityForm((current) => ({ ...current, location: event.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                  placeholder="Location"
                />
                <input
                  type="time"
                  value={activityForm.time}
                  onChange={(event) => setActivityForm((current) => ({ ...current, time: event.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />
                <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Add
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <Checklist items={trip.checklist} onToggle={handleChecklistToggle} onAddItem={handleChecklistAdd} />
            <BudgetSummary budget={trip.budget} expenses={trip.expenses} paidByLabel={user?.name ?? "You"} onAddExpense={handleExpenseAdd} />
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Members</h3>
                  <p className="text-sm text-slate-500">Roles stay visible while the itinerary evolves.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {trip.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-950">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <span className={`rounded-xl px-3 py-1 text-xs font-semibold ${roleClasses(member.role)}`}>{member.role}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />

      <AnimatePresence>
        {selectedActivity ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivityId(null)}
              className="fixed inset-0 z-40 bg-slate-950/35"
              aria-label="Close activity details"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-[0_30px_90px_-24px_rgba(15,23,42,0.32)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Activity Details</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{selectedActivity.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{selectedActivity.location}</span>
                    <span>{selectedActivity.time}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{selectedActivity.notes}</p>
                </div>
                <button type="button" onClick={() => setSelectedActivityId(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 space-y-6">
                <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-3 text-[var(--accent)] shadow-sm">
                      <Paperclip className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-950">Attachments</h4>
                      <p className="text-sm text-slate-500">Tickets, PDFs, and visual references for the team.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {selectedActivity.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                        <div>
                          <p className="font-medium text-slate-950">{attachment.name}</p>
                          <p className="text-sm text-slate-500">{attachment.kind} file</p>
                        </div>
                        <span className="text-sm text-slate-400">{attachment.size}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    Drop more files here or connect the backend upload endpoint.
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-3 text-[var(--accent)] shadow-sm">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-950">Reservations</h4>
                      <p className="text-sm text-slate-500">Manual reservation cards attached to the activity.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedActivity.reservations.length > 0 ? (
                      selectedActivity.reservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)
                    ) : (
                      <div className="rounded-xl bg-white px-4 py-6 text-sm text-slate-500 shadow-sm">No reservations linked yet.</div>
                    )}
                  </div>
                </section>

                {user ? <CommentSection comments={selectedActivity.comments} currentUser={user} onAddComment={handleCommentAdd} /> : null}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}