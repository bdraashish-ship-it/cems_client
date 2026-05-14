import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, CheckCircle2, 
  AlertCircle, Activity, Tag, Filter, RefreshCcw
} from "lucide-react";
import { 
  useGetAllProjectStatusesQuery, 
  useDeleteProjectStatusMutation,
  useToggleProjectStatusMutation
} from "../../../services/features/cemsApi";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { DataTable } from "../../../components/common/DataTable/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

const StatusList = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllProjectStatusesQuery();
  const [deleteStatus, { isLoading: isDeleting }] = useDeleteProjectStatusMutation();
  const [toggleStatus] = useToggleProjectStatusMutation();
  
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  const allStatuses = data?.data || [];

  const filteredData = useMemo(() => {
    let result = allStatuses;
    if (statusFilter === "active") result = result.filter((s: any) => s.is_active);
    else if (statusFilter === "inactive") result = result.filter((s: any) => !s.is_active);
    return result;
  }, [allStatuses, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Statuses"
      : statusFilter === "inactive" ? "Archived/Inactive"
        : "All Workflow States";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleToggle = async (status: any) => {
    try {
      await toggleStatus({ id: status.id, is_active: !status.is_active }).unwrap();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteStatus(deleteModal.id).unwrap();
        setDeleteModal({ isOpen: false, id: null });
        refetch();
      } catch (err) {
        console.error("Failed to delete status:", err);
      }
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Status Name",
      cell: (info) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "color_code",
      header: "Theme Color",
      cell: (info) => {
        const color = (info.getValue() as string) || "#6366f1";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "24px", 
              height: "24px", 
              borderRadius: "6px", 
              background: color,
              border: "2px solid #fff",
              boxShadow: "0 0 0 1px #e2e8f0"
            }} />
            <code style={{ fontSize: "0.8rem", color: "#64748b", background: "#f8fafc", padding: "2px 6px", borderRadius: "4px" }}>
              {color}
            </code>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => (
        <div style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {(info.getValue() as string) || "—"}
        </div>
      ),
    },
    {
      accessorKey: "module",
      header: "Category",
      cell: (info) => (
        <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
          {(info.getValue() as string) || "General"}
        </span>
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Workflow Statuses</h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "0.95rem" }}>
            Manage lifecycle states for projects, sites, and tasks across the system.
          </p>
        </div>
        <button 
          onClick={() => navigate("/settings/statuses/create")}
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
          <Plus size={20} /> Create New Status
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Total Statuses", value: data?.data?.length || 0, icon: <Activity size={20} />, color: "#6366f1" },
          { label: "Active States", value: data?.data?.filter((s: any) => s.is_active).length || 0, icon: <CheckCircle2 size={20} />, color: "#10b981" },
          { label: "Used Globally", value: "System-wide", icon: <Tag size={20} />, color: "#f59e0b" }
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

      {/* DataTable Integration */}
      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        onEdit={(status) => navigate(`/settings/statuses/edit/${status.id}`)}
        onDelete={(status) => setDeleteModal({ isOpen: true, id: status.id })}
        onToggleStatus={handleToggle}
        getStatus={(status) => status.is_active}
        pageSize={10}
        headerActions={[
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Delete Status"
        size="sm"
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AlertCircle size={32} color="#dc2626" />
          </div>
          <h3 style={{ margin: "0 0 8px 0" }}>Confirm Deletion</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
            Are you sure you want to delete this status? This may affect projects or tasks currently using this workflow state.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, id: null })} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting} style={{ flex: 1 }}>
              {isDeleting ? "Deleting..." : "Delete Status"}
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StatusList;
