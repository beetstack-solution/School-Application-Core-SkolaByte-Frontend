import LookupCodeComponent from "@/core-modules/super-admin-module/lookup-code/LookupCodeComponent";
import ViewLookupCode from "@/core-modules/super-admin-module/lookup-code/ViewLookupCode";
import { Route, Routes } from "react-router-dom";

const LookupCodeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LookupCodeComponent />} />
      <Route path="view/:id" element={<ViewLookupCode />} />
    </Routes>
  );
};

export default LookupCodeRoutes;
