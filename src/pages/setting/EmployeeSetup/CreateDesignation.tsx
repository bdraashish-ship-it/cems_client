import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase, FileText, Check, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, ShieldCheck
} from "lucide-react";
import { InputField } from "../../../components/widgets/InputField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import {
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useGetAllDesignationsQuery
} from "../../../services/features/cemsApi";

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }> = ({ title, icon, children, accent = "#f97316" }) => (
  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
    <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px", background: `${accent}08` }}>
      <span style={{ color: accent }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{title}</h3>
    </div>
    <div style={{ padding: "24px" }}>{children}</div>
  </div>
);

const CreateDesignation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: allDesignations, isLoading: isLoadingData } = useGetAllDesignationsQuery(undefined, { skip: !isEditMode });
  const [createDesignation, { isLoading: isCreating }] = useCreateDesignationMutation();
  const [updateDesignation, { isLoading: isUpdating }] = useUpdateDesignationMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && allDesignations?.data) {
      const des = allDesignations.data.find((d: any) => d.id.toString() === id);
      if (des) {
        setForm({
          name: des.name || "",
          description: des.description || "",
        });
      }
    }
  }, [isEditMode, allDesignations, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Designation title is required." });
      return;
    }

    try {
      if (isEditMode) {
        await updateDesignation({ id: Number(id), data: form }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Designation updated successfully!" });
      } else {
        await createDesignation(form).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Designation created successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: err?.data?.message || "Operation failed. Please try again." });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/designations");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* ── Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px", height: "64px" }}>
          <button onClick={() => navigate("/settings/designations")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: "6px 10px", borderRadius: "8px", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <ArrowLeft size={16} /> Back to Designations
          </button>
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#f97316,#fb923c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                {isEditMode ? "Edit Designation" : "Onboard New Designation"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                Define professional titles for your organizational hierarchy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <SectionCard title="Designation Details" icon={<ShieldCheck size={18} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <InputField
                label="Designation Title"
                name="name"
                required
                icon={Briefcase}
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Senior Site Engineer"
              />
              <InputField
                label="Scope of Work / Description"
                name="description"
                type="textarea"
                icon={FileText}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the primary responsibilities of this role..."
                rows={3}
              />
            </div>
          </SectionCard>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" onClick={() => navigate("/settings/designations")}
              style={{ padding: "10px 24px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              style={{ padding: "10px 28px", borderRadius: "10px", border: "none", background: isLoading ? "#fdba74" : "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }}>
              {isLoading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Check size={16} /> {isEditMode ? "Save Changes" : "Create Designation"}</>}
            </button>
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

export default CreateDesignation;
