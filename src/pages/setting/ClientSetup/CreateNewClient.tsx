import { useState, useEffect } from "react";
import {
  Building2, Mail, Phone, MapPin, User, ArrowLeft, Hash, Globe,
  UserCircle, Briefcase, FileText, Camera, Upload, CheckCircle2,
  AlertCircle, Loader2, Save, Info,
  Users, ShieldCheck, Plus, Trash2, FileStack
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FormTemplate } from "../../../components/common/form/Form";
import { InputField } from "../../../components/widgets/InputField";
import { FormSection } from "../../../components/widgets/FormSection";
import { Button } from "../../../components/widgets/Button";
import { SelectField } from "../../../components/widgets/SelectField";
import { Modal } from "../../../components/common/Modal/Modal";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetClientByIdQuery,
  useGetAllGendersQuery,
  useGetAllCountriesQuery,
  useGetAllSalutationsQuery,
  useGetAllDocumentTypesQuery
} from "../../../services/features/cemsApi";
import { FILE_BASE } from "../../../redux/types/baseUrl";
import { parseError } from "../../../utils/errorParser";

interface DocumentEntry {
  type_id: string;
  number: string;
  file: File | null;
}

const CreateNewClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: clientResponse, isLoading: isFetching } = useGetClientByIdQuery(Number(id), { skip: !isEdit });
  const { data: gendersData } = useGetAllGendersQuery();
  const { data: countriesData } = useGetAllCountriesQuery();
  const { data: salutationsData } = useGetAllSalutationsQuery();
  const { data: docTypesData } = useGetAllDocumentTypesQuery();
  
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const [form, setForm] = useState({
    salutation_id: "",
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    country_id: "",
    information: "",
    gender_id: "",
    occupation: ""
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Dynamic Documents Array
  const [documents, setDocuments] = useState<DocumentEntry[]>([
    { type_id: "", number: "", file: null }
  ]);

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    const c = clientResponse?.data || ((clientResponse as any)?.id ? clientResponse : null);

    if (isEdit && c) {
      setForm({
        salutation_id: c.salutation_id?.toString() || "",
        name: c.name || "",
        contact_person: c.contact_person || "",
        email: c.email || "",
        phone: c.phone || "",
        address: c.address || "",
        country_id: c.country_id?.toString() || "",
        information: c.information || "",
        gender_id: c.gender_id?.toString() || "",
        occupation: c.occupation || ""
      });
      
      if (c.photo) {
        setPhotoPreview(`${FILE_BASE}/api/v1/uploads/profile_photos/${c.photo}`);
      }

      // Populate existing documents if available
      if (c.documents && c.documents.length > 0) {
        const existingDocs = c.documents.map((d: any) => ({
          type_id: d.document_type_id?.toString() || "",
          number: d.document_number || "",
          file: null // We can't set the File object for existing ones
        }));
        setDocuments(existingDocs);
      }
    }
  }, [isEdit, clientResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddDocument = () => {
    setDocuments(prev => [...prev, { type_id: "", number: "", file: null }]);
  };

  const handleRemoveDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDocFieldChange = (index: number, field: keyof DocumentEntry, value: any) => {
    const newDocs = [...documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setDocuments(newDocs);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatusModal({ isOpen: true, type: "error", message: "Client name is required." });
      return;
    }

    try {
      const formData = new FormData();
      
      // Basic info
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      if (photoFile) formData.append("photo", photoFile);

      // Append multiple documents
      documents.forEach(doc => {
        if (doc.type_id) {
          formData.append("document_type_ids", doc.type_id);
          formData.append("document_numbers", doc.number || "");
          if (doc.file) {
            formData.append("document_files", doc.file);
          }
        }
      });

      if (isEdit) {
        await updateClient({ id: Number(id), data: formData }).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "Client portfolio updated successfully!" });
      } else {
        formData.append("is_active", "true");
        await createClient(formData).unwrap();
        setStatusModal({ isOpen: true, type: "success", message: "New client registered successfully!" });
      }
    } catch (err: any) {
      setStatusModal({ isOpen: true, type: "error", message: parseError(err) });
    }
  };

  const handleModalClose = () => {
    if (statusModal.type === "success") {
      navigate("/settings/clients/all");
    }
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const isLoading = isCreating || isUpdating || isFetching;

  const genderOptions = gendersData?.data?.map((g: any) => ({ label: g.name, value: g.id.toString() })) || [];
  const countryOptions = countriesData?.data?.map((c: any) => ({ label: c.name, value: c.id.toString() })) || [];
  const salutationOptions = salutationsData?.data?.map((s: any) => ({ label: s.name, value: s.id.toString() })) || [];
  const docTypeOptions = docTypesData?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })) || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <button
          onClick={() => navigate("/settings/clients/all")}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600, marginBottom: "24px", padding: "8px", borderRadius: "8px" }}
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <FormTemplate
          title={isEdit ? "Update Client Profile" : "Register New Client"}
          description="Manage multi-tier entity identification and partnership data."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" onClick={() => navigate("/settings/clients/all")} type="button">Discard</Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{ minWidth: "180px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
                {isLoading ? "Synchronizing..." : isEdit ? "Update Portfolio" : "Complete Registration"}
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              <FormSection title="Partner Core Details" columns={2} icon={<Building2 size={18} color="#6366f1" />}>
                <div style={{ gridColumn: "span 2", display: "flex", gap: "16px" }}>
                  <div style={{ width: "140px" }}>
                    <SelectField label="Salutation" value={form.salutation_id} options={salutationOptions} placeholder="..." onChange={(val) => setForm(prev => ({ ...prev, salutation_id: val.toString() }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <InputField label="Legal Entity / Full Name" name="name" required icon={UserCircle} value={form.name} onChange={handleChange} placeholder="e.g. Homeland Projects Pvt. Ltd." />
                  </div>
                </div>
                <InputField label="Contact Person" name="contact_person" icon={User} value={form.contact_person} onChange={handleChange} />
                <InputField label="Direct Phone" type="tel" name="phone" icon={Phone} value={form.phone} onChange={handleChange} />
                <InputField label="Official Email" type="email" name="email" icon={Mail} value={form.email} onChange={handleChange} />
                <SelectField label="Primary Region" value={form.country_id} options={countryOptions} placeholder="Select Country" onChange={(val) => setForm(prev => ({ ...prev, country_id: val.toString() }))} />
              </FormSection>

              <FormSection title="Identification Documents" columns={1} icon={<FileStack size={18} color="#10b981" />}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {documents.map((doc, index) => (
                    <div key={index} style={{ 
                      padding: "20px", 
                      background: "#f8fafc", 
                      borderRadius: "16px", 
                      border: "1px solid #e2e8f0", 
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr auto",
                      gap: "16px",
                      alignItems: "end"
                    }}>
                      <SelectField
                        label="Document Type"
                        value={doc.type_id}
                        options={docTypeOptions}
                        placeholder="Type"
                        onChange={(val) => handleDocFieldChange(index, "type_id", val.toString())}
                      />
                      <InputField
                        label="Document Number"
                        value={doc.number}
                        icon={Hash}
                        onChange={(e) => handleDocFieldChange(index, "number", e.target.value)}
                        placeholder="ID #"
                      />
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "8px" }}>Scan / File</label>
                        <div style={{ position: "relative" }}>
                          <input type="file" id={`doc-file-${index}`} hidden onChange={(e) => handleDocFieldChange(index, "file", e.target.files?.[0] || null)} />
                          <label htmlFor={`doc-file-${index}`} style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: doc.file ? "#dcfce7" : "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", color: doc.file ? "#16a34a" : "#64748b", overflow: "hidden"
                          }}>
                            <Upload size={14} /> {doc.file ? doc.file.name : "Choose File"}
                          </label>
                        </div>
                      </div>
                      {documents.length > 1 && (
                        <button type="button" onClick={() => handleRemoveDocument(index)} style={{ padding: "10px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddDocument} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6366f1", fontWeight: 700, fontSize: "0.875rem", background: "#eef2ff", border: "1px dashed #6366f1", padding: "12px", borderRadius: "12px", cursor: "pointer", justifyContent: "center" }}>
                    <Plus size={18} /> Add Another Document
                  </button>
                </div>
              </FormSection>

              <FormSection title="Additional Information" columns={2} icon={<Users size={18} color="#f59e0b" />}>
                <SelectField label="Gender Reference" value={form.gender_id} options={genderOptions} placeholder="Select Gender" onChange={(val) => setForm(prev => ({ ...prev, gender_id: val.toString() }))} />
                <InputField label="Occupation / Sector" name="occupation" icon={Briefcase} value={form.occupation} onChange={handleChange} />
                <div style={{ gridColumn: "span 2" }}>
                  <InputField label="Full Business Address" name="address" icon={MapPin} value={form.address} onChange={handleChange} />
                </div>
                <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Internal Profile Notes</label>
                  <textarea name="information" value={form.information} onChange={handleChange} placeholder="Record historical context, project requirements, or tax notes..." style={{ width: "100%", minHeight: "100px", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }} />
                </div>
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "160px", height: "160px", borderRadius: "20px", border: "2px dashed #cbd5e1", overflow: "hidden", margin: "0 auto 16px", position: "relative", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photoPreview ? <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={40} color="#94a3b8" />}
                  <label style={{ position: "absolute", bottom: "10px", right: "10px", background: "#6366f1", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #fff" }}>
                    <Upload size={14} /><input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>Entity profile photo for dashboard visibility.</p>
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
    </div>
  );
};

export default CreateNewClient;
