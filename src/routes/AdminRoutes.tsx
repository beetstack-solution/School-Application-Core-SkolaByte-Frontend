// src/routes/AdminRoutes.tsx

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "@/assets/css/index.css"; // Import the consolidated CSS file

// Lazy load components
const Dashboard = lazy(
  () => import("@/core-modules/admin-module/main-pages/Dashboard")
);
const Login = lazy(() => import("@/core-modules/auth-module/auth/login/Login"));
const Layout = lazy(() => import("@/layouts/Layout"));
const UserRoutes = lazy(() => import("@/routes/module-routes/UserRoutes"));
const ProfileRoutes = lazy(
  () => import("@/routes/module-routes/ProfileRoutes")
);

const ModuleTypeRoutes = lazy(
  () => import("@/routes/super-admin-routes/ModuleTypeRoutes")
);
const PermissionModulesRoutes = lazy(
  () => import("@/routes/super-admin-routes/PermissionModulesRoutes")
);
const PermissionModuleActionRoutes = lazy(
  () => import("@/routes/super-admin-routes/PermissionModuleActionRoutes")
);
// const TaxRoutes = lazy(() => import("@/routes/super-admin-routes/TaxRoutes"));
// const TaxSlabRoutes = lazy(
//   () => import("@/routes/super-admin-routes/TaxSlabRoutes")
// );

import { PrivateRoute } from "./PrivateRoute";
import RoleRoutes from "./module-routes/RoleRoutes";
import FinancialYearRoutes from "./super-admin-routes/FinancialYearRoutes";
import LookupCodeRoutes from "./super-admin-routes/LookupCodeRoutes";
import ModuleRoutes from "./module-routes/settings-routes/ModuleRoutes";
import PermissionsRoutes from "./module-routes/settings-routes/PermissionsRoutes";
import OrganisationRoutes from "./module-routes/OrganisationRoutes";
import FeatureRoutes from "./super-admin-routes/FeatureRoutes";
import FeatureModuleRoutes from "./super-admin-routes/FeatureModuleRoutes";
import LookupsRoutes from "./lookups-routes/LookupsRoutes";
import StudentManagementRoutes from "./student-management-routes/StudentManagementRoutes";
import PaymentRoutes from "./lookups-routes/payment-routes/PaymentRoutes";
import NotificationRoutes from "./notification-routes/NotificationRoutes";
import AttendenceReportRoutes from "./report-routes/attendence/AttendenceReportRoutes";
import ReportsRoutes from "./report-routes/ReportsRoutes";
import SpinnerLoader from "@/components/SpinnerLoader";
import SchoolCodeLogin from "@/core-modules/auth-module/auth/login/SchoolCodeLogin";
import CmsPageRoutes from "./cms-page-routes/CmsPageRoutes";


// import ModuleTypeRoutes from "./super-admin-routes/ModuleTyperoutes";
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/school/login" element={
         <Suspense fallback={<SpinnerLoader />}>
        <SchoolCodeLogin />
        </Suspense>
      } />
      {/* Public Route - Login Page */}
      <Route path="/login" element={
         <Suspense fallback={<SpinnerLoader />}>
        <Login />
        </Suspense>
      } />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={  <Suspense fallback={<SpinnerLoader />}><Layout /></Suspense>}>
          <Route index element={<Suspense fallback={<SpinnerLoader />}><Dashboard /></Suspense>} />
          {/* Include the UserRoutes */}
          <Route path="users/*" element={  <Suspense fallback={<SpinnerLoader />}><UserRoutes /></Suspense>} />
          <Route
            path="organisation-profile/*"
            element={<OrganisationRoutes />}
          />

          {/* Include the ProfileRoutes */}
          <Route path="profile/*" element={<ProfileRoutes />} />

          {/* Include the RoleRoutes */}
          <Route path="roles/*" element={<RoleRoutes />} />

          {/* base module routes */}

          {/* Include the permission module */}
          <Route
            path="permission-modules/*"
            element={<PermissionModulesRoutes />}
          />
          {/* Include the permission module */}
          <Route
            path="module-action/*"
            element={<PermissionModuleActionRoutes />}
          />

          {/* Include the CurrencyDecimals */}
          <Route path="module-type/*" element={<ModuleTypeRoutes />} />

          {/* Include the CurrencyDecimals */}
          {/* <Route path="tax/*" element={<TaxRoutes />} /> */}
          {/* Include the CurrencyDecimals */}
          {/* <Route path="tax-slab/*" element={<TaxSlabRoutes />} /> */}

          {/* Add more module routes here */}

          <Route path="financial-years/*" element={<FinancialYearRoutes />} />
          {/* Add more module routes here */}
          <Route path="lookup-code/*" element={<LookupCodeRoutes />} />

  


          {/* Add more module routes here */}
          <Route path="student-managements/*" element={<StudentManagementRoutes />} />
          <Route path="module/*" element={<ModuleRoutes />} />
          <Route path="permissions/*" element={<PermissionsRoutes />} />
          <Route path="feature/*" element={<FeatureRoutes />} />
          <Route path="feature-module/*" element={<FeatureModuleRoutes />} />


          {/* Super Admin Routes end */}

          {/* lookups routes */}
          <Route path="lookups/*" element={<LookupsRoutes />} />
          <Route path="notifications/*" element={<NotificationRoutes />} />
          <Route path="reports/*" element={<ReportsRoutes />} />
          <Route path="page/*" element={<CmsPageRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
