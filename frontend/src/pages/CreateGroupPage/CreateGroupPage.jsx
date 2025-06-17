import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as groupService from "../../services/groupService";

export default function CreateGroupPage() {
  const [teamName, setTeamName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await groupService.createGroup({ teamName });
      navigate("/groups");
    } catch (err) {
      setErrorMsg("Creating Golf Group Failed");
    }
  }

  return (
    <div className="container">
      <div className="create-group-card">
        <h2>Create New Golf Group</h2>
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
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </div>
    </div>
  );
}
