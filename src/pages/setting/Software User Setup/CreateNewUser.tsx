import React, { useState, useEffect } from "react";
import { 
  UserCircle, Mail, Phone, Lock, ArrowLeft, Shield, 
  CheckCircle2, AlertCircle, Loader2, Save,
  Camera, FileCheck, Info, Hash, FileText
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { FormTemplate } from "../../../components/common/form/Form";
import { InputField } from "../../../components/widgets/InputField";
import { FormSection } from "../../../components/widgets/FormSection";
import { Button } from "../../../components/widgets/Button";
import { SelectField } from "../../../components/widgets/SelectField";
import { ToggleSwitch } from "../../../components/widgets/ToggleSwitch";
import { Modal } from "../../../components/common/Modal/Modal";

import { 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useGetUserByIdQuery,
  useGetAllGendersQuery, 
  useGetAllRolesQuery,
  useGetAllDocumentTypesQuery
} from "../../../services/features/cemsApi";
import type { CreateUserForm } from "../../../types/user";
import { FILE_BASE } from "../../../redux/types/baseUrl";
import { parseError } from "../../../utils/errorParser";

const CreateNewUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: userData, isLoading: isFetching } = useGetUserByIdQuery(Number(id), { skip: !isEditMode });

  const { data: gendersData, isLoading: gendersLoading } = useGetAllGendersQuery();
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery();
  const { data: docTypesData, isLoading: docTypesLoading } = useGetAllDocumentTypesQuery();

  const genders = gendersData?.data ?? [];
  const roles = rolesData?.data ?? [];
  const docTypes = docTypesData?.data ?? [];

  /* ---------------- IMAGE STATE ---------------- */
  const [profileImage, setProfileImage] = useState<File[]>([]);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<File[]>([]);
  const [panPreview, setPanPreview] = useState<string | null>(null);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState<CreateUserForm>({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    gender_id: 0,
    role_id: 0,
    document_type_id: 0,
    document_number: "",
    username: "",
    password: "",
    information: ""
  });

  const [hasSoftwareAccess, setHasSoftwareAccess] = useState<boolean>(false);
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  /* ---------------- POPULATE ON EDIT ---------------- */
  useEffect(() => {
    const u = userData?.data || ((userData as any)?.id ? userData : null);

    if (isEditMode && u) {
      setForm({
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        middle_name: u.middle_name || "",
        email: u.email || "",
        phone_number: u.phone_number || "",
        gender_id: u.gender_id || 0,
        role_id: u.role_id || 0,
        document_type_id: u.document_type_id || 0,
        document_number: u.document_number || "",
        username: u.username || u.email || "",
        password: "", 
        information: u.information || ""
      });
      setHasSoftwareAccess(u.has_software_access ?? false);
      
      if (u.profile_photo) {
        setProfilePreview(`${FILE_BASE}/api/v1/uploads/profile_photos/${u.profile_photo}`);
      }
      if (u.document_file) {
        setPanPreview(`${FILE_BASE}/api/v1/uploads/document_files/${u.document_file}`);
      }
    }
  }, [isEditMode, userData]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof CreateUserForm) => (value: string | number) => {
    setForm(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleToggleAccess = () => {
    setHasSoftwareAccess(prev => !prev);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage([file]);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPanImage([file]);
      setPanPreview(URL.createObjectURL(file));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasSoftwareAccess && form.password && form.password.length < 6) {
      setStatusModal({ 
        isOpen: true, 
        type: "error", 
        message: "Security requirement: The temporary password must be at least 6 characters long." 
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("middle_name", form.middle_name || "");
    formData.append("email", form.email);
    formData.append("phone_number", form.phone_number);
    formData.append("gender_id", String(form.gender_id));
    formData.append("role_id", String(form.role_id));
    formData.append("document_type_id", String(form.document_type_id));
    formData.append("document_number", form.document_number || "");
    formData.append("username", form.username || form.email);
    formData.append("information", form.information || "");
    formData.append("has_software_access", hasSoftwareAccess ? "true" : "false");

    if (hasSoftwareAccess && form.password) {
      formData.append("password", form.password);
    }

    if (profileImage[0]) formData.append("profile_photo", profileImage[0]);
    if (panImage[0]) formData.append("document_file", panImage[0]);

    try {
      if (isEditMode) {
        await updateUser({ id: Number(id), data: formData }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "User account updated successfully!" });
      } else {
        await createUser(formData).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New user registered successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") navigate("/settings/users");
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <button onClick={() => navigate("/settings/users")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px" }}>
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <FormTemplate
          title={isEditMode ? "Modify Personnel Profile" : "Provision New Software User"}
          description={isEditMode ? "Update identity details, roles, and security permissions." : "Grant system access to staff members."}
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/users")} type="button">Cancel</Button>
              <Button variant="primary" type="submit" disabled={isLoading} style={{ minWidth: "180px" }}>
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                &nbsp; {isLoading ? "Synchronizing..." : isEditMode ? "Commit Updates" : "Provision User"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <FormSection title="Account Identity" columns={3} icon={<UserCircle size={18} color="#6366f1" />}>
                <InputField label="First Name" name="first_name" required icon={UserCircle} value={form.first_name} onChange={handleChange} />
                <InputField label="Middle Name" name="middle_name" icon={UserCircle} value={form.middle_name} onChange={handleChange} />
                <InputField label="Last Name" name="last_name" required icon={UserCircle} value={form.last_name} onChange={handleChange} />
                <div style={{ gridColumn: "span 3", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <SelectField label="Gender" value={form.gender_id} options={genders.map(g => ({ label: g.name, value: g.id }))} placeholder="Select gender" required onChange={handleSelectChange("gender_id")} />
                    <SelectField label="System Role" value={form.role_id} options={roles.map(r => ({ label: r.name, value: r.id }))} placeholder="Assign role" required onChange={handleSelectChange("role_id")} />
                </div>
              </FormSection>

              <FormSection title="Contact & Verification" columns={2} icon={<Mail size={18} color="#10b981" />}>
                <InputField label="Primary Email" name="email" type="email" required icon={Mail} value={form.email} onChange={handleChange} />
                <InputField label="Mobile Number" name="phone_number" type="tel" required icon={Phone} value={form.phone_number} onChange={handleChange} />
                <SelectField label="ID Document Type" value={form.document_type_id} options={docTypes.map(d => ({ label: d.name, value: d.id }))} placeholder="Select document type" onChange={handleSelectChange("document_type_id")} />
                <InputField label="Document / PAN Number" name="document_number" icon={Hash} value={form.document_number} onChange={handleChange} />
              </FormSection>

              <FormSection title="System Information" columns={1} icon={<FileText size={18} color="#f59e0b" />}>
                <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                    Personnel Notes / Professional Background
                  </label>
                  <textarea
                    name="information"
                    value={form.information}
                    onChange={handleChange}
                    placeholder="Enter skills, certifications, or internal history..."
                    style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", background: "#fff" }}
                  />
                </div>
              </FormSection>

              <FormSection title="Security & Authentication" columns={1} icon={<Shield size={18} color="#ef4444" />}>
                <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <ToggleSwitch id="access-toggle" checked={hasSoftwareAccess} onChange={handleToggleAccess} label="Enable Software Login" size="md" color="indigo" />
                  {hasSoftwareAccess && (
                    <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                      <InputField label={isEditMode ? "Reset Password (Blank to keep)" : "Initial Password"} name="password" type="password" required={!isEditMode} icon={Lock} value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
                    </div>
                  )}
                </div>
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", marginBottom: "16px", textAlign: "left" }}>Profile Photo</div>
                <div style={{ width: "140px", height: "140px", borderRadius: "50%", border: "3px solid #f1f5f9", overflow: "hidden", margin: "0 auto 16px", position: "relative", background: "#f8fafc" }}>
                  {profilePreview ? <img src={profilePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserCircle size={64} color="#cbd5e1" />}
                  <label style={{ position: "absolute", bottom: "4px", right: "4px", background: "#6366f1", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #fff" }}>
                    <Camera size={16} /><input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1e293b", marginBottom: "16px" }}>Verification Document</div>
                <div onClick={() => document.getElementById('doc-upload')?.click()} style={{ width: "100%", aspectRatio: "3/2", borderRadius: "12px", border: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f8fafc", overflow: "hidden" }}>
                  {panPreview ? <img src={panPreview} alt="Doc" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FileCheck size={32} color="#94a3b8" />}
                  <input id="doc-upload" type="file" hidden accept="image/*" onChange={handleDocChange} />
                </div>
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
          <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "1rem" }}>{statusModal.message}</p>
          <Button variant="primary" onClick={handleModalClose} style={{ width: "100%" }}>Dismiss</Button>
        </div>
      </Modal>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateNewUser;
