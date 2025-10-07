import { Link, useParams } from "react-router-dom";
import {
  fetchCurrencyFormatById,
  CurrencyFormatData,
} from "@/api/super-admin-api/currencyFormatApi";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { formatDateOnly } from "@/helpers/helper";

const ViewCurrencyFormat: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get person's ID from URL
  const [currencyData, setCurrencyData] = useState<CurrencyFormatData | null>(
    null
  ); // This should only store currency info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyFormatById = async (currencyId: string) => {
    try {
      const responseData = await fetchCurrencyFormatById(currencyId);
      if (responseData.success) {
        console.log("Data by currency ID:", responseData);
        setCurrencyData(responseData.currencyFormat);
      } else {
        setError("currency format data not found");
      }
    } catch (error: any) {
      console.error("Error fetching  currencyFormats data:", error);
      setError(
        error.response?.data?.message || "Error fetching currency Formats data"
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

  console.log("format data:", currencyData);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Currency Format", path: "/currency-format" },
    { label: " View Currency Format", path: "" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Currency Format</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/currency-format"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Currency Information */}
      {currencyData && ( // Ensure currencyData is available
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{currencyData.code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Format Pattern
                </td>
                <td className="border px-4 py-2">
                  {currencyData.formatPattern}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{currencyData.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {currencyData.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {formatDateOnly(currencyData.createdAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCurrencyFormat;
