import React from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { 
  Plus, 
  RefreshCcw, 
  Truck, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from "lucide-react";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllMaterialDetailsQuery, 
  useDeleteMaterialDetailMutation,
  useToggleMaterialDetailStatusMutation 
} from "../../services/features/cemsApi";

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "material_name",
    header: "Resource Allocated",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6366f1", border: "1px solid #e2e8f0"
        }}>
          <Truck size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.material_name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            <Calendar size={10} /> {row.original.delivery_start_date || "Scheduled Soon"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "project_name",
    header: "Destination",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
          <Briefcase size={12} style={{ color: "#94a3b8" }} />
          {row.original.project_name}
        </div>
        {row.original.site_name && (
          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={10} style={{ color: "#ef4444" }} />
            {row.original.site_name}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "order_quantity",
    header: "Allocation",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
          {row.original.order_quantity} Units
        </div>
        <div style={{ fontSize: "0.72rem", color: row.original.is_received ? "#10b981" : "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
          {row.original.is_received ? <CheckCircle2 size={10} /> : <Clock size={10} />}
          {row.original.is_received ? `Received (${row.original.received_quantity})` : "Pending Delivery"}
        </div>
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
          backgroundColor: active ? "#ecfdf5" : "#f1f5f9",
          color: active ? "#059669" : "#64748b",
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {active ? "Active" : "Completed"}
        </span>
      );
    },
  },
];

const MaterialAssignments: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllMaterialDetailsQuery();
  const [deleteAssignment] = useDeleteMaterialDetailMutation();
  const [toggleStatus] = useToggleMaterialDetailStatusMutation();
  const assignments = response?.data ?? [];

  const handleEdit = (item: any) => navigate(`/resources/assignments/edit/${item.id}`);
  
  const handleDelete = async (item: any) => {
    if (window.confirm(`Revoke this material allocation for '${item.material_name}'?`)) {
      try {
          await deleteAssignment(item.id).unwrap();
      } catch (err) {
          alert("Failed to revoke assignment.");
      }
    }
  };

  const handleToggleStatus = async (item: any) => {
    try {
      await toggleStatus({ id: item.id, is_active: !item.is_active }).unwrap();
    } catch {
      alert("Failed to update assignment status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Material Allocations"
        subtitle="Manage resource distribution across active engineering sites and projects."
        description="Track logistics, verify deliveries, and monitor inventory movement from warehouse to site."
        data={assignments}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={(item) => item.is_active}
        headerActions={[
          { key: "add", label: "New Allocation", icon: <Plus size={18} />, onClick: () => navigate("/resources/assignments/create") },
          { key: "refresh", label: "Sync Logistics", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default MaterialAssignments;
