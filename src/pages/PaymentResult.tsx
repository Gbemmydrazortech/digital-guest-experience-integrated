import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/api";

 type PaymentState = "verifying" | "success" | "pending" | "failed";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<PaymentState>("verifying");
  const [message, setMessage] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkPayment() {
      if (!reference) {
        setStatus("pending");
        setMessage("No Paystack reference was supplied. This is normal when opening this page without completing a payment.");
        return;
      }

      setStatus("verifying");
      setMessage("");
      try {
        const response = await verifyPayment(reference);
        const result = response.data;
        if (!active) return;
        setBookingReference(result.bookingReference || "");

        if (result.paymentStatus === "successful" && result.bookingStatus === "confirmed") {
          setStatus("success");
          setMessage("Your payment has been verified and your booking is confirmed.");
        } else if (result.paymentStatus === "pending" || result.bookingStatus === "pending_payment") {
          setStatus("pending");
          setMessage("Your payment is not confirmed yet. Please check again shortly.");
        } else {
          setStatus("failed");
          setMessage("We could not confirm this payment. Please contact the hotel before trying to pay again.");
        }
      } catch (error) {
        if (!active) return;
        setStatus("failed");
        setMessage(error instanceof Error ? error.message : "Payment verification could not be completed.");
      }
    }

    checkPayment();
    return () => { active = false; };
  }, [reference, attempt]);

  const heading = status === "success" ? "Booking confirmed" : status === "verifying" ? "Verifying payment" : status === "pending" ? "Payment pending" : "Payment not confirmed";

  return (
    <section style={{ maxWidth: 680, margin: "48px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }} aria-hidden="true">
        {status === "success" ? "✓" : status === "failed" ? "!" : "…"}
      </div>
      <h1>{heading}</h1>
      <p role="status">{message || "Please wait while we confirm your transaction with the booking server."}</p>
      {bookingReference && <p><strong>Booking reference:</strong> {bookingReference}</p>}
      {status === "pending" && reference && (
        <button type="button" onClick={() => setAttempt((value) => value + 1)} style={{ margin: 12, padding: "10px 18px", cursor: "pointer" }}>
          Check again
        </button>
      )}
      <p><Link to="/room-search">Return to room search</Link></p>
    </section>
  );
}
