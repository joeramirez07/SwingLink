import { useState } from "react";
import { useNavigate } from "react-router";
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

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);
      navigate("/groups");
    } catch (err) {
      setErrorMsg("Sign Up Failed - Try Again");
    }
  }

  const disable = formData.password !== formData.confirm;

  return (
    <div className="container">
      <div className="signup-card">
        <h2 className="golf-header">🏌️ Join SwingLink</h2>
        <p className="golf-subtitle">Golf planning made simple</p>

        <form autoComplete="off" onSubmit={handleSubmit} className="golf-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              required
            />
            <small>For golf outing invites and reminders</small>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" disabled={disable} className="btn-primary">
            Join the Golf Community
          </button>
        </form>

        <p className="error-message">&nbsp;{errorMsg}</p>

        <p className="signin-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}
