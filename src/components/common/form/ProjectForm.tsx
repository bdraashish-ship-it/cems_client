import React, { useState, useEffect } from "react";
import { FolderKanban, MapPin, Calendar, DollarSign, FileText, Tag, Users, Plus, X, Sparkles, Briefcase } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";
import {
  useGetAllProjectStatusesQuery,
  useGetAllProjectCategoriesQuery,
  useGetAllEmployeesQuery,
} from "../../../services/features/cemsApi";

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const AI_CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  road: ["Road & Highway"],
  highway: ["Road & Highway"],
  bridge: ["Bridge & Culvert"],
  culvert: ["Bridge & Culvert"],
  building: ["Building & Infra"],
  construction: ["Building & Infra"],
  water: ["Water & Sanitation"],
  sanitation: ["Water & Sanitation"],
  drainage: ["Water & Sanitation"],
  sewage: ["Water & Sanitation"],
  irrigation: ["Irrigation"],
  canal: ["Irrigation"],
  dam: ["Irrigation"],
  electrical: ["Electrical Works"],
  substation: ["Electrical Works"],
  power: ["Electrical Works"],
  survey: ["Survey & Design"],
  design: ["Survey & Design"],
  feasibility: ["Survey & Design"],
  maintenance: ["Maintenance"],
  repair: ["Maintenance"],
};

