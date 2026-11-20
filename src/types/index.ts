
export interface Guest {
  id: string;
  fullName: string;
  email: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
}

export interface Booking {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  price: number;
  status: string;
}

export type RequestStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface ServiceRequest {
  id: string;
  service: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  ownerEmail?: string;
}

export interface ServiceOption {
  name: string;
  description: string;
  icon: string;
}
