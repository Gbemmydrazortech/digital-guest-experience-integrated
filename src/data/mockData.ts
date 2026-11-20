
import type {
  Guest,
  Booking,
  ServiceRequest,
  ServiceOption
} from "../types";

export const guest: Guest = {
  id: "GUEST-001",
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  roomNumber: "204",
  checkIn: "2026-11-20",
  checkOut: "2026-11-24"
};

export const bookings: Booking[] = [
  {
    id: "BK-001",
    roomName: "Deluxe Ocean View",
    checkIn: "2026-11-20",
    checkOut: "2026-11-24",
    price: 85000,
    status: "Confirmed"
  }
];

export const initialRequests: ServiceRequest[] = [
  {
    id: "REQ-001",
    service: "Housekeeping",
    description: "Please arrange room cleaning.",
    status: "Pending",
    createdAt: "2026-11-17"
  },
  {
    id: "REQ-002",
    service: "Room Service",
    description: "Request for breakfast.",
    status: "In Progress",
    createdAt: "2026-11-17"
  }
];

export const serviceOptions: ServiceOption[] = [
  {
    name: "Room Service",
    description: "Request food and drinks.",
    icon: "🍽️"
  },
  {
    name: "Housekeeping",
    description: "Request room cleaning.",
    icon: "🧹"
  },
  {
    name: "Maintenance",
    description: "Report a room issue.",
    icon: "🛠️"
  },
  {
    name: "Laundry",
    description: "Request laundry services.",
    icon: "👔"
  },
  {
    name: "Extra Amenities",
    description: "Request additional room items.",
    icon: "🛏️"
  },
  {
    name: "Transport",
    description: "Request transport assistance.",
    icon: "🚘"
  }
];
