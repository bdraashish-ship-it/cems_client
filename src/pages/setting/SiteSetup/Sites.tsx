import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, RefreshCcw, Plus, MapPin, CheckCircle2, Clock, Filter } from "lucide-react";

import { DataTable } from "../../../components/common/DataTable/DataTable";
import { useGetAllSitesQuery, useDeleteSiteMutation, useUpdateSiteMutation } from "../../../services/features/cemsApi";

const buildColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Site Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)"
        }}>
          <Building2 size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={10} /> Active Work Area
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Operational Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const isActive = status === "active";
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: isActive ? "#ecfdf5" : "#fef2f2",
          color: isActive ? "#059669" : "#dc2626",
          display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "uppercase"
        }}>
          {isActive ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {status}
        </span>
      );
    },
  },
];

const Sites: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllSitesQuery();
  const [deleteSite] = useDeleteSiteMutation();
  const [updateSite] = useUpdateSiteMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allSites = response?.data ?? [];

  const sites = useMemo(() => {
    let result = allSites;
    if (statusFilter === "active") result = result.filter((s: any) => s.status === "active");
    else if (statusFilter === "inactive") result = result.filter((s: any) => s.status !== "active");
    return result;
  }, [allSites, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Sites"
      : statusFilter === "inactive" ? "Completed/Inactive"
        : "Full Portfolio";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (site: any) => navigate(`/settings/sites/edit/${site.id}`);
  
  const handleDelete = async (site: any) => {
    if (window.confirm(`Are you sure you want to delete ${site.name}?`)) {
      try {
        await deleteSite(site.id).unwrap();
      } catch (err) {
        alert("Failed to delete site.");
      }
    }
  };

  const handleToggleStatus = async (site: any) => {
    try {
      const newStatus = site.status === "active" ? "inactive" : "active";
      await updateSite({ id: site.id, data: { status: newStatus } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <DataTable<any>
        title="Construction Sites"
        subtitle="Overview of all active and planned construction sites."
        description="Monitor site status, assigned supervisors, and location data."
        data={sites}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={(site) => site.status === "active"}
        headerActions={[
          { key: "add", label: "Establish New Site", icon: <Plus size={18} />, onClick: () => navigate("/settings/sites/create") },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default Sites;
