import {
  fetchModelById,
  ModuleItems,
} from "@/api/admin-api/erp-setting-api/authortity-setting-api/moduleApi";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import { formatDate } from "@/helpers/helper";
import Breadcrumb from "@/components/Breadcumb";

function ViewModule() {
  const { id } = useParams<{ id: string }>(); // Get module ID from URL
  const [moduleData, setModuleData] = useState<ModuleItems | null>(null); // This should only store module info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getModelDataById = async (moduleId: string) => {
    setLoading(true); // Ensure loading state is set to true before the request
    try {
      const responseData = await fetchModelById(moduleId);
      console.log("API Response:", responseData); // Debugging to log the response

      if (responseData?.success && responseData.module) {
        console.log("Module Data:", responseData.module); // Further logging
        setModuleData(responseData.module); // Set the single module object
      } else {
        setError("Module data not found");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false); // Ensure loading is set to false in all cases
    }
  };

  useEffect(() => {
    if (id) {
      getModelDataById(id); // Fetch module data when component mounts
    }
  }, [id]);
  console.log("moduleData :", moduleData);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Module", path: "/module" },
    { label: "View Module", path: "" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Module</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/module"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Module Information */}

      {moduleData ? (
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{moduleData.code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{moduleData.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">created At</td>
                <td className="border px-4 py-2">
                  {formatDate(moduleData.createdAt)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {moduleData.status ? "Active" : "Inactive"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">No module data available</div>
      )}
    </div>
  );
}

export default ViewModule;
