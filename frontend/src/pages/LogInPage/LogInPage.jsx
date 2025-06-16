import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../../services/authService";
import "./LogInPage.css";

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate("/groups");
    } catch (err) {
      // Handle specific error types
      if (err.message.includes('email')) {
        setErrorMsg("Email not found");
      } else if (err.message.includes('password')) {
        setErrorMsg("Incorrect password");
      } else if (err.message.includes('credentials')) {
        setErrorMsg("Invalid email or password");
      } else {
        setErrorMsg("Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  const isFormValid = formData.email && formData.password;

  return (
    <main className="login-page" aria-label="Login to GolfSpot">
      <div className="login-content">
        <div className="login-card">
          <header className="card-header">
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Sign in to coordinate your next round</p>
          </header>

          <form 
            autoComplete="on" 
            onSubmit={handleSubmit} 
            className="login-form"
            noValidate
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                aria-describedby={errorMsg ? "error-msg" : undefined}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                aria-describedby={errorMsg ? "error-msg" : undefined}
                autoComplete="current-password"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="btn-primary btn-login"
              aria-describedby={errorMsg ? "error-msg" : undefined}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {errorMsg && (
            <div id="error-msg" className="error-message" role="alert" aria-live="polite">
              {errorMsg}
            </div>
          )}

          <footer className="card-footer">
            <p className="signup-link">
              New to GolfSpot? <Link to="/signup">Create Account</Link>
            </p>
            <p className="forgot-link">
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}