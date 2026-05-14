import React from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Briefcase, RefreshCcw, Plus, Edit, Trash2 } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { useGetAllDesignationsQuery, useDeleteDesignationMutation } from "../../../services/features/cemsApi";

const buildColumns = (onEdit: (id: number) => void, onDelete: (id: number) => void): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Designation Title",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#f97316", border: "1px solid #ffedd5"
        }}>
          <Briefcase size={16} />
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
    header: "Role Scope",
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
        {getValue<string>() || "Official corporate designation."}
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

const Designations: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllDesignationsQuery();
  const [deleteDesignation] = useDeleteDesignationMutation();
  const designations = response?.data ?? [];

  const handleEdit = (id: number) => navigate(`/settings/designations/edit/${id}`);
  const handleDelete = async (id: number) => {
      try {
          await deleteDesignation(id).unwrap();
      } catch (err) {
          alert("Failed to delete designation.");
      }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Employee Designations"
        subtitle="Manage official job titles and roles within the company."
        description="Designations are used to categorize employees and define their official capacity."
        data={designations}
        columns={buildColumns(handleEdit, handleDelete)}
        pageSize={10}
        isLoading={isLoading}
        headerActions={[
          { key: "add", label: "Add Designation", icon: <Plus size={18} />, onClick: () => navigate("/settings/designations/create") },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default Designations;
