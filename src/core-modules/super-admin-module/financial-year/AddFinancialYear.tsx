import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createData, fetchFinancialYears } from "@/api/super-admin-api/financialYearApi";
import { toast } from "react-toastify";

interface AddFinancialYearProps {
  onClose: () => void;
  onReload: () => void;
}

const AddFinancialYear: React.FC<AddFinancialYearProps> = ({ onClose, onReload }) => {
  const [startMonth, setStartMonth] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [groupData, setGroupData] = useState<any>({
    startMonth: "",
    endMonth: "",
  });
  // Array of months for easier handling
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

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    setStartMonth(selectedMonth);

    // Find the index of the selected month
    const monthIndex = months.indexOf(selectedMonth);
    // Set endMonth to the next month (next financial year)
    if (monthIndex >= 0) {
      const nextMonthIndex = (monthIndex + 11) % months.length; // Wrap around to January if December is selected
      setEndMonth(months[nextMonthIndex]);
    } else {
      setEndMonth(""); // Reset if no valid month is selected
    }
  };
  useEffect(() => {
    // Update groupData whenever startMonth or endMonth changes
    setGroupData({
      startMonth,
      endMonth,
    });
  }, [startMonth, endMonth]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // const groupData: any = {
    //   startMonth,
    //   endMonth,

    // };

    try {
      const response = await createData(groupData);
      if (response.success) {
        toast.success(`${response.message}` || "Financial Year created successfully!");
        setGroupData({
          startMonth,
          endMonth,
        });
      } else {
        toast.error(`${response.message}` || "Financial Year created successfully!");
      }
      // console.log("Financial Year created:", response);
      // toast.success(`${response.message}` ||"Financial Year created successfully!");
      onReload();
      onClose();
    } catch (error: any) {
      // console.error("Error creating financial year:", error);
      // Check for duplicate entry error
      // if (error.response && error.response.data && error.response.data.message === "Duplicate entry") {
      //   toast.error("Financial Year already exists. Please enter a unique year.");
      // } else {

      // }
      toast.error(error.message || "Failed to create financial year. Please try again.");
      setError(error.message || "Failed to create financial year. Please try again.");
    }
  };


  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Financial Year</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Starting Month
          </label>
          <select
            value={startMonth}
            onChange={handleStartMonthChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Month
            </option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
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
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
            Submit
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            <FcCancel size={20} className="mr-2" />
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinancialYear;
