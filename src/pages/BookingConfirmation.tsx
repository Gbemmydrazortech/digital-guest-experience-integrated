import { getRoomImage } from "../utils/roomImages";
import { Hotel } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { createBooking, initializePayment } from "../services/api";
import type { AvailabilityResult, Room } from "../types/api";

interface BookingSelection {
  room: Room;
  availability: AvailabilityResult;
  checkIn: string;
  checkOut: string;
  guests: string;
  quantity: string;
}

function isValidBooking(value: unknown): value is BookingSelection {
  if (!value || typeof value !== "object") return false;
  const booking = value as Partial<BookingSelection>;
  return Boolean(
    booking.room &&
    typeof booking.room._id === "string" &&
    typeof booking.room.name === "string" &&
    booking.availability &&
    typeof booking.availability.estimatedTotal === "number" &&
    typeof booking.checkIn === "string" &&
    typeof booking.checkOut === "string" &&
    typeof booking.guests === "string" &&
    typeof booking.quantity === "string"
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BookingConfirmation() {
  const location = useLocation();
  const selection: unknown = location.state;
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isValidBooking(selection)) {
    return (
      <div className="page">
        <div className="confirmation-card">
          <div className="confirmation-icon">!</div>
          <h1>No Room Selected</h1>
          <p>
            Please search for available rooms and select your preferred room
            before continuing.
          </p>
          <Link to="/room-search">
            <Button>Find a Room</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookingSelection = selection;
  const { room, availability } = bookingSelection;

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const bookingResponse = await createBooking({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        roomId: room._id,
        quantity: Number(bookingSelection.quantity),
        checkIn: bookingSelection.checkIn,
        checkOut: bookingSelection.checkOut,
        numberOfGuests: Number(bookingSelection.guests),
      });

      const bookingId = bookingResponse.data.bookingId;
      if (!bookingId) {
        throw new Error("The booking server did not return a booking ID.");
      }

      const paymentResponse = await initializePayment({ bookingId });
      const authorizationUrl = paymentResponse.data.authorizationUrl;
      if (!authorizationUrl) {
        throw new Error("The payment server did not return a checkout link.");
      }

      window.location.assign(authorizationUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not create your booking. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="confirmation-card">
        <p className="eyebrow">RESERVATION REVIEW</p>
        <h1>Booking Summary</h1>
        <p className="muted">
          Review your stay details and enter your contact information to
          continue to secure payment.
        </p>

        <div className="confirmation-details">
          <div className="confirmation-room">
            <img className="confirmation-room-image" src={getRoomImage(room)} alt={`${room.name} representative room`} />
            <span className="service-icon"><Hotel size={25} strokeWidth={1.8} /></span>
            <h2>{room.name}</h2>
            <p>{room.description}</p>
          </div>
          <div className="confirmation-row">
            <span>Check-in</span>
            <strong>{formatDate(bookingSelection.checkIn)}</strong>
          </div>
          <div className="confirmation-row">
            <span>Check-out</span>
            <strong>{formatDate(bookingSelection.checkOut)}</strong>
          </div>
          <div className="confirmation-row">
            <span>Number of guests</span>
            <strong>{bookingSelection.guests}</strong>
          </div>
          <div className="confirmation-row">
            <span>Rooms requested</span>
            <strong>{bookingSelection.quantity}</strong>
          </div>
          <div className="confirmation-row">
            <span>Number of nights</span>
            <strong>{availability.numberOfNights}</strong>
          </div>
          <div className="confirmation-row">
            <span>Price per night</span>
            <strong>
              ₦{availability.pricePerNight.toLocaleString("en-NG")}
            </strong>
          </div>
          <div className="confirmation-total">
            <span>Backend availability estimate</span>
            <h2>₦{availability.estimatedTotal.toLocaleString("en-NG")}</h2>
          </div>
        </div>

        <p className="demo-notice">
          This is an estimate from the availability check. The backend will
          validate availability again and calculate the final booking amount.
        </p>

        <section className="content-section form-section">
          <h2>Guest Information</h2>
          <form onSubmit={handleBooking}>
            <label htmlFor="guest-name">Full name</label>
            <input
              id="guest-name"
              type="text"
              autoComplete="name"
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              required
            />

            <label htmlFor="guest-email">Email address</label>
            <input
              id="guest-email"
              type="email"
              autoComplete="email"
              value={guestEmail}
              onChange={(event) => setGuestEmail(event.target.value)}
              required
            />

            <label htmlFor="guest-phone">Phone number</label>
            <input
              id="guest-phone"
              type="tel"
              autoComplete="tel"
              value={guestPhone}
              onChange={(event) => setGuestPhone(event.target.value)}
              required
            />

            {error && <p className="form-error" role="alert">{error}</p>}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Preparing secure payment..." : "Continue to Payment"}
            </Button>
          </form>
        </section>

        <div className="confirmation-actions">
          <Link to="/room-search">
            <Button variant="secondary">Back to Room Search</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
