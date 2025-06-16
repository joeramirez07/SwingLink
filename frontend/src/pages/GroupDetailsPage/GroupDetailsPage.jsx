import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupDetails } from "../../services/groupService";

export default function GroupDetailsPage() {
  const { id } = useParams();
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

  if (loading) return <p>Loading...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;

  return (
    <div className="container">
      <h1>{group.teamName}</h1>
      <p>
        <strong>Invite Code:</strong> {group.inviteLink}
      </p>

      <section>
        <h2>Members</h2>
        <ul>
          {group.members.map((m) => (
            <li key={m._id}>{m.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Outings</h2>
        {group.outings.length === 0 ? (
          <p>No outings yet.</p>
        ) : (
          <ul>
            {group.outings.map((outing) => (
              <li key={outing._id}>
                <strong>{outing.courseName}</strong> on{" "}
                {new Date(outing.date).toLocaleDateString()} at {outing.time} —
                Created by {outing.createdBy?.name || "someone"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
