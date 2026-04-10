import type { AuthUser, Trip } from "../types/app";

export const storageKeys = {
  trips: "tripcanvas-trips",
  token: "tripcanvas-token",
  user: "tripcanvas-user",
};

export const demoUser: AuthUser = {
  id: "user-1",
  name: "Amelia Jones",
  email: "amelia@tripcanvas.app",
  avatar: "AJ",
};

const seedTrips: Trip[] = [
  {
    id: "trip-lisbon",
    title: "Lisbon Team Offsite",
    destination: "Lisbon, Portugal",
    startDate: "2026-05-12",
    endDate: "2026-05-16",
    travelers: 6,
    budget: 5600,
    owner: "user-1",
    members: [
      { id: "user-1", name: "Amelia Jones", email: "amelia@tripcanvas.app", avatar: "AJ", role: "admin" },
      { id: "user-2", name: "Marco Silva", email: "marco@tripcanvas.app", avatar: "MS", role: "editor" },
      { id: "user-3", name: "Priya Raman", email: "priya@tripcanvas.app", avatar: "PR", role: "viewer" },
    ],
    checklist: [
      { id: "check-1", text: "Passport and ID", completed: true, category: "Documents" },
      { id: "check-2", text: "Company cards", completed: false, category: "Essentials" },
      { id: "check-3", text: "Adapters and chargers", completed: false, category: "Electronics" },
      { id: "check-4", text: "Pitch deck printouts", completed: true, category: "Documents" },
    ],
    expenses: [
      { id: "exp-1", title: "Boutique hotel deposit", amount: 1800, category: "Dining", paidBy: "Amelia", splitAmong: ["user-1", "user-2"], createdAt: new Date().toISOString() },
      { id: "exp-2", title: "Airport transfers", amount: 320, category: "Transportation", paidBy: "Marco", splitAmong: ["user-1", "user-2", "user-3"], createdAt: new Date().toISOString() },
      { id: "exp-3", title: "Welcome dinner", amount: 410, category: "Dining", paidBy: "Priya", splitAmong: ["user-1", "user-2", "user-3"], createdAt: new Date().toISOString() },
    ],
    days: [
      {
        id: "day-1",
        label: "Day 1",
        date: "2026-05-12",
        activities: [
          {
            id: "activity-1",
            title: "Touchdown and hotel check-in",
            location: "Baixa District",
            time: "14:00",
            notes: "Drop bags, sync room assignments, and confirm the evening meetup point.",
            comments: [
              { id: "comment-1", author: "Marco Silva", avatar: "MS", message: "Reception can hold luggage for the early arrivals.", createdAt: "10m ago" },
            ],
            attachments: [
              { id: "attach-1", name: "Hotel voucher.pdf", kind: "PDF", size: "1.2 MB" },
              { id: "attach-2", name: "Rooming-list.xlsx", kind: "Ticket", size: "180 KB" },
            ],
            reservations: [
              {
                id: "res-1",
                type: "Hotel",
                title: "The Lumia Hotel",
                confirmationCode: "LIS-2108",
                detail: "6 rooms, breakfast included",
                time: "Check-in after 15:00",
              },
            ],
          },
          {
            id: "activity-2",
            title: "Sunset tram loop",
            location: "Alfama",
            time: "18:30",
            notes: "Informal welcome ride with photo stop near Miradouro de Santa Luzia.",
            comments: [
              { id: "comment-2", author: "Priya Raman", avatar: "PR", message: "I booked a larger table nearby for dinner afterward.", createdAt: "28m ago" },
            ],
            attachments: [{ id: "attach-3", name: "Tram route.png", kind: "Image", size: "420 KB" }],
            reservations: [
              {
                id: "res-2",
                type: "Bus",
                title: "Private shuttle backup",
                confirmationCode: "VAN-914",
                detail: "12-seat sprinter on standby",
                time: "18:15 pickup",
              },
            ],
          },
        ],
      },
      {
        id: "day-2",
        label: "Day 2",
        date: "2026-05-13",
        activities: [
          {
            id: "activity-3",
            title: "Strategy sprint at coworking loft",
            location: "Cais do Sodre",
            time: "09:30",
            notes: "Review roadmap, assign breakout rooms, and keep lunch delivery at 12:30.",
            comments: [
              { id: "comment-3", author: "Amelia Jones", avatar: "AJ", message: "Wi-Fi credentials are in the shared folder.", createdAt: "1h ago" },
            ],
            attachments: [{ id: "attach-4", name: "Agenda.pdf", kind: "PDF", size: "960 KB" }],
            reservations: [],
          },
          {
            id: "activity-4",
            title: "Riverside dinner reservation",
            location: "Time Out Market",
            time: "20:00",
            notes: "Need two vegetarian tasting menus and one gluten-free option.",
            comments: [],
            attachments: [{ id: "attach-5", name: "Menu.jpg", kind: "Image", size: "680 KB" }],
            reservations: [
              {
                id: "res-3",
                type: "Flight",
                title: "Speaker arrival reference",
                confirmationCode: "TP-4420",
                detail: "Guest speaker arriving from Madrid",
                time: "17:20 arrival",
              },
            ],
          },
        ],
      },
      {
        id: "day-3",
        label: "Day 3",
        date: "2026-05-14",
        activities: [
          {
            id: "activity-5",
            title: "Coastal train to Cascais",
            location: "Lisbon Cais do Sodre Station",
            time: "10:15",
            notes: "Bring picnic blankets and leave from platform 4.",
            comments: [
              { id: "comment-4", author: "Marco Silva", avatar: "MS", message: "I added platform details to the travel folder.", createdAt: "Yesterday" },
            ],
            attachments: [{ id: "attach-6", name: "Rail passes.pdf", kind: "Ticket", size: "240 KB" }],
            reservations: [
              {
                id: "res-4",
                type: "Bus",
                title: "Evening return coach",
                confirmationCode: "SEA-222",
                detail: "Pickup outside Boca do Inferno",
                time: "21:00 departure",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "trip-kyoto",
    title: "Kyoto Rail Escape",
    destination: "Kyoto, Japan",
    startDate: "2026-10-03",
    endDate: "2026-10-08",
    travelers: 4,
    budget: 4200,
    owner: "user-1",
    members: [
      { id: "user-1", name: "Amelia Jones", email: "amelia@tripcanvas.app", avatar: "AJ", role: "admin" },
      { id: "user-4", name: "Kenta Mori", email: "kenta@tripcanvas.app", avatar: "KM", role: "editor" },
    ],
    checklist: [
      { id: "check-5", text: "JR pass vouchers", completed: true, category: "Documents" },
      { id: "check-6", text: "Autumn layers", completed: false, category: "Clothes" },
    ],
    expenses: [{ id: "exp-4", title: "Ryokan deposit", amount: 970, category: "Dining", paidBy: "Amelia", splitAmong: ["user-1", "user-4"], createdAt: new Date().toISOString() }],
    days: [
      {
        id: "day-4",
        label: "Day 1",
        date: "2026-10-03",
        activities: [
          {
            id: "activity-6",
            title: "Arrive at Kyoto Station",
            location: "Kyoto Station",
            time: "11:00",
            notes: "Grab SIM cards and IC cards before heading to the ryokan.",
            comments: [],
            attachments: [],
            reservations: [],
          },
        ],
      },
    ],
  },
  {
    id: "trip-patagonia",
    title: "Patagonia Field Week",
    destination: "El Calafate, Argentina",
    startDate: "2026-12-01",
    endDate: "2026-12-06",
    travelers: 5,
    budget: 6800,
    owner: "user-1",
    members: [
      { id: "user-1", name: "Amelia Jones", email: "amelia@tripcanvas.app", avatar: "AJ", role: "admin" },
      { id: "user-5", name: "Sofia Cruz", email: "sofia@tripcanvas.app", avatar: "SC", role: "viewer" },
    ],
    checklist: [
      { id: "check-7", text: "Windproof jackets", completed: false, category: "Clothes" },
      { id: "check-8", text: "Satellite modem", completed: false, category: "Electronics" },
    ],
    expenses: [{ id: "exp-5", title: "Guide reservation", amount: 1250, category: "Activities", paidBy: "Sofia", splitAmong: ["user-1", "user-5"], createdAt: new Date().toISOString() }],
    days: [
      {
        id: "day-5",
        label: "Day 1",
        date: "2026-12-01",
        activities: [
          {
            id: "activity-7",
            title: "Glacier briefing",
            location: "Expedition lodge",
            time: "16:30",
            notes: "Safety kit distribution and gear fit check.",
            comments: [],
            attachments: [],
            reservations: [],
          },
        ],
      },
    ],
  },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function loadTripsFromStorage(): Trip[] {
  if (typeof window === "undefined") {
    return deepClone(seedTrips);
  }

  const stored = window.localStorage.getItem(storageKeys.trips);

  if (!stored) {
    const seededTrips = deepClone(seedTrips);
    window.localStorage.setItem(storageKeys.trips, JSON.stringify(seededTrips));
    return seededTrips;
  }

  try {
    return JSON.parse(stored) as Trip[];
  } catch {
    const seededTrips = deepClone(seedTrips);
    window.localStorage.setItem(storageKeys.trips, JSON.stringify(seededTrips));
    return seededTrips;
  }
}

export function saveTripsToStorage(trips: Trip[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKeys.trips, JSON.stringify(trips));
  }
}