import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ExitInterview() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/interview", { feedback, rating });
      setSuccess(true);
      setTimeout(() => navigate("/employee"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit interview");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{ padding: '60px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h1 style={{ marginBottom: '10px' }}>Thank You!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Your feedback has been submitted successfully.</p>
          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
        <button 
          onClick={() => navigate("/employee")} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ← Back to Dashboard
        </button>
        
        <h1 style={{ marginBottom: '10px' }}>Exit Interview</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your feedback helps us improve our workplace.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Overall Experience Rating (1-10)</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={rating} 
                onChange={(e) => setRating(parseInt(e.target.value))}
                style={{ flex: 1, marginRight: '20px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', width: '40px', textAlign: 'right' }}>{rating}</span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>What could we have done better?</label>
            <textarea
              className="input-field"
              style={{ minHeight: '150px', resize: 'vertical' }}
              placeholder="Tell us about your experience, challenges, or suggestions..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
