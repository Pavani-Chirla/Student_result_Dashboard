import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppStyles.css";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8888/results")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDelete = (s_id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:8888/results/${s_id}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("Deleted successfully");
          setStudents((prev) => prev.filter((s) => s.s_id !==s_id));
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  return (
    <div className="container">
      <h2>Student Dashboard</h2>
      <button onClick={() => navigate("/add")}>➕ Add Result</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.s_id} onClick={() => navigate(`/student/${s.s_id}`)} style={{ cursor: "pointer" }}>
              <td>{s.s_id}</td>
              <td>{s.name}</td>
              <td>{s.total_marks}</td>
              <td className="actions">
                <button className="danger" onClick={(e) => { e.stopPropagation(); handleDelete(s.s_id); }}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
