
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface Guest {
  name: string;
  email: string;
}

function getCurrentGuest(): Guest | null {
  try {
    const savedUser = localStorage.getItem("grandstayCurrentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Guest | null>(
    getCurrentGuest
  );

  const navigate = useNavigate();

  useEffect(() => {
    function updateGuest() {
      setCurrentUser(getCurrentGuest());
    }

    window.addEventListener("grandstayAuthChange", updateGuest);
    window.addEventListener("storage", updateGuest);

    return () => {
      window.removeEventListener("grandstayAuthChange", updateGuest);
      window.removeEventListener("storage", updateGuest);
    };
  }, []);

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Room Search", path: "/room-search" },
    { name: "Booking", path: "/booking" },
    { name: "Check-in", path: "/check-in" },
    { name: "Concierge", path: "/concierge" },
    { name: "Rewards", path: "/rewards" },
  ];

  function handleLogout() {
    localStorage.removeItem("grandstayCurrentUser");
    window.dispatchEvent(new Event("grandstayAuthChange"));
    setMenuOpen(false);
    navigate("/login");
  }

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "G";

  return (
    <aside
      className={`sidebar ${menuOpen ? "menu-open" : "menu-closed"}`}
    >
      <div className="brand">
        <div className="brand-icon">G</div>

        <div className="brand-text">
          <h2>GrandStay</h2>
          <p>Guest Experience</p>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      <div className={`navigation-panel ${menuOpen ? "open" : ""}`}>
        <p className="nav-heading">MENU</p>

        <nav className="navigation">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                if (window.matchMedia("(max-width: 700px)").matches) {
                  setMenuOpen(false);
                }
              }}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="guest-avatar">{initials}</div>

          <div className="guest-info">
            <strong>{currentUser?.name || "Guest"}</strong>
            <p>{currentUser?.email || "Guest account"}</p>

            {currentUser && (
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
