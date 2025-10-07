import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import {
  fetchfinancialYearById,
  FinancialYearData,
} from "@/api/super-admin-api/financialYearApi";
import Breadcrumb from "@/components/Breadcumb";
import { formatDateOnly } from "@/helpers/helper";

const ViewFinancialYear: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get person's ID from URL
  const [groupData, setGroupData] = useState<FinancialYearData | null>(null); // This should only store currency info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyFormatById = async (id: string) => {
    try {
      const responseData = await fetchfinancialYearById(id);
      if (responseData.success) {
        console.log("Data by Financial Year ID:", responseData);
        setGroupData(responseData.financialYear);
      } else {
        setError("currency format data not found");
      }
    } catch (error: any) {
      console.error("Error fetching  Financial Year data:", error);
      setError(
        error.response?.data?.message || "Error fetching Financial Year data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCurrencyFormatById(id); // Fetch currency data when component mounts
    }
  }, [id]);

  console.log("format data:", groupData);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Financial Year", path: "/financial-years" },
    { label: "View Financial Year", path: "" },
  ];
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Financial Year</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/financial-years"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Currency Information */}
      {groupData && ( // Ensure currencyData is available
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{groupData.code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Start Month</td>
                <td className="border px-4 py-2">{groupData.startMonth}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">End Month</td>
                <td className="border px-4 py-2">{groupData.endMonth}</td>
              </tr>

              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {groupData.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {formatDateOnly(groupData.createdAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFinancialYear;
