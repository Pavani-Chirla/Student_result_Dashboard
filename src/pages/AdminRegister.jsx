import React, { useState } from "react";
import "./AppStyles.css";

function AdminRegister() {
  const [oldUsername, setOldUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8888/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_username: oldUsername,
        old_password: oldPassword,
        new_username: newUsername,
        new_password: newPassword,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("☑️ New admin registered successfully!");
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div className="container">
      <h2> 👤 Admin Registration</h2>
      <form onSubmit={handleRegister}>
        <label>Old Admin Username:</label>
        <input type="text" value={oldUsername} onChange={(e) => setOldUsername(e.target.value)} required />
        <label>Old Admin Password:</label>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        <label>New Admin Username:</label>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
        <label>New Admin Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">➕ Register New Admin</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
}

export default AdminRegister;
