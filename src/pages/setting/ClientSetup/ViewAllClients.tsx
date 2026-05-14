import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Filter, RefreshCcw, Building2, UserCheck, MapPin, Eye, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { 
  useGetAllClientsQuery, 
  useDeleteClientMutation, 
  useUpdateClientMutation 
} from "../../../services/features/cemsApi";

interface Client {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  photo?: string;
  occupation?: string;
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
const buildColumns = (onView: (id: number) => void): ColumnDef<Client>[] => [
  {
    accessorKey: "photo",
    header: "Profile",
    cell: ({ row }) => {
      const photo = row.original.photo;
      const url = photo ? `http://127.0.0.1:8000/api/v1/uploads/profile_photos/${photo}` : null;
      return (
        <div style={{ 
          width: "36px", 
          height: "36px", 
          borderRadius: "8px", 
          overflow: "hidden", 
          background: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e2e8f0"
        }}>
          {url ? (
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={18} color="#94a3b8" />
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "name",
    header: "Client Entity",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
          {row.original.name}
        </div>
        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
          {row.original.occupation || row.original.contact_person || "Individual"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact Details",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ fontSize: "0.8rem", color: "#475569", whiteSpace: "nowrap", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span>{row.original.email || "No Email"}</span>
        <span style={{ fontWeight: 600, color: "#6366f1" }}>{row.original.phone || "No Phone"}</span>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Location",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>
        <MapPin size={12} style={{ color: "#94a3b8" }} />
        {row.original.address || "N/A"}
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
  {
    id: "actions_view",
    header: "View",
    cell: ({ row }) => (
      <button 
        onClick={() => onView(row.original.id)}
        style={{ 
          background: "none", 
          border: "none", 
          cursor: "pointer", 
          color: "#6366f1", 
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <Eye size={18} />
      </button>
    )
  }
];

const ViewAllClients: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllClientsQuery({});
  const [deleteClient] = useDeleteClientMutation();
  const [updateClient] = useUpdateClientMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allClients: Client[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const total = allClients.length;
    const active = allClients.filter(c => c.is_active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [allClients]);

  const clients = useMemo(() => {
    let result = allClients;
    if (statusFilter === "active") result = result.filter(c => c.is_active);
    else if (statusFilter === "inactive") result = result.filter(c => !c.is_active);
    return result;
  }, [allClients, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Clients"
    : statusFilter === "inactive" ? "Inactive"
    : "All Clients";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (client: Client) => navigate(`/settings/clients/edit/${client.id}`);
  const handleAdd = () => navigate("/settings/clients/create");
  const handleView = (id: number) => navigate(`/settings/clients/view/${id}`);

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Permanently delete client "${client.name}"?`)) {
      try {
        await deleteClient(client.id).unwrap();
      } catch {
        alert("Failed to delete client.");
      }
    }
  };

  const handleToggleStatus = async (client: Client) => {
    try {
      await updateClient({ id: client.id, data: { is_active: !client.is_active } }).unwrap();
    } catch {
      alert("Failed to update client status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Total Clients"
          value={kpiStats.total}
          icon={<Building2 size={20} />}
          color="#6366f1"
          sub="registered"
        />
        <StatCard
          label="Active Partners"
          value={kpiStats.active}
          icon={<UserCheck size={20} />}
          color="#10b981"
          sub="ongoing relations"
        />
        <StatCard
          label="Inactive"
          value={kpiStats.inactive}
          icon={<RefreshCcw size={20} />}
          color="#f59e0b"
          sub="archived/paused"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<Client>
        title="Client Directory"
        subtitle="Enterprise-wide registry of our business partners and individual house-making clients."
        description="Manage personal details, family information, citizenship records, and service requirements."
        data={clients}
        columns={buildColumns(handleView)}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={client => client.is_active}
        headerActions={[
          { key: "add", label: "New Client", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default ViewAllClients;
