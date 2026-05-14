import React from "react";
import { Activity, Clock, User, CheckCircle2, AlertCircle } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "create" | "update" | "delete" | "status";
  message: string;
  timestamp: string;
  user: string;
}

const mockActivities: ActivityItem[] = [
  { id: 1, type: "create", message: "New project registered: Kathmandu Hydropower", timestamp: "2 mins ago", user: "Admin" },
  { id: 2, type: "status", message: "Project status changed to Ongoing", timestamp: "1 hour ago", user: "Sushant" },
  { id: 3, type: "update", message: "Budget updated for Ring Road project", timestamp: "3 hours ago", user: "Admin" },
  { id: 4, type: "delete", message: "Legacy draft deleted", timestamp: "Yesterday", user: "Prashant" },
];

export const ActivityFeed: React.FC = () => {
  return (
    <div className="activity-feed" style={{
      background: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      padding: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Activity size={20} color="#2563eb" />
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>Recent Activity</h3>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {mockActivities.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: "12px" }}>
            <div style={{ 
              marginTop: "4px",
              width: "32px", 
              height: "32px", 
              borderRadius: "50%", 
              background: item.type === "create" ? "#dcfce7" : item.type === "delete" ? "#fee2e2" : "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {item.type === "create" ? <CheckCircle2 size={16} color="#166534" /> : 
               item.type === "delete" ? <AlertCircle size={16} color="#991b1b" /> : 
               <Clock size={16} color="#1e40af" />}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#334155", fontWeight: 500 }}>{item.message}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <User size={12} /> {item.user}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>•</span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button style={{
        width: "100%",
        marginTop: "20px",
        padding: "8px",
        background: "transparent",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "0.8125rem",
        fontWeight: 600,
        color: "#64748b",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#1e293b"; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
      >
        View Full History
      </button>
    </div>
  );
};
