import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  LoaderCircle,
  RefreshCw,
  LayoutDashboard,
  Search,
  CalendarDays,
  Receipt
} from "lucide-react";
import { verifyPayment } from "../services/api";
import type { PaymentVerification } from "../types/api";

type PaymentState =
  | "verifying"
  | "success"
  | "pending"
  | "failed"
  | "error";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<PaymentState>("verifying");
  const [message, setMessage] = useState("");
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentVerification | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkPayment() {
      if (!reference) {
        setStatus("pending");
        setMessage(
          "No payment reference was supplied. If you have made a payment, please contact the hotel for assistance."
        );
        return;
      }

      setStatus("verifying");
      setMessage("");

      try {
        const response = await verifyPayment(reference);
        const result = response.data;

        if (!active) return;

        setPaymentDetails(result);

        if (
          result.paymentStatus === "successful" &&
          result.bookingStatus === "confirmed"
        ) {
          setStatus("success");
          setMessage(
            "Your payment has been verified successfully and your booking is confirmed. Thank you for choosing GrandStay."
          );
        } else if (
          result.paymentStatus === "failed" ||
          ["failed", "cancelled", "expired"].includes(
            String(result.bookingStatus).toLowerCase()
          )
        ) {
          setStatus("failed");
          setMessage(
            "Your payment was not successful or your booking could not be confirmed. Please contact the hotel before attempting another payment."
          );
        } else {
          setStatus("pending");
          setMessage(
            "Your payment is still being processed. Please check again shortly. Do not make another payment while this transaction is being verified."
          );
        }
      } catch (error) {
        if (!active) return;

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not reach the payment verification service. Your payment status is not yet known."
        );
      }
    }

    checkPayment();

    return () => {
      active = false;
    };
  }, [reference, attempt]);

  const content = {
    verifying: {
      icon: <LoaderCircle size={54} className="payment-spinner" />,
      heading: "Verifying your payment",
      label: "Please wait"
    },
    success: {
      icon: <CheckCircle2 size={58} />,
      heading: "Booking confirmed successfully!",
      label: "Payment successful"
    },
    pending: {
      icon: <Clock3 size={58} />,
      heading: "Payment pending",
      label: "Awaiting confirmation"
    },
    failed: {
      icon: <XCircle size={58} />,
      heading: "Payment unsuccessful",
      label: "Transaction not confirmed"
    },
    error: {
      icon: <RefreshCw size={58} />,
      heading: "Unable to verify payment",
      label: "Verification interrupted"
    }
  }[status];

  return (
    <section className="payment-result-page">
      <div className={`payment-result-card payment-${status}`}>
        <div className="payment-result-icon" aria-hidden="true">
          {content.icon}
        </div>

        <p className="eyebrow">GRANDSTAY PAYMENT</p>
        <h1>{content.heading}</h1>
        <span className="payment-status-label">{content.label}</span>

        <p className="payment-result-message" role="status">
          {message ||
            "Please wait while we confirm your transaction with the booking server."}
        </p>

        {status === "success" && paymentDetails && (
          <div className="payment-booking-reference">
            <div>
              <Receipt size={18} />
              <span>Booking reference</span>
              <strong>{paymentDetails.bookingReference}</strong>
            </div>

            <div>
              <Receipt size={18} />
              <span>Payment reference</span>
              <strong>{paymentDetails.paymentReference}</strong>
            </div>

            {paymentDetails.paidAt && (
              <div>
                <CalendarDays size={18} />
                <span>Payment date</span>
                <strong>
                  {new Date(paymentDetails.paidAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </strong>
              </div>
            )}
          </div>
        )}

        {(status === "pending" || status === "error") && reference && (
          <button
            type="button"
            className="primary-button payment-retry-button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            <RefreshCw size={17} />
            Check payment again
          </button>
        )}

        <div className="payment-result-actions">
          <Link to="/" className="primary-button">
            <LayoutDashboard size={18} />
            Return to Home
          </Link>

          <Link to="/room-search" className="text-link">
            <Search size={17} />
            Explore Rooms
          </Link>
        </div>

        {status === "failed" && (
          <p className="payment-support-note">
            Need assistance? Please contact the hotel support team.
          </p>
        )}
      </div>
    </section>
  );
}
