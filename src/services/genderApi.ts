// src/services/genderApi.ts
import type { BaseResponseDTO } from "../redux/types/baseResponse";
import { baseApi } from "./baseApi";

export interface Gender {
  id: number;
  name: string;
  status: boolean;
}

export const genderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGenders: builder.query<BaseResponseDTO<Gender[]>, void>({
      query: () => "/cems/genders/",
      providesTags: ["Gender"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetGendersQuery } = genderApi;
