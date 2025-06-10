import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddResult from "./pages/AddResult";
import StudentDetail from "./pages/StudentDetail";

import AdminRegister from "./pages/AdminRegister";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddResult />} />
        <Route path="/student/:id" element={<StudentDetail />} />
        <Route path="/admin-register" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
