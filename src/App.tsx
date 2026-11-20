
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Concierge from "./pages/Concierge";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomSearch from "./pages/RoomSearch";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentResult from "./pages/PaymentResult";

import { guest, initialRequests } from "./data/mockData";
import type { ServiceRequest } from "./types";

import "./App.css";

const REQUESTS_STORAGE_KEY = "grandstayRequestsByGuest";
const USER_STORAGE_KEY = "grandstayCurrentUser";

// Shared layout for guest pages
function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

// Safely retrieve the logged-in guest's email
function getCurrentGuestEmail(): string {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!savedUser) return "";

    const user = JSON.parse(savedUser);

    return typeof user.email === "string"
      ? user.email.trim().toLowerCase()
      : "";
  } catch {
    return "";
  }
}

// Load request histories belonging to individual guests
function getSavedRequests(): Record<string, ServiceRequest[]> {
  try {
    const savedRequests = localStorage.getItem(
      REQUESTS_STORAGE_KEY
    );

    if (savedRequests) {
      const parsed = JSON.parse(savedRequests);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed as Record<string, ServiceRequest[]>;
      }
    }
  } catch {
    // Use the initial demonstration data if storage is invalid.
  }

  // Keep sample requests exclusive to the mock guest account.
  return {
    [guest.email.toLowerCase()]: initialRequests.map((request) => ({
      ...request,
      ownerEmail: guest.email.toLowerCase(),
    })),
  };
}

function App() {
  const [currentGuestEmail, setCurrentGuestEmail] = useState(
    getCurrentGuestEmail
  );

  const [requestsByGuest, setRequestsByGuest] = useState<
    Record<string, ServiceRequest[]>
  >(getSavedRequests);

  // Listen for login and logout changes.
  useEffect(() => {
    function updateCurrentGuest() {
      setCurrentGuestEmail(getCurrentGuestEmail());
    }

    window.addEventListener(
      "grandstayAuthChange",
      updateCurrentGuest
    );

    window.addEventListener("storage", updateCurrentGuest);

    return () => {
      window.removeEventListener(
        "grandstayAuthChange",
        updateCurrentGuest
      );

      window.removeEventListener("storage", updateCurrentGuest);
    };
  }, []);

  // Save all guest request histories.
  useEffect(() => {
    localStorage.setItem(
      REQUESTS_STORAGE_KEY,
      JSON.stringify(requestsByGuest)
    );
  }, [requestsByGuest]);

  // Only retrieve requests belonging to the current guest.
  const requests = currentGuestEmail
    ? requestsByGuest[currentGuestEmail] || []
    : [];

  // Add a new request to the currently logged-in guest's history.
  function addRequest(newRequest: ServiceRequest) {
    if (!currentGuestEmail) return;

    const guestRequest: ServiceRequest = {
      ...newRequest,
      ownerEmail: currentGuestEmail,
    };

    setRequestsByGuest((previousRequests) => ({
      ...previousRequests,
      [currentGuestEmail]: [
        guestRequest,
        ...(previousRequests[currentGuestEmail] || []),
      ],
    }));
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Paystack return route: must remain outside ProtectedRoute */}
        <Route
          path="/payment/success"
          element={
            <GuestLayout>
              <PaymentResult />
            </GuestLayout>
          }
        />

        {/* Protected guest pages */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={
              <GuestLayout>
                <Dashboard requests={requests} />
              </GuestLayout>
            }
          />

          <Route
            path="/dashboard"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="/booking"
            element={
              <GuestLayout>
                <Booking />
              </GuestLayout>
            }
          />

          <Route
            path="/check-in"
            element={
              <GuestLayout>
                <CheckIn />
              </GuestLayout>
            }
          />

          <Route
            path="/concierge"
            element={
              <GuestLayout>
                <Concierge
                  requests={requests}
                  onAddRequest={addRequest}
                />
              </GuestLayout>
            }
          />

          <Route
            path="/rewards"
            element={
              <GuestLayout>
                <Rewards />
              </GuestLayout>
            }
          />

          <Route
            path="/room-search"
            element={
              <GuestLayout>
                <RoomSearch />
              </GuestLayout>
            }
          />

          <Route
            path="/booking-confirmation"
            element={
              <GuestLayout>
                <BookingConfirmation />
              </GuestLayout>
            }
          />

        </Route>

        {/* Unknown pages */}
        <Route
          path="*"
          element={
            <main className="main-content">
              <h1>404 - Page Not Found</h1>
            </main>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
