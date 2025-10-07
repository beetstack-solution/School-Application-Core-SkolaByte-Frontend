import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { fetchuserById, SingleUserDataResponse, UserData } from "@/api/admin-api/base-api/userApi";
import Breadcrumb from "@/components/Breadcumb";

const ViewUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get person's ID from URL
  const [userData, setUserData] = useState<SingleUserDataResponse>(); // This should only store currency info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyFormatById = async (currencyId: string) => {
    try {
      const responseData = await fetchuserById(currencyId);
      if (responseData.success) {
        console.log("Data by Tax Slab ID:", responseData);
        setUserData(responseData);
      } else {
        setError("Tax slab data not found");
      }
    } catch (error: any) {
      console.error("Error fetching  Tax Slab data:", error);
      setError(error.response?.data?.message || "Error fetching Tax Slab data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCurrencyFormatById(id); // Fetch currency data when component mounts
    }
  }, [id]);

  console.log("user data", userData);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
    { label: " View user", path: "" },
  ];
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View User</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns ">
        <Link to={"/users"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Currency Information */}
      {userData && ( // Ensure currencyData is available
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{userData.data.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Email</td>
                <td className="border px-4 py-2">{userData.data.email}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Phone</td>
                <td className="border px-4 py-2">{userData.data.phone}</td>
              </tr>

              <h1 className="mt-5 mb-2">
                <b>Address</b>
              </h1>
              <tr>
                <td className="border px-4 py-2 font-semibold">Street</td>
                <td className="border px-4 py-2">{userData.data.address.street}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">City</td>
                <td className="border px-4 py-2">{userData.data.address.city}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">District</td>
                <td className="border px-4 py-2">
                  {userData.data.address.district}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">State</td>
                <td className="border px-4 py-2">{userData.data.address.state}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Zip Code</td>
                <td className="border px-4 py-2">{userData.data.address.zipCode}</td>
              </tr>
              <h1 className="mt-5 mb-2">
                <b>Payment Address</b>
              </h1>
              <tr>
                <td className="border px-4 py-2 font-semibold">Street</td>
                <td className="border px-4 py-2">
                {userData?.data?.user?.paymentAddress?.street || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">City</td>
                <td className="border px-4 py-2">
                  {userData?.data?.user?.paymentAddress?.city}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">District</td>
                <td className="border px-4 py-2">
                  {userData?.data?.user?.paymentAddress?.district}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">State</td>
                <td className="border px-4 py-2">
                  {userData?.data?.user?.paymentAddress?.state}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Zip Code</td>
                <td className="border px-4 py-2">
                  {userData?.data?.user?.paymentAddress?.zipCode}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
