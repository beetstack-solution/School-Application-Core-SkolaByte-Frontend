import AddModule from "@/core-modules/admin-module/erp-setting/module/AddModule";
import EditModule from "@/core-modules/admin-module/erp-setting/module/EditModule";
import Module from "@/core-modules/admin-module/erp-setting/module/Module";
import ViewModule from "@/core-modules/admin-module/erp-setting/module/ViewModule";
import { Routes, Route } from "react-router-dom";

const ModuleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Module />} />
      {/* <Route path="add/" element={<AddModule />} />
      <Route path="edit/:id" element={<EditModule />} /> */}
      <Route path="view/:id" element={<ViewModule />} />
    </Routes>
  );
};

export default ModuleRoutes;
