export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Room {
  _id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

export interface RoomsResponse {
  success: boolean;
  count: number;
  data: Room[];
}

export interface AvailabilityRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  quantity: number;
  numberOfGuests: number;
}

export interface AvailabilityResult {
  roomId: string;
  roomName: string;
  pricePerNight: number;
  totalRooms: number;
  reservedRooms: number;
  availableRooms: number;
  requestedQuantity: number;
  numberOfGuests: number;
  maximumGuests: number;
  checkIn: string;
  checkOut: string;
  numberOfNights: number;
  estimatedTotal: number;
  canBook: boolean;
}

export interface BookingRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  quantity: number;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
}

export interface BookedRoom {
  roomId: string;
  roomName: string;
  quantity: number;
  pricePerNight: number;
}

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "expired";

export interface Booking {
  _id?: string;
  bookingId?: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  rooms: BookedRoom[];
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  numberOfNights: number;
  totalAmount: number;
  status: BookingStatus;
  expiresAt: string;
}

export interface BookingStatusResult {
  _id: string;
  bookingReference: string;
  status: BookingStatus;
  totalAmount: number;
  expiresAt: string;
}

export interface InitializePaymentRequest {
  bookingId: string;
}

export interface PaymentInitialization {
  paymentId: string;
  bookingReference: string;
  reference: string;
  amount: number;
  currency: string;
  authorizationUrl: string;
  accessCode: string;
}

export interface PaymentVerification {
  bookingReference: string;
  paymentReference: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: BookingStatus;
  paidAt: string | null;
}
