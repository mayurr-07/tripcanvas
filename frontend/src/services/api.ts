import axios from "axios";
import { storageKeys } from "../data/mockData";
import type {
  Activity,
  AuthResponse,
  ChecklistItem,
  ChecklistPayload,
  CreateTripPayload,
  DayPlan,
  Expense,
  ExpensePayload,
  ExpenseSummary,
  InvitePayload,
  LoginPayload,
  MemberRole,
  RegisterPayload,
  Trip,
} from "../types/app";

export const API = import.meta.env.VITE_API_URL;
console.log("Current API:", API);

// Using axios instance configured to use the dynamic API URL
export const api = axios.create({
  baseURL: `${API}/api`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(storageKeys.token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper functions for mapping backend to frontend structures
function createTripDays(startDate: string, endDate: string): DayPlan[] {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1);

  return Array.from({ length: totalDays }, (_, index) => {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + index);

    return {
      id: `day-${crypto.randomUUID()}`,
      label: `Day ${index + 1}`,
      date: nextDate.toISOString().split("T")[0],
      activities: [] as Activity[],
    };
  });
}

function mapBackendTripToFrontend(trip: any): Trip {
  return {
    id: String(trip._id || trip.id),
    title: trip.title || "Untitled Trip",
    destination: trip.destination || "TBD",
    startDate: trip.startDate || new Date().toISOString(),
    endDate: trip.endDate || new Date().toISOString(),
    travelers: trip.travelers || 1,
    budget: trip.budget || 0,
    members: (trip.members || []).map((m: any) => ({
      id: String(m.user?._id || m.user || m.id || crypto.randomUUID()),
      name: m.user?.name || m.name || "Unknown",
      email: m.user?.email || m.email || "",
      avatar: (m.user?.name || m.name || "U").substring(0, 2).toUpperCase(),
      role: (m.role || "viewer").toLowerCase() as MemberRole,
    })),
    checklist: trip.checklist || [],
    expenses: trip.expenses || [],
    days: trip.days || createTripDays(trip.startDate, trip.endDate),
    owner: String(trip.owner?._id || trip.owner || ""),
    updatedAt: trip.updatedAt || new Date().toISOString(),
  };
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse>(`${API}/api/auth/login`, payload);
    
    if (!data || !data.token) {
      throw new Error("Invalid response from server");
    }

    const userData: any = data.user || data; 
    const userId = userData._id || userData.id;

    return {
      token: data.token,
      user: {
        id: String(userId),
        name: userData.name || "User",
        email: userData.email || "",
        avatar: (userData.name || "U").substring(0, 2).toUpperCase(),
      }
    };
  } catch (error: any) {
    console.error("Login Error:", error);
    throw error;
  }
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse>(`${API}/api/auth/register`, {
      username: payload.name,
      email: payload.email,
      password: payload.password
    });

    if (!data || !data.token) {
      throw new Error("Invalid response from server during registration");
    }

    const userData: any = data.user || data;
    const userId = userData._id || userData.id;

    return {
      token: data.token,
      user: {
        id: String(userId),
        name: userData.name || "User",
        email: userData.email || "",
        avatar: (userData.name || "U").substring(0, 2).toUpperCase(),
      }
    };
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw error;
  }
}

export async function getTripsRequest(): Promise<{ ownedTrips: Trip[]; sharedTrips: Trip[] }> {
  // Using the configured axios instance for other authenticated requests
  const { data } = await api.get("/trips");
  return {
    ownedTrips: data.ownedTrips.map(mapBackendTripToFrontend),
    sharedTrips: data.sharedTrips.map(mapBackendTripToFrontend),
  };
}

export async function createTripRequest(payload: CreateTripPayload): Promise<Trip> {
  const { data } = await api.post("/trips", payload);
  return mapBackendTripToFrontend(data);
}

