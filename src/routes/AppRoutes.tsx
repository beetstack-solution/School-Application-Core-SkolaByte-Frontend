// src/routes/moduleRoutes/AppRoutes.tsx

import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/layouts/Header";
import Sidebar from "@/layouts/Sidebar";
import Dashboard from "@/core-modules/admin-module/main-pages/Dashboard";
import "@/assets/css/mainStyles.css";
import "@/assets/css/sidebarStyles.css";
import "@/assets/css/tableStyles.css";
import "@/assets/css/headerStyles.css";
import "@/assets/css/breadcumbStyles.css";
import "@/assets/css/searchbarStyles.css";
// import "@/assets/css/mediaQuery.css";
import Login from "@/core-modules/auth-module/auth/login/Login";
import { PrivateRoute } from "@/routes/PrivateRoute";
import UserRoutes from "@/routes/module-routes/UserRoutes"; // Import the UserRoutes component
import SchoolCodeLogin from "@/core-modules/auth-module/auth/login/SchoolCodeLogin";

// Define the type for the props that include children
interface LayoutProps {
  children: ReactNode;
}

// A layout for the private routes (with Sidebar and Header)
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 p-4 h-screen overflow-y-auto overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login Page */}
        <Route path="/school/login" element={<SchoolCodeLogin />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes - Dashboard and Other Pages */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          {/* Include the User Routes */}
          <UserRoutes />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
