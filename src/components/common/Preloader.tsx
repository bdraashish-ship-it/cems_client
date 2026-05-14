import React, { useState, useEffect } from "react";

const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 800); // Wait for fade animation
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.8s ease-in-out",
      pointerEvents: fadeOut ? "none" : "auto",
    }}>
      <div style={{ position: "relative", marginBottom: "30px" }}>
        {/* Animated Rings */}
        <div className="loader-ring" style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "4px solid transparent",
          borderTopColor: "#ce0909",
          animation: "spin 1.5s linear infinite",
        }} />
        <div className="loader-ring" style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "4px solid transparent",
          borderTopColor: "#ffd78c",
          animation: "spin-reverse 1.2s linear infinite",
        }} />
        
        {/* Software Name in Center */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.5rem",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "0.1em",
          textShadow: "0 0 20px rgba(206, 9, 9, 0.5)",
        }}>
          CEMS
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontSize: "1.25rem",
          fontWeight: 600,
          margin: "0 0 8px 0",
          letterSpacing: "0.05em",
          background: "linear-gradient(90deg, #ffd78c, #ce0909, #ffd78c)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 3s linear infinite",
        }}>
          Civil Engineering Management System
        </h1>
        <div style={{
          fontSize: "0.75rem",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}>
          Optimizing Infrastructure Intelligence
        </div>
      </div>

      {/* Progress Line */}
      <div style={{
        marginTop: "40px",
        width: "200px",
        height: "2px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "2px",
        overflow: "hidden",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, #ce0909, #ffd78c)",
          animation: "progress 2.5s cubic-bezier(0.65, 0.05, 0.36, 1) forwards",
        }} />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
