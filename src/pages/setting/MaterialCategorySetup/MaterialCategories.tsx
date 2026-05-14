import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Layers, RefreshCcw, Plus, Filter } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { 
  useGetAllMaterialCategoriesQuery, 
  useDeleteMaterialCategoryMutation,
  useToggleMaterialCategoryStatusMutation 
} from "../../../services/features/cemsApi";

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Category Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6366f1", border: "1px solid #e2e8f0"
        }}>
          <Layers size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            {row.original.description || "Project Material Classification"}
          </div>
        </div>
      </div>
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

const MaterialCategories: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllMaterialCategoriesQuery();
  const [deleteCategory] = useDeleteMaterialCategoryMutation();
  const [toggleStatus] = useToggleMaterialCategoryStatusMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allCategories = response?.data ?? [];

  const categories = useMemo(() => {
    let result = allCategories;
    if (statusFilter === "active") result = result.filter((cat: any) => cat.is_active);
    else if (statusFilter === "inactive") result = result.filter((cat: any) => !cat.is_active);
    return result;
  }, [allCategories, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Categories"
      : statusFilter === "inactive" ? "Archived/Inactive"
        : "Full Classification";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (cat: any) => navigate(`/settings/material-categories/edit/${cat.id}`);
  
  const handleDelete = async (cat: any) => {
    if (window.confirm(`Are you sure you want to remove the category '${cat.name}'?`)) {
      try {
          await deleteCategory(cat.id).unwrap();
      } catch (err) {
          alert("Failed to delete category.");
      }
    }
  };

  const handleToggleStatus = async (cat: any) => {
    try {
      await toggleStatus({ id: cat.id, is_active: !cat.is_active }).unwrap();
    } catch {
      alert("Failed to update category status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Material Classifications"
        subtitle="Organize construction materials into logical groups (e.g., Raw Materials, Finished Goods)."
        description="Categories help in filtering inventory, generating reports, and tracking project expenses by material type."
        data={categories}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={(cat) => cat.is_active}
        headerActions={[
          { key: "add", label: "Add New Category", icon: <Plus size={18} />, onClick: () => navigate("/settings/material-categories/create") },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default MaterialCategories;
