import { NavLink, Link, useNavigate } from "react-router-dom";
import { logOut } from "../../services/authService";
import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate("/");
  }
  return (
    <nav className="NavBar">
      <div className="nav-brand">
        <NavLink to="/" className="brand-link">
          GolfSpot
        </NavLink>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/groups" end className="nav-link">
              My Groups
            </NavLink>
            <NavLink to="/groups/new" className="nav-link">
              Create Group
            </NavLink>
            <div className="user-section">
              <span className="welcome-text">Welcome, {user.name}!</span>
              <Link to="/" onClick={handleLogOut} className="logout-link">
                Log Out
              </Link>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Log In
            </NavLink>
            <NavLink to="/signup" className="nav-link btn-signup">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
