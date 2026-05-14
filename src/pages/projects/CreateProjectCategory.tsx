import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tag, Palette, FileText, Check, Loader2, ArrowLeft,
  X, CheckCircle2, AlertTriangle
} from "lucide-react";
import { InputField } from "../../components/widgets/InputField";
import { Modal } from "../../components/common/Modal/Modal";
import { Button } from "../../components/widgets/Button";
import {
  useCreateProjectCategoryMutation,
  useUpdateProjectCategoryMutation,
  useGetAllProjectCategoriesQuery
} from "../../services/features/cemsApi";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
  "#64748b", "#334155", "#1e293b", "#0f172a",
];

// Section card wrapper
const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }> = ({ title, icon, children, accent = "#6366f1" }) => (
  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px", background: `${accent}08` }}>
      <span style={{ color: accent }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{title}</h3>
    </div>
    <div style={{ padding: "24px" }}>{children}</div>
  </div>
);

const CreateProjectCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: allCategories, isLoading: isLoadingData } = useGetAllProjectCategoriesQuery(undefined, { skip: !isEditMode });
  const [createCategory, { isLoading: isCreating }] = useCreateProjectCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateProjectCategoryMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366f1",
    is_active: true,
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && allCategories?.data) {
      const category = allCategories.data.find((c: any) => c.id.toString() === id);
      if (category) {
        setForm({
          name: category.name || "",
          description: category.description || "",
          color: category.color || "#6366f1",
          is_active: category.is_active ?? true,
        });
      }
    }
  }, [isEditMode, allCategories, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Category name is required." });
      return;
    }

    try {
      if (isEditMode) {
        await updateCategory({ id: Number(id), data: form }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Category updated successfully!" });
      } else {
        await createCategory(form).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Category created successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: err?.data?.message || "Operation failed. Please try again." });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/projects/categories");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* ── Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px", height: "64px" }}>
          <button onClick={() => navigate("/projects/categories")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "6px 10px", borderRadius: "8px", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tag size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                {isEditMode ? "Edit Project Category" : "Create New Category"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                {isEditMode ? "Update the details of an existing project classification category" : "Add a new classification category for projects"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

          {/* ── LEFT: Form sections ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* 1. Basic Info */}
            <SectionCard title="Basic Details" icon={<Tag size={18} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField
                  label="Category Name"
                  name="name"
                  required
                  icon={Tag}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Road & Highway"
                />
                <InputField
                  label="Description"
                  name="description"
                  type="textarea"
                  icon={FileText}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of this category..."
                  rows={3}
                />
              </div>
            </SectionCard>

            {/* 2. Visuals */}
            <SectionCard title="Visual Identification" icon={<Palette size={18} />} accent="#ec4899">
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Color Picker */}
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.825rem", color: "#374151", marginBottom: "10px" }}>
                    Badge Color
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, color }))}
                        style={{
                          width: "36px", height: "36px", borderRadius: "50%", background: color,
                          border: form.color === color ? "3px solid #1e293b" : "2px solid transparent",
                          cursor: "pointer", transition: "all 0.15s", outline: "none",
                          boxShadow: form.color === color ? "0 0 0 4px rgba(226,232,240,0.8)" : "none",
                        }}
                        title={color}
                      />
                    ))}
                    <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 6px" }} />
                    <input
                      type="color"
                      value={form.color}
                      onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #e2e8f0", cursor: "pointer", padding: "0" }}
                      title="Custom color"
                    />
                  </div>
                </div>

              </div>
            </SectionCard>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingBottom: "32px" }}>
              <button type="button" onClick={() => navigate("/projects/categories")}
                style={{ padding: "10px 24px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                Cancel
              </button>
              <button type="submit" disabled={isLoading || isLoadingData}
                style={{ padding: "10px 28px", borderRadius: "10px", border: "none", background: isLoading ? "#a5b4fc" : "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
                {isLoading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={16} /> {isEditMode ? "Save Changes" : "Create Category"}</>}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Live Preview Card ── */}
          <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Status Toggle */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e293b" }}>Category Status</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Activate or deactivate this category</div>
              </div>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                style={{
                  width: "52px", height: "28px", borderRadius: "14px",
                  background: form.is_active ? "#10b981" : "#e2e8f0",
                  border: "none", cursor: "pointer", position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: "3px",
                  left: form.is_active ? "27px" : "3px",
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {/* Preview Card */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ height: "6px", background: form.color || "linear-gradient(90deg,#6366f1,#818cf8)" }} />
              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Live Preview</div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "4px" }}>
                      {form.name || <span style={{ color: "#cbd5e1" }}>Category Name</span>}
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 700,
                      background: form.is_active ? "#dcfce7" : "#fee2e2",
                      color: form.is_active ? "#166534" : "#991b1b",
                      textTransform: "uppercase", letterSpacing: "0.04em",
                    }}>
                      {form.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "16px", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, minHeight: "40px" }}>
                  {form.description || <span style={{ fontStyle: "italic", opacity: 0.6 }}>No description provided...</span>}
                </div>

                <div style={{ marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "8px" }}>Badge Preview:</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 14px", borderRadius: "20px",
                    background: form.color, color: "#fff",
                    fontWeight: 700, fontSize: "0.8rem",
                    boxShadow: `0 2px 8px ${form.color}40`
                  }}>
                    {form.name || "Category"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      {/* Status Message Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleModalClose}
        title={statusModal.type === "success" ? "Success" : "Error"}
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", textAlign: "center" }}>
          {statusModal.type === "success" ? (
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>
          ) : (
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <AlertTriangle size={32} color="#dc2626" />
            </div>
          )}
          <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.25rem" }}>
            {statusModal.type === "success" ? "Operation Successful" : "Action Failed"}
          </h3>
          <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "0.95rem" }}>
            {statusModal.message}
          </p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>
            {statusModal.type === "success" ? "Continue" : "Close"}
          </Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateProjectCategory;
