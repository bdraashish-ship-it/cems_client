import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Building2, Phone, Mail, MapPin, 
  User, Hash, Briefcase, Info, Calendar, Globe 
} from "lucide-react";
import { useGetClientByIdQuery } from "../../../services/features/cemsApi";
import { Button } from "../../../components/widgets/Button";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: clientData, isLoading } = useGetClientByIdQuery(Number(id));

  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading client details...</div>;

  const client = clientData?.data;
  if (!client) return <div style={{ padding: "40px", textAlign: "center" }}>Client not found.</div>;

  const photoUrl = client.photo 
    ? `http://127.0.0.1:8000/api/v1/uploads/profile_photos/${client.photo}`
    : null;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button variant="outline" size="sm" onClick={() => navigate("/settings/clients/all")} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Client Profile</h1>
        </div>
        <Button variant="primary" onClick={() => navigate(`/settings/clients/edit/${id}`)} icon={<Edit size={16} />}>
          Edit Profile
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>
        {/* Left Side - Profile Card */}
        <div style={{ 
          background: "#fff", 
          borderRadius: "16px", 
          padding: "24px", 
          border: "1px solid #e2e8f0", 
          textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            width: "150px", 
            height: "150px", 
            borderRadius: "50%", 
            margin: "0 auto 16px", 
            overflow: "hidden",
            border: "4px solid #f1f5f9",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {photoUrl ? (
              <img src={photoUrl} alt={client.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <User size={64} color="#94a3b8" />
            )}
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>{client.name}</h2>
          <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 16px 0" }}>{client.occupation || "Client"}</p>
          
          <div style={{ 
            padding: "8px 12px", 
            borderRadius: "20px", 
            fontSize: "0.75rem", 
            fontWeight: 700,
            display: "inline-block",
            backgroundColor: client.is_active ? "#ecfdf5" : "#fef2f2",
            color: client.is_active ? "#059669" : "#dc2626"
          }}>
            {client.is_active ? "ACTIVE CLIENT" : "INACTIVE"}
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "20px 0" }} />

          <div style={{ textAlign: "left" }}>
            <DetailItem icon={<Phone size={14} />} label="Phone" value={client.phone} />
            <DetailItem icon={<Mail size={14} />} label="Email" value={client.email} />
            <DetailItem icon={<MapPin size={14} />} label="Address" value={client.address} />
          </div>
        </div>

        {/* Right Side - Tabs/Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Personal Info Section */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} color="#6366f1" /> Personal & Family Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <InfoBox label="Citizenship Number" value={client.citizenship_no} />
              <InfoBox label="Occupation" value={client.occupation} />
              <InfoBox label="Father's Name" value={client.father_name} />
              <InfoBox label="Grandfather's Name" value={client.grandfather_name} />
              <InfoBox label="PAN / VAT Number" value={client.pan_vat_number} />
              <InfoBox label="Website" value={client.website} />
            </div>
          </div>

          {/* Business/Additional Info Section */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={18} color="#6366f1" /> Corporate & Partnership Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <InfoBox label="Company Name" value={client.name} />
              <InfoBox label="Contact Person" value={client.contact_person} />
              <InfoBox label="Joined Date" value={new Date(client.created_at).toLocaleDateString()} />
              <InfoBox label="Last Updated" value={new Date(client.last_updated_at).toLocaleDateString()} />
            </div>
          </div>

          {/* Notes Section */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Info size={18} color="#6366f1" /> Requirements & Notes
            </h3>
            <div style={{ 
              padding: "16px", 
              borderRadius: "12px", 
              background: "#f8fafc", 
              color: "#334155", 
              fontSize: "0.875rem", 
              lineHeight: "1.6",
              borderLeft: "4px solid #6366f1"
            }}>
              {client.information || "No additional requirements or notes provided for this client."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
    <div style={{ color: "#6366f1", marginTop: "2px" }}>{icon}</div>
    <div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "#334155" }}>{value || "N/A"}</div>
    </div>
  </div>
);

const InfoBox = ({ label, value }: { label: string, value: any }) => (
  <div style={{ padding: "12px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b" }}>{value || "—"}</div>
  </div>
);

export default ClientDetails;
