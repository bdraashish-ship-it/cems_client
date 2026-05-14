import React, { useState, useEffect } from "react";
import { UserCircle, Mail, Phone, Lock, Tag, ShieldCheck } from "lucide-react";
import { InputField } from "../../widgets/InputField";
import { FormSection } from "../../widgets/FormSection";
import { Button } from "../../widgets/Button";
import { SelectField } from "../../widgets/SelectField";
import { ToggleSwitch } from "../../widgets/ToggleSwitch";
import { MultiImageUpload } from "../../widgets/ImageUpload";
import { useGetRolesQuery } from "../../../services/roleApi";
import { useGetAllGendersQuery, useGetAllDocumentTypesQuery } from '../../../services/features/cemsApi';

interface SoftwareUserFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const SoftwareUserForm: React.FC<SoftwareUserFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const { data: gendersData } = useGetAllGendersQuery();
  const { data: documentTypesData } = useGetAllDocumentTypesQuery();
  const { data: rolesData } = useGetRolesQuery();

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender_id: 0,
    role_id: 0,
    document_type_id: 0,
    username: "",
    password: "",
  });

  const [hasSoftwareAccess, setHasSoftwareAccess] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File[]>([]);
  const [documentFile, setDocumentFile] = useState<File[]>([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || "",
        middle_name: initialData.middle_name || "",
        last_name: initialData.last_name || "",
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        gender_id: initialData.gender_id || 0,
        role_id: initialData.role_id || 0,
        username: initialData.username || "",
        document_type_id: initialData.document_type_id || 0,
        password: "", // Don't prepopulate password
      });
      setHasSoftwareAccess(!!initialData.has_software_access);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string) => (val: string | number) => {
    setForm((prev) => ({ ...prev, [name]: Number(val) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !hasSoftwareAccess) return;
      formData.append(key, value.toString());
    });
    formData.append("has_software_access", hasSoftwareAccess.toString());
    if (profileImage[0]) formData.append("profile_photo", profileImage[0]);
    if (documentFile[0]) formData.append("document_file", documentFile[0]);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="software-user-form">
      <FormSection title="Basic Profile" columns={2}>
        <div className="profile-photo-section" style={{ gridColumn: "span 2", marginBottom: "1rem" }}>
          <MultiImageUpload
            label="Profile Photo (100x100px)"
            values={profileImage}
            onChange={setProfileImage}
            maxFiles={1}
          />
        </div>
        <InputField
          label="First Name"
          name="first_name"
          required
          icon={UserCircle}
          value={form.first_name}
          onChange={handleChange}
        />
        <InputField
          label="Middle Name"
          name="middle_name"
          icon={UserCircle}
          value={form.middle_name}
          onChange={handleChange}
        />
        <InputField
          label="Last Name"
          name="last_name"
          required
          icon={UserCircle}
          value={form.last_name}
          onChange={handleChange}
        />
        <SelectField
          label="Gender"
          value={form.gender_id}
          options={gendersData?.data?.map((g: any) => ({ label: g.name, value: g.id })) || []}
          onChange={handleSelectChange("gender_id")}
          required
        />
        <SelectField
          label="Document Type"
          value={form.document_type_id}
          options={documentTypesData?.data?.map((d: any) => ({ label: d.name, value: d.id })) || []}
          onChange={handleSelectChange("document_type_id")}
          required
        />
      </FormSection>

      <FormSection title="Contact & Access" columns={2}>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          required
          icon={Mail}
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Phone Number"
          name="phone_number"
          required
          icon={Phone}
          value={form.phone_number}
          onChange={handleChange}
        />
        <SelectField
          label="System Role"
          value={form.role_id}
          options={rolesData?.data?.map((r: any) => ({ label: r.name, value: r.id })) || []}
          onChange={handleSelectChange("role_id")}
          required
        />
        <div style={{ marginTop: "1rem" }}>
          <ToggleSwitch
            id="access-toggle"
            checked={hasSoftwareAccess}
            onChange={() => setHasSoftwareAccess(!hasSoftwareAccess)}
            label="Enable Login Access"
            color="indigo"
          />
        </div>
        {hasSoftwareAccess && (
          <InputField
            label="Temporary Password"
            name="password"
            type="password"
            required
            icon={Lock}
            value={form.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
          />
        )}
      </FormSection>

      <div style={{ marginTop: "1.5rem" }}>
        <MultiImageUpload
          label="Government Issued ID (Verification)"
          values={documentFile}
          onChange={setDocumentFile}
          maxFiles={1}
        />
      </div>

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
          {isLoading ? "Saving..." : initialData ? "Update Account" : "Create Account"}
        </Button>
      </div>
    </form>
  );
};
