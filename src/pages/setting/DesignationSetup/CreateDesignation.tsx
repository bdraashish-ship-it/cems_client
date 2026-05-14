import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  CheckCircle2, AlertCircle, ArrowLeft, Loader2, 
  Briefcase, FileText, Info, Save
} from "lucide-react";
import { 
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useGetAllDesignationsQuery
} from "../../../services/features/cemsApi";
import { InputField } from "../../../components/widgets/InputField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";

const CreateDesignation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const { data: allItems } = useGetAllDesignationsQuery(undefined, { skip: !isEditMode });
  
  const [createItem, { isLoading: isCreating }] = useCreateDesignationMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateDesignationMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && allItems?.data) {
      const item = allItems.data.find((s: any) => s.id === Number(id));
      if (item) {
        setForm({
          name: item.name || "",
          description: item.description || "",
          is_active: item.is_active ?? true,
        });
      }
    }
  }, [isEditMode, allItems, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Designation name is required." });
      return;
    }

    try {
      if (isEditMode) {
        await updateItem({ id: Number(id), data: form }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Designation updated successfully!" });
      } else {
        await createItem(form).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New designation created!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: err?.data?.message || "Failed to save designation." });
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/settings/designations")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Designations
        </button>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={22} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {isEditMode ? "Modify Designation" : "Create New Designation"}
            </h1>
          </div>
          <p style={{ color: "#64748b", margin: 0 }}>
            Assign specific roles to manage organization hierarchy and employee positions.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "grid", gap: "24px" }}>
              <InputField 
                label="Designation Name"
                name="name"
                required
                icon={Briefcase}
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Project Manager, Site Engineer, Accountant"
              />
              
              <InputField 
                label="Role Description"
                name="description"
                type="textarea"
                icon={FileText}
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe the responsibilities of this role..."
                rows={4}
              />

              <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: form.is_active ? "#dcfce7" : "#f1f5f9", color: form.is_active ? "#16a34a" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>Active Status</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Inactive roles won't appear in employee selection.</div>
                  </div>
                </div>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
                  <input 
                    type="checkbox" 
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: form.is_active ? "#6366f1" : "#cbd5e1", 
                    transition: ".4s", borderRadius: "34px" 
                  }}>
                    <span style={{ 
                      position: "absolute", height: "18px", width: "18px", left: "4px", bottom: "4px", 
                      backgroundColor: "white", transition: ".4s", borderRadius: "50%",
                      transform: form.is_active ? "translateX(24px)" : "none"
                    }}></span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ background: "#eff6ff", borderRadius: "16px", padding: "20px", border: "1px solid #dbeafe", display: "flex", gap: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Info size={18} color="#2563eb" />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#1e3a8a", fontSize: "0.9rem" }}>Organization Structure</h4>
              <p style={{ margin: 0, color: "#3b82f6", fontSize: "0.8rem", lineHeight: 1.5 }}>
                Designations help in generating accurate reports and managing permissions based on employee roles.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={() => navigate("/settings/designations")}
              style={{ padding: "12px 28px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                padding: "12px 32px", borderRadius: "12px", border: "none", 
                background: isLoading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #4f46e5)", 
                color: "#fff", fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
              }}
            >
              {isLoading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><Save size={18} /> {isEditMode ? "Update Role" : "Create Designation"}</>}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleModalClose}
        title={statusModal.type === "success" ? "Operation Successful" : "Error"}
        size="sm"
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {statusModal.type === "success" ? <CheckCircle2 size={32} color="#16a34a" /> : <AlertCircle size={32} color="#dc2626" />}
          </div>
          <h3 style={{ margin: "0 0 8px 0" }}>{statusModal.type === "success" ? "Success!" : "Action Failed"}</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
            {statusModal.message}
          </p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>
            {statusModal.type === "success" ? "Return to List" : "Try Again"}
          </Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateDesignation;
