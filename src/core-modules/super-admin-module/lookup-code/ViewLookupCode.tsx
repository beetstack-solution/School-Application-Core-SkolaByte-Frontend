import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { fetchLookupCodeById, LookupCode } from "@/api/super-admin-api/authority-setting-api/lookupCodeApi"; // Adjust the import path as needed
import Breadcrumb from "@/components/Breadcumb";

const ViewLookupCode: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get lookup code ID from URL
  const [lookupCode, setLookupCode] = useState<LookupCode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getLookupCodeById = async (lookupCodeId: string) => {
    try {
      const responseData = await fetchLookupCodeById(lookupCodeId);
      if (responseData.success) {
        console.log("Data by Lookup Code ID:", responseData);
        setLookupCode(responseData.lookupCode);
      } else {
        setError("Lookup Code not found");
      }
    } catch (error: any) {
      console.error("Error fetching Lookup Code data:", error);
      setError(
        error.response?.data?.message || "Error fetching Lookup Code data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getLookupCodeById(id); // Fetch lookup code data when component mounts
    }
  }, [id]);

  console.log("Lookup Code data", lookupCode);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Lookup Codes", path: "/lookup-code" },
    { label: "View Lookup Code", path: "" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Lookup Code</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/lookup-code"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Lookup Code Information */}
      {lookupCode && (
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Type</td>
                <td className="border px-4 py-2">{lookupCode.type}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{lookupCode.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{lookupCode.code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">First Number</td>
                <td className="border px-4 py-2">{lookupCode.firstNumber}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Last Number</td>
                <td className="border px-4 py-2">{lookupCode.lastNumber}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {lookupCode.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {new Date(lookupCode.createdAt).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Updated At</td>
                <td className="border px-4 py-2">
                  {new Date(lookupCode.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewLookupCode;
