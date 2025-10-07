import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  updateDataById,
  fetchfinancialYearById,
} from "@/api/super-admin-api/financialYearApi";
import { toast } from "react-toastify";

interface EditFinancialYearProps {
  onClose: () => void;
  yearId: string;
  onReload: () => void;
}

const EditFinancialYear: React.FC<EditFinancialYearProps> = ({
  onClose,
  yearId,
  onReload,
}) => {
  const [startMonth, setStartMonth] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadFinancialYear = async () => {
      try {
        const response = await fetchfinancialYearById(yearId);
        setStartMonth(response.financialYear.startMonth);
        setEndMonth(response.financialYear.endMonth);
      } catch (error) {
        console.error("Error loading financial year data:", error);
        setError("Failed to load financial year data.");
      }
    };
    loadFinancialYear();
  }, [yearId]);

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    setStartMonth(selectedMonth);

    // Calculate the next month based on the selected starting month
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex >= 0) {
      const nextMonthIndex = (monthIndex + 1) % months.length; // Wrap to January if December
      setEndMonth(months[nextMonthIndex]);
    } else {
      setEndMonth(""); // Reset if no valid month is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
  
    const updatedData: any = { startMonth, endMonth };
  
    try {
      const response = await updateDataById(yearId, updatedData);
      console.log("Financial Year updated successfully!", response);
  
      if (response.success) {
        toast.success(response.message || "Financial Year updated successfully!");
        // Ensure onClose is invoked with parentheses
      } else {
        toast.error(response.message || "Failed to update financial year. Please try again.");
      }
      onReload(); // Ensure onReload is invoked with parentheses
      onClose();
    } catch (error: any) {
      console.error(error.message || "Error updating financial year:", error);
      toast.error(error.message || "Failed to update financial year. Please try again.");
      setError(error.message || "Failed to update financial year. Please try again.");
    }
  };
  

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Financial Year</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Starting Month
          </label>
          <select
            value={startMonth}
            onChange={handleStartMonthChange} // Update on change
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Month
            </option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ending Month (Next Financial Year)
          </label>
          <input
            type="text"
            value={endMonth}
            readOnly // Make read-only
            className="w-full p-2 border rounded-lg bg-gray-200 cursor-not-allowed" // Style as read-only
          />
        </div>
        <div className="flex justify-end space-x-4 items-center">
          <button type="submit" className="submit-btn">
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" /> Update
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            <FcCancel size={20} className="mr-2" /> Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFinancialYear;
