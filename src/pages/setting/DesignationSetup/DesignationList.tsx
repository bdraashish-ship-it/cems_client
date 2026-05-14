import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, CheckCircle2, 
  AlertCircle, Briefcase, Users, Filter, RefreshCcw
} from "lucide-react";
import { 
  useGetAllDesignationsQuery, 
  useDeleteDesignationMutation,
  useToggleDesignationMutation
} from "../../../services/features/cemsApi";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { DataTable } from "../../../components/common/DataTable/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const DesignationList = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllDesignationsQuery();
  const [deleteDesignation, { isLoading: isDeleting }] = useDeleteDesignationMutation();
  const [toggleDesignation] = useToggleDesignationMutation();
  
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  const allDesignations = data?.data || [];

  const filteredData = useMemo(() => {
    let result = allDesignations;
    if (statusFilter === "active") result = result.filter((item: any) => item.is_active);
    else if (statusFilter === "inactive") result = result.filter((item: any) => !item.is_active);
    return result;
  }, [allDesignations, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Roles"
      : statusFilter === "inactive" ? "Archived/Inactive"
        : "All Designations";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleToggle = async (item: any) => {
    try {
      await toggleDesignation({ id: item.id, is_active: !item.is_active }).unwrap();
    } catch (err) {
      console.error("Failed to toggle designation:", err);
    }
  };

  const handleDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteDesignation(deleteModal.id).unwrap();
        setDeleteModal({ isOpen: false, id: null });
        refetch();
      } catch (err) {
        console.error("Failed to delete designation:", err);
      }
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Designation Name",
      cell: (info) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => (
        <div style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: "400px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {(info.getValue() as string) || "—"}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Visibility",
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <span style={{ 
            color: isActive ? "#10b981" : "#94a3b8", 
            fontSize: "0.8rem", 
            fontWeight: 600, 
            display: "flex", 
            alignItems: "center", 
            gap: "4px" 
          }}>
            {isActive ? <><CheckCircle2 size={14} /> Active</> : "Disabled"}
          </span>
        );
      },
    },
  ], []);

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Staff Designations</h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "0.95rem" }}>
            Define roles and positions for employees within the organization.
          </p>
        </div>
        <button 
          onClick={() => navigate("/settings/designations/create")}
          style={{ 
            background: "linear-gradient(135deg, #6366f1, #4f46e5)", 
            color: "#fff", 
            padding: "12px 24px", 
            borderRadius: "12px", 
            border: "none", 
            fontWeight: 700, 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
          }}
        >
          <Plus size={20} /> Create Designation
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Total Roles", value: data?.data?.length || 0, icon: <Briefcase size={20} />, color: "#6366f1" },
          { label: "Active Positions", value: data?.data?.filter((s: any) => s.is_active).length || 0, icon: <Users size={20} />, color: "#10b981" },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${stat.color}15`, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        onEdit={(item) => navigate(`/settings/designations/edit/${item.id}`)}
        onDelete={(item) => setDeleteModal({ isOpen: true, id: item.id })}
        onToggleStatus={handleToggle}
        getStatus={(item) => item.is_active}
        pageSize={10}
        headerActions={[
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Delete Designation"
        size="sm"
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AlertCircle size={32} color="#dc2626" />
          </div>
          <h3 style={{ margin: "0 0 8px 0" }}>Confirm Deletion</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
            Are you sure you want to delete this designation? This may affect employees currently assigned to this role.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, id: null })} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting} style={{ flex: 1 }}>
              {isDeleting ? "Deleting..." : "Delete Designation"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DesignationList;
