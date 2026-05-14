import React, { useState, useEffect } from "react";
import { AlertTriangle, FileText, Calendar, Tag, Info } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";

interface SiteIssueFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const SiteIssueForm: React.FC<SiteIssueFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "low",
    reported_date: new Date().toISOString().split("T")[0],
    project_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        severity: initialData.severity || "low",
        reported_date: initialData.reported_date || new Date().toISOString().split("T")[0],
        project_id: initialData.project_id?.toString() || "",
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
      project_id: parseInt(form.project_id) || 1,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="site-issue-form">
      <FormSection title="Issue Reporting" columns={2}>
        <InputField
          label="Issue Title"
          name="title"
          required
          icon={AlertTriangle}
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Safety Barrier Missing"
        />
        <SelectField
          label="Severity Level"
          value={form.severity}
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
          onChange={handleSelectChange("severity")}
          required
        />
        <InputField
          label="Reported Date"
          name="reported_date"
          type="date"
          required
          icon={Calendar}
          value={form.reported_date}
          onChange={handleChange}
        />
        <InputField
          label="Project Association (ID)"
          name="project_id"
          type="number"
          required
          icon={Info}
          value={form.project_id}
          onChange={handleChange}
          placeholder="1"
        />
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Detailed Description"
          name="description"
          type="textarea"
          icon={FileText}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the problem, location, and potential impact..."
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
          {isLoading ? "Processing..." : initialData ? "Update Issue" : "Report Issue"}
        </Button>
      </div>
    </form>
  );
};
