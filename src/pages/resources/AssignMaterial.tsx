import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Truck, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, FileText, Save, Briefcase, MapPin, Package, Calendar
} from "lucide-react";
import { InputField } from "../../components/widgets/InputField";
import { Modal } from "../../components/common/Modal/Modal";
import { Button } from "../../components/widgets/Button";
import { SelectField } from "../../components/widgets/SelectField";
import { FormTemplate } from "../../components/common/form/Form";
import { FormSection } from "../../components/widgets/FormSection";
import {
  useCreateMaterialDetailMutation,
  useUpdateMaterialDetailMutation,
  useGetMaterialDetailByIdQuery,
  useGetAllProjectsQuery,
  useGetAllSitesQuery,
  useGetAllMaterialsQuery
} from "../../services/features/cemsApi";
import { parseError } from "../../utils/errorParser";

const AssignMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: detailResponse, isLoading: isLoadingData } = useGetMaterialDetailByIdQuery(Number(id), { skip: !isEditMode });
  const { data: projectsData } = useGetAllProjectsQuery();
  const { data: sitesData } = useGetAllSitesQuery();
  const { data: materialsData } = useGetAllMaterialsQuery({});

  const [createAssignment, { isLoading: isCreating }] = useCreateMaterialDetailMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateMaterialDetailMutation();

  const [form, setForm] = useState({
    material_id: "",
    project_id: "",
    site_id: "",
    order_quantity: "",
    received_quantity: "0",
    is_received: false,
    delivery_start_date: "",
    delivery_end_date: "",
    notes: "",
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && detailResponse?.data) {
      const d = detailResponse.data;
      setForm({
        material_id: d.material_id?.toString() || "",
        project_id: d.project_id?.toString() || "",
        site_id: d.site_id?.toString() || "",
        order_quantity: d.order_quantity?.toString() || "",
        received_quantity: d.received_quantity?.toString() || "0",
        is_received: d.is_received || false,
        delivery_start_date: d.delivery_start_date || "",
        delivery_end_date: d.delivery_end_date || "",
        notes: d.notes || "",
      });
    }
  }, [isEditMode, detailResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.material_id || !form.project_id || !form.order_quantity) {
      setStatusModal({ isOpen: true, type: "error", message: "Please fill in all required fields." });
      return;
    }

    try {
      const payload = {
        ...form,
        material_id: parseInt(form.material_id),
        project_id: parseInt(form.project_id),
        site_id: form.site_id ? parseInt(form.site_id) : null,
        order_quantity: parseFloat(form.order_quantity),
        received_quantity: parseFloat(form.received_quantity),
      };

      if (isEditMode) {
        await updateAssignment({ id: Number(id), data: payload }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Allocation updated successfully!" });
      } else {
        await createAssignment(payload).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Resource allocated successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/resources/assignments");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const projectOptions = projectsData?.data?.map((p: any) => ({ label: p.name, value: p.id.toString() })) || [];
  const siteOptions = sitesData?.data?.map((s: any) => ({ label: s.name, value: s.id.toString() })) || [];
  const materialOptions = materialsData?.data?.map((m: any) => ({ 
    label: `${m.name} (In Stock: ${m.quantity} ${m.unit_symbol || ''})`, 
    value: m.id.toString() 
  })) || [];

  const isLoading = isCreating || isUpdating || isLoadingData;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/resources/assignments")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Back to Allocations
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Resource Assignment" : "Allocate Material to Site"}
          description="Assign inventory items to specific projects or sites. The system will automatically check stock availability before confirming the allocation."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/resources/assignments")} type="button">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: "180px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Validating..." : isEditMode ? "Commit Changes" : "Confirm Allocation"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <FormSection title="Logistics & Destination" columns={2} icon={<Truck size={18} color="#6366f1" />}>
              <SelectField
                label="Primary Project"
                value={form.project_id}
                options={projectOptions}
                placeholder="Select destination project..."
                required
                onChange={handleSelectChange("project_id")}
              />
              <SelectField
                label="Specific Site (Optional)"
                value={form.site_id}
                options={siteOptions}
                placeholder="Select project site..."
                onChange={handleSelectChange("site_id")}
              />
              <div style={{ gridColumn: "span 2" }}>
                <SelectField
                    label="Resource / Material"
                    value={form.material_id}
                    options={materialOptions}
                    placeholder="Search material from warehouse..."
                    required
                    onChange={handleSelectChange("material_id")}
                />
              </div>
            </FormSection>

            <FormSection title="Quantity & Delivery" columns={2} icon={<Calendar size={18} color="#10b981" />}>
              <InputField
                label="Allocation Quantity"
                name="order_quantity"
                type="number"
                required
                icon={Package}
                value={form.order_quantity}
                onChange={handleChange}
                placeholder="Amount to assign"
              />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "100%", paddingTop: "24px" }}>
                <input 
                  type="checkbox" 
                  name="is_received" 
                  checked={form.is_received} 
                  onChange={handleChange as any}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e293b" }}>Mark as Received on Site</label>
              </div>
              
              <InputField
                label="Scheduled Start Date"
                name="delivery_start_date"
                type="date"
                icon={Calendar}
                value={form.delivery_start_date}
                onChange={handleChange}
              />
              <InputField
                label="Expected Completion"
                name="delivery_end_date"
                type="date"
                icon={Calendar}
                value={form.delivery_end_date}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Logistics Notes" columns={1} icon={<FileText size={18} color="#f59e0b" />}>
              <textarea 
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Special handling instructions, delivery contact details, or site-specific notes..."
                style={{ 
                  width: "100%", 
                  minHeight: "100px", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  border: "1px solid #e2e8f0",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </FormSection>
          </div>
        </FormTemplate>
      </div>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleModalClose}
        title={statusModal.type === "success" ? "Allocation Confirmed" : "Allocation Failed"}
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
          <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "0.95rem" }}>
            {statusModal.message}
          </p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>
            {statusModal.type === "success" ? "View Logistics" : "Try Again"}
          </Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AssignMaterial;
