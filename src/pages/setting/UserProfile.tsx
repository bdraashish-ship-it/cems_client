import React, { useState } from "react";
import { 
  User, Mail, Phone, Lock, Save, Camera, 
  Upload, Shield, Key, CheckCircle2, UserCircle 
} from "lucide-react";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";

const UserProfile = () => {
  const [form, setForm] = useState({
    name: "Aashish", 
    email: "aashish@example.com", 
    phone: "+1 234 567 890", 
    currentPassword: "", 
    newPassword: "",
    confirmPassword: ""
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for profile update would go here
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <FormTemplate
          title="Personal Account Management"
          description="Manage your professional profile, contact information, and account security settings."
          width="full"
          onSubmit={handleSubmit}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
              <Button variant="outline" type="button">Discard Changes</Button>
              <Button 
                variant="primary" 
                type="submit" 
                style={{ minWidth: "160px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
              >
                <Save size={18} /> Save All Changes
              </Button>
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <FormSection title="Identity & Contact" columns={1} icon={<UserCircle size={18} color="#6366f1" />}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <InputField 
                    label="Full Legal Name" 
                    name="name" 
                    required 
                    icon={User} 
                    value={form.name} 
                    onChange={handleChange} 
                  />
                  <InputField 
                    label="Verified Email" 
                    name="email" 
                    type="email" 
                    required 
                    icon={Mail} 
                    value={form.email} 
                    onChange={handleChange} 
                    disabled
                  />
                </div>
                <InputField 
                  label="Primary Contact Number" 
                  name="phone" 
                  icon={Phone} 
                  value={form.phone} 
                  onChange={handleChange} 
                />
              </FormSection>

              <FormSection title="Security Credentials" columns={1} icon={<Shield size={18} color="#ef4444" />}>
                <div style={{ background: "#fef2f2", padding: "16px", borderRadius: "12px", border: "1px solid #fee2e2", marginBottom: "20px", display: "flex", gap: "12px" }}>
                   <Key size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                   <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b" }}>Authentication Update</div>
                      <div style={{ fontSize: "0.75rem", color: "#b91c1c", marginTop: "2px" }}>Changing your password will terminate all other active sessions for your account.</div>
                   </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <InputField 
                      label="Current Secure Password" 
                      name="currentPassword" 
                      type="password" 
                      icon={Lock} 
                      value={form.currentPassword} 
                      onChange={handleChange} 
                      placeholder="Enter existing password"
                    />
                  </div>
                  <InputField 
                    label="New Account Password" 
                    name="newPassword" 
                    type="password" 
                    icon={Lock} 
                    value={form.newPassword} 
                    onChange={handleChange} 
                    placeholder="Min 8 characters"
                  />
                  <InputField 
                    label="Confirm New Password" 
                    name="confirmPassword" 
                    type="password" 
                    icon={CheckCircle2} 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                  />
                </div>
              </FormSection>
            </div>

            <div style={{ position: "sticky", top: "24px" }}>
               <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ 
                    width: "160px", 
                    height: "160px", 
                    borderRadius: "50%", 
                    border: "4px solid #f8fafc", 
                    overflow: "hidden", 
                    margin: "0 auto 24px",
                    position: "relative",
                    background: "#f1f5f9",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}>
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}>
                         <User size={80} />
                      </div>
                    )}
                    <label style={{ 
                      position: "absolute", 
                      bottom: "8px", 
                      right: "8px", 
                      background: "#6366f1", 
                      color: "#fff", 
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%", 
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(99, 102, 241, 0.4)",
                      border: "4px solid #fff"
                    }}>
                      <Camera size={18} />
                      <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                    </label>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#0f172a", fontWeight: 800 }}>{form.name}</h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>System Administrator</p>
                  </div>

                  <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #f1f5f9" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "8px" }}>
                        <span style={{ color: "#64748b" }}>Account Status</span>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>Active</span>
                     </div>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                        <span style={{ color: "#64748b" }}>Member Since</span>
                        <span style={{ color: "#1e293b", fontWeight: 700 }}>Jan 2026</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </FormTemplate>
      </div>
    </div>
  );
};

export default UserProfile;
