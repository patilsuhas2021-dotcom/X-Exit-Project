import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text-main)",
        padding: "10px 15px",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.9rem",
        fontWeight: "500",
        transition: "all 0.3s ease",
        backdropFilter: "blur(8px)",
      }}
    >
      {isDarkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
