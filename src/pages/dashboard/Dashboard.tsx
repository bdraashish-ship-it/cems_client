import { FolderKanban, Users, CheckCircle2, TrendingUp, AlertTriangle, AlertCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "bold" }}>Dashboard Overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        
        {/* Card 1 */}
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Total Projects</p>
              <h2 style={{ fontSize: "1.8rem", margin: "0.5rem 0", color: "#333" }}>26</h2>
            </div>
            <div style={{ backgroundColor: "#eef2ff", padding: "0.8rem", borderRadius: "50%" }}>
              <FolderKanban size={24} color="#4f46e5" />
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.5rem" }}>+2 this month</p>
        </div>

        {/* Card 2 */}
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Active Employees</p>
              <h2 style={{ fontSize: "1.8rem", margin: "0.5rem 0", color: "#333" }}>142</h2>
            </div>
            <div style={{ backgroundColor: "#dcfce7", padding: "0.8rem", borderRadius: "50%" }}>
              <Users size={24} color="#16a34a" />
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.5rem" }}>+12 new hires</p>
        </div>

        {/* Card 3 */}
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Completed Milestones</p>
              <h2 style={{ fontSize: "1.8rem", margin: "0.5rem 0", color: "#333" }}>89.5%</h2>
            </div>
            <div style={{ backgroundColor: "#fef3c7", padding: "0.8rem", borderRadius: "50%" }}>
              <CheckCircle2 size={24} color="#d97706" />
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>Project tracking</p>
        </div>

        {/* Card 4 */}
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>Pending Issues</p>
              <h2 style={{ fontSize: "1.8rem", margin: "0.5rem 0", color: "#333" }}>8</h2>
            </div>
            <div style={{ backgroundColor: "#fee2e2", padding: "0.8rem", borderRadius: "50%" }}>
              <AlertTriangle size={24} color="#dc2626" />
            </div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: "0.5rem" }}>Require attention</p>
        </div>

      </div>

      <div style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #eee" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Recent Activities</h3>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ backgroundColor: "#eef2ff", padding: "0.6rem", borderRadius: "50%" }}><TrendingUp size={16} color="#4f46e5" /></div>
          <div>
            <p style={{ margin: 0, fontWeight: "500" }}>Quarterly Financial Report Generated</p>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>2 hours ago</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0" }}>
          <div style={{ backgroundColor: "#fee2e2", padding: "0.6rem", borderRadius: "50%" }}><AlertCircle size={16} color="#dc2626" /></div>
          <div>
            <p style={{ margin: 0, fontWeight: "500" }}>Material Shortage at Site B</p>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
