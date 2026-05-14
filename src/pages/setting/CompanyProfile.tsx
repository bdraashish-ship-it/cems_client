import React, { useState, useEffect, useRef } from "react";
import { 
  Building, MapPin, Phone, Globe, Mail, 
  Save, Loader2, Camera, CheckCircle2, 
  AlertCircle, DollarSign, Coins, Landmark
} from "lucide-react";
import { 
  useGetCompanyQuery, 
  useUpdateCompanyMutation 
} from "../../services/features/cemsApi";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";
import { Modal } from "../../components/common/Modal/Modal";

const CompanyProfile = () => {
  const { data: companyData, isLoading: isFetching } = useGetCompanyQuery();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [form, setForm] = useState({
    name: "",
    code: "",
    email: "",
    contact_address: "",
    phone: "",
    website: "",
    currency_name: "",
    currency_symbol: "",
    currency_code: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (companyData?.data) {
      const data = companyData.data;
      setForm({
        name: data.name || "",
        code: data.code || "",
        email: data.email || "",
        contact_address: data.contact_address || "",
        phone: data.phone || "",
        website: data.website || "",
        currency_name: data.currency_name || "Nepalese Rupee",
        currency_symbol: data.currency_symbol || "Rs.",
        currency_code: data.currency_code || "NPR",
      });
      if (data.logo) {
        setLogoPreview(`http://127.0.0.1:8000/api/v1/uploads/logos/${data.logo}`);
      }
    }
  }, [companyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await updateCompany(formData).unwrap();
      setStatusModal({ 
        isOpen: true, 
        type: "success", 
        message: "Company configuration has been updated successfully!" 
      });
    } catch (err: any) {
      setStatusModal({ 
        isOpen: true, 
        type: "error", 
        message: err?.data?.message || "Failed to update company configuration." 
      });
    }
  };

  if (isFetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <Loader2 size={40} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <FormTemplate
        title="Company Configuration"
        description="Establish the global identity, regional settings, and branding for the entire CEMS ecosystem."
        width="full"
        onSubmit={handleSubmit}
        footer={
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%" }}>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isUpdating}
              style={{ padding: "12px 32px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isUpdating ? "Saving..." : "Apply Configuration"}
            </Button>
          </div>
        }
      >
        {/* Branding Section */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "32px", padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ position: "relative" }}>
            <div style={{ 
              width: "120px", 
              height: "120px", 
              borderRadius: "20px", 
              background: "#f1f5f9", 
              border: "2px dashed #cbd5e1",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <Building size={48} color="#94a3b8" />
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                position: "absolute", 
                bottom: "-10px", 
                right: "-10px", 
                width: "36px", 
                height: "36px", 
                borderRadius: "50%", 
                background: "#6366f1", 
                color: "#fff", 
                border: "4px solid #fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoChange} 
              accept="image/*" 
              style={{ display: "none" }} 
            />
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "1.25rem", color: "#1e293b" }}>Corporate Branding</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              Upload your company logo. This will appear on all generated reports, invoices, and the dashboard header.
            </p>
          </div>
        </div>

        <FormSection title="Identity & Registration" columns={2}>
          <InputField label="Official Company Name" name="name" required icon={Building} value={form.name} onChange={handleChange} placeholder="e.g. Acme Engineering & Construction" />
          <InputField label="Company Identification Code" name="code" required icon={Landmark} value={form.code} onChange={handleChange} placeholder="e.g. AEC-001" />
        </FormSection>

        <FormSection title="Contact Details" columns={2}>
          <InputField label="HQ Physical Address" name="contact_address" required icon={MapPin} value={form.contact_address} onChange={handleChange} />
          <InputField label="Official Phone" name="phone" required icon={Phone} value={form.phone} onChange={handleChange} />
          <InputField label="Corporate Email" name="email" type="email" required icon={Mail} value={form.email} onChange={handleChange} />
          <InputField label="Official Website" name="website" required icon={Globe} value={form.website} onChange={handleChange} />
        </FormSection>

        <FormSection title="Regional & Finance Defaults" columns={3}>
          <InputField label="Local Currency Name" name="currency_name" required icon={Coins} value={form.currency_name} onChange={handleChange} placeholder="e.g. Nepalese Rupee" />
          <InputField label="Currency Code" name="currency_code" required icon={Landmark} value={form.currency_code} onChange={handleChange} placeholder="e.g. NPR" />
          <InputField label="Currency Symbol" name="currency_symbol" required icon={DollarSign} value={form.currency_symbol} onChange={handleChange} placeholder="e.g. Rs." />
        </FormSection>


      </FormTemplate>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        title={statusModal.type === "success" ? "Config Synchronized" : "Update Error"}
        size="sm"
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ 
            width: "64px", height: "64px", borderRadius: "50%", 
            background: statusModal.type === "success" ? "#dcfce7" : "#fee2e2", 
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" 
          }}>
            {statusModal.type === "success" ? <CheckCircle2 size={32} color="#16a34a" /> : <AlertCircle size={32} color="#dc2626" />}
          </div>
          <h3 style={{ margin: "0 0 8px 0" }}>{statusModal.type === "success" ? "Profile Updated!" : "Update Failed"}</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
            {statusModal.message}
          </p>
          <Button variant="primary" onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))} style={{ width: "100%" }}>
            Close
          </Button>
        </div>
      </Modal>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CompanyProfile;
