import axios from "axios";
import { storageKeys } from "../data/mockData";
import type {
  AuthResponse,
  CreateTripPayload,
  InvitePayload,
  LoginPayload,
  RegisterPayload,
  Trip,
} from "../types/app";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  if ((data.user as any)._id) data.user.id = (data.user as any)._id;
  return data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  if ((data.user as any)._id) data.user.id = (data.user as any)._id;
  return data;
}

function normalizeTrip(trip: any): Trip {
  return {
    ...trip,
    id: trip._id || trip.id,
    destination: trip.destination || "TBD",
    travelers: trip.travelers || 1,
    budget: trip.budget || 0,
    checklist: trip.checklist || [],
    expenses: trip.expenses || [],
    days: trip.days || [],
    members: (trip.members || []).map((m: any) => ({
      ...m,
      id: m._id || m.id,
      user: m.user ? (m.user._id || m.user.id || m.user) : undefined
    }))
  };
}

export async function getTripsRequest(): Promise<Trip[]> {
  const { data } = await api.get<any[]>("/trips");
  return data.map(normalizeTrip);
}

export async function createTripRequest(payload: CreateTripPayload): Promise<Trip> {
  const { data } = await api.post<any>("/trips", payload);
  return normalizeTrip(data);
}

export async function getTripRequest(id: string): Promise<Trip | undefined> {
  if (!id || id === "undefined") return undefined;

  const { data } = await api.get<any>(`/trips/${id}`);
  return normalizeTrip(data);
}

export async function saveTripRequest(trip: Trip): Promise<Trip> {
  const { data } = await api.put<any>(`/trips/${trip.id}`, trip);
  return normalizeTrip(data);
}

export async function inviteTripRequest(tripId: string, payload: InvitePayload): Promise<Trip | undefined> {
  const { data } = await api.post<any>(`/trips/${tripId}/invite`, payload);
  return normalizeTrip(data);
}