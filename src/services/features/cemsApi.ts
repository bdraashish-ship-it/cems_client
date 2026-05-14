import { baseApi } from "../baseApi";
import type { BaseResponseDTO } from "../../redux/types/baseResponse";

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export const cemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/projects`, method: "GET", params: params ?? undefined }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/projects`, method: "POST", body }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/projects/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Project", id }, "Project"],
    }),
    deleteProject: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project"],
    }),

    getAllClients: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/clients`, method: "GET", params: params ?? undefined }),
      providesTags: ["Client"],
    }),
    getClientById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/clients`, method: "POST", body }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/clients/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Client", id }, "Client"],
    }),
    deleteClient: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/clients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Client"],
    }),

    getAllEmployees: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/employees`, method: "GET", params: params ?? undefined }),
      providesTags: ["Employee"],
    }),
    getEmployeeById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/employees/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    createEmployee: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/employees`, method: "POST", body }),
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/employees/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Employee", id }, "Employee"],
    }),
    deleteEmployee: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/employees/${id}`, method: "DELETE" }),
      invalidatesTags: ["Employee"],
    }),

    getAllMaterials: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/materials`, method: "GET", params: params ?? undefined }),
      providesTags: ["Material"],
    }),
    getMaterialById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/materials/${id}`,
      providesTags: (result, error, id) => [{ type: "Material", id }],
    }),
    createMaterial: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/materials`, method: "POST", body }),
      invalidatesTags: ["Material"],
    }),
    updateMaterial: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/materials/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Material", id }, "Material"],
    }),
    deleteMaterial: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/materials/${id}`, method: "DELETE" }),
      invalidatesTags: ["Material"],
    }),

    getAllEquipments: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/equipment`, method: "GET", params: params ?? undefined }),
      providesTags: ["Equipment"],
    }),
    getEquipmentById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/equipment/${id}`,
      providesTags: (result, error, id) => [{ type: "Equipment", id }],
    }),
    createEquipment: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/equipment`, method: "POST", body }),
      invalidatesTags: ["Equipment"],
    }),
    updateEquipment: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/equipment/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Equipment", id }, "Equipment"],
    }),
    deleteEquipment: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/equipment/${id}`, method: "DELETE" }),
      invalidatesTags: ["Equipment"],
    }),

    getAllTransactions: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/transactions`, method: "GET", params: params ?? undefined }),
      providesTags: ["Transaction"],
    }),
    getTransactionById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),
    createTransaction: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/transactions`, method: "POST", body }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/transactions/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Transaction", id }, "Transaction"],
    }),
    deleteTransaction: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/transactions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Transaction"],
    }),

    getAllDailyProgresss: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/daily-progress`, method: "GET", params: params ?? undefined }),
      providesTags: ["DailyProgress"],
    }),
    getDailyProgressById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/daily-progress/${id}`,
      providesTags: (result, error, id) => [{ type: "DailyProgress", id }],
    }),
    createDailyProgress: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/daily-progress`, method: "POST", body }),
      invalidatesTags: ["DailyProgress"],
    }),
    updateDailyProgress: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/daily-progress/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "DailyProgress", id }, "DailyProgress"],
    }),
    deleteDailyProgress: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/daily-progress/${id}`, method: "DELETE" }),
      invalidatesTags: ["DailyProgress"],
    }),

    getAllSiteIssues: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/site-issues`, method: "GET", params: params ?? undefined }),
      providesTags: ["SiteIssue"],
    }),
    getSiteIssueById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/site-issues/${id}`,
      providesTags: (result, error, id) => [{ type: "SiteIssue", id }],
    }),
    createSiteIssue: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/site-issues`, method: "POST", body }),
      invalidatesTags: ["SiteIssue"],
    }),
    updateSiteIssue: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/site-issues/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "SiteIssue", id }, "SiteIssue"],
    }),
    deleteSiteIssue: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/site-issues/${id}`, method: "DELETE" }),
      invalidatesTags: ["SiteIssue"],
    }),
    getNotificationCount: builder.query<BaseResponseDTO<{ count: number }>, void>({
      query: () => `/cems/notifications/count`,
      providesTags: ["Notification"],
    }),
    getAllNotifications: builder.query<BaseResponseDTO<any[]>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/notifications`, method: "GET", params: params ?? undefined }),
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation<BaseResponseDTO<any>, void>({
      query: () => ({ url: `/cems/notifications/read-all`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    getAllProjectStatuses: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/statuses",
      providesTags: ["ProjectStatus"],
    }),
    createProjectStatus: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/statuses`, method: "POST", body }),
      invalidatesTags: ["ProjectStatus"],
    }),
    updateProjectStatus: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/statuses/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["ProjectStatus"],
    }),
    deleteProjectStatus: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/statuses/${id}`, method: "DELETE" }),
      invalidatesTags: ["ProjectStatus"],
    }),
    toggleProjectStatus: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/cems/statuses/${id}/status`,
        method: "PATCH",
        params: { is_active }
      }),
      invalidatesTags: ["ProjectStatus"],
    }),
    // ---- Project Categories ----
    getAllProjectCategories: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/project-categories",
      providesTags: ["ProjectCategory"],
    }),
    createProjectCategory: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/project-categories`, method: "POST", body }),
      invalidatesTags: ["ProjectCategory"],
    }),
    updateProjectCategory: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/project-categories/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["ProjectCategory"],
    }),
    deleteProjectCategory: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/project-categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["ProjectCategory"],
    }),
    // ---- Project Members ----
    getProjectMembers: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/project-members",
      providesTags: ["ProjectMember"],
    }),
    addProjectMember: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/project-members`, method: "POST", body }),
      invalidatesTags: ["ProjectMember", "Project"],
    }),
    updateProjectMember: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/project-members/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["ProjectMember", "Project"],
    }),
    removeProjectMember: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/project-members/${id}`, method: "DELETE" }),
      invalidatesTags: ["ProjectMember", "Project"],
    }),
    // ---- Material Units ----
    getAllMaterialUnits: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/material-units",
      providesTags: ["MaterialUnit"],
    }),
    createMaterialUnit: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/material-units`, method: "POST", body }),
      invalidatesTags: ["MaterialUnit"],
    }),
    updateMaterialUnit: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/material-units/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["MaterialUnit"],
    }),
    deleteMaterialUnit: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/material-units/${id}`, method: "DELETE" }),
      invalidatesTags: ["MaterialUnit"],
    }),
    toggleMaterialUnitStatus: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/cems/material-units/${id}/status`,
        method: "PATCH",
        params: { is_active }
      }),
      invalidatesTags: ["MaterialUnit"],
    }),
    getMaterialUnitById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/material-units/${id}`,
      providesTags: (result, error, id) => [{ type: "MaterialUnit", id }],
    }),
    // ---- Material Categories ----
    getAllMaterialCategories: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/material-categories",
      providesTags: ["MaterialCategory"],
    }),
    getMaterialCategoryById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/material-categories/${id}`,
      providesTags: (result, error, id) => [{ type: "MaterialCategory", id }],
    }),
    createMaterialCategory: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/material-categories`, method: "POST", body }),
      invalidatesTags: ["MaterialCategory"],
    }),
    updateMaterialCategory: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/material-categories/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["MaterialCategory"],
    }),
    deleteMaterialCategory: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/material-categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["MaterialCategory"],
    }),
    toggleMaterialCategoryStatus: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({ 
        url: `/cems/material-categories/${id}/status`, 
        method: "PATCH", 
        params: { is_active } 
      }),
      invalidatesTags: ["MaterialCategory"],
    }),
    // ---- Material Details (Assignments) ----
    getAllMaterialDetails: builder.query<BaseResponseDTO<any[]>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/material-details`, method: "GET", params: params ?? undefined }),
      providesTags: ["MaterialDetail"],
    }),
    getMaterialDetailById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/material-details/${id}`,
      providesTags: (result, error, id) => [{ type: "MaterialDetail", id }],
    }),
    createMaterialDetail: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/material-details`, method: "POST", body }),
      invalidatesTags: ["MaterialDetail", "Material"],
    }),
    updateMaterialDetail: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/material-details/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "MaterialDetail", id }, "MaterialDetail", "Material"],
    }),
    deleteMaterialDetail: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/material-details/${id}`, method: "DELETE" }),
      invalidatesTags: ["MaterialDetail", "Material"],
    }),
    toggleMaterialDetailStatus: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({ 
        url: `/cems/material-details/${id}/status`, 
        method: "PATCH", 
        params: { is_active } 
      }),
      invalidatesTags: ["MaterialDetail"],
    }),
    // ---- Sites ----
    getAllSites: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/sites",
      providesTags: ["Site"],
    }),
    getSiteById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/sites/${id}`,
      providesTags: (result, error, id) => [{ type: "Site", id }],
    }),
    createSite: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/sites`, method: "POST", body }),
      invalidatesTags: ["Site"],
    }),
    updateSite: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/sites/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Site"],
    }),
    deleteSite: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/sites/${id}`, method: "DELETE" }),
      invalidatesTags: ["Site"],
    }),
    // ---- Site Types ----
    getAllSiteTypes: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/site-types",
      providesTags: ["SiteType"],
    }),
    createSiteType: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/site-types`, method: "POST", body }),
      invalidatesTags: ["SiteType"],
    }),
    updateSiteType: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/site-types/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["SiteType"],
    }),
    deleteSiteType: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/site-types/${id}`, method: "DELETE" }),
      invalidatesTags: ["SiteType"],
    }),
    // ---- Designations ----
    getAllDesignations: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/designations",
      providesTags: ["Designation"],
    }),
    createDesignation: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/designations`, method: "POST", body }),
      invalidatesTags: ["Designation"],
    }),
    updateDesignation: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/designations/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Designation"],
    }),
    deleteDesignation: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/designations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Designation"],
    }),
    toggleDesignation: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/cems/designations/${id}/status`,
        method: "PATCH",
        params: { is_active }
      }),
      invalidatesTags: ["Designation"],
    }),
    // ---- Document Types ----
    getAllDocumentTypes: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/document-types",
      providesTags: ["DocumentType"],
    }),
    createDocumentType: builder.mutation<BaseResponseDTO<any>, any>({
      query: (body) => ({ url: `/cems/document-types`, method: "POST", body }),
      invalidatesTags: ["DocumentType"],
    }),
    updateDocumentType: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/cems/document-types/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["DocumentType"],
    }),
    deleteDocumentType: builder.mutation<BaseResponseDTO<any>, number>({
      query: (id) => ({ url: `/cems/document-types/${id}`, method: "DELETE" }),
      invalidatesTags: ["DocumentType"],
    }),
    toggleDocumentType: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/cems/document-types/${id}/status`,
        method: "PATCH",
        params: { is_active }
      }),
      invalidatesTags: ["DocumentType"],
    }),
    // ---- Tasks ----
    getAllTasks: builder.query<BaseResponseDTO<any>, PaginationParams | void>({
      query: (params) => ({ url: `/cems/tasks`, method: "GET", params: params ?? undefined }),
      providesTags: ["Task"],
    }),
    getTaskById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/cems/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<BaseResponseDTO<any>, FormData>({
      query: (body) => ({ url: `/cems/tasks`, method: "POST", body }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<BaseResponseDTO<any>, { id: number; data: FormData }>({
      query: ({ id, data }) => ({ url: `/cems/tasks/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }, "Task"],
    }),
    updateTaskStatus: builder.mutation<BaseResponseDTO<any>, { id: number; is_active: boolean }>({
      query: ({ id, is_active }) => ({ url: `/cems/tasks/${id}/status`, method: "PATCH", params: { is_active } }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }, "Task"],
    }),
    // ---- Countries ----
    getAllCountries: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/countries/select",
      providesTags: ["Country"],
    }),
    // ---- Salutations ----
    getAllSalutations: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/salutations",
      providesTags: ["Salutation"],
    }),
    // ---- Company ----
    getCompany: builder.query<BaseResponseDTO<any>, void>({
      query: () => "/cems/company",
      providesTags: ["Company"],
    }),
    updateCompany: builder.mutation<BaseResponseDTO<any>, FormData>({
      query: (body) => ({ url: `/cems/company`, method: "PUT", body }),
      invalidatesTags: ["Company"],
    }),
    // ---- Users (Software) ----
    getAllUsers: builder.query<BaseResponseDTO<any[]>, PaginationParams | void>({
      query: (params) => ({ url: "/software/users", method: "GET", params: params ?? undefined }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<BaseResponseDTO<any>, FormData>({
      query: (body) => ({ url: "/software/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<BaseResponseDTO<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/software/users/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),
    getUserById: builder.query<BaseResponseDTO<any>, number>({
      query: (id) => `/software/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    // ---- Genders ----
    getAllGenders: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/cems/genders/",
      providesTags: ["Gender"],
    }),
    // ---- Roles ----
    getAllRoles: builder.query<BaseResponseDTO<any[]>, void>({
      query: () => "/roles/",
      providesTags: ["Roles"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation, useGetUserByIdQuery,
  useGetAllGendersQuery, useGetAllRolesQuery,
  useGetAllProjectsQuery, useGetProjectByIdQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation,
  useGetAllClientsQuery, useGetClientByIdQuery, useCreateClientMutation, useUpdateClientMutation, useDeleteClientMutation,
  useGetAllEmployeesQuery, useGetEmployeeByIdQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation,
  useGetAllMaterialsQuery, useGetMaterialByIdQuery, useCreateMaterialMutation, useUpdateMaterialMutation, useDeleteMaterialMutation,
  useGetAllEquipmentsQuery, useGetEquipmentByIdQuery, useCreateEquipmentMutation, useUpdateEquipmentMutation, useDeleteEquipmentMutation,
  useGetAllTransactionsQuery, useGetTransactionByIdQuery, useCreateTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation,
  useGetAllDailyProgresssQuery, useGetDailyProgressByIdQuery, useCreateDailyProgressMutation, useUpdateDailyProgressMutation, useDeleteDailyProgressMutation,
  useGetAllSiteIssuesQuery, useGetSiteIssueByIdQuery, useCreateSiteIssueMutation, useUpdateSiteIssueMutation, useDeleteSiteIssueMutation,
  useGetNotificationCountQuery, useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation,
  useGetAllProjectStatusesQuery, useCreateProjectStatusMutation, useUpdateProjectStatusMutation, useDeleteProjectStatusMutation, useToggleProjectStatusMutation,
  // Categories
  useGetAllProjectCategoriesQuery, useCreateProjectCategoryMutation, useUpdateProjectCategoryMutation, useDeleteProjectCategoryMutation,
  // Members
  useGetProjectMembersQuery, useAddProjectMemberMutation, useUpdateProjectMemberMutation, useRemoveProjectMemberMutation,
  // Material Units
  useGetAllMaterialUnitsQuery, useGetMaterialUnitByIdQuery, useCreateMaterialUnitMutation, useUpdateMaterialUnitMutation, useDeleteMaterialUnitMutation, useToggleMaterialUnitStatusMutation,
  // Material Categories
  useGetAllMaterialCategoriesQuery, useGetMaterialCategoryByIdQuery, useCreateMaterialCategoryMutation, useUpdateMaterialCategoryMutation, useDeleteMaterialCategoryMutation, useToggleMaterialCategoryStatusMutation,

  // Sites
  useGetAllSitesQuery, useGetSiteByIdQuery, useCreateSiteMutation, useUpdateSiteMutation, useDeleteSiteMutation,
  // Site Types
  useGetAllSiteTypesQuery, useCreateSiteTypeMutation, useUpdateSiteTypeMutation, useDeleteSiteTypeMutation,
  // Designations
  useGetAllDesignationsQuery, useCreateDesignationMutation, useUpdateDesignationMutation, useDeleteDesignationMutation, useToggleDesignationMutation,
  useGetAllDocumentTypesQuery, useCreateDocumentTypeMutation, useUpdateDocumentTypeMutation, useDeleteDocumentTypeMutation, useToggleDocumentTypeMutation,
  // Tasks
  useGetAllTasksQuery, useGetTaskByIdQuery, useCreateTaskMutation, useUpdateTaskMutation, useUpdateTaskStatusMutation,
  // Countries
  useGetAllCountriesQuery,
  // Salutations
  useGetAllSalutationsQuery,
  // Company
  useGetCompanyQuery, useUpdateCompanyMutation,
  // Material Details
  useGetAllMaterialDetailsQuery, useGetMaterialDetailByIdQuery, useCreateMaterialDetailMutation, useUpdateMaterialDetailMutation, useDeleteMaterialDetailMutation, useToggleMaterialDetailStatusMutation,
} = cemsApi;


