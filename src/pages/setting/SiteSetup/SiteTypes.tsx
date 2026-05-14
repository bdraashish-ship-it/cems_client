import React from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutGrid, RefreshCcw, Plus, Edit, Trash2 } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { useGetAllSiteTypesQuery, useDeleteSiteTypeMutation } from "../../../services/features/cemsApi";

const buildColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Site Type",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#10b981", border: "1px solid #d1fae5"
        }}>
          <LayoutGrid size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
        {getValue<string>() || "No description provided."}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <button 
          onClick={() => onEdit(row.original.id)}
          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#6366f1" }}
          title="Edit"
        >
          <Edit size={14} />
        </button>
        <button 
          onClick={() => { if(window.confirm("Are you sure?")) onDelete(row.original.id) }}
          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fff", cursor: "pointer", color: "#ef4444" }}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )
  }
];

const SiteTypes: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllSiteTypesQuery();
  const [deleteType] = useDeleteSiteTypeMutation();
  const types = response?.data ?? [];

  const handleEdit = (id: number) => navigate(`/settings/site-types/edit/${id}`);
  const handleDelete = async (id: number) => {
      try {
          await deleteType(id).unwrap();
      } catch (err) {
          alert("Failed to delete site type.");
      }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Construction Site Categories"
        subtitle="Define different types of construction sites (e.g., Office, Storage, Fabrication)."
        description="Site categories help in organizing site-specific logs and reports."
        data={types}
        columns={buildColumns(handleEdit, handleDelete)}
        pageSize={10}
        isLoading={isLoading}
        headerActions={[
          { key: "add", label: "Add New Category", icon: <Plus size={18} />, onClick: () => navigate("/settings/site-types/create") },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default SiteTypes;
