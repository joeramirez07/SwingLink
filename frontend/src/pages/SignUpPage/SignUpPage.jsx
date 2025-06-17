import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/authService";

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirm: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

  
    if (!validatePhone(formData.phoneNumber)) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const user = await signUp(formData);
      setUser(user);
      navigate("/groups");
    } catch (err) {
 
      if (err.message.includes("email")) {
        setErrorMsg("Email already exists");
      } else if (err.message.includes("phone")) {
        setErrorMsg("Phone number already registered");
      } else if (err.message.includes("password")) {
        setErrorMsg("Password requirements not met");
      } else {
        setErrorMsg("Registration failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isFormInvalid = formData.password !== formData.confirm || isLoading;

  return (
    <div className="container">
      <div className="signup-card">
        <h2 className="golf-header">Join SwingLink</h2>
        <p className="golf-subtitle">Golf planning made simple</p>

        <form autoComplete="off" onSubmit={handleSubmit} className="golf-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              aria-describedby={errorMsg ? "error-msg" : undefined}
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              aria-describedby="phone-help"
              required
            />
            <small id="phone-help">For golf outing invites and reminders</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              aria-describedby={errorMsg ? "error-msg" : undefined}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Confirm password"
              aria-describedby="confirm-help"
              required
            />
            {formData.confirm && formData.password !== formData.confirm && (
              <small id="confirm-help" className="error-text">
                Passwords don't match
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={isFormInvalid}
            className="btn-primary"
            aria-describedby={errorMsg ? "error-msg" : undefined}
          >
            {isLoading ? "Creating Account..." : "Join the Golf Community"}
          </button>
        </form>

        <p id="error-msg" className="error-message" role="alert">
          &nbsp;{errorMsg}
        </p>

        <p className="signin-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
