import { useState, useEffect } from "react";
import {
  Wrench, Hash, Package, FileText, ArrowLeft, Building2,
  Layers, Scale, Save, Loader2, CheckCircle2, AlertCircle,
  MapPin
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { SelectField } from "../../components/widgets/SelectField";
import { Modal } from "../../components/common/Modal/Modal";
import {
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useGetMaterialByIdQuery,
  useGetAllMaterialCategoriesQuery,
  useGetAllMaterialUnitsQuery
} from "../../services/features/cemsApi";
import { parseError } from "../../utils/errorParser";

const Materials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: materialData, isLoading: isFetching } = useGetMaterialByIdQuery(Number(id), { skip: !isEdit });
  const { data: categoriesData } = useGetAllMaterialCategoriesQuery();
  const { data: unitsData } = useGetAllMaterialUnitsQuery();

  const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation();
  const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation();

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    unit_id: "",
    quantity: "",
    unit_price: "",
    supplier: "",
    supplier_location: "",
    description: ""
  });

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    const m = materialData?.data || ((materialData as any)?.id ? materialData : null);

    if (isEdit && m) {
      setForm({
        name: m.name || "",
        category_id: m.category_id?.toString() || "",
        unit_id: m.unit_id?.toString() || "",
        quantity: m.quantity?.toString() || "0",
        unit_price: m.unit_price?.toString() || "0",
        supplier: m.supplier || "",
        supplier_location: m.supplier_location || "",
        description: m.description || ""
      });
    }
  }, [isEdit, materialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Material name is required." });
      return;
    }

    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        unit_id: form.unit_id ? parseInt(form.unit_id) : null,
        quantity: parseFloat(form.quantity) || 0,
        unit_price: parseFloat(form.unit_price) || 0,
      };

      if (isEdit) {
        await updateMaterial({ id: Number(id), data: payload }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Material specifications updated successfully!" });
      } else {
        await createMaterial(payload).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New material successfully registered to inventory!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/resources/materials/all");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isFetching;

  const categoryOptions = categoriesData?.data?.map((c: any) => ({
    label: c.name,
    value: c.id.toString()
  })) || [];

  const unitOptions = unitsData?.data?.map((u: any) => ({
    label: `${u.name} (${u.symbol})`,
    value: u.id.toString()
  })) || [];

  return (
    <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        <button
          onClick={() => navigate("/resources/materials/all")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Back to Inventory
        </button>

        <FormTemplate
          title={isEdit ? "Refine Material Record" : "Onboard New Resource"}
          description={isEdit ? "Update technical specifications, current stock levels, or vendor logistics for this material." : "Establish a new material record in the centralized engineering inventory for tracking and procurement."}
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%" }}>
              <Button variant="outline" type="button" onClick={() => navigate("/resources/materials/all")}>Discard Changes</Button>
              <Button variant="primary" type="submit" disabled={isLoading} style={{ minWidth: "200px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Synchronizing..." : isEdit ? "Commit Updates" : "Register Material"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <FormSection title="Core Classification" columns={2} icon={<Package size={18} color="#6366f1" />}>
              <InputField
                label="Material Item Name"
                name="name"
                required
                icon={Package}
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Portland Cement Grade 53"
              />
              <SelectField
                label="Asset Classification"
                value={form.category_id}
                options={categoryOptions}
                placeholder="Select category..."
                required
                onChange={handleSelectChange("category_id")}
              />
              <SelectField
                label="Measurement Unit"
                value={form.unit_id}
                options={unitOptions}
                placeholder="Select unit..."
                required
                onChange={handleSelectChange("unit_id")}
              />
              <InputField
                label="Current Stock Quantity"
                name="quantity"
                type="number"
                required
                icon={Layers}
                value={form.quantity}
                onChange={handleChange}
                placeholder="0.00"
              />
            </FormSection>

            <FormSection title="Financials & Logistics" columns={2} icon={<Building2 size={18} color="#10b981" />}>
              <InputField
                label="Unit Acquisition Cost (NPR)"
                name="unit_price"
                type="number"
                required
                icon={Scale}
                value={form.unit_price}
                onChange={handleChange}
                placeholder="Cost per unit"
              />
              <InputField
                label="Primary Vendor / Supplier"
                name="supplier"
                required
                icon={Building2}
                value={form.supplier}
                onChange={handleChange}
                placeholder="Enter company name"
              />
              <div style={{ gridColumn: "span 2" }}>
                <InputField
                  label="Supplier Registered Address"
                  name="supplier_location"
                  icon={MapPin}
                  value={form.supplier_location}
                  onChange={handleChange}
                  placeholder="Full physical or corporate address"
                />
              </div>
            </FormSection>

            <FormSection title="Supplementary Data" columns={1} icon={<FileText size={18} color="#f59e0b" />}>
              <div style={{ position: "relative" }}>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter technical specifications, storage requirements, or internal notes..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "all 0.2s",
                    resize: "vertical",
                    background: "#f8fafc"
                  }}
                />
              </div>
            </FormSection>
          </div>
        </FormTemplate>
      </div>

      <Modal isOpen={statusModal.isOpen} onClose={handleModalClose} title={statusModal.type === "success" ? "Success" : "Error"} size="sm">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
            {statusModal.type === "success" ? <CheckCircle2 size={36} color="#16a34a" /> : <AlertCircle size={36} color="#dc2626" />}
          </div>
          <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "1rem" }}>{statusModal.message}</p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>Continue</Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Materials;
