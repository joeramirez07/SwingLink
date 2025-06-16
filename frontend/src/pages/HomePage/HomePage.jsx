import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage({ user }) {
  const navigate = useNavigate();
  if (user) {
    return (
      <div className="dashboard">
        <h2>Time to Hit the Links, {user.name}!</h2>
        <p>Let's Tee Off:</p>
        <ul>
          <li>
            <a href="/groups">Your Golf Groups</a>
          </li>
          <li>
            <a href="/groups/new">Create a New Group</a>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div className="homepage">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title"></h1>
          <h2 className="hero-subtitle">
            Organize Golf Outings with Your Friends the Easy Way
          </h2>
          <p className="hero-description">
            No more "Who's playing Sunday?" texts. SwingLink makes golf
            coordination simple.
          </p>
          <p className="hero-note">
            Join in 30 seconds. No credit card required.
          </p>
        </div>
      </section>

      <section className="problem-solution">
        <div className="container">
          <h3>Tired of Golf Planning Headaches?</h3>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-before">Endless group texts</div>
              <div className="problem-after">One simple app</div>
            </div>
            <div className="problem-card">
              <div className="problem-before">"Who's in?" confusion</div>
              <div className="problem-after">Clear RSVP tracking</div>
            </div>
            <div className="problem-card">
              <div className="problem-before">Forgotten tee times</div>
              <div className="problem-after">Automatic reminders</div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <h3>Ready to Simplify Your Golf Plans?</h3>
          <p>Get your group started in 2 minutes</p>
          <button
            className="btn-primary btn-large"
            onClick={() => navigate("/signup")}
          >
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
}
