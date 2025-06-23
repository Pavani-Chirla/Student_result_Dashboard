import { useState } from "react";

function Add() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [rows, setRows] = useState([{ subject: "", mark: "" }]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { subject: "", mark: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sub = rows.map((r) => r.subject);
    const mark = rows.map((r) => r.mark);

    const response = await fetch("http://localhost:8888/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, sub, mark }),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <div>
      <h2>Add Student Result</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Roll No" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

        {rows.map((row, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Subject"
              value={row.subject}
              onChange={(e) => handleChange(index, "subject", e.target.value)}
            />
            <input
              type="text"
              placeholder="Mark"
              value={row.mark}
              onChange={(e) => handleChange(index, "mark", e.target.value)}
            />
          </div>
        ))}

        <button type="button" class="ad" onClick={addRow}> Add Subject</button><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Add;
