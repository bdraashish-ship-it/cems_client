import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Filter, Shield, Key, Lock, RefreshCcw, Tag } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { useGetRolesQuery, type Role } from "../../../services/roleApi";

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
const buildColumns = (): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Access Level / Role",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#4f46e5", border: "1px solid #e2e8f0"
        }}>
          <Shield size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            System Internal Role
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Permission Scope",
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#475569", whiteSpace: "nowrap", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
        {getValue<string | null>() ?? "General system access permissions."}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "State",
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
          {active ? "Active" : "Archived"}
        </span>
      );
    },
  },
];

const RoleTable: React.FC = () => {
  const { data: response, isLoading, refetch } = useGetRolesQuery();
  const roles = response?.data ?? [];
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const kpiStats = useMemo(() => {
    const total = roles.length;
    const active = roles.filter(r => r.status).length;
    const descriptions = roles.filter(r => r.description).length;
    return { total, active, descriptions };
  }, [roles]);

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return roles;
    if (statusFilter === "active") return roles.filter((role) => role.status);
    return roles.filter((role) => !role.status);
  }, [roles, statusFilter]);

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Total Roles"
          value={kpiStats.total}
          icon={<Key size={20} />}
          color="#6366f1"
          sub="defined hierarchies"
        />
        <StatCard
          label="Active Levels"
          value={kpiStats.active}
          icon={<Shield size={20} />}
          color="#10b981"
          sub="currently assignable"
        />
        <StatCard
          label="System Lock"
          value="Enabled"
          icon={<Lock size={20} />}
          color="#f59e0b"
          sub="read-only protection"
        />
        <StatCard
          label="Documentation"
          value={kpiStats.descriptions}
          icon={<Tag size={20} />}
          color="#3b82f6"
          sub="defined scopes"
        />
      </div>

      <DataTable<Role>
        title="Access Control Policies"
        subtitle="View and audit system-defined roles and their respective access scopes."
        description="Core system roles are protected and cannot be modified to ensure structural integrity and security compliance."
        data={filteredData}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        headerActions={[
          { key: "filter", label: statusFilter === 'active' ? "Active Levels" : statusFilter === 'inactive' ? "Inactive" : "All Roles", icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default RoleTable;