import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw, Filter, ShieldCheck, Users, Mail, Phone, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { 
  useGetAllUsersQuery, 
  useUpdateUserMutation
} from "../../../services/features/cemsApi";
import type { SoftwareUser } from "../../../types/user";
import { FILE_BASE } from "../../../redux/types/baseUrl";



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
const buildColumns = (): ColumnDef<SoftwareUser>[] => [
  {
    id: "user",
    header: "Identity & Role",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        {row.original.profile_photo ? (
          <img
            src={`${FILE_BASE}/api/v1/uploads/profile_photos/${row.original.profile_photo}`}
            alt="Profile"
            style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid #e2e8f0" }}
          />
        ) : (
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 700
          }}>
            {row.original.first_name?.[0]}{row.original.last_name?.[0]}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.first_name} {row.original.last_name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={10} /> {row.original.role}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact Info",
    cell: ({ row }) => (
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontSize: "0.8rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
          <Mail size={12} style={{ color: "#94a3b8" }} />
          {row.original.email}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
          <Phone size={12} style={{ color: "#94a3b8" }} />
          {row.original.phone_number}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "has_software_access",
    header: "System Access",
    cell: ({ getValue }) => {
      const has = getValue<boolean>();
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: has ? "#ecfdf5" : "#f1f5f9",
          color: has ? "#059669" : "#64748b",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}>
          {has ? "Granted" : "Profile Only"}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Account Status",
    cell: ({ getValue }) => {
      const active = getValue<boolean>();
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: active ? "#ecfdf5" : "#fef2f2",
          color: active ? "#059669" : "#dc2626",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}>
          {active ? "Active" : "Suspended"}
        </span>
      );
    },
  },
];

const ViewAllUsers: React.FC = () => {
  const navigate = useNavigate();
  
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useGetAllUsersQuery({ page, page_size: pageSize });
  const [updateUser] = useUpdateUserMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allUsers: SoftwareUser[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter(u => u.is_active).length;
    const withAccess = allUsers.filter(u => u.has_software_access).length;
    const suspended = total - active;
    return { total, active, withAccess, suspended };
  }, [allUsers]);

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return allUsers;
    if (statusFilter === "active") return allUsers.filter(u => u.is_active);
    return allUsers.filter(u => !u.is_active);
  }, [allUsers, statusFilter]);

  // Direct Navigation (No Modal)
  const handleRegisterUser = () => {
    navigate("/settings/users/create");
  };

  const handleEdit = (user: SoftwareUser) => {
    navigate(`/settings/users/edit/${user.id}`);
  };

  const handleToggleStatus = async (user: SoftwareUser) => {
    try {
      const formData = new FormData();
      formData.append("is_active", (!user.is_active).toString());
      await updateUser({ id: user.id, data: formData }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* KPI Stats */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard label="Total Personnel" value={kpiStats.total} icon={<Users size={20} />} color="#6366f1" sub="registered profiles" />
        <StatCard label="Active Users" value={kpiStats.active} icon={<UserCheck size={20} />} color="#10b981" sub="operational" />
        <StatCard label="System Access" value={kpiStats.withAccess} icon={<ShieldCheck size={20} />} color="#3b82f6" sub="login enabled" />
        <StatCard label="Suspended" value={kpiStats.suspended} icon={<Filter size={20} />} color="#ef4444" sub="access revoked" />
      </div>

      {/* DataTable */}
      <DataTable<SoftwareUser>
        title="Administrative Directory"
        subtitle="Enterprise-wide user management, access control, and personnel auditing."
        description="Manage software user accounts, assign system roles, and monitor account activity levels for security compliance."
        data={filteredData}
        columns={buildColumns()}
        pageSize={pageSize}
        currentPage={page}
        totalCount={data?.totalcount || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        getStatus={u => u.is_active}
        headerActions={[
          { 
            key: "add", 
            label: "Register User", 
            icon: <Plus size={18} />, 
            onClick: handleRegisterUser     // ← Now routes to full page
          },
          { 
            key: "filter", 
            label: statusFilter === 'active' ? "Active Only" : statusFilter === 'inactive' ? "Archived" : "All Users", 
            icon: <Filter size={18} />, 
            onClick: () => setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active") 
          },
          { 
            key: "refresh", 
            label: "Sync", 
            icon: <RefreshCcw size={18} />, 
            onClick: () => refetch() 
          },
        ]}
      />
    </div>
  );
};

export default ViewAllUsers;