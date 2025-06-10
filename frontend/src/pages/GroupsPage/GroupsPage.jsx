import { useState, useEffect } from "react";
import * as groupService from "../../services/groupService";

export default function PostListPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        const userGroups = await groupService.getUserGroups();
        setGroups(userGroups);
      } catch (err) {
        setErrorMsg("Failed to load golf groups");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

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
        <h1>🏌️ My Golf Groups</h1>
        <p className="groups-subtitle">Your golf crews and upcoming rounds</p>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        {groups.length ? (
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group._id} className="group-card">
                <h3>{group.teamName}</h3>
                <p>{group.members.length} members</p>
                <p>{group.outings.length} outings scheduled</p>
                <div className="group-actions">
                  <button className="btn-primary">View Details</button>
                  <button className="btn-secondary">Create Outing</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-groups">
            <p>No Golf Groups Yet!</p>
            <p>
              Create your first group or join friends using their invite code.
            </p>
            <button className="btn-primary">Create First Group</button>
          </div>
        )}
      </div>
    </div>
  );
}
