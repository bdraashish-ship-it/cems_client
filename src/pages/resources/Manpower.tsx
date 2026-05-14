import { useState } from "react";
import { User, Briefcase, Calendar, Phone } from "lucide-react";
import { FormTemplate } from "../../components/common/form/Form";
import { InputField } from "../../components/widgets/InputField";
import { FormSection } from "../../components/widgets/FormSection";
import { Button } from "../../components/widgets/Button";

const Manpower = () => {
  const [form, setForm] = useState({
    name: "", role: "", contact: "", joining_date: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <FormTemplate
      title="Add Manpower"
      description="Register labor or staff for site operations."
      width="full"
      onSubmit={handleSubmit}
      footer={<Button variant="primary" type="submit">Register Manpower</Button>}
    >
      <FormSection title="Labor/Staff Details" columns={2}>
        <InputField label="Full Name" name="name" required icon={User} value={form.name} onChange={handleChange} />
        <InputField label="Role / Trade" name="role" required icon={Briefcase} value={form.role} onChange={handleChange} />
        <InputField label="Contact Number" name="contact" required icon={Phone} value={form.contact} onChange={handleChange} />
        <InputField label="Joining Date" name="joining_date" type="date" required icon={Calendar} value={form.joining_date} onChange={handleChange} />
      </FormSection>
    </FormTemplate>
  );
};

export default Manpower;
