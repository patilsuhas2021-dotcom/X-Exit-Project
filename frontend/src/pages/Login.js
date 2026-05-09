import React, { useState } from "react";
import API, { setToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { username, password });
      const { token } = res.data;

      setToken(token);
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      
      // Check role - assuming backend returns role in uppercase
      if (payload.role === "ADMIN") {
        navigate("/hr");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
        <ThemeToggle />
      </div>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '2rem', textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '30px' }}>Sign in to manage your exit process</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Username</label>
            <input
              className="input-field"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Only admin account can access HR panel.
        </p>
      </div>
    </div>
  );
}