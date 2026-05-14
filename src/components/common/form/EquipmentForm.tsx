import React, { useState, useEffect } from "react";
import { Truck, Tag, PenTool, DollarSign, Hash } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";

interface EquipmentFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    serial_number: "",
    model: "",
    daily_rate: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        type: initialData.type || "",
        serial_number: initialData.serial_number || "",
        model: initialData.model || "",
        daily_rate: initialData.daily_rate?.toString() || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      daily_rate: parseFloat(form.daily_rate) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="equipment-form">
      <FormSection title="Machinery Information" columns={2}>
        <InputField
          label="Equipment Name"
          name="name"
          required
          icon={Truck}
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Caterpillar Excavator"
        />
        <InputField
          label="Category / Type"
          name="type"
          required
          icon={Tag}
          value={form.type}
          onChange={handleChange}
          placeholder="e.g. Heavy Machinery"
        />
        <InputField
          label="Model Number"
          name="model"
          required
          icon={PenTool}
          value={form.model}
          onChange={handleChange}
          placeholder="e.g. 320D L"
        />
        <InputField
          label="Serial / VIN Number"
          name="serial_number"
          required
          icon={Hash}
          value={form.serial_number}
          onChange={handleChange}
          placeholder="e.g. CAT0320DL123"
        />
        <InputField
          label="Daily Rental Rate (NPR)"
          name="daily_rate"
          type="number"
          required
          icon={DollarSign}
          value={form.daily_rate}
          onChange={handleChange}
          placeholder="0.00"
        />
      </FormSection>

      <div className="form-actions" style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #f1f5f9"
      }}>
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : initialData ? "Update Equipment" : "Register Equipment"}
        </Button>
      </div>
    </form>
  );
};