export async function getTripRequest(id: string): Promise<Trip | undefined> {
  try {
    const { data } = await api.get(`/trips/${id}`);
    return mapBackendTripToFrontend(data);
  } catch (err: any) {
    if (err.response?.status === 404 || err.response?.status === 500) {
      const { data } = await api.get("/trips");
      const match = data.find((t: any) => t._id === id || t.id === id);
      return match ? mapBackendTripToFrontend(match) : undefined;
    }
    throw err;
  }
}

export async function saveTripRequest(trip: Trip): Promise<Trip> {
  const { data } = await api.put(`/trips/${trip.id}`, trip);
  return mapBackendTripToFrontend(data);
}

export async function inviteTripRequest(tripId: string, payload: InvitePayload): Promise<Trip | undefined> {
  const { data } = await api.post(`/trips/${tripId}/invite`, payload);
  if (data.trip) {
    return mapBackendTripToFrontend(data.trip);
  }
  return mapBackendTripToFrontend(data);
}

export async function generateInviteLinkRequest(tripId: string): Promise<{ link: string; code: string }> {
  const { data } = await api.post(`/trips/${tripId}/invite`);
  return data;
}

export async function joinTripRequest(token: string): Promise<{ message: string; trip: Trip }> {
  const { data } = await api.post(`/trips/join/${token}`);
  return {
    message: data.message,
    trip: mapBackendTripToFrontend(data.trip)
  };
}

export async function createActivityRequest(payload: any) {
  const { data } = await api.post("/activities", payload);
  return data;
}

export async function getActivitiesRequest(tripId: string) {
  const { data } = await api.get(`/activities/${tripId}`);
  return data;
}

export async function createCommentRequest(payload: any) {
  const { data } = await api.post("/comments", payload);
  return data;
}

export async function getCommentsRequest(activityId: string) {
  const { data } = await api.get(`/comments/${activityId}`);
  return data;
}

export async function createExpenseRequest(payload: ExpensePayload): Promise<Expense> {
  const { data } = await api.post("/expenses", payload);
  return {
    ...data,
    id: data._id,
    splitAmong: (data.splitAmong || []).map((id: any) => String(id)),
  };
}

export async function getExpensesRequest(tripId: string): Promise<Expense[]> {
  const { data } = await api.get(`/expenses/${tripId}`);
  return data.map((exp: any) => ({
    ...exp,
    id: exp._id,
    splitAmong: (exp.splitAmong || []).map((id: any) => String(id)),
  }));
}

export async function getExpensesSummaryRequest(tripId: string): Promise<ExpenseSummary> {
  const { data } = await api.get(`/expenses/${tripId}/summary`);
  return data;
}

export async function deleteExpenseRequest(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}

export async function getChecklistRequest(tripId: string): Promise<ChecklistItem[]> {
  const { data } = await api.get(`/checklist/${tripId}`);
  return data.map((item: any) => ({
    ...item,
    id: item._id,
    text: item.text || item.label || "",
    completed: item.completed ?? item.packed ?? false,
    category: item.category || "Essentials"
  }));
}

export async function createChecklistItemRequest(payload: ChecklistPayload): Promise<ChecklistItem> {
  const { data } = await api.post("/checklist", payload);
  return {
    ...data,
    id: data._id,
    text: data.text || data.label || "",
    completed: data.completed ?? data.packed ?? false,
    category: data.category || "Essentials"
  };
}

export async function toggleChecklistRequest(id: string): Promise<ChecklistItem> {
  const { data } = await api.patch(`/checklist/${id}/toggle`);
  return {
    ...data,
    id: data._id,
    text: data.text || data.label || "",
    completed: data.completed ?? data.packed ?? false,
    category: data.category || "Essentials"
  };
}

export async function deleteChecklistItemRequest(id: string): Promise<void> {
  await api.delete(`/checklist/${id}`);
}

export async function createReservationRequest(payload: any) {
  const { data } = await api.post("/reservations", payload);
  return data;
}

export async function getReservationsRequest(tripId: string) {
  const { data } = await api.get(`/reservations/${tripId}`);
  return data;
}

export async function createAttachmentRequest(formData: FormData) {
  const { data } = await api.post("/attachments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
