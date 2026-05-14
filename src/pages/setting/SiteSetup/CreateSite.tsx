import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2, FileText, Loader2, ArrowLeft,
  CheckCircle2, AlertTriangle, MapPin, Tag,
  Calendar, Briefcase, Camera, X, Plus, Info,
  Users, Layers, Save
} from "lucide-react";
import { InputField } from "../../../components/widgets/InputField";
import { SelectField } from "../../../components/widgets/SelectField";
import { MultiSelectField } from "../../../components/widgets/MultiSelectField";
import { Modal } from "../../../components/common/Modal/Modal";
import { Button } from "../../../components/widgets/Button";
import { FormTemplate } from "../../../components/common/form/Form";
import { FormSection } from "../../../components/widgets/FormSection";
import {
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useGetSiteByIdQuery,
  useGetAllSiteTypesQuery,
  useGetAllProjectsQuery,
  useGetAllEmployeesQuery,
  useGetAllClientsQuery,
  useGetAllProjectStatusesQuery
} from "../../../services/features/cemsApi";
import { parseError } from "../../../utils/errorParser";

const CreateSite = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: siteData, isLoading: isLoadingSite } = useGetSiteByIdQuery(Number(id), { skip: !isEditMode });
  const { data: siteTypesData } = useGetAllSiteTypesQuery();
  const { data: projectsData } = useGetAllProjectsQuery();
  const { data: employeesData } = useGetAllEmployeesQuery();
  const { data: clientsData } = useGetAllClientsQuery();
  const { data: statusesData } = useGetAllProjectStatusesQuery();

  const [createSite, { isLoading: isCreating }] = useCreateSiteMutation();
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  const [form, setForm] = useState({
    name: "",
    site_code: "",
    description: "",
    start_date: "",
    end_date: "",
    site_type_id: "",
    client_id: "",
    status_id: "",
    project_ids: [] as (string | number)[],
    employee_ids: [] as (string | number)[],
    is_active: true,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (isEditMode && siteData?.data) {
      const site = siteData.data;
      setForm({
        name: site.name || "",
        site_code: site.site_code || "",
        description: site.description || "",
        start_date: site.start_date || "",
        end_date: site.end_date || "",
        site_type_id: site.site_type_id?.toString() || "",
        client_id: site.client_id?.toString() || "",
        status_id: site.status_id?.toString() || "",
        project_ids: site.project_ids || [],
        employee_ids: site.employee_ids || [],
        is_active: site.is_active ?? true,
      });
    }
  }, [isEditMode, siteData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value.toString() }));
  };

  const handleMultiSelectChange = (name: string) => (values: (string | number)[]) => {
    setForm(prev => ({ ...prev, [name]: values }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Site name is required." });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("site_code", form.site_code);
    formData.append("description", form.description);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    if (form.site_type_id) formData.append("site_type_id", form.site_type_id);
    if (form.client_id) formData.append("client_id", form.client_id);
    if (form.status_id) formData.append("status_id", form.status_id);
    formData.append("is_active", String(form.is_active));

    formData.append("project_ids", JSON.stringify(form.project_ids.map(id => Number(id))));
    formData.append("employee_ids", JSON.stringify(form.employee_ids.map(id => Number(id))));

    selectedImages.forEach(image => {
      formData.append("images", image);
    });

    try {
      if (isEditMode) {
        await updateSite({ id: Number(id), data: formData }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Site updated successfully!" });
      } else {
        await createSite(formData).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Site established successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/sites");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isLoadingSite;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <button 
          onClick={() => navigate("/settings/sites")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Site Inventory
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Site Data" : "Register New Construction Site"}
          description="Establish and manage physical work areas. Site records allow for detailed progress tracking and resource allocation across multiple projects."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/sites")} type="button">
                Discard Changes
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: "180px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Processing..." : isEditMode ? "Save Site Updates" : "Establish Site"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <FormSection title="Core Identification" columns={2} icon={<MapPin size={18} color="#6366f1" />}>
                <div style={{ gridColumn: "span 2" }}>
                  <InputField
                    label="Work Area / Site Name"
                    name="name"
                    required
                    icon={Building2}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Bridge Deck Section A"
                  />
                </div>
                <InputField
                  label="Site Reference Code"
                  name="site_code"
                  icon={Tag}
                  value={form.site_code}
                  onChange={handleChange}
                  placeholder="e.g. SITE-001"
                />
                <SelectField
                  label="Site Category"
                  value={form.site_type_id ? Number(form.site_type_id) : undefined}
                  options={siteTypesData?.data?.map((t: any) => ({ label: t.name, value: t.id })) || []}
                  onChange={handleSelectChange("site_type_id")}
                  placeholder="Select type..."
                />
                <div style={{ gridColumn: "span 2" }}>
                  <InputField
                    label="Detailed Scope / Description"
                    name="description"
                    type="textarea"
                    icon={FileText}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the scope of work and specific location details..."
                    rows={4}
                  />
                </div>
              </FormSection>

              <FormSection title="Project & Staff Assignment" columns={2} icon={<Users size={18} color="#10b981" />}>
                <div style={{ gridColumn: "span 2" }}>
                  <MultiSelectField
                    label="Associated Projects"
                    values={form.project_ids}
                    options={projectsData?.data?.map((p: any) => ({ label: p.name, value: p.id })) || []}
                    onChange={handleMultiSelectChange("project_ids")}
                    placeholder="Link to one or more projects..."
                  />
                </div>
                <SelectField
                  label="Primary Client"
                  value={form.client_id ? Number(form.client_id) : undefined}
                  options={clientsData?.data?.map((c: any) => ({ label: c.name, value: c.id })) || []}
                  onChange={handleSelectChange("client_id")}
                  placeholder="Assign client..."
                />
                <SelectField
                    label="Workflow Status"
                    value={form.status_id ? Number(form.status_id) : undefined}
                    options={statusesData?.data?.map((s: any) => ({ label: s.name, value: s.id })) || []}
                    onChange={handleSelectChange("status_id")}
                    placeholder="Select status..."
                />
                <div style={{ gridColumn: "span 2" }}>
                  <MultiSelectField
                    label="Assigned Supervisors / Team"
                    values={form.employee_ids}
                    options={employeesData?.data?.map((e: any) => ({ label: e.full_name, value: e.id })) || []}
                    onChange={handleMultiSelectChange("employee_ids")}
                    placeholder="Assign responsible staff..."
                  />
                </div>
              </FormSection>

              <FormSection title="Timeline & Scheduling" columns={2} icon={<Calendar size={18} color="#f59e0b" />}>
                <InputField
                  label="Anticipated Start"
                  name="start_date"
                  type="date"
                  icon={Calendar}
                  value={form.start_date}
                  onChange={handleChange}
                />
                <InputField
                  label="Target Completion"
                  name="end_date"
                  type="date"
                  icon={Calendar}
                  value={form.end_date}
                  onChange={handleChange}
                />
              </FormSection>

              <FormSection title="Visual Documentation" columns={1} icon={<Camera size={18} color="#8b5cf6" />}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "32px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: "#f8fafc" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <Camera size={32} color="#94a3b8" style={{ marginBottom: "12px" }} />
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>Upload Site Photos</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>Select multiple images (PNG, JPG, Max 5MB)</div>
                  <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </div>

                {imagePreviews.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "12px", marginTop: "16px" }}>
                    {imagePreviews.map((src, index) => (
                      <div key={index} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                        <img src={src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => removeImage(index)} style={{ position: "absolute", top: "6px", right: "6px", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", color: "#ef4444", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ aspectRatio: "1/1", borderRadius: "12px", border: "1.5px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", background: "#f8fafc" }}
                    >
                      <Plus size={24} />
                    </div>
                  </div>
                )}
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                   <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)" }} />
                   <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>Integration Summary</span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                   <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Layers size={16} /></div>
                      <div>
                         <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", marginBottom: "2px" }}>Multi-Project Linking</div>
                         <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>Log data will sync across all linked engineering projects.</div>
                      </div>
                   </div>
                   <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f0fdf4", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Users size={16} /></div>
                      <div>
                         <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", marginBottom: "2px" }}>Team Collaboration</div>
                         <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>Multiple supervisors can manage and report on this site.</div>
                      </div>
                   </div>
                </div>

                <div style={{ padding: "16px", background: form.is_active ? "#f0fdf4" : "#fef2f2", borderRadius: "12px", border: `1px solid ${form.is_active ? "#dcfce7" : "#fee2e2"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: form.is_active ? "#166534" : "#991b1b" }}>Operational Status</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: form.is_active ? "#15803d" : "#dc2626" }}>{form.is_active ? "Live & Active" : "Suspended"}</div>
                   </div>
                   <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
                      <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: form.is_active ? "#10b981" : "#cbd5e1", transition: ".4s", borderRadius: "34px" }}>
                        <span style={{ position: "absolute", height: "18px", width: "18px", left: "3px", bottom: "3px", backgroundColor: "white", transition: ".4s", borderRadius: "50%", transform: form.is_active ? "translateX(20px)" : "none" }}></span>
                      </span>
                   </label>
                </div>
              </div>
            </div>
          </div>
        </FormTemplate>
      </div>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={handleModalClose}
        title={statusModal.type === "success" ? "Success" : "Error"}
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px", textAlign: "center" }}>
          <div style={{ 
            width: "72px", height: "72px", borderRadius: "50%", 
            background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", 
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" 
          }}>
            {statusModal.type === "success" ? <CheckCircle2 size={36} color="#16a34a" /> : <AlertTriangle size={36} color="#dc2626" />}
          </div>
          <h3 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "1.35rem", fontWeight: 800 }}>
            {statusModal.type === "success" ? "Operation Successful" : "Action Failed"}
          </h3>
          <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "1rem", lineHeight: 1.5 }}>
            {statusModal.message}
          </p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%", padding: "14px" }}>
            {statusModal.type === "success" ? "Return to Inventory" : "Close & Review"}
          </Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateSite;
