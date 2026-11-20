
import { Link } from "react-router-dom";
import { bookings, guest } from "../data/mockData";
import type { ServiceRequest } from "../types";
import StatusBadge from "../components/StatusBadge";

interface DashboardProps {
  requests: ServiceRequest[];
}

interface CurrentUser {
  name: string;
  email: string;
}

function getCurrentUser(): CurrentUser | null {
  try {
    const savedUser = localStorage.getItem("grandstayCurrentUser");

    if (!savedUser) return null;

    const user = JSON.parse(savedUser);

    if (
      typeof user.name !== "string" ||
      typeof user.email !== "string"
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

function Dashboard({ requests }: DashboardProps) {
  const booking = bookings[0];
  const currentUser = getCurrentUser();

  const customerName = currentUser?.name.trim() || "Guest";
  const firstName = customerName.split(/\s+/)[0];

  const activeRequests = requests.filter(
    (request) => request.status !== "Completed"
  );

  return (
    <div className="page">

      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <p className="eyebrow">GUEST OVERVIEW</p>

          <h1>Welcome back, {firstName}!</h1>

          <p className="muted">
            Your comfort is our priority. How can we make your stay better?
          </p>
        </div>

        <Link to="/concierge" className="primary-button">
          Request a Service
        </Link>
      </div>

      {/* Guest Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-icon">🛎️</span>
          <p>Demo Room Number</p>
          <h2>{guest.roomNumber}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <p>Sample Check-in</p>
          <h2>{guest.checkIn}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <p>Active Requests</p>
          <h2>{activeRequests.length}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <p>Demo Loyalty Points</p>
          <h2>2,450</h2>
        </div>

      </div>

      {/* Current Reservation */}
      <section className="content-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR STAY</p>
            <h2>Current Reservation</h2>
          </div>

          <Link to="/booking" className="text-link">
            View booking
          </Link>
        </div>

        {booking ? (
          <div className="booking-card">

            <div className="booking-image">
              🏨
            </div>

            <div className="booking-details">

              <span className="confirmed-label">
                ● Sample Reservation
              </span>

              <h3>{booking.roomName}</h3>

              <p>Demo Room {guest.roomNumber}</p>

              <div className="booking-dates">

                <div>
                  <small>CHECK-IN</small>
                  <strong>{booking.checkIn}</strong>
                </div>

                <div>
                  <small>CHECK-OUT</small>
                  <strong>{booking.checkOut}</strong>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>You currently have no reservation details available.</p>

            <Link to="/room-search" className="primary-button">
              Explore Rooms
            </Link>
          </div>
        )}

      </section>

      {/* Recent Service Requests */}
      <section className="content-section">

        <div className="section-heading">
          <div>
            <p className="eyebrow">RECENT ACTIVITY</p>
            <h2>Your Service Requests</h2>
          </div>

          <Link to="/concierge" className="text-link">
            View all
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't made any service requests yet.</p>

            <Link to="/concierge" className="text-link">
              Request a service
            </Link>
          </div>
        ) : (
          <div className="request-list">

            {requests.slice(0, 4).map((request) => (
              <div className="request-item" key={request.id}>

                <div>
                  <strong>{request.service}</strong>
                  <p>{request.description}</p>
                </div>

                <StatusBadge status={request.status} />

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;
