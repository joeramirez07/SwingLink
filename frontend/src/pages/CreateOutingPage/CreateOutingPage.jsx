import { useParams } from "react-router-dom";

export default function CreateOutingPage() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Create Outing</h1>
      <p>For Group ID: {id}</p>

      <form className="outing-form">
        <div className="form-group">
          <label>Course Name</label>
          <input type="text" placeholder="e.g., Lincoln Park GC" />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input type="time" />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea placeholder="Any special info..." />
        </div>

        <button type="submit" className="btn-primary">Create Outing</button>
      </form>
    </div>
  );
}
