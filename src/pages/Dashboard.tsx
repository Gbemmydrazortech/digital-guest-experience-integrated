import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  ArrowRight,
  ConciergeBell
} from "lucide-react";
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
  const currentUser = getCurrentUser();
  const customerName = currentUser?.name.trim() || "Guest";
  const firstName = customerName.split(/\s+/)[0];

  const activeRequests = requests.filter(
    (request) => request.status !== "Completed"
  );

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  );

  return (
    <div className="page dashboard-page">
      <div className="welcome-section">
        <div>
          <h1>Welcome back, {firstName}!</h1>
          <p className="muted">
            Your comfort is our priority. How can we make your stay better?
          </p>
        </div>

        <Link to="/concierge" className="primary-button">
          <ConciergeBell size={18} />
          Request a Service
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">
            <ClipboardList size={23} />
          </span>
          <p>Total Requests</p>
          <h2>{requests.length}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <Clock3 size={23} />
          </span>
          <p>Active Requests</p>
          <h2>{activeRequests.length}</h2>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <CheckCircle2 size={23} />
          </span>
          <p>Completed Requests</p>
          <h2>{completedRequests.length}</h2>
        </div>
      </div>

      <section className="content-section featured-room-section">
        <div className="featured-room-card">
          <div className="featured-room-image">
            <img
              src="https://tokyo-park.net/wp-content/uploads/shangri-la-tokyo-tokyo-updated-prices-8-700x467.jpg"
              alt="Illustrative photograph of a deluxe hotel room"
            />
          </div>

          <div className="featured-room-details">
            <span className="eyebrow">DISCOVER YOUR COMFORT</span>
            <h2>Experience Deluxe Comfort</h2>
            <p className="muted">
              Explore our room options and find a comfortable space for your stay.
            </p>
            <Link to="/room-search" className="primary-button">
              Explore Rooms
              <ArrowRight size={18} />
            </Link>
            <small>Illustrative photograph. Actual room appearance may vary.</small>
          </div>
        </div>
      </section>

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
