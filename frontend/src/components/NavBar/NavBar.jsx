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

  function handleCreateOuting() {
    navigate("/groups");
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        
        <div className="nav-brand">
          <NavLink to="/" className="brand-link" aria-label="GolfSpot home">
            GolfSpot
          </NavLink>
        </div>

        <div className="nav-content">
          {user ? (
            <>
              <div className="nav-links">
                <NavLink 
                  to="/groups" 
                  end 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  aria-label="View your golf groups"
                >
                  My Groups
                </NavLink>
                
                <NavLink 
                  to="/schedule" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  aria-label="View your golf schedule"
                >
                  My Schedule
                </NavLink>
              </div>

              <div className="nav-actions">
                <div className="action-buttons">
                  <NavLink 
                    to="/groups/new" 
                    className="action-btn create-group-btn"
                    aria-label="Create a new golf group"
                  >
                    Create Group
                  </NavLink>
                  
                  <button 
                    onClick={handleCreateOuting}
                    className="action-btn create-outing-btn"
                    aria-label="Create a new golf outing"
                    title="Choose a group to create an outing"
                  >
                    Create Outing
                  </button>
                </div>
                
                <div className="user-section">
                  <div className="user-info">
                    <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                    <div className="user-details">
                      <span className="welcome-text">Welcome back!</span>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogOut} 
                    className="logout-btn"
                    aria-label="Log out of your account"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <NavLink 
                to="/login" 
                className={({ isActive }) => `nav-link auth-link ${isActive ? 'active' : ''}`}
              >
                Log In
              </NavLink>
              <NavLink 
                to="/signup" 
                className={({ isActive }) => `nav-link signup-btn ${isActive ? 'active' : ''}`}
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}