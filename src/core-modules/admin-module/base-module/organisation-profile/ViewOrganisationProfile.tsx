import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcumb";
import { useEffect, useState } from "react";
import {
  fetchOrganizationById,
  Organization,
} from "@/api/admin-api/base-api/organizationProfileApi";
function ViewOrganisationProfile() {
  const { id } = useParams<{ id: string }>(); // Get organization's ID from URL
  const [organisationProfileData, setOrganisationProfileData] =
    useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const getOrganisationProfileById = async (id: string) => {
    try {
      const responseData = await fetchOrganizationById(id);
      if (responseData.success) {
        console.log("Data by ID:", responseData);
        setOrganisationProfileData(responseData.organization);
      } else {
        setError("Organisation data not found");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrganisationProfileById(id);
    }
  }, [id]);

  const imgLogo = organisationProfileData?.logo;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Organisation Profile", path: "/organisation-profile" },
    { label: "View Organisation Profile", path: "" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Organisation Profile</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns mt-2">
        <Link to="/organisation-profile">
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      <div className="w-full md:w-4/5 mt-5">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Name</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Phone Number</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.phoneNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Email</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.email}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Website URL</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.websiteUrl}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">GSTIN Number</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.paymentAddress?.GSTINNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Logo</td>
              <td>
                <img
                  src={`${baseUrl}${imgLogo}`}
                  alt="Organization Logo"
                  className="max-w-full max-h-12"
                />
              </td>
            </tr>

            <tr>
              <td className="border px-4 py-2 font-semibold">Logo</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.logo ? (
                  <img
                    src={`${baseUrl}${organisationProfileData.logo}`} // Use the base URL to display image
                    alt="Uploaded"
                  />
                ) : (
                  "No uploaded files available."
                )}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Head Office</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.headOffice}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Default Currency
              </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.defaultCurrency}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Default Decimal
              </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.defaultDecimal}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Default Format</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.defaultFormat}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Default Financial Year
              </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.defaultFinancialYear}
              </td>
            </tr>
            {/* Add more rows for Address and Payment Address details */}
            <h1 className="mt-5 mb-2">
              <b>Address</b>
            </h1>
            <tr>
              <td className="border px-4 py-2 font-semibold">Street</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.street}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">City </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.city}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">District </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.district}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">State</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.state}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Pin Code</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.zipCode}
              </td>
            </tr>
            <h1 className="mt-5 mb-2">
              <b>Payment Address</b>
            </h1>
            <tr>
              <td className="border px-4 py-2 font-semibold">Street</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.address?.street}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">City </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.paymentAddress?.city}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">District </td>
              <td className="border px-4 py-2">
                {organisationProfileData?.paymentAddress?.district}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">State</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.paymentAddress?.state}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Pin Code</td>
              <td className="border px-4 py-2">
                {organisationProfileData?.paymentAddress?.pincode}
              </td>
            </tr>
            {/* Repeat for payment address fields as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewOrganisationProfile;
