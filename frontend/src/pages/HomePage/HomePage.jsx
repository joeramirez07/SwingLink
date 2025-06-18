import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage({ user }) {
  const navigate = useNavigate();

  if (user) {
    return (
      <main className="dashboard" aria-label="User dashboard">
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="./videos/tigervideo.mp4" type="video/mp4" />
        </video>

        <div className="dashboard-content">
          <header className="dashboard-header">
            <h2>Time to Hit the Links, {user.name}! 🏌️‍♂️</h2>
            <p className="dashboard-subtitle">Let's Tee Off</p>
          </header>

          <nav className="dashboard-nav" aria-label="Main navigation">
            <div className="nav-cards">
              <Link to="/groups" className="nav-card">
                <div className="nav-icon">👥</div>
                <h3>Your Golf Groups</h3>
                <p>View and manage your golf crews</p>
              </Link>
              <Link to="/groups/new" className="nav-card">
                <div className="nav-icon">➕</div>
                <h3>Create New Group</h3>
                <p>Start organizing with friends</p>
              </Link>
            </div>
          </nav>
        </div>
      </main>
    );
  }

  return (
    <div className="homepage">
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      ></video>

      <div className="homepage-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-container">
            <h1 id="hero-heading" className="hero-title">
              GolfSpot
            </h1>
            <h2 className="hero-subtitle">
              Organize Golf Outings with Your Friends the Easy Way
            </h2>
            <p className="hero-description">
              No more "Who's playing Sunday?" texts. GolfSpot makes golf
              coordination simple.
            </p>
            <p className="hero-note">
              Join in 30 seconds. No credit card required.
            </p>
          </div>
        </section>

        <section
          className="problem-solution"
          aria-labelledby="problems-heading"
        >
          <div className="section-container">
            <h3 id="problems-heading">Tired of Golf Planning Headaches?</h3>
            <div className="problem-grid">
              <article className="problem-card">
                <div className="problem-icon">😤</div>
                <div className="problem-before">Endless group texts</div>
                <div className="arrow">→</div>
                <div className="problem-after">One simple app</div>
              </article>
              <article className="problem-card">
                <div className="problem-icon">❓</div>
                <div className="problem-before">"Who's in?" confusion</div>
                <div className="arrow">→</div>
                <div className="problem-after">Clear RSVP tracking</div>
              </article>
              <article className="problem-card">
                <div className="problem-icon">⏰</div>
                <div className="problem-before">Forgotten tee times</div>
                <div className="arrow">→</div>
                <div className="problem-after">Automatic reminders</div>
              </article>
            </div>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-heading">
          <div className="cta-container">
            <h3 id="cta-heading">Ready to Simplify Your Golf Plans?</h3>
            <p className="cta-description">
              Get your group started in 2 minutes
            </p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/signup")}
              aria-describedby="signup-benefits"
            >
              Create Free Account
            </button>
            <p id="signup-benefits" className="signup-note">
              Join thousands of golfers already using GolfSpot
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
