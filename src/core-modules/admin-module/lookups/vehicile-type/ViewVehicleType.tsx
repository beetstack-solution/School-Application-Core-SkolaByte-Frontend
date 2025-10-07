import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { fetchTransportVehiclesById } from "@/api/admin-api/lookups-api/vehicleTypeApi";

function ViewVehicleType() {
  const { id } = useParams<{ id: string }>();
  const [feeType, setFeeType] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeTypeById = async (paramId: string) => {
    try {
      const responseData: any = await fetchTransportVehiclesById(paramId);
      if (responseData.success) {
        setFeeType(responseData.data);
      } else {
        setError("Transportation type not found.");
      }
    } catch (error) {
      console.error("Error fetching transportation type:", error);
      setError("Error fetching transportation type");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFeeTypeById(id);
    }
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto mt-8 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Transportation Type", path: "/lookups/vehicle-types" },
    { label: "View Transportation Type", path: "" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">Transportation Type Details</h3>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <Link to={"/lookups/vehicle-types"}>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {feeType && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {/* <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">Code</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feeType?.code || "N/A"}</td>
                </tr> */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feeType?.name || "N/A"}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Status</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${feeType?.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {feeType?.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Created At</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feeType?.createdAt ? new Date(feeType.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Created By</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feeType?.createdBy?.name || "System"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewVehicleType;