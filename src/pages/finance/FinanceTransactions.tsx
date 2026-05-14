import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Filter, RefreshCcw, TrendingUp, TrendingDown, Wallet, PieChart, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/common/DataTable/DataTable";
import { 
  useGetAllTransactionsQuery, 
  useDeleteTransactionMutation, 
  useUpdateTransactionMutation, 
} from "../../services/features/cemsApi";

interface Transaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  transaction_date: string;
  reference_number?: string;
  is_active?: boolean;
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
      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "1px" }}>{sub}</div>}
    </div>
  </div>
);

// ─── COLUMNS ────────────────────────────────────────────────────────────────
const buildColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "title",
    header: "Title / Reference",
    enableSorting: true,
    cell: ({ row }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: row.original.type.toLowerCase() === 'income' ? "#ecfdf5" : "#fef2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: row.original.type.toLowerCase() === 'income' ? "#059669" : "#dc2626",
          border: "1px solid #e2e8f0"
        }}>
          {row.original.type.toLowerCase() === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>
            {row.original.title}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
            {row.original.reference_number || "No Reference"} | {row.original.category}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    cell: ({ row }) => {
      const isIncome = row.original.type.toLowerCase() === 'income';
      return (
        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: isIncome ? "#059669" : "#1e293b", whiteSpace: "nowrap" }}>
          {isIncome ? "+" : "-"} NPR {row.original.amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ fontSize: "0.8rem", color: "#64748b", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>
        <Receipt size={12} style={{ color: "#94a3b8" }} />
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Flow",
    enableSorting: true,
    cell: ({ getValue }) => {
      const val = getValue<string>().toLowerCase();
      const isIncome = val === 'income';
      return (
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700,
          backgroundColor: isIncome ? "#ecfdf5" : "#fef2f2",
          color: isIncome ? "#059669" : "#dc2626",
          textTransform: "uppercase", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          {val}
        </span>
      );
    },
  },
];

const FinanceTransactions: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllTransactionsQuery({});
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");

  const allTransactions: Transaction[] = data?.data || [];

  // KPI Metrics
  const kpiStats = useMemo(() => {
    const totalIncome = allTransactions.filter(t => t.type.toLowerCase() === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = allTransactions.filter(t => t.type.toLowerCase() === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const categories = new Set(allTransactions.map(t => t.category)).size;
    return { totalIncome, totalExpense, balance, categories };
  }, [allTransactions]);

  const transactions = useMemo(() => {
    let result = allTransactions;
    if (statusFilter === "active") result = result.filter(t => t.is_active !== false);
    else if (statusFilter === "inactive") result = result.filter(t => t.is_active === false);
    return result;
  }, [allTransactions, statusFilter]);

  const statusLabel =
    statusFilter === "active" ? "Active Records"
    : statusFilter === "inactive" ? "Archived"
    : "All Transactions";

  const handleFilterToggle = () => {
    setStatusFilter(prev => prev === "active" ? "inactive" : prev === "inactive" ? "all" : "active");
  };

  const handleEdit = (transaction: Transaction) => navigate(`/finance/transactions/edit/${transaction.id}`);
  const handleAdd = () => navigate("/finance/transactions/create");

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm(`Permanently delete transaction record "${transaction.title}"?`)) {
      try {
        await deleteTransaction(transaction.id).unwrap();
      } catch {
        alert("Failed to delete transaction.");
      }
    }
  };

  const handleToggleStatus = async (transaction: Transaction) => {
    try {
      await updateTransaction({ id: transaction.id, data: { is_active: !transaction.is_active } }).unwrap();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          label="Current Balance"
          value={`NPR ${(kpiStats.balance / 1000).toFixed(1)}k`}
          icon={<Wallet size={20} />}
          color={kpiStats.balance >= 0 ? "#10b981" : "#ef4444"}
          sub="net cash flow"
        />
        <StatCard
          label="Total Income"
          value={`NPR ${(kpiStats.totalIncome / 1000).toFixed(1)}k`}
          icon={<TrendingUp size={20} />}
          color="#059669"
          sub="revenue logs"
        />
        <StatCard
          label="Total Expenses"
          value={`NPR ${(kpiStats.totalExpense / 1000).toFixed(1)}k`}
          icon={<TrendingDown size={20} />}
          color="#dc2626"
          sub="spending logs"
        />
        <StatCard
          label="Head Categories"
          value={kpiStats.categories}
          icon={<PieChart size={20} />}
          color="#6366f1"
          sub="budget classification"
        />
      </div>

      {/* ── DataTable ──────────────────────────────────────────── */}
      <DataTable<Transaction>
        title="Financial Ledger"
        subtitle="Comprehensive tracking of all project-related incomes and expenses."
        description="Monitor cash flow, categorize spending, and maintain a verifiable digital audit trail of financial activity."
        data={transactions}
        columns={buildColumns()}
        pageSize={10}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getStatus={t => t.is_active !== false}
        headerActions={[
          { key: "add", label: "Add Record", icon: <Plus size={18} />, onClick: handleAdd },
          { key: "filter", label: statusLabel, icon: <Filter size={18} />, onClick: handleFilterToggle },
          { key: "refresh", label: "Sync", icon: <RefreshCcw size={18} />, onClick: () => refetch() },
        ]}
      />
    </div>
  );
};

export default FinanceTransactions;
