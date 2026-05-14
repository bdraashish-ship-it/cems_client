import React, { useState, useEffect } from "react";
import { Building2, Mail, Phone, MapPin, User, FileText } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";

interface ClientFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        contact_person: initialData.contact_person || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <FormSection title="Company Information" columns={2}>
        <InputField
          label="Company Name"
          name="name"
          required
          icon={Building2}
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Acme Construction Pvt. Ltd."
        />
        <InputField
          label="Contact Person"
          name="contact_person"
          required
          icon={User}
          value={form.contact_person}
          onChange={handleChange}
          placeholder="e.g. John Doe"
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          required
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          placeholder="e.g. contact@acme.com"
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          required
          icon={Phone}
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. +977-1-4444444"
        />
        <InputField
          label="Office Address"
          name="address"
          required
          icon={MapPin}
          value={form.address}
          onChange={handleChange}
          placeholder="e.g. Tinkune, Kathmandu"
        />
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Additional Notes / Description"
          name="description"
          type="textarea"
          icon={FileText}
          value={form.description}
          onChange={handleChange}
          placeholder="Any additional details about the client..."
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
          {isLoading ? "Saving..." : initialData ? "Update Client" : "Register Client"}
        </Button>
      </div>
    </form>
  );
};
