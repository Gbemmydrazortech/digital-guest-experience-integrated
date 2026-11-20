
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const savedUser = localStorage.getItem("grandstayCurrentUser");

  let isAuthenticated = false;

  try {
    if (savedUser) {
      const currentUser = JSON.parse(savedUser);

      isAuthenticated = Boolean(
        currentUser &&
        typeof currentUser.name === "string" &&
        currentUser.name.trim() &&
        typeof currentUser.email === "string" &&
        currentUser.email.trim()
      );
    }
  } catch {
    isAuthenticated = false;
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
