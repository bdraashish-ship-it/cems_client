import React, { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Plus, RefreshCcw, Filter, FolderKanban, CheckCircle2,
  Clock, AlertTriangle, TrendingUp, Users, DollarSign,
} from "lucide-react";
import { DataTable } from "../../components/common/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import { SelectField } from "../../components/widgets/SelectField";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useCreateProjectMutation,
  useAddProjectMemberMutation,
  useGetAllProjectStatusesQuery,
  useGetAllProjectCategoriesQuery,
} from "../../services/features/cemsApi";

interface Member {
  id: number;
  employee_id: number;
  role_in_project?: string;
  is_active: boolean;
  employee_rel?: { id: number; full_name: string; designation?: string; profile_photo?: string };
}

interface Project {
  id: number;
  name: string;
  code: string;
  location: string;
  status_id: number;
  status_rel?: { name: string; color_bg: string; color_text: string };
  category_id?: number;
  category_rel?: { id: number; name: string; color: string };
  client_id?: number;
  client_rel?: { id: number; full_name: string; company?: string };
  budget: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  members?: Member[];
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
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "1px" }}>{sub}</div>}
    </div>
  </div>
);

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<Project>[] => [
  {
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
    cell: ({ getValue }) => (
      <code style={{
        background: "#f1f5f9", borderRadius: "6px", padding: "2px 8px",
        fontSize: "0.78rem", fontWeight: 700, color: "#6366f1",
        border: "1px solid #e0e7ff",
      }}>
        {getValue<string>()}
      </code>
    ),
  },
  {
    accessorKey: "name",
    header: "Project Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
          {row.original.name}
        </span>
        {row.original.location && (
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            (📍 {row.original.location})
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category_rel.name",
    header: "Category",
    enableSorting: true,
    cell: ({ row }) => {
      const cat = row.original.category_rel;
      if (!cat) return <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>;
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          background: cat.color || "#64748b", color: "#fff", whiteSpace: "nowrap",
        }}>
          {cat.name}
        </span>
      );
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    enableSorting: true,
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return (
        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>
          {new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(amount || 0)}
        </span>
      );
    },
  },
  {
    id: "timeline",
    header: "Timeline",
    enableSorting: false,
    cell: ({ row }) => {
      const start = row.original.start_date;
      const end = row.original.end_date;
      if (!start && !end) return <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>;
      return (
        <div style={{ fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>
          <span>{start || "?"}</span>
          <span style={{ color: "#94a3b8" }}>→</span>
          <span style={{ color: "#94a3b8" }}>{end || "TBD"}</span>
        </div>
      );
    },
  },
  {
    id: "members",
    header: "Team",
    enableSorting: false,
    accessorFn: (row) => (row.members || []).map(m => m.employee_rel?.full_name).join(", "),
    cell: ({ row }) => {
      const members = row.original.members || [];
      const visible = members.slice(0, 4);
      const extra = members.length - visible.length;
      if (members.length === 0) return <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {visible.map((m, i) => (
            <div
              key={m.id}
              title={`${m.employee_rel?.full_name || ""} — ${m.role_in_project || m.employee_rel?.designation || ""}`}
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: `hsl(${(m.employee_id * 47) % 360}, 60%, 55%)`,
                border: "2px solid #fff", marginLeft: i > 0 ? "-8px" : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: "0.7rem",
                cursor: "default", zIndex: visible.length - i, position: "relative",
              }}
            >
              {(m.employee_rel?.full_name || "?").charAt(0).toUpperCase()}
            </div>
          ))}
          {extra > 0 && (
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "#e2e8f0", border: "2px solid #fff", marginLeft: "-8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748b", fontWeight: 700, fontSize: "0.65rem",
            }}>
              +{extra}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status_rel.name",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status_rel;
      const name = status?.name || "Pending";
      const bg = status?.color_bg || "#f1f5f9";
      const text = status?.color_text || "#475569";
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: bg, color: text,
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {name}
        </span>
      );
    },
  },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const AllProjects = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetAllProjectsQuery({});
  const { data: categoryData } = useGetAllProjectCategoriesQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const allProjects: Project[] = data?.data || [];
  const categories = categoryData?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const total = allProjects.length;
    const active = allProjects.filter(p => p.status_rel?.name !== "Archived" && p.status_rel?.name !== "Cancelled").length;
    const totalBudget = allProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const teamSize = new Set(allProjects.flatMap(p => (p.members || []).map(m => m.employee_id))).size;
    return { total, active, totalBudget, teamSize };
  }, [allProjects]);

  const projects = useMemo(() => {
    let result = allProjects;
    if (statusFilter === "active") result = result.filter(p => p.status_rel?.name !== "Archived" && p.status_rel?.name !== "Cancelled");
    else if (statusFilter === "inactive") result = result.filter(p => p.status_rel?.name === "Archived" || p.status_rel?.name === "Cancelled");
    if (categoryFilter !== null) result = result.filter(p => p.category_id === categoryFilter);
    return result;
  }, [allProjects, statusFilter, categoryFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Projects"
      : statusFilter === "inactive" ? "Closed/Archived"
        : "All Projects";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (project: Project) => navigate(`/projects/edit/${project.id}`);
  const handleAdd = () => navigate("/projects/create");

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Permanently delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await deleteProject(project.id).unwrap();
      } catch {
        alert("Failed to delete project. It may have dependent records.");
      }
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const nextStatusId = project.status_id === 5 ? 2 : 5;
    try {
      await updateProject({ id: project.id, data: { status_id: nextStatusId } }).unwrap();
    } catch {
      alert("Failed to update project status.");
    }
  };

  // Listen for nav shortcut → open the add page
  useEffect(() => {
    const handler = () => navigate("/projects/create");
    window.addEventListener("open-add-project-modal", handler);
    return () => window.removeEventListener("open-add-project-modal", handler);
  }, [navigate]);

  return (
    <>
      <div style={{ display: "flex", gap: "24px", padding: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── KPI Stats Row ─────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
            <StatCard
              label="Total Projects"
              value={kpiStats.total}
              icon={<FolderKanban size={20} />}
              color="#6366f1"
              sub="all time"
            />
            <StatCard
              label="Active Projects"
              value={kpiStats.active}
              icon={<CheckCircle2 size={20} />}
              color="#10b981"
              sub="ongoing"
            />
            <StatCard
              label="Total Budget"
              value={`NPR ${(kpiStats.totalBudget / 1_000_000).toFixed(1)}M`}
              icon={<DollarSign size={20} />}
              color="#f59e0b"
              sub="aggregate"
            />
            <StatCard
              label="Team Members"
              value={kpiStats.teamSize}
              icon={<Users size={20} />}
              color="#3b82f6"
              sub="unique personnel"
            />
          </div>

          {/* ── DataTable ──────────────────────────────────────────── */}
          <DataTable<Project>
            title="Project Inventory"
            subtitle="Comprehensive register of all civil engineering projects."
            description="Track budgets, categories, team assignments, and real-time project status across your entire portfolio."
            data={projects}
            columns={buildColumns()}
            pageSize={10}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            getStatus={(project: Project) => project.status_rel ? project.status_rel.name !== "Archived" && project.status_rel.name !== "Cancelled" : true}
            customHeaderElements={
              categories.length > 0 && (
                <div style={{ minWidth: "200px" }}>
                  <SelectField
                    value={categoryFilter === null ? "" : categoryFilter}
                    onChange={(val) => setCategoryFilter(val === "" ? null : Number(val))}
                    options={[
                      { label: "All Categories", value: "" },
                      ...categories.map((cat: any) => ({
                        label: cat.name,
                        value: cat.id
                      }))
                    ]}
                    placeholder="Filter by Category"
                  />
                </div>
              )
            }
            headerActions={[
              { key: "add", label: "New Project", icon: <Plus size={18} />, onClick: handleAdd },
              { key: "filter_status", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
              { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AllProjects;
