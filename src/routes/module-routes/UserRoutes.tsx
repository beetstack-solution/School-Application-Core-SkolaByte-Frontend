// src/routes/moduleRoutes/UserRoutes.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Users from "@/core-modules/admin-module/base-module/users/Users";
import AddUsers from "@/core-modules/admin-module/base-module/users/AddUsers";
import ViewUsers from "@/core-modules/admin-module/base-module/users/ViewUsers";
import EditUser from "@/core-modules/admin-module/base-module/users/EditUser";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="add" element={<AddUsers />} />
      <Route path="view/:id" element={<ViewUsers />} />
      <Route path="edit/:id" element={<EditUser />} />
    </Routes>
  );
};

export default UserRoutes;
