import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8888/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
       });

    const data = await response.json();
    if (response.ok) {
      navigate("/dashboard");
    } else {
      setMessage(`${data.error}`);
    }
  };

  return (
    <div className="container">
      <h2>🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">Login</button>
        


      </form>

      <p className="message">{message}</p>

      <button className="secondary" onClick={() => navigate("/admin-register")}>
        ➕ Register New Admin
      </button>
    </div>
  );
}

export default LoginPage;
