import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as groupService from "../../services/groupService";
import GolfCalendar from "../../components/GolfCalendar/GolfCalendar";
import "./MySchedulePage.css";

export default function MySchedulePage({ user }) {
  const [allOutings, setAllOutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const [viewMode, setViewMode] = useState("list");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMySchedule() {
      try {
        const userGroups = await groupService.getUserGroups();

        const outings = [];
        userGroups.forEach((group) => {
          if (group.outings) {
            group.outings.forEach((outing) => {
              outings.push({
                ...outing,
                groupId: group._id,
                groupName: group.teamName,
                userRsvpd:
                  outing.players?.some(
                    (player) =>
                      !player.cancelled &&
                      (player.userId === user?._id ||
                        player.userId._id === user?._id),
                  ) || false,
                goingCount:
                  outing.players?.filter((player) => !player.cancelled)
                    .length || 0,
              });
            });
          }
        });

        outings.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAllOutings(outings);
      } catch (err) {
        setErrorMsg("Failed to load your golf schedule.");
      } finally {
        setLoading(false);
      }
    }
    fetchMySchedule();
  }, [user]);

  function getFilteredOutings() {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return allOutings.filter((outing) => new Date(outing.date) >= now);
      case "rsvped":
        return allOutings.filter(
          (outing) => new Date(outing.date) >= now && outing.userRsvpd,
        );
      case "all":
        return allOutings;
      default:
        return allOutings;
    }
  }

  function handleOutingClick(outing) {
    navigate(`/groups/${outing.groupId}`);
  }

  function isOutingToday(outingDate) {
    const today = new Date();
    const outing = new Date(outingDate);
    return today.toDateString() === outing.toDateString();
  }

  function isOutingThisWeek(outingDate) {
    const today = new Date();
    const outing = new Date(outingDate);
    const diffTime = outing - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }

  if (loading) {
    return (
      <main className="schedule-page" aria-label="Loading your golf schedule">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your golf schedule...</p>
        </div>
      </main>
    );
  }

  const filteredOutings = getFilteredOutings();
  const upcomingCount = allOutings.filter(
    (o) => new Date(o.date) >= new Date(),
  ).length;
  const rsvpedCount = allOutings.filter(
    (o) => new Date(o.date) >= new Date() && o.userRsvpd,
  ).length;

  return (
    <main className="schedule-page" aria-labelledby="schedule-heading">
      <div className="schedule-content">
        <header className="schedule-header">
          <div className="header-content">
            <h1 id="schedule-heading">My Golf Schedule 🏌️‍♂️</h1>
            <p className="schedule-subtitle">
              Your upcoming rounds across all groups
            </p>
          </div>

          <div className="schedule-stats">
            <div className="stat-card">
              <span className="stat-number">{upcomingCount}</span>
              <span className="stat-label">Upcoming Rounds</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{rsvpedCount}</span>
              <span className="stat-label">You're Going</span>
            </div>
          </div>
        </header>

        <div className="view-tabs">
          <button
            className={`view-tab ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            📋 List View
          </button>
          <button
            className={`view-tab ${viewMode === "calendar" ? "active" : ""}`}
            onClick={() => setViewMode("calendar")}
          >
            📅 Calendar View
          </button>
        </div>

        {viewMode === "list" && (
          <>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                className={`filter-tab ${filter === "rsvped" ? "active" : ""}`}
                onClick={() => setFilter("rsvped")}
              >
                My RSVPs ({rsvpedCount})
              </button>
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Outings ({allOutings.length})
              </button>
            </div>

            {errorMsg && (
              <div className="error-message" role="alert" aria-live="polite">
                {errorMsg}
              </div>
            )}

            <section className="outings-section" aria-label="Golf outings">
              {filteredOutings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h2>No outings found</h2>
                  <p>
                    {filter === "rsvped"
                      ? "You haven't RSVP'd to any upcoming outings yet."
                      : filter === "upcoming"
                        ? "No upcoming golf rounds scheduled."
                        : "No outings in any of your groups."}
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/groups")}
                  >
                    View Your Groups
                  </button>
                </div>
              ) : (
                <div className="outings-list">
                  {filteredOutings.map((outing) => (
                    <article
                      key={`${outing.groupId}-${outing._id}`}
                      className="outing-card"
                    >
                      <div className="outing-header">
                        <div className="outing-main-info">
                          <h3 className="outing-course">{outing.courseName}</h3>
                          <p className="outing-group">
                            <span className="group-label">Group:</span>{" "}
                            {outing.groupName}
                          </p>
                        </div>

                        <div className="outing-badges">
                          {isOutingToday(outing.date) && (
                            <span className="badge today">Today!</span>
                          )}
                          {isOutingThisWeek(outing.date) &&
                            !isOutingToday(outing.date) && (
                              <span className="badge this-week">This Week</span>
                            )}
                          {outing.userRsvpd ? (
                            <span className="badge going">You're Going</span>
                          ) : (
                            <span className="badge not-rsvped">
                              RSVP Needed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="outing-details">
                        <div className="detail-item">
                          <span className="detail-label">Date:</span>
                          <span className="detail-value">
                            {new Date(outing.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{outing.time}</span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Players:</span>
                          <span className="detail-value">
                            {outing.goingCount}{" "}
                            {outing.goingCount === 1 ? "player" : "players"}{" "}
                            going
                          </span>
                        </div>

                        {outing.notes && (
                          <div className="detail-item">
                            <span className="detail-label">Notes:</span>
                            <span className="detail-value">{outing.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="outing-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => navigate(`/groups/${outing.groupId}`)}
                        >
                          View Group
                        </button>
                        {!outing.userRsvpd &&
                          new Date(outing.date) >= new Date() && (
                            <button
                              className="btn-primary"
                              onClick={() =>
                                navigate(`/groups/${outing.groupId}`)
                              }
                            >
                              RSVP Now
                            </button>
                          )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {viewMode === "calendar" && (
          <section className="calendar-section" aria-label="Golf calendar">
            <GolfCalendar
              outings={allOutings.map((outing) => ({
                ...outing,
                userRsvpd: outing.userRsvpd,
              }))}
              onOutingClick={handleOutingClick}
            />
          </section>
        )}
      </div>
    </main>
  );
}
