// src/routes/moduleRoutes/ProfileRoutes.tsx

import React from "react";
import { Route, Routes } from "react-router-dom";
import Profile from "@/core-modules/admin-module/base-module/profile/Profile";
import EditProfile from "@/core-modules/admin-module/base-module/profile/EditProfile";

const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile/:id" element={<EditProfile />} />
    </Routes>
  );
};

export default ProfileRoutes;
