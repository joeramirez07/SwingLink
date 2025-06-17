import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGroupDetails,
  deleteGroup,
  rsvpToOuting,
} from "../../services/groupService";
import "./GroupDetailsPage.css";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(new Set());

  useEffect(() => {
    async function fetchGroup() {
      try {
        const data = await getGroupDetails(id);
        setGroup(data);
      } catch (err) {
        setErrorMsg("Failed to load group details.");
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [id]);

  async function handleDelete() {
    if (
      window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone.",
      )
    ) {
      setDeleteLoading(true);
      try {
        await deleteGroup(group._id);
        navigate("/groups");
      } catch (err) {
        console.error("Delete failed:", err);
        setErrorMsg("Failed to delete group. Please try again.");
      } finally {
        setDeleteLoading(false);
      }
    }
  }

  async function handleRsvp(outingId) {
  setRsvpLoading(prev => new Set(prev).add(outingId));
  setErrorMsg("");
  
  try {
    await rsvpToOuting(group._id, outingId); 
    
    const updatedGroup = await getGroupDetails(id);
    setGroup(updatedGroup);
  } catch (err) {
    setErrorMsg("Failed to RSVP. Please try again.");
  } finally {
    setRsvpLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(outingId);
      return newSet;
    });
  }
}

  function copyInviteCode() {
    navigator.clipboard
      .writeText(group.inviteLink)
      .then(() => {
       
        alert("Invite code copied to clipboard!");
      })
      .catch(() => {
       
        setErrorMsg(
          "Could not copy invite code. Please copy manually: " +
            group.inviteLink,
        );
      });
  }

  function isOutingPast(outingDate) {
    return new Date(outingDate) < new Date();
  }

  
  function getUpcomingOutings() {
    if (!group?.outings) return [];
    return group.outings
      .filter((outing) => !isOutingPast(outing.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }


  function getPastOutings() {
    if (!group?.outings) return [];
    return group.outings
      .filter((outing) => isOutingPast(outing.date))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (loading) {
    return (
      <main className="group-details-page" aria-label="Loading group details">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading group details...</p>
        </div>
      </main>
    );
  }

  if (errorMsg && !group) {
    return (
      <main className="group-details-page" aria-label="Error loading group">
        <div className="error-state">
          <h1>Oops! Something went wrong</h1>
          <p className="error-message">{errorMsg}</p>
          <button className="btn-primary" onClick={() => navigate("/groups")}>
            Back to Groups
          </button>
        </div>
      </main>
    );
  }

  const upcomingOutings = getUpcomingOutings();
  const pastOutings = getPastOutings();

  return (
    <main className="group-details-page" aria-labelledby="group-title">
      <div className="group-details-content">
      
        <header className="group-header">
          <div className="header-content">
            <h1 id="group-title" className="group-title">
              {group.teamName}
            </h1>
            <div className="group-stats">
              <div className="stat-item">
                <span className="stat-number">{group.members.length}</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{group.outings.length}</span>
                <span className="stat-label">Total Outings</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate(`/groups/${group._id}/outings/new`)}
              aria-label="Create new outing for this group"
            >
              Create Outing
            </button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleteLoading}
              aria-label="Delete this group"
            >
              {deleteLoading ? "Deleting..." : "Delete Group"}
            </button>
          </div>
        </header>

       
        {errorMsg && (
          <div className="error-message" role="alert" aria-live="polite">
            {errorMsg}
          </div>
        )}

       
        <section className="invite-section" aria-labelledby="invite-heading">
          <h2 id="invite-heading" className="visually-hidden">
            Group Invite
          </h2>
          <div className="invite-card">
            <div className="invite-content">
              <span className="invite-label">Invite Code:</span>
              <code className="invite-code">{group.inviteLink}</code>
            </div>
            <button
              className="btn-copy"
              onClick={copyInviteCode}
              aria-label="Copy invite code to clipboard"
            >
              Copy
            </button>
          </div>
        </section>

      
        <div className="main-content">
         
          <div className="left-column">
           
            <section
              className="members-section"
              aria-labelledby="members-heading"
            >
              <h2 id="members-heading" className="section-title">
                Members ({group.members.length})
              </h2>

              {group.members.length === 0 ? (
                <div className="empty-state">
                  <p>No members yet. Share your invite code to get started!</p>
                </div>
              ) : (
                <div className="members-grid">
                  {group.members.map((member) => (
                    <div key={member._id} className="member-card">
                      <div className="member-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <h3 className="member-name">{member.name}</h3>
                        <p className="member-email">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            
            {pastOutings.length > 0 && (
              <section
                className="outings-section"
                aria-labelledby="past-heading"
              >
                <h2 id="past-heading" className="section-title">
                  Past Outings ({pastOutings.length})
                </h2>

                <div className="outings-list">
                  {pastOutings.map((outing) => (
                    <article key={outing._id} className="outing-card past">
                      <div className="outing-header">
                        <h3 className="outing-course">{outing.courseName}</h3>
                        <span className="outing-status past-badge">
                          Completed
                        </span>
                      </div>

                      <div className="outing-details">
                        <p className="outing-date">
                          {new Date(outing.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at {outing.time}
                        </p>
                        {outing.notes && (
                          <p className="outing-notes">{outing.notes}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

     
          <div className="right-column">
          
            <section
              className="outings-section"
              aria-labelledby="upcoming-heading"
            >
              <h2 id="upcoming-heading" className="section-title">
                Upcoming Outings ({upcomingOutings.length})
              </h2>

              {upcomingOutings.length === 0 ? (
                <div className="empty-state">
                  <p>No upcoming outings scheduled.</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/groups/${group._id}/outings/new`)}
                  >
                    Schedule First Outing
                  </button>
                </div>
              ) : (
                <div className="outings-list">
                  {upcomingOutings.map((outing) => (
                    <article key={outing._id} className="outing-card upcoming">
                      <div className="outing-header">
                        <h3 className="outing-course">{outing.courseName}</h3>
                        <span className="outing-status upcoming-badge">
                          Upcoming
                        </span>
                      </div>

                      <div className="outing-details">
                        <p className="outing-date">
                          <strong>Date:</strong>{" "}
                          {new Date(outing.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="outing-time">
                          <strong>Time:</strong> {outing.time}
                        </p>
                        {outing.notes && (
                          <p className="outing-notes">
                            <strong>Notes:</strong> {outing.notes}
                          </p>
                        )}
                        <p className="outing-creator">
                          <strong>Created by:</strong>{" "}
                          {outing.createdBy?.name || "Someone"}
                        </p>
                      </div>

                      <div className="outing-actions">
                        {outing.userRsvpd ? (
                          <span className="rsvp-status confirmed">
                            ✓ You're going!
                          </span>
                        ) : (
                          <button
                            className="btn-rsvp"
                            onClick={() => handleRsvp(outing._id)}
                            disabled={rsvpLoading.has(outing._id)}
                            aria-label={`RSVP to ${outing.courseName} on ${new Date(outing.date).toLocaleDateString()}`}
                          >
                            {rsvpLoading.has(outing._id)
                              ? "RSVPing..."
                              : "RSVP"}
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
