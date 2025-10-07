import Feature from "@/core-modules/super-admin-module/features/Feature";
import ViewFeature from "@/core-modules/super-admin-module/features/ViewFeature";
import { Routes, Route } from "react-router-dom";

const FeatureRoutes = () => {
    return (
  <Routes>
    <Route path="/" element={<Feature />} />
    <Route path="view/:id" element={<ViewFeature />} />
  </Routes>
  );
};

export default FeatureRoutes;
