import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">GOLFLINK</h1>
          <h2 className="hero-subtitle">
            Organize Golf Outings with Your Friends the Easy Way
          </h2>
          <p className="hero-description">
            No more "Who's playing Sunday?" texts. SwingLink makes golf
            coordination simple.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/signup")}
            >
              Get Started - It's Free
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
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
              <div className="problem-after"> Automatic reminders</div>
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
