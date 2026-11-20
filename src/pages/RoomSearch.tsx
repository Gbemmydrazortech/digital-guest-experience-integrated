import { getRoomImage } from "../utils/roomImages";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { checkRoomAvailability, getRooms } from "../services/api";
import type { AvailabilityResult, Room } from "../types/api";

interface RoomOption {
  room: Room;
  availability: AvailabilityResult;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function RoomSearch() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [quantity, setQuantity] = useState("1");
  const [results, setResults] = useState<RoomOption[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!checkIn || !checkOut) {
      setError("Please select your check-in and check-out dates.");
      setSearched(false);
      return;
    }
    if (checkIn < getTodayDate()) {
      setError("Check-in date cannot be in the past.");
      setSearched(false);
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);
    setResults([]);

    try {
      const roomResponse = await getRooms();
      const rooms = roomResponse.data || [];

      const availabilityResults = await Promise.all(
        rooms.filter((room) => room.isActive).map(async (room) => {
          const response = await checkRoomAvailability({
            roomId: room._id,
            checkIn,
            checkOut,
            quantity: Number(quantity),
            numberOfGuests: Number(guests),
          });
          return { room, availability: response.data };
        })
      );

      setResults(availabilityResults);
      setSearched(true);
      if (availabilityResults.length === 0) {
        setError("There are currently no active rooms to display.");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load rooms. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectRoom(option: RoomOption) {
    navigate("/booking-confirmation", {
      state: {
        room: option.room,
        availability: option.availability,
        checkIn,
        checkOut,
        guests,
        quantity,
      },
    });
  }

  const availableOptions = results.filter(
    (option) => option.availability.canBook
  );

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">ROOM DISCOVERY</p>
        <h1>Find Your Room</h1>
        <p className="muted">
          Choose your dates and discover your perfect stay.
        </p>
      </div>

      <section className="content-section">
        <div className="room-search-form">
          <div className="form-field">
            <label htmlFor="room-checkin">Check-in Date</label>
            <input
              id="room-checkin"
              type="date"
              min={getTodayDate()}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setCheckOut("");
                setSearched(false);
                setError("");
              }}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="room-checkout">Check-out Date</label>
            <input
              id="room-checkout"
              type="date"
              min={checkIn || getTodayDate()}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setSearched(false);
                setError("");
              }}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="room-guests">Number of Guests</label>
            <select
              id="room-guests"
              value={guests}
              onChange={(event) => {
                setGuests(event.target.value);
                setSearched(false);
                setError("");
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="room-quantity">Number of Rooms</label>
            <select
              id="room-quantity"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                setSearched(false);
                setError("");
              }}
            >
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "Room" : "Rooms"}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Checking availability..." : "Search Rooms"}
          </Button>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>

      {searched && (
        <section className="content-section room-results">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR SEARCH RESULTS</p>
              <h2>Available Room Options</h2>
              <p className="muted">
                {availableOptions.length} room option(s) are available for your
                selected dates.
              </p>
            </div>
          </div>

          {availableOptions.length === 0 ? (
            <div className="empty-state">
              <p>No rooms are available for the selected dates and guests.</p>
              <p className="muted">Try different dates or fewer rooms.</p>
            </div>
          ) : (
            <div className="room-results-grid">
              {availableOptions.map(({ room, availability }) => (
                <article className="room-card" key={room._id}>
                  {(room.images?.[0] || getRoomImage(room)) ? (
                    <img
                      className="room-card-image"
                      src={getRoomImage(room)}
                      alt={room.name}
                    />
                  ) : (
                    <div className="room-card-icon"><Building2 size={38} strokeWidth={1.6} /></div>
                  )}

                  <div className="room-card-content">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <strong className="room-price">
                      {formatNaira(availability.pricePerNight)} / night
                    </strong>
                    <p>Available rooms: {availability.availableRooms}</p>
                    <p>Maximum guests: {availability.maximumGuests}</p>
                    <p>
                      {availability.numberOfNights} night(s) · Estimated total: {formatNaira(availability.estimatedTotal)}
                    </p>
                    {room.amenities?.length > 0 && (
                      <p className="muted">
                        Amenities: {room.amenities.join(", ")}
                      </p>
                    )}
                    <Button onClick={() => selectRoom({ room, availability })}>
                      Select Room
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default RoomSearch;
