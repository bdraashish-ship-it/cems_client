import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw, Package, Layers, ShoppingCart, DollarSign, Filter, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllMaterialsQuery, 
  useDeleteMaterialMutation, 
  useUpdateMaterialMutation
} from "../../services/features/cemsApi";

interface Material {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
  unit_id?: number;
  unit_name?: string;
  unit_symbol?: string;
  quantity: number;
  unit_price: number;
  supplier: string;
  description?: string;
  is_active: boolean;
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
const buildColumns = (): ColumnDef<Material>[] => [
  {
    accessorKey: "name",
    header: "Material / Resource",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6366f1", border: "1px solid #e2e8f0"
        }}>
          <Package size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            <Layers size={10} style={{ color: "#6366f1" }} /> {row.original.category_name || "Unclassified"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Stock Level",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: row.original.quantity < 10 ? "#ef4444" : "#0f172a" }}>
          {row.original.quantity}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "4px", display: "inline-flex", alignItems: "center", gap: "2px" }}>
          <Scale size={10} /> {row.original.unit_symbol || row.original.unit_name || "Units"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "unit_price",
    header: "Unit Cost",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
        NPR {getValue<number>().toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Primary Vendor",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#475569", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
        <ShoppingCart size={12} style={{ color: "#94a3b8" }} />
        {getValue<string>()}
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
          {active ? "In Use" : "Archived"}
        </span>
      );
    },
  },
];

const AllMaterials: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllMaterialsQuery({});
  const [deleteMaterial] = useDeleteMaterialMutation();
  const [updateMaterial] = useUpdateMaterialMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allMaterials: Material[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const totalItems = allMaterials.length;
    const totalValue = allMaterials.reduce((acc, m) => acc + (m.quantity * (m.unit_price || 0)), 0);
    const lowStock = allMaterials.filter(m => m.quantity < 10).length;
    const categories = new Set(allMaterials.map(m => m.category_id)).size;
    return { totalItems, totalValue, lowStock, categories };
  }, [allMaterials]);

  const materials = useMemo(() => {
    let result = allMaterials;
    if (statusFilter === "active") result = result.filter(m => m.is_active);
    else if (statusFilter === "inactive") result = result.filter(m => !m.is_active);
    return result;
  }, [allMaterials, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "In Stock/Active"
      : statusFilter === "inactive" ? "Archived"
        : "Full Inventory";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (material: Material) => navigate(`/resources/materials/edit/${material.id}`);
  const handleAdd = () => navigate("/resources/materials/create");

  const handleDelete = async (material: Material) => {
    if (window.confirm(`Remove "${material.name}" from inventory?`)) {
      try {
        await deleteMaterial(material.id).unwrap();
      } catch {
        alert("Failed to delete material.");
      }
    }
  };

  const handleToggleStatus = async (material: Material) => {
    try {
      await updateMaterial({ id: material.id, data: { is_active: !material.is_active } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Inventory Items"
          value={kpiStats.totalItems}
          icon={<Package size={20} />}
          color="#6366f1"
          sub="total products"
        />
        <StatCard
          label="Total Value"
          value={`NPR ${(kpiStats.totalValue / 1000).toFixed(1)}k`}
          icon={<DollarSign size={20} />}
          color="#10b981"
          sub="stock valuation"
        />
        <StatCard
          label="Low Stock Alert"
          value={kpiStats.lowStock}
          icon={<ShoppingCart size={20} />}
          color="#ef4444"
          sub="needs attention"
        />
        <StatCard
          label="Classifications"
          value={kpiStats.categories}
          icon={<Layers size={20} />}
          color="#3b82f6"
          sub="active groups"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<Material>
        title="Inventory Ledger"
        subtitle="Real-time tracking of construction materials and site resources."
        description="Monitor stock levels, unit prices, and procurement sources for optimized site supply management."
        data={materials}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={m => m.is_active}
        headerActions={[
          { key: "add", label: "Add Material", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default AllMaterials;
