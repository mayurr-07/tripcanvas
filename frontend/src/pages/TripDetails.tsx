import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, MessageSquare, Paperclip, Plus, Users, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { BudgetAnalytics } from "../components/BudgetAnalytics";
import { Checklist } from "../components/Checklist";
import { CommentSection } from "../components/CommentSection";
import { DayColumn } from "../components/DayColumn";
import { ExpenseSplitter } from "../components/ExpenseSplitter";
import { InviteModal } from "../components/InviteModal";
import { Navbar } from "../components/Navbar";
import { ReservationCard } from "../components/ReservationCard";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";
import {
  createActivityRequest,
  createAttachmentRequest,
  createChecklistItemRequest,
  createCommentRequest,
  createExpenseRequest,
  deleteChecklistItemRequest,
  deleteExpenseRequest,
  generateInviteLinkRequest,
  getActivitiesRequest,
  getChecklistRequest,
  getExpensesRequest,
  getReservationsRequest,
  getTripRequest,
  saveTripRequest,
  toggleChecklistRequest,
} from "../services/api";
import type { Activity, DayPlan, Trip, ExpensePayload } from "../types/app";

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export function TripDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({ title: "", location: "", time: "" });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  const fetchTripData = async () => {
    try {
      const tripData = await getTripRequest(id);
      if (!tripData) {
        setLoading(false);
        return;
      }

      // Pre-fetch invite link in background
      generateInviteLinkRequest(id).then(res => setInviteLink(res.link)).catch(() => {});

      const [activitiesRes, checklistRes, expensesRes] = await Promise.all([
        getActivitiesRequest(id).catch(() => []),
        getChecklistRequest(id).catch(() => []),
        getExpensesRequest(id).catch(() => []),
        getReservationsRequest(id).catch(() => []),
      ]);

      const rawActivities = Array.isArray(activitiesRes) ? activitiesRes : [];
      const mappedActivities: Activity[] = rawActivities.map((a: any) => ({
        id: a._id || a.id || crypto.randomUUID(),
        title: a.title || "Untitled",
        location: a.location || "Location pending",
        time: a.time || "TBD",
        notes: a.notes || "",
        comments: a.comments || [],
        attachments: a.attachments || [],
        reservations: a.reservations || [],
      }));

      const updatedDays: DayPlan[] = tripData.days.map((day, idx) => {
        if (idx === 0) return { ...day, activities: mappedActivities };
        return day;
      });

      const rawChecklist = Array.isArray(checklistRes) ? checklistRes : [];
      const rawExpenses = Array.isArray(expensesRes) ? expensesRes : [];

      const fullTrip: Trip = {
        ...tripData,
        checklist: rawChecklist.length > 0 ? rawChecklist.map((item: any) => ({
          id: item._id || item.id,
          text: item.text || "",
          completed: item.completed || false,
          category: item.category || "Essentials"
        })) : tripData.checklist,
        expenses: rawExpenses.length > 0 ? rawExpenses.map((exp: any) => ({
          id: exp._id || exp.id,
          title: exp.title,
          amount: Number(exp.amount) || 0,
          category: exp.category || "Dining",
          paidBy: exp.paidBy,
          splitAmong: exp.splitAmong || [],
          createdAt: exp.createdAt || new Date().toISOString()
        })) : tripData.expenses,
        days: updatedDays,
      };

      setTrip(fullTrip);
      setSelectedDayId(fullTrip.days[0]?.id ?? "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const selectedDay = useMemo(() => trip?.days.find((day) => day.id === selectedDayId) ?? trip?.days[0] ?? null, [selectedDayId, trip]);
  const selectedActivity = useMemo(
    () => trip?.days.flatMap((day) => day.activities).find((activity) => activity.id === selectedActivityId) ?? null,
    [selectedActivityId, trip]
  );

  const currentUserInTrip = useMemo(() => 
    trip?.members.find((m) => m.id === user?.id || (m as any).user === user?.id || (m as any).user?._id === user?.id),
  [trip, user]);
  
  const userRole = (currentUserInTrip?.role as any || "viewer").toLowerCase();
  const isOwner = trip?.owner === user?.id;
  const canAdmin = isOwner || userRole === "admin";
  const canEdit = canAdmin || userRole === "editor";

  const roleClasses = (role: string) => {
    const r = role.toLowerCase();
    switch (r) {
      case "admin": return "bg-slate-950 text-white";
      case "editor": return "bg-[var(--accent)]/15 text-slate-900";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const updateTrip = async (nextTrip: Trip) => {
    if (!canEdit) return;
    setTrip(nextTrip);
    await saveTripRequest(nextTrip);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!trip || !selectedDay || !result.destination || !canEdit) return;
    if (result.destination.index === result.source.index) return;
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
    if (!trip || !selectedDay || !activityForm.title.trim() || !canEdit) return;

    try {
      const newActivity = await createActivityRequest({
        tripId: id,
        title: activityForm.title.trim(),
        location: activityForm.location.trim(),
        time: activityForm.time,
        notes: "New activity added to the shared itinerary.",
      });

      const activityForState: Activity = {
        id: newActivity._id || newActivity.id || crypto.randomUUID(),
        title: newActivity.title || activityForm.title.trim(),
        location: newActivity.location || activityForm.location.trim() || "Location pending",
        time: newActivity.time || activityForm.time || "TBD",
        notes: newActivity.notes || "New activity added to the shared itinerary.",
        comments: newActivity.comments || [],
        attachments: newActivity.attachments || [],
        reservations: newActivity.reservations || [],
      };

      const nextTrip = {
        ...trip,
        days: trip.days.map((day) =>
          day.id === selectedDay.id ? { ...day, activities: [...day.activities, activityForState] } : day
        ),
      };

      await updateTrip(nextTrip);
      setActivityForm({ title: "", location: "", time: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChecklistToggle = async (itemId: string) => {
    if (!trip || !canEdit) return;
    try {
      await toggleChecklistRequest(itemId);
      setTrip({
        ...trip,
        checklist: trip.checklist.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChecklistAdd = async (text: string, category: string) => {
    if (!trip || !canEdit) return;
    try {
      const newItem = await createChecklistItemRequest({ trip: id, text, category });
      setTrip({
        ...trip,
        checklist: [...trip.checklist, newItem],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChecklistRemove = async (itemId: string) => {
    if (!trip || !canEdit) return;
    try {
      await deleteChecklistItemRequest(itemId);
      setTrip({
        ...trip,
        checklist: trip.checklist.filter((item) => item.id !== itemId),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpenseAdd = async (payload: ExpensePayload) => {
    if (!trip || !canEdit) return;
    try {
      const newExpense = await createExpenseRequest({ ...payload, trip: id });
      setTrip({
        ...trip,
        expenses: [...trip.expenses, newExpense],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpenseRemove = async (expenseId: string) => {
    if (!trip || !canEdit) return;
    try {
      await deleteExpenseRequest(expenseId);
      setTrip({
        ...trip,
        expenses: trip.expenses.filter((exp) => exp.id !== expenseId),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentAdd = async (message: string) => {
    if (!trip || !selectedActivity || !user) return;
    try {
      const newComment = await createCommentRequest({ activityId: selectedActivity.id, message });
      const commentState = {
        id: newComment._id || newComment.id || crypto.randomUUID(),
        author: user.name,
        avatar: user.avatar,
        message: newComment.message || message,
        createdAt: newComment.createdAt || "Just now",
      };

      const nextTrip = {
        ...trip,
        days: trip.days.map((day) => ({
          ...day,
          activities: day.activities.map((activity) =>
            activity.id === selectedActivity.id
              ? { ...activity, comments: [...(activity.comments || []), commentState] }
              : activity
          ),
        })),
      };
      await updateTrip(nextTrip);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!trip || !selectedActivity || !event.target.files || event.target.files.length === 0 || !canEdit) return;
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tripId", trip.id);
      formData.append("activityId", selectedActivity.id);

      const res = await createAttachmentRequest(formData);
      const attachment = {
        id: res._id || res.id || crypto.randomUUID(),
        name: file.name,
        kind: (file.type.includes("pdf") ? "PDF" : "Image") as any,
        size: `${(file.size / 1024).toFixed(1)} KB`
      };

      const nextTrip = {
        ...trip,
        days: trip.days.map((day) => ({
          ...day,
          activities: day.activities.map((activity) =>
            activity.id === selectedActivity.id
              ? { ...activity, attachments: [...(activity.attachments || []), attachment] }
              : activity
          ),
        })),
      };
      setTrip(nextTrip);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] text-slate-500">Loading trip workspace...</div>;

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fffaf5] px-6 text-center">
        <p className="text-3xl font-semibold text-slate-950">Trip not found</p>
        <Link to="/dashboard" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#fffaf5]">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-4 py-10 lg:px-6 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Trip Workspace</p>
              <h1 className="mt-4 max-w-3xl break-words text-[clamp(2rem,3.6vw,3.5rem)] font-semibold tracking-[-0.05em] text-slate-950 leading-tight">
                {trip.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-[var(--accent)]" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--accent)]" />
                  {trip.travelers} travelers
                </span>
                {isEditingBudget ? (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-[var(--accent)]" />
                    <input
                      type="number"
                      autoFocus
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-[var(--accent)]"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      onBlur={async () => {
                        const nextBudget = Number(tempBudget) || 0;
                        if (trip) {
                          const updated = { ...trip, budget: nextBudget };
                          setTrip(updated);
                          await saveTripRequest(updated);
                        }
                        setIsEditingBudget(false);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          const nextBudget = Number(tempBudget) || 0;
                          if (trip) {
                            const updated = { ...trip, budget: nextBudget };
                            setTrip(updated);
                            await saveTripRequest(updated);
                          }
                          setIsEditingBudget(false);
                        }
                        if (e.key === "Escape") setIsEditingBudget(false);
                      }}
                    />
                  </div>
                ) : (
                  <span 
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      canEdit && "cursor-pointer hover:text-slate-950"
                    )}
                    onClick={() => {
                      if (!canEdit) return;
                      setTempBudget(String(trip.budget));
                      setIsEditingBudget(true);
                    }}
                  >
                    <Wallet className="h-4 w-4 text-[var(--accent)]" />
                    Budget ${trip.budget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            {canAdmin && (
              <button type="button" onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                <Users className="h-4 w-4" />
                Invite members
              </button>
            )}
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-12 gap-8 md:gap-10">
          <div className="col-span-12 xl:col-span-3 min-w-0">
            <DayColumn days={trip.days} selectedDayId={selectedDay?.id ?? ""} onSelect={setSelectedDayId} />
          </div>

          <div className="col-span-12 xl:col-span-6 min-w-0 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.26)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Itinerary Builder</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selectedDay?.label}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {canEdit ? "Drag activities to reshape the day in seconds." : "View the planned itinerary for this day."}
                  </p>
                </div>
                <p className="text-sm text-slate-400">{selectedDay?.activities.length ?? 0} items</p>
              </div>

              <div className="mt-6">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={selectedDay?.id ?? "day"} isDropDisabled={!canEdit}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                        {selectedDay?.activities.map((activity, index) => (
                          <ActivityCard key={activity.id} activity={activity} index={index} onSelect={() => setSelectedActivityId(activity.id)} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>

            {canEdit && (
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
                <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4 min-w-0">
                    <input required value={activityForm.title} onChange={(event) => setActivityForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]" placeholder="Activity title" />
                  </div>
                  <div className="md:col-span-4 min-w-0">
                    <input required value={activityForm.location} onChange={(event) => setActivityForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]" placeholder="Location" />
                  </div>
                  <div className="md:col-span-2">
                    <input type="time" value={activityForm.time} onChange={(event) => setActivityForm((current) => ({ ...current, time: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full h-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Add</button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="col-span-12 xl:col-span-3 min-w-0 overflow-hidden space-y-6">
            <Checklist items={trip.checklist} onToggle={handleChecklistToggle} onAddItem={handleChecklistAdd} onRemoveItem={handleChecklistRemove} readOnly={!canEdit} />
            
            <BudgetAnalytics 
              expenses={trip.expenses} 
              budget={trip.budget || 5000} 
            />
            
            <ExpenseSplitter
              expenses={trip.expenses}
              members={trip.members}
              userId={user?.id || ""}
              onAddExpense={handleExpenseAdd}
              onRemoveExpense={handleExpenseRemove}
              readOnly={!canEdit}
            />

            <section className="rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.15)] backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Users className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">Members</h3>
                  <p className="text-[13px] font-medium text-slate-500">Roles stay visible while the itinerary evolves.</p>
                </div>
              </div>
              <div className="space-y-3">
                {trip.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">{member.avatar}</div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-950 truncate text-sm">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className={`block rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${roleClasses(member.role)}`}>{member.role}</span>
                      {(member as any).joinedAt && (
                        <p className="mt-1 text-[9px] font-medium text-slate-400">Joined {new Date((member as any).joinedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <InviteModal tripId={trip.id} open={inviteOpen} onClose={() => setInviteOpen(false)} initialLink={inviteLink} />

      <AnimatePresence>
        {selectedActivity ? (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedActivityId(null)} className="fixed inset-0 z-40 bg-slate-950/35" aria-label="Close activity details" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 180, damping: 24 }} className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-[0_30px_90px_-24px_rgba(15,23,42,0.32)]">
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
                        <div className="min-w-0 truncate">
                          <p className="font-medium text-slate-950 truncate">{attachment.name}</p>
                          <p className="text-sm text-slate-500">{attachment.kind} file</p>
                        </div>
                        <span className="text-sm text-slate-400 shrink-0 ml-2">{attachment.size}</span>
                      </div>
                    ))}
                  </div>
                  {canEdit && (
                    <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 transition hover:bg-slate-100">
                      Drop more files here or click to connect the backend upload endpoint.
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
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