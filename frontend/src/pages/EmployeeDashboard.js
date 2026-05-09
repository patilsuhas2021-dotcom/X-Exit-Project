import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function EmployeeDashboard() {
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [reason, setReason] = useState("");
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      const res = await API.get("/resignation");
      setResignations(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await API.post("/resignation", { lwd: lastWorkingDay, reason });
      setSuccess("Resignation submitted successfully!");
      setReason("");
      setLastWorkingDay("");
      fetchResignations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit resignation");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Employee Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your resignation and exit process</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ThemeToggle />
          <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)', boxShadow: 'none' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Submission Form */}
        <div className="glass-card animate-fade-in" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Submit Resignation</h2>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginBottom: '15px' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Intended Last Working Day</label>
              <input
                className="input-field"
                type="date"
                value={lastWorkingDay}
                onChange={(e) => setLastWorkingDay(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Reason for Resignation</label>
              <textarea
                className="input-field"
                style={{ minHeight: '120px', resize: 'vertical' }}
                placeholder="Please share why you are leaving..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Status View */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ marginBottom: '20px' }}>Your Requests</h2>
          {resignations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No resignation requests found.</p>
          ) : (
            resignations.map((reg) => (
              <div key={reg._id} className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '600' }}>Last Working Day: {new Date(reg.lastWorkingDay).toDateString()}</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    background: reg.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : reg.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: reg.status === 'APPROVED' ? 'var(--success)' : reg.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)',
                    border: `1px solid ${reg.status === 'APPROVED' ? 'var(--success)' : reg.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'}`
                  }}>
                    {reg.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{reg.reason}</p>
                
                {reg.status === 'APPROVED' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '10px' }}>
                    <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Exit Date Set: {reg.exitDate ? new Date(reg.exitDate).toDateString() : new Date(reg.lastWorkingDay).toDateString()}
                    </p>
                    <button 
                      onClick={() => navigate("/exit")} 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      Fill Exit Interview
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
