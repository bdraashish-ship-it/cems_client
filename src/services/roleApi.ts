// src/services/roleApi.ts
import type { BaseResponseDTO } from "../redux/types/baseResponse";
import { baseApi } from "./baseApi";

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  status: boolean;
}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<BaseResponseDTO<Role[]>, void>({
      query: () => "/roles/",
      providesTags: ["Roles"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRolesQuery } = roleApi;
