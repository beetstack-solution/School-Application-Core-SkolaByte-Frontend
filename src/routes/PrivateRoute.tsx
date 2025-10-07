import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SpinnerLoader from "@/components/SpinnerLoader";

export const PrivateRoute: React.FC = () => {
  const { currentSchoolAdmin ,loading } = useSelector(
    // (state: any) => state.auth.admin
    (state: any) => state.user
  );
  if (loading) {
    return <SpinnerLoader />;
  }
  const isAuthenticated = currentSchoolAdmin;
  return isAuthenticated ? <Outlet /> : <Navigate to="/school/login" />;
};

export default PrivateRoute;
