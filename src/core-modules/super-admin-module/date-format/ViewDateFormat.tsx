import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { fetchDateFormatById, DateFormatData } from "@/api/super-admin-api/dateFormatApi";
import Breadcrumb from "@/components/Breadcumb";
import { formatDateOnly } from "@/helpers/helper";

const ViewDateFormat: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get person's ID from URL
  const [dateFormat, setDateFormat] = useState<DateFormatData | null>(null); // This should only store currency info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyFormatById = async (id: string) => {
    try {
      const responseData = await fetchDateFormatById(id);
      if (responseData.success) {
        console.log("Data by Financial Year ID:", responseData);
        setDateFormat(responseData.dateFormat);
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

  console.log("format data:", dateFormat);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Date Format", path: "/date-format" },
    { label: "View Date Format", path: "" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Date Format</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="header-btns">
        <Link to={"/date-format"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Currency Information */}
      {dateFormat && ( // Ensure currencyData is available
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{dateFormat.code}</td>
              </tr>
              {/* <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{dateFormat.name}</td>
              </tr> */}
              <tr>
                <td className="border px-4 py-2 font-semibold">Date</td>
                <td className="border px-4 py-2">{dateFormat.dateFormat}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{dateFormat.name}</td>
              </tr>

              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {dateFormat.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {formatDateOnly(dateFormat.createdAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewDateFormat;
