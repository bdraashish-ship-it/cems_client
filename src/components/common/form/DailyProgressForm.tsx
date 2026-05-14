import React, { useState, useEffect } from "react";
import { Calendar, FileText, Users, Cloud, Percent } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";

interface DailyProgressFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const DailyProgressForm: React.FC<DailyProgressFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    work_done: "",
    manpower_count: "",
    weather: "Clear",
    percentage_complete: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || new Date().toISOString().split("T")[0],
        work_done: initialData.work_done || "",
        manpower_count: initialData.manpower_count?.toString() || "",
        weather: initialData.weather || "Clear",
        percentage_complete: initialData.percentage_complete?.toString() || "",
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
      manpower_count: parseInt(form.manpower_count) || 0,
      percentage_complete: parseFloat(form.percentage_complete) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="daily-progress-form">
      <FormSection title="Log Overview" columns={2}>
        <InputField
          label="Reporting Date"
          name="date"
          type="date"
          required
          icon={Calendar}
          value={form.date}
          onChange={handleChange}
        />
        <SelectField
          label="Weather Condition"
          value={form.weather}
          options={[
            { label: "Clear / Sunny", value: "Clear" },
            { label: "Cloudy", value: "Cloudy" },
            { label: "Rainy", value: "Rainy" },
            { label: "Stormy", value: "Stormy" },
            { label: "Windy", value: "Windy" },
          ]}
          onChange={handleSelectChange("weather")}
          required
        />
        <InputField
          label="Manpower Count"
          name="manpower_count"
          type="number"
          required
          icon={Users}
          value={form.manpower_count}
          onChange={handleChange}
          placeholder="e.g. 15"
        />
        <InputField
          label="Completion (%)"
          name="percentage_complete"
          type="number"
          required
          icon={Percent}
          value={form.percentage_complete}
          onChange={handleChange}
          placeholder="0-100"
        />
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Work Executed Today"
          name="work_done"
          type="textarea"
          required
          icon={FileText}
          value={form.work_done}
          onChange={handleChange}
          placeholder="Describe the tasks completed today..."
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
          {isLoading ? "Saving..." : initialData ? "Update Log" : "Post Log"}
        </Button>
      </div>
    </form>
  );
};
