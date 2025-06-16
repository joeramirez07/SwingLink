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

  async function handleRsvp(outingId) {
    try {
      await groupService.rsvpToOuting(outingId);
      const updatedGroups = await groupService.getUserGroups();
      setGroups(updatedGroups);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Failed to RSVP. You may have already RSVPd.");
    }
  }

  function handleCreateGroupClick() {
    navigate("/groups/new");
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading your golf groups...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="groups-page">
        <h1>My Golf Groups</h1>
        <p className="groups-subtitle">Your golf crews and upcoming rounds</p>

        <JoinGroupForm onJoin={(newGroup) => setGroups([...groups, newGroup])} />
        {errorMsg && <p className="error-message">{errorMsg}</p>}

        {groups.length ? (
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group._id} className="group-card">
                <h3>{group.teamName}</h3>
                <p>{group.members.length} members</p>
                <p>{group.outings.length} outings scheduled</p>

                {group.outings.length > 0 && (
                  <div className="outings-list">
                    {group.outings.map((outing) => (
                      <div key={outing._id} className="outing-summary">
                        <p><strong>{outing.courseName}</strong></p>
                        <p>{new Date(outing.date).toLocaleDateString()} @ {outing.time}</p>
                        <p>{outing.notes}</p>
                        <button
                          onClick={() => handleRsvp(outing._id)}
                          className="btn-rsvp"
                        >
                          RSVP
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="group-actions">
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/groups/${group._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/groups/${group._id}/outings/new`)}
                  >
                    Create Outing
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-groups">
            <p>No Golf Groups Yet!</p>
            <p>Create your first group or join friends using their invite code.</p>
            <button className="btn-primary" onClick={handleCreateGroupClick}>
              Create First Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
