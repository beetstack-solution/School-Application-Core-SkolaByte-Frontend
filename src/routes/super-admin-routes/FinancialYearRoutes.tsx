// src/routes/super-admin-routes/FinancialYearRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import FinancialYear from "@/core-modules/super-admin-module/financial-year/FinancialYear";
import ViewFinancialYear from "@/core-modules/super-admin-module/financial-year/ViewFinancialYear";


const FinancialYearRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<FinancialYear />} />
            <Route path="view/:id" element={<ViewFinancialYear />} />
        </Routes>
    );
};

export default FinancialYearRoutes;
