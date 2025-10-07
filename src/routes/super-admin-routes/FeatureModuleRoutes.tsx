import FeatureModule from '@/core-modules/super-admin-module/FeatureModule/FeatureModule';
import ViewFeatureModule from '@/core-modules/super-admin-module/FeatureModule/ViewfeatureModule';
import { Routes, Route } from "react-router-dom";

const FeatureModuleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FeatureModule />} />
      <Route path="view/:id" element={<ViewFeatureModule />} />
    </Routes>
  );
}

export default FeatureModuleRoutes