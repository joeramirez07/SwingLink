import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as groupService from "../../services/groupService";
import JoinGroupForm from "../../components/JoinGroupForm/JoinGroupForm";
import "./GroupsPage.css";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const userGroups = await groupService.getUserGroups();
        setGroups(userGroups);
      } catch (err) {
        setErrorMsg("Failed to load golf groups.");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  function handleCreateGroupClick() {
    navigate("/groups/new");
  }

  // Helper function to get next upcoming outing
  function getNextOuting(outings) {
    if (!outings || outings.length === 0) return null;
    
    const now = new Date();
    const upcomingOutings = outings
      .filter(outing => new Date(outing.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingOutings[0] || null;
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your golf groups...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="groups-page" aria-label="Golf groups dashboard">
      <div className="groups-content">
        <header className="page-header">
          <h1 id="groups-heading">My Golf Groups</h1>
          <p className="groups-subtitle">Your golf crews and upcoming rounds</p>
        </header>

        <section className="join-section" aria-labelledby="join-heading">
          <h2 id="join-heading" className="visually-hidden">Join a group</h2>
          <JoinGroupForm
            onJoin={(newGroup) => setGroups([...groups, newGroup])}
          />
        </section>

        {errorMsg && (
          <div className="error-message" role="alert" aria-live="polite">
            {errorMsg}
          </div>
        )}

        {groups.length ? (
          <section className="groups-section" aria-labelledby="groups-heading">
            <div className="groups-grid">
              {groups.map((group) => {
                const nextOuting = getNextOuting(group.outings);
                
                return (
                  <article key={group._id} className="group-card">
                    <div className="card-header">
                      <h3>{group.teamName}</h3>
                      <div className="member-count">
                        <span className="count">{group.members.length}</span>
                        <span className="label">members</span>
                      </div>
                    </div>

                    <div className="card-content">
                      {nextOuting ? (
                        <div className="next-round">
                          <span className="next-label">Next round:</span>
                          <p className="round-info">
                            <strong>{nextOuting.courseName}</strong>
                          </p>
                          <p className="round-date">
                            {new Date(nextOuting.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })} at {nextOuting.time}
                          </p>
                        </div>
                      ) : (
                        <div className="no-rounds">
                          <span className="no-rounds-text">No upcoming rounds</span>
                          <p className="suggestion">Create your first outing!</p>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn-primary"
                        onClick={() => navigate(`/groups/${group._id}`)}
                        aria-label={`View details for ${group.teamName}`}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/groups/${group._id}/outings/new`)}
                        aria-label={`Create new outing for ${group.teamName}`}
                      >
                        Create Outing
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="empty-state" aria-labelledby="empty-heading">
            <div className="empty-content">
              <div className="golf-icon">🏌️‍♂️</div>
              <h2 id="empty-heading">Ready to Tee Off?</h2>
              <p>Create your first golf group and start organizing amazing rounds with friends!</p>
              
              <div className="cta-section">
                <button 
                  className="btn-primary btn-large" 
                  onClick={handleCreateGroupClick}
                  aria-describedby="create-group-desc"
                >
                  Create Your First Group
                </button>
                <p id="create-group-desc" className="cta-description">
                  Start building your golf community today
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}