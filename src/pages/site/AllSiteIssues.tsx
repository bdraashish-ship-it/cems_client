import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Filter, RefreshCcw, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllSiteIssuesQuery, 
  useDeleteSiteIssueMutation, 
  useUpdateSiteIssueMutation, 
} from "../../services/features/cemsApi";

interface SiteIssue {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  reported_date: string;
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
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "1px" }}>{sub}</div>}
    </div>
  </div>
);

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<SiteIssue>[] => [
  {
    accessorKey: "title",
    header: "Issue / Risk",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: row.original.severity === 'high' ? "#fef2f2" : "#fffbeb",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: row.original.severity === 'high' ? "#ef4444" : "#f59e0b",
          border: "1px solid #e2e8f0"
        }}>
          <AlertTriangle size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.title}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            Reported on {row.original.reported_date}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "severity",
    header: "Severity",
    enableSorting: true,
    cell: ({ getValue }) => {
      const val = getValue<string>().toLowerCase();
      const colors: any = {
        high: { bg: "#fee2e2", text: "#991b1b" },
        medium: { bg: "#fffbeb", text: "#92400e" },
        low: { bg: "#f0fdf4", text: "#166534" },
      };
      const theme = colors[val] || colors.low;
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800,
          backgroundColor: theme.bg, color: theme.text,
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          display: "inline-flex", alignItems: "center", gap: "4px"
        }}>
          <ShieldAlert size={10} />
          {val}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Resolution Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      const val = getValue<string>().toLowerCase();
      const isResolved = val === 'resolved';
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: isResolved ? "#ecfdf5" : "#f1f5f9",
          color: isResolved ? "#059669" : "#64748b",
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          display: "inline-flex", alignItems: "center", gap: "4px"
        }}>
          {isResolved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {val}
        </span>
      );
    },
  },
];

const AllSiteIssues: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllSiteIssuesQuery({});
  const [deleteIssue] = useDeleteSiteIssueMutation();
  const [updateIssue] = useUpdateSiteIssueMutation();

  const [statusFilter, setStatusFilter] = useState<"open" | "resolved" | "all">("open");

  const allIssues: SiteIssue[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const total = allIssues.length;
    const open = allIssues.filter(i => i.status === 'open').length;
    const highSeverity = allIssues.filter(i => i.severity === 'high').length;
    const resolved = total - open;
    return { total, open, highSeverity, resolved };
  }, [allIssues]);

  const issues = useMemo(() => {
    let result = allIssues;
    if (statusFilter === "open") result = result.filter(i => i.status === 'open');
    else if (statusFilter === "resolved") result = result.filter(i => i.status === 'resolved');
    return result;
  }, [allIssues, statusFilter]);

  const statusLabel =
    statusFilter === "open" ? "Pending Issues"
    : statusFilter === "resolved" ? "Resolved"
    : "All Reports";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "open" ? "resolved" : prev === "resolved" ? "all" : "open");
  };

  const handleEdit = (issue: SiteIssue) => navigate(`/site-operations/site-issues/edit/${issue.id}`);
  const handleAdd = () => navigate("/site-operations/site-issues/report");

  const handleDelete = async (issue: SiteIssue) => {
    if (window.confirm(`Permanently remove issue report "${issue.title}"?`)) {
      try {
        await deleteIssue(issue.id).unwrap();
      } catch {
        alert("Failed to delete issue.");
      }
    }
  };

  const handleToggleStatus = async (issue: SiteIssue) => {
    const nextStatus = issue.status === "resolved" ? "open" : "resolved";
    try {
      await updateIssue({ id: issue.id, data: { status: nextStatus } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Open Issues"
          value={kpiStats.open}
          icon={<Clock size={20} />}
          color="#f59e0b"
          sub="requiring attention"
        />
        <StatCard
          label="High Criticality"
          value={kpiStats.highSeverity}
          icon={<ShieldAlert size={20} />}
          color="#ef4444"
          sub="immediate action"
        />
        <StatCard
          label="Resolved"
          value={kpiStats.resolved}
          icon={<CheckCircle2 size={20} />}
          color="#10b981"
          sub="fixed & closed"
        />
        <StatCard
          label="Total Reports"
          value={kpiStats.total}
          icon={<Tag size={20} />}
          color="#6366f1"
          sub="all time logs"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<SiteIssue>
        title="Incident Register"
        subtitle="Tracking and management of site-level problems, risks, and safety incidents."
        description="Maintain a documented history of all site issues, severity levels, and resolution timelines."
        data={issues}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={issue => issue.status === "resolved"}
        headerActions={[
          { key: "add", label: "Report Issue", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default AllSiteIssues;
