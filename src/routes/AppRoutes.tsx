import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "../app_layouts/Applayout";
import Login from "../pages/login/login";

// 🔹 Lazy imports
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CreateNewProject = lazy(() => import("../pages/projects/CreateNewProject"));
const AllProjects = lazy(() => import("../pages/projects/AllProjects"));
const ProjectCategories = lazy(() => import("../pages/projects/ProjectCategories"));
const CreateProjectCategory = lazy(() => import("../pages/projects/CreateProjectCategory"));
const Materials = lazy(() => import("../pages/resources/Materials"));
const MaterialAssignments = lazy(() => import("../pages/resources/MaterialAssignments"));
const AssignMaterial = lazy(() => import("../pages/resources/AssignMaterial"));
const AllEquipment = lazy(() => import("../pages/resources/AllEquipment"));
const AllMaterials = lazy(() => import("../pages/resources/AllMaterials"));


const CreateNewClient = lazy(() => import("../pages/setting/ClientSetup/CreateNewClient"));
const ViewAllClients = lazy(() => import("../pages/setting/ClientSetup/ViewAllClients"));
const ClientDetails = lazy(() => import("../pages/setting/ClientSetup/ClientDetails"));

const DailyProgress = lazy(() => import("../pages/site/DailyProgress"));
const DailyProgressFormPage = lazy(() => import("../pages/site/DailyProgressFormPage"));

const ViewAllUsers = lazy(() => import("../pages/setting/Software User Setup/ViewAllUsers"));
const CreateNewUser = lazy(() => import("../pages/setting/Software User Setup/CreateNewUser"));
const RoleTable = lazy(() => import("../pages/setting/Software User Setup/RoleTable"));

const CreateNewEmployee = lazy(() => import("../pages/setting/EmployeeSetup/CreateNewEmployee"));
const ViewAllEmployees = lazy(() => import("../pages/setting/EmployeeSetup/ViewAllEmployees"));
const MaterialCategories = lazy(() => import("../pages/setting/MaterialCategorySetup/MaterialCategories"));
const CreateMaterialCategory = lazy(() => import("../pages/setting/MaterialCategorySetup/CreateMaterialCategory"));
const MaterialUnits = lazy(() => import("../pages/setting/MaterialUnitSetup/MaterialUnits"));
const StatusList = lazy(() => import("../pages/setting/StatusSetup/StatusList"));
const CreateStatus = lazy(() => import("../pages/setting/StatusSetup/CreateStatus"));
const DesignationList = lazy(() => import("../pages/setting/DesignationSetup/DesignationList"));
const CreateDesignation = lazy(() => import("../pages/setting/DesignationSetup/CreateDesignation"));
const DocumentTypeList = lazy(() => import("../pages/setting/DocumentTypeSetup/DocumentTypeList"));
const CreateDocumentType = lazy(() => import("../pages/setting/DocumentTypeSetup/CreateDocumentType"));

const SiteTypes = lazy(() => import("../pages/setting/SiteSetup/SiteTypes"));
const Sites = lazy(() => import("../pages/setting/SiteSetup/Sites"));
const CreateMaterialUnit = lazy(() => import("../pages/setting/MaterialUnitSetup/CreateMaterialUnit"));
const CreateSiteType = lazy(() => import("../pages/setting/SiteSetup/CreateSiteType"));
const CreateSite = lazy(() => import("../pages/setting/SiteSetup/CreateSite"));

const CompanyProfile = lazy(() => import("../pages/setting/CompanyProfile"));
const UserProfile = lazy(() => import("../pages/setting/UserProfile"));

