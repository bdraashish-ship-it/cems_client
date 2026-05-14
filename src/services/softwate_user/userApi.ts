import type { BaseResponseDTO } from "../../redux/types/baseResponse";
import { baseApi } from "../baseApi";


export interface SoftwareUser {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  gender: string | null;
  role: string | null;
  phone_number: string;
  email: string;
  profile_photo: string | null;
  has_software_access: boolean;
  status: boolean;
  created_by: string ;
  created_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
}

export interface CreateUserForm {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  gender_id: number ;
  role_id: number ;
  username: string;
  password: string;
}


export interface GetAllUsersParams {
  page?: number;
  page_size?: number;
}

// Inject endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<BaseResponseDTO<SoftwareUser[]>, GetAllUsersParams | void>({
      query: (params) => ({
        url: "/software/users",
        method: "GET",
        params: params ?? undefined, 
      }),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/software/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/software/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation } = userApi;
