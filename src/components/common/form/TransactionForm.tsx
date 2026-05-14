import React, { useState, useEffect } from "react";
import { DollarSign, FileText, Tag, Calendar, Hash } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";

interface TransactionFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    transaction_date: "",
    type: "Expense",
    category: "",
    reference_number: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount?.toString() || "",
        transaction_date: initialData.transaction_date || "",
        type: initialData.type || "Expense",
        category: initialData.category || "",
        reference_number: initialData.reference_number || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string) => (val: string | number) => {
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: parseFloat(form.amount) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <FormSection title="Financial Details" columns={2}>
        <InputField
          label="Transaction Title"
          name="title"
          required
          icon={FileText}
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Supplier Payment"
        />
        <InputField
          label="Amount (NPR)"
          name="amount"
          type="number"
          required
          icon={DollarSign}
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
        />
        <SelectField
          label="Transaction Type"
          value={form.type}
          options={[
            { label: "Expense", value: "Expense" },
            { label: "Income", value: "Income" },
          ]}
          onChange={handleSelectChange("type")}
          required
        />
        <InputField
          label="Category"
          name="category"
          required
          icon={Tag}
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Material Procurement"
        />
        <InputField
          label="Transaction Date"
          name="transaction_date"
          type="date"
          required
          icon={Calendar}
          value={form.transaction_date}
          onChange={handleChange}
        />
        <InputField
          label="Reference / Invoice #"
          name="reference_number"
          icon={Hash}
          value={form.reference_number}
          onChange={handleChange}
          placeholder="e.g. INV-10234"
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
          {isLoading ? "Saving..." : initialData ? "Update Record" : "Post Transaction"}
        </Button>
      </div>
    </form>
  );
};
