import { Activity, TrendingUp, BarChart2, PieChart } from "lucide-react";

export const AnalyticsDashboard = () => (
  <div style={{ padding: "2rem" }}>
    <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Company Analytics</h1>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "10px", border: "1px solid #eee", display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ padding: "1rem", backgroundColor: "#e0e7ff", borderRadius: "8px" }}><Activity size={24} color="#4338ca" /></div>
        <div><p style={{ color: "#555", margin: 0 }}>Overall Efficiency</p><h2 style={{ margin: "0.2rem 0" }}>94.2%</h2></div>
      </div>
      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "10px", border: "1px solid #eee", display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ padding: "1rem", backgroundColor: "#dcfce7", borderRadius: "8px" }}><TrendingUp size={24} color="#15803d" /></div>
        <div><p style={{ color: "#555", margin: 0 }}>Proj. Profitability</p><h2 style={{ margin: "0.2rem 0" }}>+12.4%</h2></div>
      </div>
      <div style={{ padding: "1.5rem", background: "#fff", borderRadius: "10px", border: "1px solid #eee", display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ padding: "1rem", backgroundColor: "#fef9c3", borderRadius: "8px" }}><PieChart size={24} color="#a16207" /></div>
        <div><p style={{ color: "#555", margin: 0 }}>Resource Allocation</p><h2 style={{ margin: "0.2rem 0" }}>88% Optimal</h2></div>
      </div>
    </div>
    
    <div style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "3rem", borderRadius: "10px", border: "1px solid #eee", textAlign: "center" }}>
      <BarChart2 size={64} color="#e5e5e5" style={{ margin: "0 auto 1rem auto" }} />
      <h3>Advanced Charts Coming Soon</h3>
      <p style={{ color: "#777" }}>Chart.js or Recharts will be integrated here via API data.</p>
    </div>
  </div>
);
export default AnalyticsDashboard;
