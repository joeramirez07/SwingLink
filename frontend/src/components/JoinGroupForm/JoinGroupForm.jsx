import { useState } from "react";
import { joinGroup } from "../../services/groupService";
import "./JoinGroupForm.css";

export default function JoinGroupForm({ onJoin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    
    const cleanCode = code.trim().toUpperCase();

    
    if (!cleanCode) {
      setError("Please enter an invite code");
      setIsLoading(false);
      return;
    }

    if (cleanCode.length < 4 || cleanCode.length > 6) {
      setError("Invite codes are usually 4-6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const group = await joinGroup(cleanCode);
      onJoin(group);
      setCode("");
      setError("");
      setSuccessMessage(`Successfully joined ${group.teamName}! 🎉`);

      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Join group error:", err);

      if (err.message.includes("404") || err.message.includes("not found")) {
        setError("This invite code doesn't exist. Please double-check it.");
      } else if (
        err.message.includes("already") ||
        err.message.includes("member")
      ) {
        setError("You're already a member of this group!");
      } else if (err.message.includes("expired")) {
        setError(
          "This invite code has expired. Ask the group owner for a new one.",
        );
      } else if (err.message.includes("full")) {
        setError("This group is full and can't accept new members.");
      } else if (
        err.message.includes("network") ||
        err.message.includes("connection")
      ) {
        setError(
          "Connection problem. Please check your internet and try again.",
        );
      } else {
        setError("Couldn't join group. Please try again or contact support.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    const value = e.target.value;
    setCode(value);

   
    if (error) {
      setError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  }

  return (
    <div className="join-group-container">
      <div className="join-group-header">
        <h2 className="join-title">Join a Golf Group</h2>
        <p className="join-subtitle">
          Enter an invite code to join an existing group
        </p>
      </div>

      <form onSubmit={handleSubmit} className="join-group-form">
        <div className="form-group">
          <label htmlFor="invite-code" className="form-label">
            Invite Code
          </label>
          <input
            id="invite-code"
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="e.g. ABC123"
            required
            maxLength={6}
            className={`form-input ${error ? "error" : ""}`}
            disabled={isLoading}
            aria-describedby={
              error ? "error-msg" : successMessage ? "success-msg" : undefined
            }
            autoComplete="off"
            spellCheck="false"
          />
          <div className="input-hint">
            Ask your group organizer for the invite code
          </div>
        </div>

        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="btn-join"
          aria-describedby={
            error ? "error-msg" : successMessage ? "success-msg" : undefined
          }
        >
          {isLoading ? (
            <>
              <span className="loading-spinner" aria-hidden="true"></span>
              Joining...
            </>
          ) : (
            "Join Group"
          )}
        </button>

        {error && (
          <div
            id="error-msg"
            className="error-message"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            id="success-msg"
            className="success-message"
            role="alert"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
