import { Link, useParams } from "react-router-dom";
import {
  fetchCurrencyFormatById,
  CurrencyDecimal,
} from "@/api/super-admin-api/currenctDecimalsApi";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { formatDateOnly } from "@/helpers/helper";

const ViewCurrencyDecimals: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get currency ID from URL
  const [currencyDecimal, setCurrencyDecimal] =
    useState<CurrencyDecimal | null>(null); // Store currency info
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyDecimalById = async (currencyId: string) => {
    try {
      const responseData = await fetchCurrencyFormatById(currencyId);
      if (responseData.success) {
        setCurrencyDecimal(responseData.currencyDecimal); // Use currencyDecimal instead of currencyDecimals
      } else {
        setError("currency Decimal data not found");
      }
    } catch (error: any) {
      console.error("Error fetching currency Decimal:", error);
      setError("Error fetching currency Decimal"); // Simplified error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCurrencyDecimalById(id); // Fetch currency Decimal when component mounts
    }
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Currency Decimals", path: "/currency-decimals" },
    { label: "View Currency Decimal", path: "" },
  ];
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Currency Decimal</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/currency-decimals"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      {/* Display Currency Information */}
      {currencyDecimal && ( // Ensure currencyDecimal is available
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{currencyDecimal.code}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Decimal Value
                </td>
                <td className="border px-4 py-2">
                  {currencyDecimal.decimalValue}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Display Value
                </td>
                <td className="border px-4 py-2">
                  {currencyDecimal.displayValue}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {currencyDecimal.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {formatDateOnly(currencyDecimal.createdAt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCurrencyDecimals;
