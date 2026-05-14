// src/components/common/DataTable/DataTable.tsx
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { Edit, Power, ChevronUp, ChevronDown, Maximize2, Minimize2, MoreVertical } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "./dataTable.css";

export interface DataTableHeaderAction {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  visible?: boolean;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  title?: string;
  subtitle?: string;
  description?: string;
  pageSize?: number;

  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onToggleStatus?: (row: TData) => void;
  getStatus?: (row: TData) => boolean;

  defaultSorting?: SortingState;
  headerActions?: DataTableHeaderAction[];

  currentPage?: number; // 1-based
  totalCount?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  customHeaderElements?: React.ReactNode;
}

export function DataTable<TData>({
  data,
  columns,
  title,
  subtitle,
  description,
  pageSize = 10,
  onEdit,
  onDelete,
  onToggleStatus,
  getStatus,
  defaultSorting = [],
  headerActions = [],
  currentPage,
  totalCount,
  onPageChange,
  isLoading = false,
  customHeaderElements,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  // Sync with global navigation search
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setGlobalFilter(query);
    }
  }, [searchParams]);

  const actionColumn: ColumnDef<TData> | null =
    onEdit || onDelete || onToggleStatus
      ? {
          id: "actions",
          header: "Actions",
          size: 80,
          enableSorting: false,
          cell: ({ row }) => {
            const rowId = row.id;
            const isOpen = openActionRowId === rowId;
            const status = getStatus?.(row.original);
            const [menuPlacement, setMenuPlacement] = useState<"bottom" | "top">("bottom");
            const menuRef = useRef<HTMLDivElement>(null);
            const buttonRef = useRef<HTMLButtonElement>(null);

            useEffect(() => {
              if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setMenuPlacement(spaceBelow < 200 ? "top" : "bottom");
              }
            }, [isOpen]);

            useEffect(() => {
              const handleClickOutside = (e: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
                    buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                  setOpenActionRowId(null);
                }
              };

              if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
              }
              return () => {
                document.removeEventListener("mousedown", handleClickOutside);
              };
            }, [isOpen]);

            return (
              <div className="data-table__row-actions">
                <button
                  ref={buttonRef}
                  className={`data-table__icon-btn more ${isOpen ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionRowId(isOpen ? null : rowId);
                  }}
                  title="More actions"
                >
                  <MoreVertical size={18} />
                </button>

                {isOpen && (
                  <div 
                    ref={menuRef} 
                    className={`data-table__action-menu placement-${menuPlacement}`}
                    style={{
                      position: 'absolute',
                      right: 0,
                      [menuPlacement === 'bottom' ? 'top' : 'bottom']: 'calc(100% + 6px)',
                      zIndex: 100
                    }}
                  >
                    <div className="data-table__menu-header">Quick Actions</div>
                    {onEdit && (
                      <button
                        className="data-table__menu-item"
                        data-action="edit"
                        onClick={() => {
                          onEdit(row.original);
                          setOpenActionRowId(null);
                        }}
                      >
                        <div className="data-table__menu-icon edit">
                          <Edit size={14} />
                        </div>
                        <span>Edit Details</span>
                      </button>
                    )}

                    {onToggleStatus && (
                      <button
                        className={`data-table__menu-item status-${status ? "active" : "inactive"}`}
                        data-action={status ? "deactivate" : "activate"}
                        onClick={() => {
                          onToggleStatus(row.original);
                          setOpenActionRowId(null);
                        }}
                      >
                        <div className={`data-table__menu-icon status ${status ? "active" : "inactive"}`}>
                          <Power size={14} />
                        </div>
                        <span>{status ? "Set Inactive" : "Set Active"}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          },
        }
      : null;

  // Serial Number (SN) column
  const snColumn: ColumnDef<TData> = {
    id: "sn",
    header: "SN",
    enableSorting: true,
    size: 70,
    accessorFn: (_row, index) => index,
    minSize: 60,
    maxSize: 100,
    sortingFn: (rowA, rowB) => rowA.index - rowB.index,
    cell: ({ row, table }) => {
      const effectivePageIndex = currentPage ? currentPage - 1 : table.getState().pagination.pageIndex;
      const effectivePageSize = pageSize;
      const rowNumber = effectivePageIndex * effectivePageSize + row.index + 1;

      return (
        <div
          style={{
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: 500,
            color: "#4b5563",
            userSelect: "none",
          }}
        >
          {rowNumber}
        </div>
      );
    },
  };

  const finalColumns = [snColumn, ...columns, ...(actionColumn ? [actionColumn] : [])];

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize } },
  });

  useEffect(() => {
    if (isFullScreen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  const enhancedHeaderActions: DataTableHeaderAction[] = [
    ...headerActions,
    {
      key: "fullscreen",
      icon: isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />,
      onClick: () => setIsFullScreen((v) => !v),
    },
  ];

  const totalPages = totalCount && pageSize ? Math.ceil(totalCount / pageSize) : table.getPageCount();
  const current = currentPage || table.getState().pagination.pageIndex + 1;

  const totalVisibleColumns = table.getVisibleFlatColumns().length;

  return (
    <div className={`data-table-container ${isFullScreen ? "fullscreen-mode" : ""}`}>
      <div className="data-table">
        {/* Header */}
        {(title || subtitle || description || enhancedHeaderActions.length > 0) && (
          <div className="data-table__header">
            <div className="data-table__header-left">
              {title && <h2 className="data-table__title">{title}</h2>}
              {subtitle && <p className="data-table__subtitle">{subtitle}</p>}
              {description && <p className="data-table__subtitle">{description}</p>}
            </div>
            <div className="data-table__header-actions">

              {customHeaderElements}
              {enhancedHeaderActions
                .filter((a) => a.visible !== false)
                .map((action) => (
                  <button
                    key={action.key}
                    className="data-table__icon-btn"
                    onClick={action.onClick}
                  >
                    {action.icon}
                    {action.label && <span className="data-table__action-label">{action.label}</span>}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Table wrapper */}
        <div className="data-table__wrapper">
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              Loading...
            </div>
          ) : (
            <table className="data-table__table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const isSorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          className="data-table__th"
                          style={{
                            width: header.getSize(),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: header.column.columnDef.maxSize,
                            cursor: canSort ? "pointer" : "default",
                          }}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}

                            {canSort && (
                              <span style={{ display: "inline-flex", alignItems: "center", minWidth: 20 }}>
                                {isSorted === "asc" && <ChevronUp size={16} className="asc" />}
                                {isSorted === "desc" && <ChevronDown size={16} className="desc" />}
                                {!isSorted && <ChevronUp size={16} className="unsorted" />}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={totalVisibleColumns} className="data-table__empty">
                      No records found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="data-table__row">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="data-table__td"
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="data-table__pagination">
          <button
            className="data-table__pagination-btn"
            onClick={() => {
              if (onPageChange && current > 1) onPageChange(current - 1);
            }}
            disabled={current <= 1}
          >
            Previous
          </button>
          <span className="data-table__page-info">
            Page {current} of {totalPages || 1}
          </span>
          <button
            className="data-table__pagination-btn"
            onClick={() => {
              if (onPageChange && current < totalPages) onPageChange(current + 1);
            }}
            disabled={current >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}