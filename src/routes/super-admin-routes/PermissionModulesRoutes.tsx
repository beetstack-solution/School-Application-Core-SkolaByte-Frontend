import PermissionModules from "@/core-modules/super-admin-module/authority-settings/permission_modules/PermissionModules"
import ViewPermissionModules from "@/core-modules/super-admin-module/authority-settings/permission_modules/ViewPermissionModules"
import { Route, Routes } from "react-router-dom"

const PermissionModulesRoutes = () => {
  return (
    <Routes>
         <Route path="/" element={<PermissionModules />} />
         <Route path="view/:id" element={<ViewPermissionModules />} />
    </Routes>
  )
}

export default PermissionModulesRoutes