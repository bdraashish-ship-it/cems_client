import React, { useState, useEffect } from "react";
import { UserCircle, Mail, Phone, Book, Briefcase, Calendar } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";
import { DatePickerField } from "../../../styles/widgets/DatePickerField";

interface EmployeeFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const SALUTATIONS = ["Mr.", "Ms.", "Mrs.", "Dr."];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    salutation: "",
    full_name: "",
    gender: "",
    email: "",
    phone: "",
    join_date: "",
    designation: "",
    information: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        salutation: initialData.salutation || "",
        full_name: initialData.full_name || "",
        gender: initialData.gender || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        join_date: initialData.join_date || "",
        designation: initialData.designation || "",
        information: initialData.information || "",
      });
    }
  }, [initialData]);

  const handleSelectChange = (name: keyof typeof form) => (value: string | number) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.salutation) err.salutation = "Salutation is required";
    if (!form.full_name.trim()) err.full_name = "Full name is required";
    if (!form.email.trim()) err.email = "Email is required";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    if (!form.join_date) err.join_date = "Date of joining is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <FormSection title="Official Information" columns={2}>
        <SelectField
          label="Salutation"
          value={form.salutation}
          options={SALUTATIONS.map((s) => ({ label: s, value: s }))}
          placeholder="Select"
          required
          onChange={handleSelectChange("salutation")}
          error={isSubmitted ? errors.salutation : undefined}
        />
        <InputField
          label="Full Name"
          name="full_name"
          placeholder="Official Name"
          required
          icon={UserCircle}
          value={form.full_name}
          onChange={handleInputChange}
          error={isSubmitted ? errors.full_name : undefined}
        />
        <SelectField
          label="Gender"
          value={form.gender}
          options={GENDERS.map((g) => ({ label: g, value: g }))}
          placeholder="Select gender"
          onChange={handleSelectChange("gender")}
        />
        <InputField
          label="Designation"
          name="designation"
          placeholder="e.g. Site Engineer"
          icon={Briefcase}
          value={form.designation}
          onChange={handleInputChange}
        />
      </FormSection>

      <FormSection title="Contact & Timeline" columns={2}>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@company.com"
          required
          icon={Mail}
          value={form.email}
          onChange={handleInputChange}
          error={isSubmitted ? errors.email : undefined}
        />
        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="98xxxxxxxx"
          required
          icon={Phone}
          value={form.phone}
          onChange={handleInputChange}
          error={isSubmitted ? errors.phone : undefined}
        />
        <DatePickerField
          label="Date of Joining"
          value={form.join_date}
          onChange={(date) => {
            setForm(prev => ({ ...prev, join_date: date ? date.format('YYYY-MM-DD') : '' }));
          }}
          required
          error={isSubmitted ? errors.join_date : undefined}
        />
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Additional Information"
          name="information"
          type="textarea"
          placeholder="Notes..."
          icon={Book}
          value={form.information}
          onChange={handleInputChange}
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
          {isLoading ? "Saving..." : initialData ? "Update Employee" : "Register Employee"}
        </Button>
      </div>
    </form>
  );
};
