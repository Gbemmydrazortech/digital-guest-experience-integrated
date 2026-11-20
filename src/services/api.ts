import type {
  ApiResponse,
  AvailabilityRequest,
  AvailabilityResult,
  Booking,
  BookingRequest,
  BookingStatusResult,
  InitializePaymentRequest,
  PaymentInitialization,
  PaymentVerification,
  Room,
} from "../types/api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://guest-experience-backend.onrender.com/api"
).replace(/\/$/, "");

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to reach the booking server. Please check your internet connection and try again."
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `The server request failed (${response.status}).`
    );
  }

  return result as T;
}

export function getRooms(): Promise<{ success: boolean; count: number; data: Room[] }> {
  return apiRequest("/rooms");
}

export function checkRoomAvailability(
  request: AvailabilityRequest
): Promise<ApiResponse<AvailabilityResult>> {
  const params = new URLSearchParams({
    roomId: request.roomId,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    quantity: String(request.quantity),
    numberOfGuests: String(request.numberOfGuests),
  });

  return apiRequest(`/rooms/available?${params.toString()}`);
}

export function createBooking(
  request: BookingRequest
): Promise<ApiResponse<Booking>> {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getBooking(id: string): Promise<ApiResponse<Booking>> {
  return apiRequest(`/bookings/${encodeURIComponent(id)}`);
}

export function getBookingStatus(
  id: string
): Promise<ApiResponse<BookingStatusResult>> {
  return apiRequest(`/bookings/${encodeURIComponent(id)}/status`);
}

export function initializePayment(
  request: InitializePaymentRequest
): Promise<ApiResponse<PaymentInitialization>> {
  return apiRequest("/payments/initialize", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function verifyPayment(
  reference: string
): Promise<ApiResponse<PaymentVerification>> {
  return apiRequest(`/payments/verify/${encodeURIComponent(reference)}`);
}
