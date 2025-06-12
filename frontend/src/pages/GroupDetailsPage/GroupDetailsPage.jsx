import { useParams } from "react-router-dom";

export default function GroupDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Group Details</h1>
      <p>Group ID: {id}</p>

      <div className="section">
        <h2>Members</h2>
        <p>Coming soon...</p>
      </div>

      <div className="section">
        <h2>Outings</h2>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}
