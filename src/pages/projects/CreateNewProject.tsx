import { useState, useEffect, useMemo } from "react";
import {
  FolderKanban, MapPin, Calendar, DollarSign, FileText,
  Tag, Users, Plus, X, Sparkles, Briefcase, ArrowLeft,
  CheckCircle2, Clock, Building2, Hash, Loader2, Save,
  Crown, AlertCircle, Trash2, Layout
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { SelectField } from "../../components/widgets/SelectField";
import { Modal } from "../../components/common/Modal/Modal";

import {
  useGetAllProjectStatusesQuery,
  useGetAllProjectCategoriesQuery,
  useGetAllEmployeesQuery,
  useGetAllClientsQuery,
  useGetAllSitesQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProjectByIdQuery,
  useGetAllDesignationsQuery,
} from "../../services/features/cemsApi";
import { parseError } from "../../utils/errorParser";

const AI_HINTS: Record<string, string[]> = {
  road: ["Road & Highway"], highway: ["Road & Highway"],
  bridge: ["Bridge & Culvert"], culvert: ["Bridge & Culvert"],
  building: ["Building & Infra"], construction: ["Building & Infra"],
  water: ["Water & Sanitation"], sanitation: ["Water & Sanitation"],
  irrigation: ["Irrigation"], canal: ["Irrigation"], dam: ["Irrigation"],
  electrical: ["Electrical Works"], power: ["Electrical Works"],
  survey: ["Survey & Design"], maintenance: ["Maintenance"],
};

function getSuggestions(name: string, cats: any[]) {
  const lower = name.toLowerCase();
  const matched = new Set<string>();
  Object.entries(AI_HINTS).forEach(([k, v]) => { if (lower.includes(k)) v.forEach(n => matched.add(n)); });
  return cats.filter(c => matched.has(c.name));
}

const CreateNewProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: projectResponse, isLoading: isFetching } = useGetProjectByIdQuery(Number(id), { skip: !isEdit });
  const { data: statusData } = useGetAllProjectStatusesQuery();
  const { data: categoryData } = useGetAllProjectCategoriesQuery();
  const { data: employeeData } = useGetAllEmployeesQuery();
  const { data: clientData } = useGetAllClientsQuery();
  const { data: siteData } = useGetAllSitesQuery();
  const { data: designationData } = useGetAllDesignationsQuery();

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    status_id: "",
    category_id: "",
    client_id: "",
  });

  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [members, setMembers] = useState<{ employee_id: number; role_in_project: string; is_leader: boolean }[]>([]);
  
  // Local states for member addition
  const [memberEmpId, setMemberEmpId] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [isLeader, setIsLeader] = useState(false);

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    const p = projectResponse?.data || ((projectResponse as any)?.id ? projectResponse : null);
    if (isEdit && p) {
      setForm({
        name: p.name || "",
        code: p.code || "",
        location: p.location || "",
        description: p.description || "",
        start_date: p.start_date || "",
        end_date: p.end_date || "",
        budget: p.budget?.toString() || "",
        status_id: p.status_id?.toString() || "",
        category_id: p.category_id?.toString() || "",
        client_id: p.client_id?.toString() || "",
      });
      setSelectedSites(p.sites?.map((s: any) => s.id) || []);
      setMembers(p.members?.map((m: any) => ({
        employee_id: m.employee_id,
        role_in_project: m.role_in_project || "",
        is_leader: m.is_leader || false
      })) || []);
    }
  }, [isEdit, projectResponse]);

  const aiSuggestions = useMemo(() => {
    return categoryData?.data ? getSuggestions(form.name, categoryData.data) : [];
  }, [form.name, categoryData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSite = (siteId: number) => {
    setSelectedSites(prev => 
      prev.includes(siteId) ? prev.filter(id => id !== siteId) : [...prev, siteId]
    );
  };

  const addMember = () => {
    const eid = parseInt(memberEmpId);
    if (!eid || members.some(m => m.employee_id === eid)) return;
    
    if (isLeader && members.filter(m => m.is_leader).length >= 4) {
      setStatusModal({ isOpen: true, type: "error", message: "A project can have a maximum of 4 leaders." });
      return;
    }

    setMembers(p => [...p, { employee_id: eid, role_in_project: memberRole, is_leader: isLeader }]);
    setMemberEmpId(""); setMemberRole(""); setIsLeader(false);
  };

  const removeMember = (id: number) => setMembers(p => p.filter(m => m.employee_id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Project Name and Code are mandatory." });
      return;
    }

    try {
      const payload = {
        ...form,
        budget: parseFloat(form.budget) || 0,
        status_id: parseInt(form.status_id) || null,
        category_id: parseInt(form.category_id) || null,
        client_id: parseInt(form.client_id) || null,
        site_ids: selectedSites,
        members: members
      };

      if (isEdit) {
        await updateProject({ id: Number(id), data: payload }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Project lifecycle updated successfully!" });
      } else {
        await createProject(payload).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New engineering project successfully initiated!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") navigate("/projects");
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isFetching;

  const statuses = statusData?.data || [];
  const categories = categoryData?.data || [];
  const employees = employeeData?.data || [];
  const clients = clientData?.data || [];
  const sites = siteData?.data || [];
  const designations = designationData?.data || [];

  const selectedCat = categories.find((c: any) => c.id.toString() === form.category_id);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <button
          onClick={() => navigate("/projects")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Back to Projects
        </button>

        <FormTemplate
          title={isEdit ? "Refine Project Blueprint" : "Initialize New Project"}
          description={isEdit ? "Update technical scope, financial allocations, and team assignments." : "Establish a new civil engineering project with defined sites, teams, and budget."}
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/projects")} type="button">Discard</Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{ minWidth: "200px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Synchronizing..." : isEdit ? "Commit Updates" : "Initiate Project"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              <FormSection title="Basic Specifications" columns={2} icon={<Layout size={18} color="#6366f1" />}>
                <InputField label="Project Designation" name="name" required icon={FolderKanban} value={form.name} onChange={handleChange} placeholder="e.g. Metro Line Extension" />
                <InputField label="Project ID / Code" name="code" required icon={Hash} value={form.code} onChange={handleChange} placeholder="PRJ-2024-001" />
                <InputField label="Global Location" name="location" icon={MapPin} value={form.location} onChange={handleChange} placeholder="e.g. Kathmandu, Nepal" />
                <InputField label="Total Budget Allocation (NPR)" name="budget" type="number" icon={DollarSign} value={form.budget} onChange={handleChange} placeholder="0.00" />
              </FormSection>

              <FormSection title="Timeline & Classification" columns={2} icon={<Clock size={18} color="#10b981" />}>
                <InputField label="Commencement Date" name="start_date" type="date" icon={Calendar} value={form.start_date} onChange={handleChange} />
                <InputField label="Expected Completion" name="end_date" type="date" icon={Calendar} value={form.end_date} onChange={handleChange} />
                <SelectField label="Current Lifecycle Status" value={form.status_id} options={statuses.map((s: any) => ({ label: s.name, value: s.id.toString() }))} placeholder="Select Status" onChange={(val) => setForm(prev => ({ ...prev, status_id: val.toString() }))} />
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <SelectField label="Project Classification" value={form.category_id} options={categories.map((c: any) => ({ label: c.name, value: c.id.toString() }))} placeholder="Select Category" onChange={(val) => setForm(prev => ({ ...prev, category_id: val.toString() }))} />
                  {aiSuggestions.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Sparkles size={10} color="#f59e0b" /> Suggests:</span>
                      {aiSuggestions.map((cat: any) => (
                        <button key={cat.id} type="button" onClick={() => setForm(p => ({ ...p, category_id: cat.id.toString() }))} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "2px 8px", fontSize: "0.7rem", cursor: "pointer", color: "#475569" }}>{cat.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              <FormSection title="Client & Sites" columns={1} icon={<Building2 size={18} color="#3b82f6" />}>
                <SelectField label="Associated Client / Owner" value={form.client_id} options={clients.map((c: any) => ({ label: `${c.name} (${c.contact_person || 'N/A'})`, value: c.id.toString() }))} placeholder="Search Client" onChange={(val) => setForm(prev => ({ ...prev, client_id: val.toString() }))} />
                
                <div style={{ marginTop: "16px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "12px", display: "block" }}>Operational Sites</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    {sites.length === 0 ? <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>No sites registered. <a href="/settings/sites/create" style={{ color: "#6366f1" }}>Register one first</a>.</span> : (
                      sites.map((s: any) => (
                        <div key={s.id} onClick={() => toggleSite(s.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "12px", background: selectedSites.includes(s.id) ? "#6366f1" : "#fff", color: selectedSites.includes(s.id) ? "#fff" : "#475569", border: `1px solid ${selectedSites.includes(s.id) ? "#6366f1" : "#e2e8f0"}`, transition: "all 0.2s" }}>
                          <MapPin size={14} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{s.name}</span>
                          {selectedSites.includes(s.id) && <CheckCircle2 size={14} />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </FormSection>

              <FormSection title="Team Management" columns={1} icon={<Users size={18} color="#8b5cf6" />}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 60px auto", gap: "12px", alignItems: "flex-end", marginBottom: "20px" }}>
                  <SelectField label="Select Employee" value={memberEmpId} options={employees.filter((e: any) => !members.some(m => m.employee_id === e.id)).map((e: any) => ({ label: `${e.full_name} (${e.designation || 'Staff'})`, value: e.id.toString() }))} placeholder="Search..." onChange={(v: string | number) => setMemberEmpId(v.toString())} />
                  <SelectField label="Assigned Role" value={memberRole} options={designations.map((d: any) => ({ label: d.name, value: d.name }))} placeholder="Select Role..." onChange={(v: string | number) => setMemberRole(v.toString())} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>Leader</span>
                    <button type="button" onClick={() => setIsLeader(!isLeader)} style={{ width: "38px", height: "38px", borderRadius: "10px", border: `2px solid ${isLeader ? "#f59e0b" : "#e2e8f0"}`, background: isLeader ? "#fffbeb" : "#fff", color: isLeader ? "#f59e0b" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Crown size={20} fill={isLeader ? "#f59e0b" : "none"} />
                    </button>
                  </div>
                  <Button variant="primary" type="button" onClick={addMember} disabled={!memberEmpId} style={{ height: "42px", padding: "0 20px" }}><Plus size={18} /></Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {members.map(m => {
                    const emp = employees.find((e: any) => e.id === m.employee_id);
                    return (
                      <div key={m.employee_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: m.is_leader ? "#f59e0b" : "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{emp?.full_name?.charAt(0)}</div>
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                              {emp?.full_name} {m.is_leader && <Crown size={12} color="#f59e0b" fill="#f59e0b" />}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.role_in_project || 'Project Member'}</div>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeMember(m.employee_id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                  {members.length === 0 && <div style={{ textAlign: "center", padding: "30px", border: "2px dashed #e2e8f0", borderRadius: "16px", color: "#94a3b8", fontSize: "0.85rem" }}>Assign team members to this project.</div>}
                </div>
              </FormSection>

              <FormSection title="Technical Overview" columns={1} icon={<FileText size={18} color="#64748b" />}>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed project scope, site constraints, and technical goals..." style={{ width: "100%", minHeight: "120px", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }} />
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Blueprint Preview</div>
                <div style={{ height: "4px", width: "40px", background: selectedCat?.color || "#6366f1", borderRadius: "2px", marginBottom: "12px" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{form.name || 'Untitled Project'}</h3>
                {form.code && <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6366f1", background: "#f5f3ff", padding: "4px 10px", borderRadius: "8px", width: "fit-content", marginBottom: "20px" }}>{form.code}</div>}
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {form.budget && <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}><DollarSign size={14} /> NPR {parseFloat(form.budget).toLocaleString()}</div>}
                  {form.location && <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={14} /> {form.location}</div>}
                  {selectedCat && <div style={{ fontSize: "0.75rem", color: "#fff", background: selectedCat.color, padding: "4px 12px", borderRadius: "20px", width: "fit-content", fontWeight: 700 }}>{selectedCat.name}</div>}
                </div>

                {members.length > 0 && (
                  <div style={{ marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "10px" }}>Active Team ({members.length})</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {members.slice(0, 8).map((m, i) => (
                        <div key={m.employee_id} title={employees.find((e: any) => e.id === m.employee_id)?.full_name} style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.is_leader ? "#f59e0b" : "#6366f1", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7rem", fontWeight: 800, marginLeft: i === 0 ? 0 : "-8px" }}>{employees.find((e: any) => e.id === m.employee_id)?.full_name?.charAt(0)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "20px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "20px", padding: "20px", color: "#fff" }}>
                <Sparkles size={20} style={{ marginBottom: "10px" }} />
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>CEMS Intelligent Engine</div>
                <p style={{ fontSize: "0.75rem", opacity: 0.9, lineHeight: 1.5 }}>Link multiple sites to this project to track logistics and daily progress across different zones simultaneously.</p>
              </div>
            </div>
          </div>
        </FormTemplate>
      </div>

      <Modal isOpen={statusModal.isOpen} onClose={handleModalClose} title={statusModal.type === "success" ? "Success" : "Error"} size="sm">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
            {statusModal.type === "success" ? <CheckCircle2 size={36} color="#16a34a" /> : <AlertCircle size={36} color="#dc2626" />}
          </div>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>{statusModal.message}</p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>Continue</Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateNewProject;
