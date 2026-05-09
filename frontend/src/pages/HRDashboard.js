import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function HRDashboard() {
  const [resignations, setResignations] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExitDate, setSelectedExitDate] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resReg, resInt] = await Promise.all([
        API.get("/resignation"),
        API.get("/interview")
      ]);
      setResignations(resReg.data);
      setInterviews(resInt.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const exitDate = selectedExitDate[id] || resignations.find(r => r._id === id).lastWorkingDay;
      await API.patch(`/resignation/${id}`, { status, exitDate });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDateChange = (id, date) => {
    setSelectedExitDate(prev => ({ ...prev, [id]: date }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>HR Administration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review resignations and exit interviews</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ThemeToggle />
          <button onClick={handleLogout} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)', boxShadow: 'none' }}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>Resignation Requests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {resignations.map((reg) => (
            <div key={reg._id} className="glass-card animate-fade-in" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{reg.employee?.username}</span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem',
                  background: reg.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : reg.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: reg.status === 'APPROVED' ? 'var(--success)' : reg.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)',
                  border: `1px solid ${reg.status === 'APPROVED' ? 'var(--success)' : reg.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'}`
                }}>
                  {reg.status}
                </span>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Intended Last Day:</p>
                <p style={{ fontWeight: '500' }}>{new Date(reg.lastWorkingDay).toDateString()}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Reason:</p>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{reg.reason}"</p>
              </div>

              {reg.status === 'PENDING' && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confirm Exit Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ padding: '8px 12px' }}
                      defaultValue={reg.lastWorkingDay.split('T')[0]}
                      onChange={(e) => handleDateChange(reg._id, e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleUpdateStatus(reg._id, "APPROVED")} 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '10px' }}
                    >Approve</button>
                    <button 
                      onClick={() => handleUpdateStatus(reg._id, "REJECTED")} 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid var(--danger)', boxShadow: 'none' }}
                    >Reject</button>
                  </div>
                </div>
              )}

              {reg.status === 'APPROVED' && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: '10px' }}>
                  <p style={{ color: 'var(--success)', fontSize: '0.85rem' }}>
                    Final Exit Date: {new Date(reg.exitDate || reg.lastWorkingDay).toDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
          {resignations.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No requests to display.</p>}
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>Completed Exit Interviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {interviews.map((int) => (
            <div key={int._id} className="glass-card animate-fade-in" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontWeight: '700' }}>{int.employee?.username}</span>
                <span style={{ color: 'var(--warning)' }}>{"★".repeat(int.rating || 0)}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{int.feedback}</p>
              <p style={{ marginTop: '15px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Submitted on {new Date(int.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {interviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No interviews completed yet.</p>}
        </div>
      </div>
    </div>
  );
}