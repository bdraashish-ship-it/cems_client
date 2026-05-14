import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Filter, RefreshCcw, Users, UserCheck, UserMinus, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { 
  useGetAllEmployeesQuery, 
  useDeleteEmployeeMutation, 
  useUpdateEmployeeMutation 
} from "../../../services/features/cemsApi";

interface Employee {
  id: number;
  salutation: string;
  full_name: string;
  designation: string;
  email: string;
  phone: string;
  join_date: string;
  is_active: boolean;
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
const buildColumns = (): ColumnDef<Employee>[] => [
  {
    accessorKey: "full_name",
    header: "Employee Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: "0.75rem"
        }}>
          {row.original.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.salutation} {row.original.full_name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            {row.original.designation || "No Designation"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact Info",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ fontSize: "0.8rem", color: "#475569", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{row.original.email}</span>
        <span style={{ color: "#cbd5e1" }}>|</span>
        <span style={{ fontWeight: 500 }}>{row.original.phone}</span>
      </div>
    ),
  },
  {
    accessorKey: "join_date",
    header: "Joined Date",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap" }}>
        🗓️ {getValue<string>() || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      const active = getValue<boolean>();
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: active ? "#ecfdf5" : "#fef2f2",
          color: active ? "#059669" : "#dc2626",
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {active ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

const ViewAllEmployees: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllEmployeesQuery({});
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allEmployees: Employee[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const total = allEmployees.length;
    const active = allEmployees.filter(e => e.is_active).length;
    const inactive = total - active;
    const designations = new Set(allEmployees.map(e => e.designation).filter(Boolean)).size;
    return { total, active, inactive, designations };
  }, [allEmployees]);

  const employees = useMemo(() => {
    let result = allEmployees;
    if (statusFilter === "active") result = result.filter(e => e.is_active);
    else if (statusFilter === "inactive") result = result.filter(e => !e.is_active);
    return result;
  }, [allEmployees, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Staff"
    : statusFilter === "inactive" ? "Inactive"
    : "All Personnel";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (employee: Employee) => navigate(`/settings/employees/edit/${employee.id}`);
  const handleAdd = () => navigate("/settings/employees/create");

  const handleDelete = async (employee: Employee) => {
    if (window.confirm(`Permanently delete employee "${employee.full_name}"?`)) {
      try {
        await deleteEmployee(employee.id).unwrap();
      } catch {
        alert("Failed to delete employee.");
      }
    }
  };

  const handleToggleStatus = async (employee: Employee) => {
    try {
      await updateEmployee({ id: employee.id, data: { is_active: !employee.is_active } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Total Personnel"
          value={kpiStats.total}
          icon={<Users size={20} />}
          color="#6366f1"
          sub="headcount"
        />
        <StatCard
          label="Active Staff"
          value={kpiStats.active}
          icon={<UserCheck size={20} />}
          color="#10b981"
          sub="currently working"
        />
        <StatCard
          label="Specializations"
          value={kpiStats.designations}
          icon={<Briefcase size={20} />}
          color="#3b82f6"
          sub="unique roles"
        />
        <StatCard
          label="Inactive"
          value={kpiStats.inactive}
          icon={<UserMinus size={20} />}
          color="#f59e0b"
          sub="on leave / resigned"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<Employee>
        title="Staff Directory"
        subtitle="Management of all personnel and team members."
        description="Maintain employee records, designations, and active status across the organization."
        data={employees}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={emp => emp.is_active}
        headerActions={[
          { key: "add", label: "Add Employee", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default ViewAllEmployees;
