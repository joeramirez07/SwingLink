import { createOuting } from "../../services/groupService"; // Adjust the import path as needed
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";



export default function CreateOutingPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    courseName: "",
    date: "",
    time: "",
    notes: "",
  });

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

async function handleSubmit(evt) {
  evt.preventDefault();
  try {
    await createOuting(id, formData); 
    navigate(`/groups/${id}`);        
  } catch (err) {
    console.error("Failed to create outing:", err);
  }
}


  return (
    <div className="container">
      <h1>Create Outing</h1>
      <p>For Group ID: {id}</p>

      <form className="outing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="courseName"
            placeholder="e.g., Lincoln Park GC"
            value={formData.courseName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Any special info..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">
          Create Outing
        </button>
      </form>
    </div>
  );
}
