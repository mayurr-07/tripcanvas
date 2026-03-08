import axios from "axios";
import { demoUser, loadTripsFromStorage, saveTripsToStorage, storageKeys } from "../data/mockData";
import type {
  Activity,
  AuthResponse,
  AuthUser,
  CreateTripPayload,
  DayPlan,
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

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function getStoredUser(): AuthUser {
  if (typeof window === "undefined") {
    return demoUser;
  }

  const stored = window.localStorage.getItem(storageKeys.user);

  if (!stored) {
    return demoUser;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return demoUser;
  }
}

function createTripDays(startDate: string, endDate: string): DayPlan[] {
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

function persistTrip(trip: Trip) {
  const trips = loadTripsFromStorage();
  const nextTrips = trips.some((item) => item.id === trip.id)
    ? trips.map((item) => (item.id === trip.id ? trip : item))
    : [trip, ...trips];

  saveTripsToStorage(nextTrips);
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  } catch {
    await wait(800);

    return {
      token: "demo-jwt-token",
      user: {
        ...demoUser,
        email: payload.email,
      },
    };
  }
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  } catch {
    await wait(900);

    return {
      token: "demo-jwt-token",
      user: {
        id: `user-${crypto.randomUUID()}`,
        name: payload.name,
        email: payload.email,
        avatar: payload.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      },
    };
  }
}

export async function getTripsRequest(): Promise<Trip[]> {
  try {
    const { data } = await api.get<Trip[]>("/trips");
    return data;
  } catch {
    await wait(350);
    return loadTripsFromStorage();
  }
}

export async function createTripRequest(payload: CreateTripPayload): Promise<Trip> {
  try {
    const { data } = await api.post<Trip>("/trips", payload);
    persistTrip(data);
    return data;
  } catch {
    await wait(450);

    const currentUser = getStoredUser();
    const trip: Trip = {
      id: `trip-${crypto.randomUUID()}`,
      title: payload.title,
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      travelers: payload.travelers,
      budget: 3000,
      members: [{ ...currentUser, role: "Owner" }],
      checklist: [
        { id: `check-${crypto.randomUUID()}`, label: "Passport and travel docs", packed: false },
        { id: `check-${crypto.randomUUID()}`, label: "Payment cards", packed: false },
      ],
      expenses: [],
      days: createTripDays(payload.startDate, payload.endDate),
    };

    persistTrip(trip);
    return trip;
  }
}

export async function getTripRequest(id: string): Promise<Trip | undefined> {
  try {
    const { data } = await api.get<Trip>(`/trips/${id}`);
    return data;
  } catch {
    await wait(260);
    return loadTripsFromStorage().find((trip) => trip.id === id);
  }
}

export async function saveTripRequest(trip: Trip): Promise<Trip> {
  try {
    const { data } = await api.put<Trip>(`/trips/${trip.id}`, trip);
    persistTrip(data);
    return data;
  } catch {
    await wait(200);
    persistTrip(trip);
    return trip;
  }
}

export async function inviteTripRequest(tripId: string, payload: InvitePayload): Promise<Trip | undefined> {
  try {
    const { data } = await api.post<Trip>(`/trips/${tripId}/invite`, payload);
    persistTrip(data);
    return data;
  } catch {
    await wait(300);

    const trip = loadTripsFromStorage().find((item) => item.id === tripId);

    if (!trip) {
      return undefined;
    }

    const alreadyInvited = trip.members.some((member) => member.email === payload.email);

    const nextTrip = alreadyInvited
      ? trip
      : {
          ...trip,
          members: [
            ...trip.members,
            {
              id: `member-${crypto.randomUUID()}`,
              name: payload.name,
              email: payload.email,
              role: payload.role,
              avatar: payload.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
            },
          ],
        };

    persistTrip(nextTrip);
    return nextTrip;
  }
}