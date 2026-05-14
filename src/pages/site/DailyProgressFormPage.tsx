import { useState, useEffect } from "react";
import { FileText, Calendar, CloudSun, User, ArrowLeft, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { useCreateDailyProgressMutation, useUpdateDailyProgressMutation, useGetDailyProgressByIdQuery } from "../../services/features/cemsApi";

const DailyProgressFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: progressData, isLoading: isFetching } = useGetDailyProgressByIdQuery(Number(id), { skip: !isEdit });
  const [createProgress, { isLoading: isCreating }] = useCreateDailyProgressMutation();
  const [updateProgress, { isLoading: isUpdating }] = useUpdateDailyProgressMutation();

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weather: "Clear",
    work_description: "",
    manpower_count: "",
    supervisor_id: "1",
    project_id: "1",
  });

  useEffect(() => {
    if (isEdit && progressData?.data) {
      const p = progressData.data;
      setForm({
        date: p.date || new Date().toISOString().split("T")[0],
        weather: p.weather || "Clear",
        work_description: p.work_description || "",
        manpower_count: p.manpower_count?.toString() || "",
        supervisor_id: p.supervisor_id?.toString() || "1",
        project_id: p.project_id?.toString() || "1",
      });
    }
  }, [isEdit, progressData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        manpower_count: parseInt(form.manpower_count) || 0,
        supervisor_id: parseInt(form.supervisor_id) || 1,
        project_id: parseInt(form.project_id) || 1,
      };
      if (isEdit) {
        await updateProgress({ id: Number(id), data: payload }).unwrap();
      } else {
        await createProgress(payload).unwrap();
      }
      navigate("/site-operations/daily-progress/all");
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <FormTemplate
      title={isEdit ? "Update Daily Log" : "New Daily Site Record"}
      description={isEdit ? "Modify documented site activities, manpower logs, or weather conditions for this date." : "Document daily site activities, workforce statistics, and environmental conditions."}
      width="full"
      onSubmit={handleSubmit}
      headerActions={
        <Button variant="outline" size="sm" onClick={() => navigate("/site-operations/daily-progress/all")} icon={<ArrowLeft size={16} />}>
          Back to List
        </Button>
      }
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outline" type="button" onClick={() => navigate("/site-operations/daily-progress/all")}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Log" : "Submit Log"}
          </Button>
        </div>
      }
    >
      <FormSection title="Log Identification & Context" columns={2}>
        <InputField label="Reporting Date" name="date" type="date" required icon={Calendar} value={form.date} onChange={handleChange} />
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
            <CloudSun size={16} /> Weather Conditions
          </label>
          <select
            name="weather"
            value={form.weather}
            onChange={handleChange as any}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem' }}
          >
            <option value="Clear">Clear / Sunny</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Rainy">Rainy / Stormy</option>
            <option value="Hot">Extreme Heat</option>
          </select>
        </div>
        <InputField label="Manpower Count" name="manpower_count" type="number" required icon={User} value={form.manpower_count} onChange={handleChange} placeholder="Total workforce on site" />
        <InputField label="Supervisor ID" name="supervisor_id" type="number" required icon={Target} value={form.supervisor_id} onChange={handleChange} />
      </FormSection>
      <div style={{ marginTop: "1.5rem" }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
          <FileText size={16} /> Technical Work Summary
        </label>
        <textarea
          name="work_description"
          value={form.work_description}
          onChange={handleChange as any}
          rows={6}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem', lineHeight: '1.5' }}
          placeholder="Describe the technical progress achieved today, milestones reached, and any blockers..."
        ></textarea>
      </div>
    </FormTemplate>
  );
};

export default DailyProgressFormPage;
