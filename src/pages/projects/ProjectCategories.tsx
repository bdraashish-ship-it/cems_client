import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw, Tag, Palette, FileText, Hash, ToggleLeft, ToggleRight, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { DataTable } from "../../components/common/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProjectCategoriesQuery,
  useUpdateProjectCategoryMutation,
  useDeleteProjectCategoryMutation,
} from "../../services/features/cemsApi";

interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at?: string;
}

const ProjectCategories = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllProjectCategoriesQuery();
  const [updateCategory] = useUpdateProjectCategoryMutation();
  const [deleteCategory] = useDeleteProjectCategoryMutation();

  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const categories: ProjectCategory[] = useMemo(() => {
    const raw: ProjectCategory[] = data?.data || [];
    if (filterActive === "active") return raw.filter(c => c.is_active);
    if (filterActive === "inactive") return raw.filter(c => !c.is_active);
    return raw;
  }, [data, filterActive]);

  const columns: ColumnDef<ProjectCategory>[] = [
    {
      id: "badge",
      header: "Category",
      enableSorting: false,
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700,
            background: cat.color || "#6366f1", color: "#fff", whiteSpace: "nowrap",
          }}>
            {cat.name}
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }}>{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: ({ getValue }) => {
        const desc = getValue<string>();
        return desc
          ? <span style={{ color: "#64748b", fontSize: "0.83rem" }}>{desc.length > 60 ? desc.slice(0, 60) + "…" : desc}</span>
          : <span style={{ color: "#cbd5e1", fontSize: "0.78rem" }}>—</span>;
      },
    },
    {
      id: "color",
      header: "Color",
      enableSorting: false,
      cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: row.original.color || "#6366f1",
            border: "2px solid #e2e8f0", flexShrink: 0
          }} />
          <code style={{ fontSize: "0.75rem", color: "#64748b" }}>{row.original.color || "—"}</code>
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
            padding: "3px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
            background: active ? "#dcfce7" : "#fee2e2",
            color: active ? "#166534" : "#991b1b",
            textTransform: "uppercase", letterSpacing: "0.04em",
            display: "inline-flex", alignItems: "center", gap: "4px",
          }}>
            {active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "projects_count",
      header: "Projects",
      enableSorting: false,
      cell: () => (
        <span style={{
          padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 600,
          background: "#f1f5f9", color: "#475569",
        }}>
          —
        </span>
      ),
    },
  ];

  const handleEdit = (cat: ProjectCategory) => {
    navigate(`/projects/categories/edit/${cat.id}`);
  };

  const handleDelete = async (cat: ProjectCategory) => {
    if (window.confirm(`Delete category "${cat.name}"? Projects using this category will be unlinked.`)) {
      try {
        await deleteCategory(cat.id).unwrap();
      } catch {
        alert("Failed to delete category. It may be in use by projects.");
      }
    }
  };

  const handleToggleStatus = async (cat: ProjectCategory) => {
    try {
      await updateCategory({ id: cat.id, data: { is_active: !cat.is_active } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  const filterLabel =
    filterActive === "all" ? "All Categories"
    : filterActive === "active" ? "Active Only"
    : "Inactive Only";

  return (
    <>
      <div style={{ padding: "24px" }}>
        <DataTable<ProjectCategory>
          title="Project Category Management"
          subtitle="Define and manage classification categories for all civil engineering projects."
          description="Categories drive filtering, reporting, and AI-powered project suggestions. Add color-coded badges to enhance visual clarity."
          data={categories}
          columns={columns}
          pageSize={12}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          getStatus={(cat) => cat.is_active}
          headerActions={[
            {
              key: "add",
              label: "Add Category",
              icon: <Plus size={18} />,
              onClick: () => navigate("/projects/categories/create"),
            },
            {
              key: "filter",
              label: filterLabel,
              icon: <Tag size={18} />,
              onClick: () => setFilterActive(prev =>
                prev === "all" ? "active" : prev === "active" ? "inactive" : "all"
              ),
            },
            { key: "refresh", label: "Refresh", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
          ]}
        />
      </div>
    </>
  );
};

export default ProjectCategories;
