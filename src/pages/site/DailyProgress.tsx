import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Filter, RefreshCcw, Calendar, Users, Cloud, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllDailyProgresssQuery, 
  useDeleteDailyProgressMutation, 
  useUpdateDailyProgressMutation, 
} from "../../services/features/cemsApi";

interface DailyProgress {
  id: number;
  date: string;
  work_description: string;
  manpower_count: number;
  weather: string;
  percentage_complete?: number;
  is_active?: boolean;
}

// ─── KPI STAT CARD ──────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}> = ({ label, value, icon, color, sub }) => (
  <div style={{
    background: "#fff",
    borderRadius: "14px",
    padding: "18px 22px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
    minWidth: "160px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
  >
    <div style={{
      width: "44px", height: "44px", borderRadius: "12px",
      background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "1px" }}>{sub}</div>}
    </div>
  </div>
);

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<DailyProgress>[] => [
  {
    accessorKey: "date",
    header: "Log Date",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
        🗓️ {getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "work_description",
    header: "Summary of Work",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ 
        fontSize: "0.8rem", color: "#475569", 
        maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" 
      }}>
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "manpower_count",
    header: "Resources",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontWeight: 600, color: "#1e293b" }}>{row.original.manpower_count}</span>
        <span>Staff</span>
        <span style={{ color: "#cbd5e1" }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Cloud size={12} /> {row.original.weather}
        </span>
      </div>
    ),
  },
];

const SiteProgress: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllDailyProgresssQuery({});
  const [deleteProgress] = useDeleteDailyProgressMutation();
  const [updateProgress] = useUpdateDailyProgressMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allLogs: DailyProgress[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const totalLogs = allLogs.length;
    const totalManpower = allLogs.reduce((acc, l) => acc + l.manpower_count, 0);
    return { totalLogs, totalManpower };
  }, [allLogs]);

  const logs = useMemo(() => {
    let result = allLogs;
    if (statusFilter === "active") result = result.filter(l => l.is_active !== false);
    else if (statusFilter === "inactive") result = result.filter(l => l.is_active === false);
    return result;
  }, [allLogs, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Logs"
    : statusFilter === "inactive" ? "Archived"
    : "All Logs";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (log: DailyProgress) => navigate(`/site-operations/daily-progress/edit/${log.id}`);
  const handleAdd = () => navigate("/site-operations/daily-progress/create");

  const handleDelete = async (log: DailyProgress) => {
    if (window.confirm(`Permanently delete progress log for ${log.date}?`)) {
      try {
        await deleteProgress(log.id).unwrap();
      } catch {
        alert("Failed to delete log.");
      }
    }
  };

  const handleToggleStatus = async (log: DailyProgress) => {
    try {
      await updateProgress({ id: log.id, data: { is_active: !log.is_active } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Total Logs"
          value={kpiStats.totalLogs}
          icon={<Calendar size={20} />}
          color="#6366f1"
          sub="recorded days"
        />
        <StatCard
          label="Cumulative Labor"
          value={kpiStats.totalManpower}
          icon={<Users size={20} />}
          color="#3b82f6"
          sub="man-days logged"
        />
        <StatCard
          label="Adverse Weather"
          value={allLogs.filter(l => l.weather !== 'Clear').length}
          icon={<Cloud size={20} />}
          color="#f59e0b"
          sub="impacted days"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<DailyProgress>
        title="Daily Site Journal"
        subtitle="Detailed chronological record of site activities, manpower usage, and work completion."
        description="Document daily work executed, weather conditions, and percentage of project completion for stakeholders."
        data={logs}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={log => log.is_active !== false}
        headerActions={[
          { key: "add", label: "New Log", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default SiteProgress;
