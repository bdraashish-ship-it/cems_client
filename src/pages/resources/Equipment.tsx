import { useState, useEffect } from "react";
import { Truck, Tag, PenTool, DollarSign, ArrowLeft, Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { useCreateEquipmentMutation, useUpdateEquipmentMutation, useGetEquipmentByIdQuery } from "../../services/features/cemsApi";

const Equipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: equipData, isLoading: isFetching } = useGetEquipmentByIdQuery(Number(id), { skip: !isEdit });
  const [createEquipment, { isLoading: isCreating }] = useCreateEquipmentMutation();
  const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation();

  const [form, setForm] = useState({ name: "", type: "", serial_number: "", model: "", daily_rate: "" });

  useEffect(() => {
    if (isEdit && equipData?.data) {
      const e = equipData.data;
      setForm({
        name: e.name || "",
        type: e.type || "",
        serial_number: e.serial_number || "",
        model: e.model || "",
        daily_rate: e.daily_rate?.toString() || ""
      });
    }
  }, [isEdit, equipData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        daily_rate: parseFloat(form.daily_rate) || 0,
      };
      if (isEdit) {
        await updateEquipment({ id: Number(id), data: payload }).unwrap();
      } else {
        await createEquipment(payload).unwrap();
      }
      navigate("/resources/equipment/all");
    } catch (error) {
      console.error("Failed to save equipment:", error);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <FormTemplate
      title={isEdit ? "Update Fleet Records" : "Register Machinery"}
      description={isEdit ? "Modify operational specs, rates, or identification for existing heavy equipment." : "Add new machinery, vehicles, or specialized tools to the organizational fleet."}
      width="full"
      onSubmit={handleSubmit}
      headerActions={
        <Button variant="outline" size="sm" onClick={() => navigate("/resources/equipment/all")} icon={<ArrowLeft size={16} />}>
          Back to List
        </Button>
      }
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outline" type="button" onClick={() => navigate("/resources/equipment/all")}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Fleet" : "Register Equipment"}
          </Button>
        </div>
      }
    >
      <FormSection title="Machinery Identification" columns={2}>
        <InputField label="Equipment Asset Name" name="name" required icon={PenTool} value={form.name} onChange={handleChange} placeholder="e.g. Caterpillar Excavator 320" />
        <InputField label="Asset Category" name="type" required icon={Settings} value={form.type} onChange={handleChange} placeholder="e.g. Heavy Earthmovers" />
        <InputField label="Model / Generation" name="model" required icon={Tag} value={form.model} onChange={handleChange} placeholder="e.g. CAT 2024 Series" />
        <InputField label="Serial / Chassis Number" name="serial_number" required icon={Truck} value={form.serial_number} onChange={handleChange} placeholder="Unique Identification No." />
        <InputField label="Standard Daily Rate" name="daily_rate" type="number" required icon={DollarSign} value={form.daily_rate} onChange={handleChange} placeholder="Rental or Internal cost/day" />
      </FormSection>
    </FormTemplate>
  );
};

export default Equipment;

