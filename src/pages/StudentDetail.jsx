import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AppStyles.css";

function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedMarks, setEditedMarks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8888/results/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setEditedName(data.name);
        const marksMap = {};
        data.marks.forEach(m => {
          marksMap[m.subject] = m.marks;
        });
        setEditedMarks(marksMap);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  const handleSave = async () => {
    try {
      const updates = Object.entries(editedMarks).map(([subject, marks]) => ({
        name: editedName,
        subject,
        marks: parseInt(marks)
      }));

      const responses = await Promise.all(updates.map(update =>
        fetch(`http://localhost:8888/results/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        })
      ));

      const failed = responses.filter(res => !res.ok);

      if (failed.length === 0) {
        alert("✅ Updated successfully");
        setEditing(false);
        window.location.reload();
      } else {
        const errorMsg = await failed[0].json();
        alert("❌ Updation failed: " + errorMsg.error);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Updation failed");
    }
  };

  if (!student) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>
        {editing ? (
          <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
        ) : (
          <>Details for: {student.name}</>
        )}
      </h2>

      <ul>
        {student.marks.map((m, idx) => (
          <li key={idx}>
            {m.subject}:{" "}
            {editing ? (
              <input
                type="number"
                value={editedMarks[m.subject]}
                onChange={(e) =>
                  setEditedMarks({
                    ...editedMarks,
                    [m.subject]: e.target.value,
                  })
                }
              />
            ) : (
              m.marks
            )}
          </li>
        ))}
      </ul>

      {editing ? (
        <>
          <button onClick={handleSave}> 💾Save</button>
          <button className="secondary" onClick={() => setEditing(false)}>❌ Cancel</button>
        </>
      ) : (
        <button onClick={() => setEditing(true)}>✏️ Edit</button>
      )}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>🔙 Back to Dashboard</button>
    </div>
  );
}

export default StudentDetail;
