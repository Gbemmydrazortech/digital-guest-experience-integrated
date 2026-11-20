
import { useState, type FormEvent } from "react";
import { bookings } from "../data/mockData";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Booking() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [room, setRoom] = useState("Deluxe Ocean View");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (checkIn < getTodayDate()) {
      setMessage("Please select a valid check-in date.");
      setMessageType("error");
      return;
    }

    if (checkOut <= checkIn) {
      setMessage("Check-out must be later than check-in.");
      setMessageType("error");
      return;
    }

    setMessage(
      `Your ${room} booking request has been prepared. Backend confirmation is not yet connected.`
    );
    setMessageType("success");
  }

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">ROOM RESERVATIONS</p>
        <h1>Book Your Stay</h1>
        <p className="muted">
          Explore your stay options and submit a booking request.
        </p>
      </div>

      <section className="content-section">
        <h2>Available Room Options</h2>

        {bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <div className="booking-image">🛏️</div>

            <div className="booking-details">
              <span className="confirmed-label">Featured room</span>
              <h3>{booking.roomName}</h3>
              <p>Comfort, space and a relaxing experience.</p>
              <h3>
                ₦{booking.price.toLocaleString("en-NG")} / night
              </h3>
            </div>
          </div>
        ))}
      </section>

      <section className="content-section form-section">
        <h2>Booking Request</h2>

        <form onSubmit={handleBooking}>
          <label htmlFor="room">Choose a room</label>

          <select
            id="room"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          >
            <option>Deluxe Ocean View</option>
            <option>Executive Suite</option>
            <option>Standard Room</option>
          </select>

          <label htmlFor="booking-checkin">Check-in date</label>

          <input
            id="booking-checkin"
            type="date"
            min={getTodayDate()}
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);
              setCheckOut("");
              setMessage("");
              setMessageType("");
            }}
            required
          />

          <label htmlFor="booking-checkout">Check-out date</label>

          <input
            id="booking-checkout"
            type="date"
            min={checkIn || getTodayDate()}
            value={checkOut}
            onChange={(event) => {
              setCheckOut(event.target.value);
              setMessage("");
              setMessageType("");
            }}
            required
          />

          <button className="primary-button" type="submit">
            Submit Booking Request
          </button>

          {message && (
            <p
              className={`form-message ${
                messageType === "error" ? "error-message" : "success-message"
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default Booking;
