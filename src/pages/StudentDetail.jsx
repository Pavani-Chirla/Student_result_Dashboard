import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8888/student/${id}`)
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Error fetching:", err));
  }, [id]);

  return (
    <div>
      <h2>Subject-wise Marks</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, i) => (
            <tr key={i}>
              <td>{sub.subject}</td>
              <td>{sub.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

export default StudentDetail;
