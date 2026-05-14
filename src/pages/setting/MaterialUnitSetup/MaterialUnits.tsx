import React from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Scale, RefreshCcw, Plus } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { 
  useGetAllMaterialUnitsQuery, 
  useDeleteMaterialUnitMutation,
  useToggleMaterialUnitStatusMutation 
} from "../../../services/features/cemsApi";

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Unit Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#4f46e5", border: "1px solid #e2e8f0"
        }}>
          <Scale size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            Standard Measurement Unit
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ getValue }) => (
      <code style={{ fontSize: "0.85rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", color: "#6366f1", fontWeight: 700 }}>
        {getValue<string>() || "—"}
      </code>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Availability",
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

const MaterialUnits: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllMaterialUnitsQuery();
  const [deleteUnit] = useDeleteMaterialUnitMutation();
  const [toggleStatus] = useToggleMaterialUnitStatusMutation();
  const units = response?.data ?? [];

  const handleEdit = (unit: any) => navigate(`/settings/material-units/edit/${unit.id}`);
  
  const handleDelete = async (unit: any) => {
    if (window.confirm(`Are you sure you want to remove the unit '${unit.name}'?`)) {
      try {
          await deleteUnit(unit.id).unwrap();
      } catch (err) {
          alert("Failed to delete unit.");
      }
    }
  };

  const handleToggleStatus = async (unit: any) => {
    try {
      await toggleStatus({ id: unit.id, is_active: !unit.is_active }).unwrap();
    } catch {
      alert("Failed to update unit status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Material Measurement Units"
        subtitle="Manage units of measurement for materials (e.g., kg, ton, meter)."
        description="These units are used across the system for material tracking and inventory management."
        data={units}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={(unit) => unit.is_active}
        headerActions={[
          { key: "add", label: "Add New Unit", icon: <Plus size={18} />, onClick: () => navigate("/settings/material-units/create") },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default MaterialUnits;