function suggestCategories(projectName: string, allCategories: any[]): any[] {
  if (!projectName || projectName.trim().length < 3) return [];
  const lower = projectName.toLowerCase();
  const matchedNames = new Set<string>();
  Object.entries(AI_CATEGORY_SUGGESTIONS).forEach(([keyword, cats]) => {
    if (lower.includes(keyword)) cats.forEach((c) => matchedNames.add(c));
  });
  return allCategories.filter((c) => matchedNames.has(c.name));
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const { data: statusData } = useGetAllProjectStatusesQuery();
  const { data: categoryData } = useGetAllProjectCategoriesQuery();
  const { data: employeeData } = useGetAllEmployeesQuery();

  const statuses = statusData?.data || [];
  const categories = categoryData?.data || [];
  const employees = employeeData?.data || [];

  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    start_date: "",
    end_date: "",
    budget: "",
    description: "",
    status_id: "",
    category_id: "",
  });

  const [members, setMembers] = useState<{ employee_id: number; role_in_project: string }[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [memberEmployeeId, setMemberEmployeeId] = useState<string>("");
  const [memberRole, setMemberRole] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        code: initialData.code || "",
        location: initialData.location || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        budget: initialData.budget?.toString() || "",
        description: initialData.description || "",
        status_id: initialData.status_id?.toString() || "",
        category_id: initialData.category_id?.toString() || "",
      });
      // Pre-populate members from existing project data
      if (initialData.members && Array.isArray(initialData.members)) {
        setMembers(
          initialData.members.map((m: any) => ({
            employee_id: m.employee_id,
            role_in_project: m.role_in_project || "",
          }))
        );
      }
    }
  }, [initialData]);

  // AI suggestion: fires when project name changes
  useEffect(() => {
    if (categories.length > 0) {
      const suggestions = suggestCategories(form.name, categories);
      setAiSuggestions(suggestions);
    }
  }, [form.name, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusChange = (val: string | number) => {
    setForm((prev) => ({ ...prev, status_id: val.toString() }));
  };

  const handleCategoryChange = (val: string | number) => {
    setForm((prev) => ({ ...prev, category_id: val.toString() }));
  };

  const applySuggestion = (cat: any) => {
    setForm((prev) => ({ ...prev, category_id: cat.id.toString() }));
  };

  const addMember = () => {
    const eid = parseInt(memberEmployeeId);
    if (!eid) return;
    if (members.some((m) => m.employee_id === eid)) return; // no duplicates
    setMembers((prev) => [...prev, { employee_id: eid, role_in_project: memberRole }]);
    setMemberEmployeeId("");
    setMemberRole("");
  };

  const removeMember = (employeeId: number) => {
    setMembers((prev) => prev.filter((m) => m.employee_id !== employeeId));
  };

  const getEmployeeName = (id: number) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? emp.full_name : `Employee #${id}`;
  };

  const getEmployeeDesignation = (id: number) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp?.designation || "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      budget: parseFloat(form.budget) || 0,
      status_id: parseInt(form.status_id) || 1,
      category_id: form.category_id ? parseInt(form.category_id) : undefined,
      members,
    };
    onSubmit(payload);
  };

  const selectedCategory = categories.find((c: any) => c.id.toString() === form.category_id);

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {/* ── BASIC INFO ── */}
      <FormSection title="Basic Information" columns={2}>
        <InputField
          label="Project Name"
          name="name"
          required
          icon={FolderKanban}
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Kathmandu Ring Road Expansion"
        />
        <InputField
          label="Project Code"
          name="code"
          required
          icon={FileText}
          value={form.code}
          onChange={handleChange}
          placeholder="e.g. KRR-01"
        />
        <InputField
          label="Location"
          name="location"
          required
          icon={MapPin}
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Lalitpur, Nepal"
        />
        <InputField
          label="Total Budget (NPR)"
          name="budget"
          type="number"
          required
          icon={DollarSign}
          value={form.budget}
          onChange={handleChange}
          placeholder="0.00"
        />
      </FormSection>

      {/* ── TIMELINE & STATUS ── */}
      <FormSection title="Timeline & Status" columns={2}>
        <InputField label="Start Date" name="start_date" type="date" required icon={Calendar} value={form.start_date} onChange={handleChange} />
        <InputField label="Expected End Date" name="end_date" type="date" required icon={Calendar} value={form.end_date} onChange={handleChange} />
        <SelectField
          label="Project Status"
          value={form.status_id ? parseInt(form.status_id) : undefined}
          options={statuses.map((s: any) => ({ label: s.name, value: s.id }))}
          onChange={handleStatusChange}
          placeholder="Select status..."
          required
        />
      </FormSection>

      {/* ── CATEGORY (AI-powered) ── */}
      <FormSection title="Project Category" columns={1}>
        <div>
          {/* AI Suggestions banner */}
          {aiSuggestions.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "1px solid #bae6fd", borderRadius: "10px",
              padding: "10px 14px", marginBottom: "12px",
              fontSize: "0.8rem", color: "#0369a1"
            }}>
              <Sparkles size={14} style={{ color: "#0284c7", flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>AI Suggests:</span>
              {aiSuggestions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => applySuggestion(cat)}
                  style={{
                    background: cat.color || "#3B82F6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <SelectField
            label="Category"
            value={form.category_id ? parseInt(form.category_id) : undefined}
            options={categories.map((c: any) => ({
              label: c.name,
              value: c.id,
            }))}
            onChange={handleCategoryChange}
            placeholder="Select or let AI suggest a category..."
          />

          {selectedCategory && (
            <div style={{
              marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "6px",
              background: selectedCategory.color || "#64748b",
              color: "#fff", borderRadius: "20px", padding: "4px 14px",
              fontSize: "0.75rem", fontWeight: 700
            }}>
              <Tag size={12} />
              {selectedCategory.name}
            </div>
          )}
        </div>
      </FormSection>

      {/* ── PROJECT MEMBERS ── */}
      <FormSection title="Project Members" columns={1}>
        <div>
          {/* Add member row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", alignItems: "flex-end", marginBottom: "14px" }}>
            <SelectField
              label="Employee"
              value={memberEmployeeId ? parseInt(memberEmployeeId) : undefined}
              options={employees
                .filter((e: any) => !members.some((m) => m.employee_id === e.id))
                .map((e: any) => ({ label: `${e.full_name} (${e.designation || "—"})`, value: e.id }))}
              onChange={(val) => setMemberEmployeeId(val.toString())}
              placeholder="Select employee..."
            />
            <InputField
              label="Role in Project"
              name="memberRole"
              icon={Briefcase}
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              placeholder="e.g. Site Engineer"
            />
            <button
              type="button"
              onClick={addMember}
              disabled={!memberEmployeeId}
              style={{
                height: "42px",
                padding: "0 16px",
                borderRadius: "8px",
                background: memberEmployeeId ? "#6366f1" : "#e2e8f0",
                color: memberEmployeeId ? "#fff" : "#94a3b8",
                border: "none",
                cursor: memberEmployeeId ? "pointer" : "not-allowed",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.85rem",
                marginBottom: "2px",
                transition: "background 0.2s",
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Members list */}
          {members.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "24px",
              border: "2px dashed #e2e8f0", borderRadius: "10px",
              color: "#94a3b8", fontSize: "0.85rem"
            }}>
              <Users size={28} style={{ marginBottom: "8px", opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No members assigned yet. Add employees above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {members.map((m) => (
                <div key={m.employee_id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: "10px", padding: "10px 14px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #818cf8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: "0.85rem"
                    }}>
                      {getEmployeeName(m.employee_id).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e293b" }}>
                        {getEmployeeName(m.employee_id)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {m.role_in_project || getEmployeeDesignation(m.employee_id) || "No role specified"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.employee_id)}
                    style={{
                      background: "transparent", border: "none",
                      color: "#ef4444", cursor: "pointer", padding: "4px", borderRadius: "6px"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* ── DESCRIPTION ── */}
      <div style={{ marginTop: "1.5rem" }}>
        <InputField
          label="Description"
          name="description"
          type="textarea"
          icon={FileText}
          value={form.description}
          onChange={handleChange}
          placeholder="Provide a brief overview of the project scope and objectives..."
        />
      </div>

      {/* ── ACTIONS ── */}
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
          {isLoading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
