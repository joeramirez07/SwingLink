import { useState } from "react";
import { joinGroup } from "../../services/groupService";

export default function JoinGroupForm({ onJoin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const group = await joinGroup(code);
      onJoin(group);
      setCode("");
      setError("");
    } catch (err) {
      setError("Invalid or expired invite code.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="join-group-form">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter invite code"
        required
        maxLength={5}
      />
      <button type="submit">Join</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}
