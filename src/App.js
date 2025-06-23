// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import StudentDetail from "./pages/StudentDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />
        <Route path="/student/:id" element={<StudentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
