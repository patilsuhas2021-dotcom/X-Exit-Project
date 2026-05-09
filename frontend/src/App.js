import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import ExitInterview from "./pages/ExitInterview";

import { setToken } from "./services/api";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/exit" element={<ExitInterview />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}