
import { useState, type FormEvent } from "react";
import { serviceOptions } from "../data/mockData";
import type { ServiceRequest } from "../types";
import StatusBadge from "../components/StatusBadge";

interface ConciergeProps {
  requests: ServiceRequest[];
  onAddRequest: (request: ServiceRequest) => void;
}

function Concierge({ requests, onAddRequest }: ConciergeProps) {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!service || !description.trim()) {
      setMessage("Please select a service and describe your request.");
      setMessageType("error");
      return;
    }

    const newRequest: ServiceRequest = {
      id: `REQ-${Date.now()}`,
      service,
      description: description.trim(),
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddRequest(newRequest);

    setService("");
    setDescription("");
    setMessage("Your service request has been submitted successfully.");
    setMessageType("success");
  }

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">GUEST SERVICES</p>
        <h1>Digital Concierge</h1>
        <p className="muted">
          Everything you need for a comfortable stay, just a request away.
        </p>
      </div>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <h2>Available Services</h2>
            <p className="muted">Choose a service to get started.</p>
          </div>
        </div>

        <div className="services-grid">
          {serviceOptions.map((item) => (
            <button
              type="button"
              className={`service-card ${
                service === item.name ? "selected" : ""
              }`}
              key={item.name}
              aria-pressed={service === item.name}
              onClick={() => {
                setService(item.name);
                setMessage("");
                setMessageType("");
              }}
            >
              <span className="service-icon">{item.icon}</span>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              {service === item.name && (
                <span className="selected-label">Selected</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="content-section form-section">
        <h2>Make a Service Request</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="service">Selected service</label>

          <select
            id="service"
            value={service}
            onChange={(event) => {
              setService(event.target.value);
              setMessage("");
              setMessageType("");
            }}
            required
          >
            <option value="">Choose a service</option>

            {serviceOptions.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <label htmlFor="description">Request details</label>

          <textarea
            id="description"
            rows={4}
            placeholder="Tell us what you need..."
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setMessage("");
              setMessageType("");
            }}
            required
          />

          <button
            type="submit"
            className="primary-button"
            disabled={!service || !description.trim()}
          >
            Submit Request
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

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">REQUEST HISTORY</p>
            <h2>My Requests ({requests.length})</h2>
          </div>
        </div>

        <div className="request-list">
          {requests.length === 0 ? (
            <div className="empty-state">
              <p>You haven't made any service requests yet.</p>
              <p className="muted">
                Your submitted requests will appear here.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div className="request-item" key={request.id}>
                <div>
                  <strong>{request.service}</strong>
                  <p>{request.description}</p>
                  <small>{request.createdAt}</small>
                </div>

                <StatusBadge status={request.status} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Concierge;
