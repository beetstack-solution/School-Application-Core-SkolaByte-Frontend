import AddOrganizationProfile from "@/core-modules/admin-module/base-module/organisation-profile/AddOrganizationProfile";
import EditOrganisationProfile from "@/core-modules/admin-module/base-module/organisation-profile/EditOrganisationProfile";
import OrganisationProfile from "@/core-modules/admin-module/base-module/organisation-profile/OrganisationProfile";
import ViewOrganisationProfile from "@/core-modules/admin-module/base-module/organisation-profile/ViewOrganisationProfile";
import { Routes, Route } from "react-router-dom";

const OrganisationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OrganisationProfile />} />
      <Route path="add" element={<AddOrganizationProfile />} />
      <Route path="view/:id" element={<ViewOrganisationProfile />} />
      <Route path="edit/:id" element={<EditOrganisationProfile />} />
    </Routes>
  );
};

export default OrganisationRoutes;
