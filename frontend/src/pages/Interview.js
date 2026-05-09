import React, { useState } from "react";
import API from "../services/api";

export default function ExitInterview() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const submit = async () => {
    await API.post("/exit", { feedback, rating });
    alert("Submitted");
  };

  return (
    <div>
      <h2>Exit Interview</h2>

      <textarea
        placeholder="Feedback"
        onChange={(e) => setFeedback(e.target.value)}
      />

      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}