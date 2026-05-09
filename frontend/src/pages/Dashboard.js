import React, { useState } from "react";
import API from "../services/api";

export default function EmployeeDashboard() {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const submit = async () => {
    try {
      await API.post("/resignations", {
        lastWorkingDay: date,
        reason
      });
      alert("Submitted");
    } catch {
      alert("Invalid date (weekend/holiday)");
    }
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Reason"
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={submit}>Submit Resignation</button>
    </div>
  );
}