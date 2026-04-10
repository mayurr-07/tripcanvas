export type MemberRole = "admin" | "editor" | "viewer";
export type AttachmentKind = "PDF" | "Image" | "Ticket";
export type ReservationType = "Hotel" | "Flight" | "Bus";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface TripMember extends AuthUser {
  role: MemberRole;
}

export interface CommentThreadItem {
  id: string;
  author: string;
  avatar: string;
  message: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  size: string;
}

export interface Reservation {
  id: string;
  type: ReservationType;
  title: string;
  confirmationCode: string;
  detail: string;
  time: string;
}

export interface Activity {
  id: string;
  title: string;
  location: string;
  time: string;
  notes: string;
  comments: CommentThreadItem[];
  attachments: Attachment[];
  reservations: Reservation[];
}

export interface DayPlan {
  id: string;
  label: string;
  date: string;
  activities: Activity[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitAmong: string[];
  createdAt: string;
}

export interface ExpenseSummary {
  total: number;
  perPerson: number;
  count: number;
  categories: Record<string, number>;
  balances: {
    owes: number;
    getsBack: number;
    net: number;
  };
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  members: TripMember[];
  days: DayPlan[];
  checklist: ChecklistItem[];
  expenses: Expense[];
  budget: number;
  owner: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateTripPayload {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

export interface InvitePayload {
  name: string;
  email: string;
  role: MemberRole;
}

export interface ExpensePayload {
  trip: string;
  title: string;
  amount: number;
  category: string;
  splitAmong: string[];
}

export interface ChecklistPayload {
  trip: string;
  text: string;
  category: string;
}