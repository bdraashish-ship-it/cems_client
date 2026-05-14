import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Layers, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, FileText, Save
} from "lucide-react";
import { InputField } from "../../../components/widgets/InputField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { FormTemplate } from "../../../components/common/form/Form";
import { FormSection } from "../../../components/widgets/FormSection";
import {
  useCreateMaterialCategoryMutation,
  useUpdateMaterialCategoryMutation,
  useGetMaterialCategoryByIdQuery
} from "../../../services/features/cemsApi";

const CreateMaterialCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: catResponse, isLoading: isLoadingData } = useGetMaterialCategoryByIdQuery(Number(id), { skip: !isEditMode });
  const [createCategory, { isLoading: isCreating }] = useCreateMaterialCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateMaterialCategoryMutation();

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
    if (isEditMode && catResponse?.data) {
      const cat = catResponse.data;
      setForm({
        name: cat.name || "",
        description: cat.description || "",
      });
    }
  }, [isEditMode, catResponse]);

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
      navigate("/settings/material-categories");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isLoadingData;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/settings/material-categories")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Categories
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Classification" : "New Material Category"}
          description="Define a logical grouping for your construction assets. Well-defined categories streamline warehouse management and financial reporting."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/material-categories")} type="button">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: "160px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Saving..." : isEditMode ? "Update Category" : "Register Category"}
              </Button>
            </div>
          }
        >
          <FormSection title="Category Identity" columns={1} icon={<Layers size={18} color="#6366f1" />}>
            <InputField
              label="Classification Name"
              name="name"
              required
              icon={Layers}
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Raw Materials, Safety Equipment, Consumables"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={16} color="#64748b" />
                Detailed Description
              </label>
              <textarea 
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe what materials fall under this category..."
                style={{ 
                  width: "100%", 
                  minHeight: "100px", 
                  padding: "12px", 
                  borderRadius: "12px", 
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.2s",
                  resize: "vertical"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </FormSection>

          <div style={{ background: "#fef2f2", borderRadius: "12px", padding: "16px", border: "1px solid #fee2e2", marginTop: "24px", display: "flex", gap: "12px" }}>
            <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#991b1b", lineHeight: 1.5 }}>
              Updating category names will reflect across all linked materials in the system. Use clear and concise nomenclature.
            </p>
          </div>
        </FormTemplate>
      </div>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleModalClose}
        title={statusModal.type === "success" ? "Success" : "Error"}
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", textAlign: "center" }}>
          <div style={{ 
            width: "64px", height: "64px", borderRadius: "50%", 
            background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", 
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" 
          }}>
            {statusModal.type === "success" ? <CheckCircle2 size={32} color="#16a34a" /> : <AlertTriangle size={32} color="#dc2626" />}
          </div>
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

export default CreateMaterialCategory;
