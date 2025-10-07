import Permission from "@/core-modules/admin-module/erp-setting/permissions/Permission";
import { Routes, Route } from "react-router-dom";

const PermissionsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Permission />} />
      {/* <Route path="add/" element={<AddModule />} />
      <Route path="edit/:id" element={<EditModule />} /> */}
      {/* <Route path="view/:id" element={<ViewModule />} /> */}
    </Routes>
  );
};

export default PermissionsRoutes;
