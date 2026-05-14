export interface SoftwareUser {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  gender: string | null;
  gender_id: number;
  role: string | null;
  role_id: number;
  phone_number: string;
  email: string;
  profile_photo: string | null;
  document_type_id?: number;
  document_number?: string;
  document_file?: string | null;
  has_software_access: boolean;
  is_active: boolean;
  created_by: number;
  created_at: string;
  last_updated_by: number | null;
  last_updated_at: string;
}

export interface CreateUserForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  gender_id: number;
  role_id: number;
  document_type_id?: number;
  document_number?: string;
  username: string;
  password: string;
  information: string;
}
