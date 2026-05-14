import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { setSessionExpired } from "./features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/v1",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If we get a 401, dispatch session expired
    api.dispatch(setSessionExpired(true));
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Gender", "Roles", "Project", "Client", "Employee", "Material", "Equipment", "Transaction", "DailyProgress", "SiteIssue", "Notification", "ProjectStatus", "ProjectCategory", "ProjectMember", "MaterialUnit", "MaterialCategory", "MaterialDetail", "Site", "SiteType", "Designation", "Task", "Country", "Salutation", "Company", "DocumentType"],
  endpoints: () => ({}),
});
