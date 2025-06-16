import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupDetails, deleteGroup } from "../../services/groupService";
import "./GroupDetailsPage.css";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await deleteGroup(group._id);
        navigate("/groups");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Something went wrong while deleting the group.");
      }
    }
  }

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;

  return (
    <div className="group-details-page">
      <div className="group-details-card">
        <h1 className="group-title">{group.teamName}</h1>

        <div className="group-meta">
          <span className="invite-code">Invite Code: {group.inviteLink}</span>
          <button onClick={handleDelete} className="btn-delete-small">
            Delete
          </button>
        </div>

        <section className="details-section">
          <h2>Members</h2>
          {group.members.length === 0 ? (
            <p>No members yet.</p>
          ) : (
            <ul>
              {group.members.map((m) => (
                <li key={m._id}>{m.name}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="details-section">
          <h2>Outings</h2>
          {group.outings.length === 0 ? (
            <p>No outings yet.</p>
          ) : (
            <div className="outings-list">
              {group.outings.map((outing) => (
                <div key={outing._id} className="outing-summary">
                  <strong>{outing.courseName}</strong>
                  <br />
                  {new Date(outing.date).toLocaleDateString()} at {outing.time}
                  <br />
                  <em>Created by: {outing.createdBy?.name || "someone"}</em>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
