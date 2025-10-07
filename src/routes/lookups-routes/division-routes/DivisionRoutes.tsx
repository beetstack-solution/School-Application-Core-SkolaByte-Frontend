import Division from "@/core-modules/admin-module/lookups/division/Division";
import ViewDivision from "@/core-modules/admin-module/lookups/division/ViewDivision";
import React from "react";
import { Route, Routes } from "react-router-dom";

const DivisionRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Division />} />
        <Route path="/view/:id" element={<ViewDivision />} />
      </Routes>
    </>
  );
};

export default DivisionRoutes;
