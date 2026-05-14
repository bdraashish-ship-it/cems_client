import React, { useState, useEffect } from "react";
import { Wrench, Hash, Package, FileText, ShoppingCart } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";

interface MaterialFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    quantity: "",
    unit_price: "",
    supplier: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        unit: initialData.unit || "",
        quantity: initialData.quantity?.toString() || "",
        unit_price: initialData.unit_price?.toString() || "",
        supplier: initialData.supplier || "",
        description: initialData.description || "",
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
      quantity: parseFloat(form.quantity) || 0,
      unit_price: parseFloat(form.unit_price) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="material-form">
      <FormSection title="Inventory Details" columns={2}>
        <InputField
          label="Material Name"
          name="name"
          required
          icon={Package}
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Portland Cement"
        />
        <InputField
          label="Category"
          name="category"
          required
          icon={Wrench}
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Construction"
        />
        <InputField
          label="Unit"
          name="unit"
          required
          icon={FileText}
          value={form.unit}
          onChange={handleChange}
          placeholder="e.g. Bags, Tons, m³"
        />
        <InputField
          label="Quantity in Stock"
          name="quantity"
          type="number"
          required
          icon={Hash}
          value={form.quantity}
          onChange={handleChange}
          placeholder="0"
        />
        <InputField
          label="Unit Price (NPR)"
          name="unit_price"
          type="number"
          required
          icon={Hash}
          value={form.unit_price}
          onChange={handleChange}
          placeholder="0.00"
        />
        <InputField
          label="Supplier / Vendor"
          name="supplier"
          required
          icon={ShoppingCart}
          value={form.supplier}
          onChange={handleChange}
          placeholder="e.g. local supplier name"
        />
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Description / Specs"
          name="description"
          type="textarea"
          icon={FileText}
          value={form.description}
          onChange={handleChange}
          placeholder="Detailed specifications or notes..."
        />
      </div>

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
          {isLoading ? "Processing..." : initialData ? "Update Inventory" : "Add to Inventory"}
        </Button>
      </div>
    </form>
  );
};
