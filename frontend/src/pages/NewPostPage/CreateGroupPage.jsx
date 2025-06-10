import { useState } from "react";
import { useNavigate } from "react-router";
import * as groupService from "../../services/groupService";

export default function NewPostPage() {  // Keep the same component name for now
  const [teamName, setTeamName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await groupService.createGroup({ teamName });
      navigate("/groups");  // Navigate to groups page instead of posts
    } catch (err) {
      setErrorMsg("Creating Golf Group Failed");
    }
  }

  return (
    <div className="container">
      <div className="create-group-card">
        <h2>🏌️ Create New Golf Group</h2>
        <p>Give your golf crew a name!</p>
        
        <form onSubmit={handleSubmit} className="golf-form">
          <div className="form-group">
            <label>Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(evt) => setTeamName(evt.target.value)}
              placeholder="e.g., Sunday Crew, The Hackers, Joe's Squad"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Create Golf Group
          </button>
        </form>
        <p className="error-message">&nbsp;{errorMsg}</p>
      </div>
    </div>
  );
}
