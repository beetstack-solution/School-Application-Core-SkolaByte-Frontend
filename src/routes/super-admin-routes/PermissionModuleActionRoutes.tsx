import ModuleActions from "@/core-modules/super-admin-module/authority-settings/moduleActions/ModuleActions";
import { Route, Routes } from "react-router-dom";

const PermissionModuleActionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ModuleActions />} />
    </Routes>
  );
};

export default PermissionModuleActionRoutes;
