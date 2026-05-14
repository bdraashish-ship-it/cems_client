import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Briefcase, ArrowLeft, Hash,
  UserCircle, Calendar, FileText, Camera, Upload, CheckCircle2,
  AlertCircle, Loader2, Save, Info, ShieldCheck, HeartPulse,
  PhoneCall, Users
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { FormTemplate } from "../../../components/common/form/Form";
import { InputField } from "../../../components/widgets/InputField";
import { FormSection } from "../../../components/widgets/FormSection";
import { Button } from "../../../components/widgets/Button";
import { SelectField } from "../../../components/widgets/SelectField";
import { Modal } from "../../../components/common/Modal/Modal";

import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useGetAllGendersQuery,
  useGetAllSalutationsQuery,
  useGetAllDesignationsQuery,
  useGetAllDocumentTypesQuery
} from "../../../services/features/cemsApi";
import { FILE_BASE } from "../../../redux/types/baseUrl";
import { parseError } from "../../../utils/errorParser";

const CreateNewEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: employeeResponse, isLoading: isFetching } = useGetEmployeeByIdQuery(Number(id), { skip: !isEdit });
  const { data: gendersData } = useGetAllGendersQuery();
  const { data: salutationsData } = useGetAllSalutationsQuery();
  const { data: designationsData } = useGetAllDesignationsQuery();
  const { data: docTypesData } = useGetAllDocumentTypesQuery();

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  const [form, setForm] = useState({
    salutation_id: "",
    full_name: "",
    gender_id: "",
    email: "",
    phone: "",
    employee_code: "",
    blood_group: "",
    join_date: "",
    designation_id: "",
    document_type_id: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    information: ""
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    const e = employeeResponse?.data || ((employeeResponse as any)?.id ? employeeResponse : null);

    if (isEdit && e) {
      setForm({
        salutation_id: e.salutation_id?.toString() || "",
        full_name: e.full_name || "",
        gender_id: e.gender_id?.toString() || "",
        email: e.email || "",
        phone: e.phone || "",
        employee_code: e.employee_code || "",
        blood_group: e.blood_group || "",
        join_date: e.join_date || "",
        designation_id: e.designation_id?.toString() || "",
        document_type_id: e.document_type_id?.toString() || "",
        emergency_contact_name: e.emergency_contact_name || "",
        emergency_contact_phone: e.emergency_contact_phone || "",
        information: e.information || ""
      });

      if (e.profile_photo) {
        setPhotoPreview(`${FILE_BASE}/api/v1/uploads/profile_photos/${e.profile_photo}`);
      }
      if (e.document_file) {
        setDocPreview(`${FILE_BASE}/api/v1/uploads/document_files/${e.document_file}`);
      }
    }
  }, [isEdit, employeeResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFile(file);
      setDocPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Employee full name is required." });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      if (photoFile) formData.append("profile_photo", photoFile);
      if (docFile) formData.append("document_file", docFile);

      if (isEdit) {
        await updateEmployee({ id: Number(id), data: formData }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Personnel file updated successfully!" });
      } else {
        await createEmployee(formData).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New employee onboarded successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/employees");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isFetching;

  const genderOptions = gendersData?.data?.map((g: any) => ({ label: g.name, value: g.id.toString() })) || [];
  const salutationOptions = salutationsData?.data?.map((s: any) => ({ label: s.name, value: s.id.toString() })) || [];
  const designationOptions = designationsData?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })) || [];
  const docTypeOptions = docTypesData?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })) || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <button
          onClick={() => navigate("/settings/employees")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <FormTemplate
          title={isEdit ? "Modify Personnel Record" : "Onboard New Employee"}
          description={isEdit ? "Update professional details, contact info, and identity verification." : "Initialize a new staff member in the CEMS ecosystem."}
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/employees")} type="button">Discard</Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{ minWidth: "180px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Processing..." : isEdit ? "Commit Changes" : "Confirm Onboarding"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              <FormSection title="Professional Identity" columns={3} icon={<UserCircle size={18} color="#6366f1" />}>
                <div style={{ gridColumn: "span 3", display: "flex", gap: "16px" }}>
                  <div style={{ width: "120px" }}>
                    <SelectField label="Prefix" value={form.salutation_id} options={salutationOptions} placeholder="..." onChange={(val) => setForm(prev => ({ ...prev, salutation_id: val.toString() }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <InputField label="Full Name" name="full_name" required icon={User} value={form.full_name} onChange={handleChange} placeholder="e.g. John Doe" />
                  </div>
                </div>
                <InputField label="Employee Code" name="employee_code" icon={Hash} value={form.employee_code} onChange={handleChange} placeholder="EMP-001" />
                <SelectField label="Gender" value={form.gender_id} options={genderOptions} placeholder="Select" onChange={(val) => setForm(prev => ({ ...prev, gender_id: val.toString() }))} />
                <InputField label="Blood Group" name="blood_group" icon={HeartPulse} value={form.blood_group} onChange={handleChange} placeholder="e.g. O+ve" />
              </FormSection>

              <FormSection title="Employment Details" columns={2} icon={<Briefcase size={18} color="#10b981" />}>
                <SelectField label="Primary Designation" value={form.designation_id} options={designationOptions} placeholder="Select Designation" onChange={(val) => setForm(prev => ({ ...prev, designation_id: val.toString() }))} />
                <InputField label="Joining Date" name="join_date" type="date" icon={Calendar} value={form.join_date} onChange={handleChange} />
                <InputField label="Official Email" name="email" type="email" required icon={Mail} value={form.email} onChange={handleChange} />
                <InputField label="Contact Number" name="phone" type="tel" icon={Phone} value={form.phone} onChange={handleChange} />
              </FormSection>

              <FormSection title="Identity & Emergency" columns={2} icon={<ShieldCheck size={18} color="#f59e0b" />}>
                <SelectField label="Verification Type" value={form.document_type_id} options={docTypeOptions} placeholder="Select Document Type" onChange={(val) => setForm(prev => ({ ...prev, document_type_id: val.toString() }))} />
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{docFile ? docFile.name : "Upload Document Scan"}</span>
                  <label style={{ cursor: "pointer", color: "#6366f1", fontSize: "0.85rem", fontWeight: 700 }}>
                    <Upload size={16} style={{ display: "inline", marginRight: "4px" }} /> Browse
                    <input type="file" hidden onChange={handleDocChange} />
                  </label>
                </div>
                <InputField label="Emergency Contact Name" name="emergency_contact_name" icon={Users} value={form.emergency_contact_name} onChange={handleChange} />
                <InputField label="Emergency Contact Phone" name="emergency_contact_phone" icon={PhoneCall} value={form.emergency_contact_phone} onChange={handleChange} />
              </FormSection>

              <FormSection title="Biography & Notes" columns={1} icon={<FileText size={18} color="#64748b" />}>
                <textarea
                  name="information"
                  value={form.information}
                  onChange={handleChange}
                  placeholder="Additional skills, career history, or internal background check notes..."
                  style={{ width: "100%", minHeight: "100px", padding: "14px", borderRadius: "16px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                />
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "160px", height: "160px", borderRadius: "50%", border: "4px solid #f1f5f9", overflow: "hidden", margin: "0 auto 16px", position: "relative", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserCircle size={80} color="#cbd5e1" />}
                  <label style={{ position: "absolute", bottom: "8px", right: "8px", background: "#6366f1", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>
                    <Camera size={18} /><input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>Profile Image</div>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#64748b" }}>Recommended: 1:1 Aspect Ratio</p>
              </div>

              {docPreview && (
                <div style={{ marginTop: "24px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>Document Preview</div>
                  <img src={docPreview} alt="ID Document" style={{ width: "100%", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                </div>
              )}
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
    </div>
  );
};

export default CreateNewEmployee;