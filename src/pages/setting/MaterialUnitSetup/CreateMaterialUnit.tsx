import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Scale, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, Ruler, Save
} from "lucide-react";
import { InputField } from "../../../components/widgets/InputField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { FormTemplate } from "../../../components/common/form/Form";
import { FormSection } from "../../../components/widgets/FormSection";
import {
  useCreateMaterialUnitMutation,
  useUpdateMaterialUnitMutation,
  useGetMaterialUnitByIdQuery
} from "../../../services/features/cemsApi";

const CreateMaterialUnit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: unitResponse, isLoading: isLoadingData } = useGetMaterialUnitByIdQuery(Number(id), { skip: !isEditMode });
  const [createUnit, { isLoading: isCreating }] = useCreateMaterialUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateMaterialUnitMutation();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && unitResponse?.data) {
      const unit = unitResponse.data;
      setForm({
        name: unit.name || "",
        symbol: unit.symbol || "",
      });
    }
  }, [isEditMode, unitResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Unit name is required." });
      return;
    }

    try {
      if (isEditMode) {
        await updateUnit({ id: Number(id), data: form }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Unit updated successfully!" });
      } else {
        await createUnit(form).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Unit created successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: err?.data?.message || "Operation failed. Please try again." });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/material-units");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isLoadingData;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/settings/material-units")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Units
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Measurement Unit" : "Create New Unit"}
          description="Standardize how materials and resources are measured across all engineering projects."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/material-units")} type="button">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: "160px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Saving..." : isEditMode ? "Update Unit" : "Create Unit"}
              </Button>
            </div>
          }
        >
          <FormSection title="Unit Specifications" columns={2} icon={<Ruler size={18} color="#6366f1" />}>
            <InputField
              label="Unit Name"
              name="name"
              required
              icon={Scale}
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Kilogram, Meter, Cubic Foot"
            />
            <InputField
              label="Unit Symbol"
              name="symbol"
              required
              icon={Scale}
              value={form.symbol}
              onChange={handleChange}
              placeholder="e.g. kg, m, cu.ft"
            />
          </FormSection>

          <div style={{ background: "#f0f9ff", borderRadius: "12px", padding: "16px", border: "1px solid #e0f2fe", marginTop: "24px", display: "flex", gap: "12px" }}>
            <AlertTriangle size={20} color="#0369a1" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#0369a1", lineHeight: 1.5 }}>
              Standard units ensure consistency in resource tracking and financial calculations. Make sure the symbol matches international standards where possible.
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

export default CreateMaterialUnit;
