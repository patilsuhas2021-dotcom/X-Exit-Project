import { useState } from "react";
import API from "../services/api";

export default function Resign() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const submit = async () => {
    await API.post("/resignation", {
      reason,
      lastWorkingDay: date
    });
    alert("Submitted!");
  };

  return (
    <div>
      <h2>Resignation Form</h2>
      <input placeholder="Reason" onChange={(e)=>setReason(e.target.value)} />
      <input type="date" onChange={(e)=>setDate(e.target.value)} />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
