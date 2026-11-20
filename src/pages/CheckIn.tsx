
import { useState, type FormEvent } from "react";
import { guest } from "../data/mockData";

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

function CheckIn() {
  const currentUser = getCurrentUser();

  const [fullName, setFullName] = useState(
    currentUser?.name || ""
  );

  const [email, setEmail] = useState(
    currentUser?.email || ""
  );

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  function handleCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentUser) {
      setMessage("Please sign in before completing check-in.");
      setMessageType("error");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setMessage("Please provide your full name and email address.");
      setMessageType("error");
      return;
    }

    if (email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      setMessage("Please use the email address associated with your account.");
      setMessageType("error");
      return;
    }

    setMessage(
      "Your check-in information has been submitted successfully as a prototype. Identity verification is not connected."
    );

    setMessageType("success");
  }

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">PRE-ARRIVAL EXPERIENCE</p>
        <h1>Digital Check-in</h1>
        <p className="muted">
          Provide your details before arriving at the hotel.
        </p>
      </div>

      <section className="content-section form-section">
        <h2>Guest Information</h2>

        {!currentUser && (
          <p className="form-message error-message" role="alert">
            Please sign in to access digital check-in.
          </p>
        )}

        <form onSubmit={handleCheckIn}>
          <label htmlFor="guest-name">Full name</label>

          <input
            id="guest-name"
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setMessage("");
              setMessageType("");
            }}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="guest-email">Email address</label>

          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage("");
              setMessageType("");
            }}
            placeholder="Enter your email address"
            required
          />

          <label htmlFor="guest-room">Assigned room number</label>

          <input
            id="guest-room"
            value={guest.roomNumber}
            disabled
          />

          <p className="muted">
            This is a demonstration room number. Live room assignment is not connected.
          </p>

          <button
            className="primary-button"
            type="submit"
            disabled={!currentUser}
          >
            Submit Check-in Details
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

export default CheckIn;
