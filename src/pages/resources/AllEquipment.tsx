import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw, Truck, Settings, Activity, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllEquipmentsQuery, 
  useDeleteEquipmentMutation, 
  useUpdateEquipmentMutation, 
} from "../../services/features/cemsApi";

interface Equipment {
  id: number;
  name: string;
  type: string;
  serial_number: string;
  model: string;
  daily_rate: number;
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
const buildColumns = (): ColumnDef<Equipment>[] => [
  {
    accessorKey: "name",
    header: "Asset / Machinery",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0284c7", border: "1px solid #e2e8f0"
        }}>
          <Truck size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            {row.original.model} | {row.original.type}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "serial_number",
    header: "Serial / VIN",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600, fontFamily: "monospace", whiteSpace: "nowrap" }}>
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "daily_rate",
    header: "Daily Rate",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
        NPR {getValue<number>().toLocaleString()}
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
          backgroundColor: active ? "#ecfdf5" : "#fff7ed",
          color: active ? "#059669" : "#c2410c",
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {active ? "Operational" : "Under Maintenance"}
        </span>
      );
    },
  },
];

const AllEquipment: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllEquipmentsQuery({});
  const [deleteEquipment] = useDeleteEquipmentMutation();
  const [updateEquipment] = useUpdateEquipmentMutation();

  const allEquipments: Equipment[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const totalAssets = allEquipments.length;
    const operational = allEquipments.filter(e => e.is_active).length;
    const maintenance = totalAssets - operational;
    const totalRate = allEquipments.reduce((acc, e) => acc + e.daily_rate, 0);
    return { totalAssets, operational, maintenance, totalRate };
  }, [allEquipments]);

  const handleEdit = (equipment: Equipment) => navigate(`/resources/equipment/edit/${equipment.id}`);
  const handleAdd = () => navigate("/resources/equipment");

  const handleDelete = async (equipment: Equipment) => {
    if (window.confirm(`Permanently decommission asset "${equipment.name}"?`)) {
      try {
        await deleteEquipment(equipment.id).unwrap();
      } catch {
        alert("Failed to delete equipment.");
      }
    }
  };

  const handleToggleStatus = async (equipment: Equipment) => {
    try {
      await updateEquipment({ id: equipment.id, data: { is_active: !equipment.is_active } }).unwrap();
    } catch {
      alert("Failed to update equipment status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Total Fleet"
          value={kpiStats.totalAssets}
          icon={<Truck size={20} />}
          color="#6366f1"
          sub="heavy machinery"
        />
        <StatCard
          label="Operational"
          value={kpiStats.operational}
          icon={<Activity size={20} />}
          color="#10b981"
          sub="site ready"
        />
        <StatCard
          label="In Maintenance"
          value={kpiStats.maintenance}
          icon={<Settings size={20} />}
          color="#f59e0b"
          sub="servicing"
        />
        <StatCard
          label="Daily Rental Capacity"
          value={`NPR ${(kpiStats.totalRate / 1000).toFixed(1)}k`}
          icon={<DollarSign size={20} />}
          color="#0ea5e9"
          sub="potential daily cost"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<Equipment>
        title="Fleet Inventory"
        subtitle="Management of heavy machinery, vehicles, and construction equipment."
        description="Track operational status, serial numbers, and daily rental rates for site resource planning."
        data={allEquipments}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={eq => eq.is_active}
        headerActions={[
          { key: "add", label: "Add Equipment", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default AllEquipment;
