// src/routes/moduleRoutes/RoleRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Role from "@/core-modules/admin-module/common-setting/roles/Role";
import ViewRole from "@/core-modules/admin-module/common-setting/roles/ViewRole";



const RoleRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Role />} />
            <Route path="view/:id" element={<ViewRole />} />
        </Routes>
    );
};

export default RoleRoutes;
