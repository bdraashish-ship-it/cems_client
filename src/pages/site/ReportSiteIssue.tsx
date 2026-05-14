import { useState, useEffect } from "react";
import { AlertTriangle, FileText, Calendar, Tag, Info, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { useCreateSiteIssueMutation, useUpdateSiteIssueMutation, useGetSiteIssueByIdQuery } from "../../services/features/cemsApi";

const ReportSiteIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: issueData, isLoading: isFetching } = useGetSiteIssueByIdQuery(Number(id), { skip: !isEdit });
  const [createIssue, { isLoading: isCreating }] = useCreateSiteIssueMutation();
  const [updateIssue, { isLoading: isUpdating }] = useUpdateSiteIssueMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "low",
    reported_date: new Date().toISOString().split("T")[0],
    project_id: "1",
  });

  useEffect(() => {
    if (isEdit && issueData?.data) {
      const issue = issueData.data;
      setForm({
        title: issue.title || "",
        description: issue.description || "",
        severity: issue.severity || "low",
        reported_date: issue.reported_date || new Date().toISOString().split("T")[0],
        project_id: issue.project_id?.toString() || "1",
      });
    }
  }, [isEdit, issueData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        project_id: parseInt(form.project_id) || 1,
        status: isEdit ? issueData?.data?.status : "open"
      };
      if (isEdit) {
        await updateIssue({ id: Number(id), data: payload }).unwrap();
      } else {
        await createIssue(payload).unwrap();
      }
      navigate("/site-operations/site-issues/all");
    } catch (error) {
      console.error("Failed to save issue:", error);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <FormTemplate
      title={isEdit ? "Update Incident Report" : "Report Operational Incident"}
      description={isEdit ? "Modify documented site issues, risk levels, or resolution progress." : "Log new technical issues, safety hazards, or operational bottlenecks observed on site."}
      width="full"
      onSubmit={handleSubmit}
      headerActions={
        <Button variant="outline" size="sm" onClick={() => navigate("/site-operations/site-issues/all")} icon={<ArrowLeft size={16} />}>
          Back to List
        </Button>
      }
      footer={
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outline" type="button" onClick={() => navigate("/site-operations/site-issues/all")}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Report" : "Report Issue"}
          </Button>
        </div>
      }
    >
      <FormSection title="Incident Identification" columns={2}>
        <InputField label="Issue Heading" name="title" required icon={AlertTriangle} value={form.title} onChange={handleChange} placeholder="e.g. Concrete Vibrator Malfunction" />
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
            <Tag size={16} /> Risk Severity
          </label>
          <select
            name="severity"
            value={form.severity}
            onChange={handleChange as any}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem' }}
          >
            <option value="low">Low - Minor Impact</option>
            <option value="medium">Medium - Operational Delay</option>
            <option value="high">High - Safety / Critical Halt</option>
          </select>
        </div>
        <InputField label="Discovery Date" name="reported_date" type="date" required icon={Calendar} value={form.reported_date} onChange={handleChange} />
        <InputField label="Project ID / Context" name="project_id" type="number" required icon={Info} value={form.project_id} onChange={handleChange} />
      </FormSection>
      <div style={{ marginTop: "1.5rem" }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
          <FileText size={16} /> Technical Description & Context
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange as any}
          rows={6}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.875rem', lineHeight: '1.5' }}
          placeholder="Provide detailed technical observations, immediate actions taken, and potential impact on timelines..."
        ></textarea>
      </div>
    </FormTemplate>
  );
};

export default ReportSiteIssue;