const FinanceTransactions = lazy(() => import("../pages/finance/FinanceTransactions"));
const CreateTransaction = lazy(() => import("../pages/finance/CreateTransaction"));
const AnalyticsDashboard = lazy(() => import("../pages/analysis/AnalyticsDashboard"));
const AllSiteIssues = lazy(() => import("../pages/site/AllSiteIssues"));
const ReportSiteIssue = lazy(() => import("../pages/site/ReportSiteIssue"));
const ReportSiteIssueEdit = lazy(() => import("../pages/site/ReportSiteIssue")); // Re-using for edit

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Layout */}
      <Route element={<AppLayout />}>
        {/* Default */}
        <Route path="/" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/categories" element={<ProjectCategories />} />
        <Route path="/projects/categories/create" element={<CreateProjectCategory />} />
        <Route path="/projects/categories/edit/:id" element={<CreateProjectCategory />} />
        <Route path="/projects/create" element={<CreateNewProject />} />
        <Route path="/projects/edit/:id" element={<CreateNewProject />} />

        {/* Resources */}
        <Route path="/resources/materials" element={<AllMaterials />} />
        <Route path="/resources/materials/all" element={<AllMaterials />} />
        <Route path="/resources/materials/create" element={<Materials />} />
        <Route path="/resources/materials/edit/:id" element={<Materials />} />
        
        <Route path="/resources/assignments" element={<MaterialAssignments />} />
        <Route path="/resources/assignments/create" element={<AssignMaterial />} />
        <Route path="/resources/assignments/edit/:id" element={<AssignMaterial />} />
        
        <Route path="/resources/equipment/all" element={<AllEquipment />} />



        {/* Site Operations */}
        <Route path="/site-operations/daily-progress/all" element={<DailyProgress />} />
        <Route path="/site-operations/daily-progress/create" element={<DailyProgressFormPage />} />
        <Route path="/site-operations/daily-progress/edit/:id" element={<DailyProgressFormPage />} />
        
        <Route path="/site-operations/site-issues/all" element={<AllSiteIssues />} />
        <Route path="/site-operations/site-issues/report" element={<ReportSiteIssue />} />
        <Route path="/site-operations/site-issues/edit/:id" element={<ReportSiteIssue />} />

        {/* Finance */}
        <Route path="/finance/transactions/all" element={<FinanceTransactions />} />
        <Route path="/finance/transactions/create" element={<CreateTransaction />} />
        <Route path="/finance/transactions/edit/:id" element={<CreateTransaction />} />
        
        <Route path="/analysis/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/analysis/reports" element={<AnalyticsDashboard />} />

        {/* Settings */}
        <Route path="/settings/roles" element={<RoleTable />} />
        <Route path="/settings/users" element={<ViewAllUsers />} />
        <Route path="/settings/users/create" element={<CreateNewUser />} />
        <Route path="/settings/users/edit/:id" element={<CreateNewUser />} />

        <Route path="/settings/company" element={<CompanyProfile />} />
        <Route path="/settings/profile" element={<UserProfile />} />

        <Route path="/settings/employees" element={<ViewAllEmployees />} />
        <Route path="/settings/material-categories" element={<MaterialCategories />} />
        <Route path="/settings/material-units" element={<MaterialUnits />} />
        <Route path="/settings/statuses" element={<StatusList />} />
        <Route path="/settings/document-types" element={<DocumentTypeList />} />
        <Route path="/settings/designations" element={<DesignationList />} />
        <Route path="/settings/site-types" element={<SiteTypes />} />
        <Route path="/settings/sites" element={<Sites />} />

        {/* Master Data Forms */}
        <Route path="/settings/material-units/create" element={<CreateMaterialUnit />} />
        <Route path="/settings/material-units/edit/:id" element={<CreateMaterialUnit />} />
        
        <Route path="/settings/designations/create" element={<CreateDesignation />} />
        <Route path="/settings/designations/edit/:id" element={<CreateDesignation />} />

        <Route path="/settings/document-types/create" element={<CreateDocumentType />} />
        <Route path="/settings/document-types/edit/:id" element={<CreateDocumentType />} />

        <Route path="/settings/site-types/create" element={<CreateSiteType />} />
        <Route path="/settings/site-types/edit/:id" element={<CreateSiteType />} />

        <Route path="/settings/sites/create" element={<CreateSite />} />
        <Route path="/settings/sites/edit/:id" element={<CreateSite />} />
        <Route path="/settings/employees/create" element={<CreateNewEmployee />} />
        <Route path="/settings/employees/edit/:id" element={<CreateNewEmployee />} />
        
        <Route path="/settings/material-categories/create" element={<CreateMaterialCategory />} />
        <Route path="/settings/material-categories/edit/:id" element={<CreateMaterialCategory />} />
        
        <Route path="/settings/clients" element={<ViewAllClients />} />
        <Route path="/settings/clients/all" element={<ViewAllClients />} />
        <Route path="/settings/clients/create" element={<CreateNewClient />} />
        <Route path="/settings/clients/edit/:id" element={<CreateNewClient />} />
        <Route path="/settings/clients/view/:id" element={<ClientDetails />} />

        <Route path="/settings/statuses/create" element={<CreateStatus />} />
        <Route path="/settings/statuses/edit/:id" element={<CreateStatus />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
