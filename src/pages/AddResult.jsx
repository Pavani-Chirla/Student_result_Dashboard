import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppStyles.css";

function AddResult() {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([{ subject: "", marks: "" }]);
  const [id, setid] = useState(0);

  const navigate = useNavigate();

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subject: "", marks: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter student name.");
      return;
    }
    if (!id.trim()) {
      alert("Please enter student id.");
      return;
    }


    for (const entry of subjects) {
      if (!entry.subject || entry.marks === "") {
        alert("Please fill all subject and marks fields.");
        return;
      }

      const marksInt = parseInt(entry.marks);
      if (isNaN(marksInt) || marksInt < 0 || marksInt > 100) {
        alert(`❌ Invalid marks for "${entry.subject}". Must be between 0–100.`);
        return;
      }
    }

    try {
      for (const entry of subjects) {
        const res = await fetch("http://localhost:8888/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            id:id.trim(),
            subject: entry.subject.trim(),
            marks: parseInt(entry.marks),
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert("❌ Error: " + err.error);
          return;
        }
      }

      alert("☑️ Student result(s) added successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Submission failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Add Student Result</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
         <input
          type="number"
          placeholder="Student id"
          value={id}
          onChange={(e) => setid(e.target.value)}
          required
        />


        {subjects.map((entry, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Subject"
              value={entry.subject}
              onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Marks"
              value={entry.marks}
              onChange={(e) => handleSubjectChange(index, "marks", e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" className="secondary" onClick={handleAddSubject}>➕ Add Subject</button>
        <button type="submit">✅ Submit</button>
      </form>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>🔙 Back to Dashboard</button>
    </div>
  );
}

export default AddResult;
