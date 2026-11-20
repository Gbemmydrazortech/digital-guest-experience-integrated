# Backend integration notes

The frontend now reads its API base URL from `VITE_API_BASE_URL` and defaults to the deployed backend URL supplied for this project.

## Implemented in this update
- Reusable API request service for rooms, availability, bookings and payments.
- TypeScript API models based on the verified backend contract.
- Room search loads active rooms from `GET /rooms`.
- Room search checks each room through `GET /rooms/available` before showing it as bookable.
- Selected room MongoDB `_id` is carried into the booking request.
- Booking summary collects guest name, email and phone, creates the booking, then initializes Paystack and redirects to the returned authorization URL.

## Local configuration
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://guest-experience-backend.onrender.com/api
```

Restart the Vite development server after changing `.env`.

## Important
- Backend availability and final booking amount are authoritative.
- A booking is created before Paystack checkout; do not interpret that as a confirmed booking.
- Payment verification and success/pending/failed return screens are the next integration stage.
- Guest authentication, booking history, concierge and other features listed as unimplemented in the backend contract remain frontend demonstrations until backend endpoints exist.
