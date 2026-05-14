import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutGrid, FileText, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, Layers, Save
} from "lucide-react";
import { InputField } from "../../../components/widgets/InputField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { FormTemplate } from "../../../components/common/form/Form";
import { FormSection } from "../../../components/widgets/FormSection";
import {
  useCreateSiteTypeMutation,
  useUpdateSiteTypeMutation,
  useGetAllSiteTypesQuery
} from "../../../services/features/cemsApi";

const CreateSiteType = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: allTypes, isLoading: isLoadingData } = useGetAllSiteTypesQuery(undefined, { skip: !isEditMode });
  const [createType, { isLoading: isCreating }] = useCreateSiteTypeMutation();
  const [updateType, { isLoading: isUpdating }] = useUpdateSiteTypeMutation();

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
    if (isEditMode && allTypes?.data) {
      const type = allTypes.data.find((t: any) => t.id.toString() === id);
      if (type) {
        setForm({
          name: type.name || "",
          description: type.description || "",
        });
      }
    }
  }, [isEditMode, allTypes, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Site Type name is required." });
      return;
    }

    try {
      if (isEditMode) {
        await updateType({ id: Number(id), data: form }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Site Type updated successfully!" });
      } else {
        await createType(form).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Site Type created successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: err?.data?.message || "Operation failed. Please try again." });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/site-types");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/settings/site-types")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Site Types
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Site Category" : "Add Site Category"}
          description="Classify your project sites for better logistical tracking and resource allocation."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/site-types")} type="button">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: "160px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Site Type"}
              </Button>
            </div>
          }
        >
          <FormSection title="Category Info" columns={1} icon={<Layers size={18} color="#10b981" />}>
            <InputField
              label="Site Type Name"
              name="name"
              required
              icon={LayoutGrid}
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Fabrication Yard, Main Construction Site, Storage Depot"
            />
            <InputField
              label="Description"
              name="description"
              type="textarea"
              icon={FileText}
              value={form.description}
              onChange={handleChange}
              placeholder="Define the purpose or logistical details of this site category..."
              rows={4}
            />
          </FormSection>
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

export default CreateSiteType;
