import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  updateDataById,
  fetchDateFormatById,
  DateFormatData,
} from "@/api/super-admin-api/dateFormatApi";
import { toast } from "react-toastify";

interface EditFinancialYearProps {
  onClose: () => void;
  yearId: string;
  onReload: () => void;
}

const EditDateFormat: React.FC<EditFinancialYearProps> = ({
  onClose,
  yearId,
  onReload,
}) => {
  const [name, setName] = useState<string>("");
  const [dateFormat, setDate] = useState<string>("");
  const [error, setError] = useState<string>("");
console.log("dateFormat",dateFormat)
  useEffect(() => {
    const loadFinancialYear = async () => {
      try {
        const response = await fetchDateFormatById(yearId);
        setName(response.dateFormat.name);
        setDate(response.dateFormat.dateFormat);
      } catch (error) {
        console.error("Error loading  Date format data:", error);
        setError("Failed to load Date format data.");
      }
    };
    loadFinancialYear();
  }, [yearId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
  
    const updatedData: any = { name, dateFormat };
  
    try {
      const response = await updateDataById(yearId, updatedData);
      console.log("Date format updated successfully!", response);
  
      if (response.success) {
        toast.success(response.message || "Date format updated successfully!");
      } else {
        toast.error(response.message || "Failed to update Date format. Please try again.");
      }
  
      // Ensure onReload is invoked properly
      onReload(); // Properly invoke the function with parentheses
      onClose();  // Close the modal or form
  
    } catch (error: any) {
      console.error(error.message ||"Error updating Date format:", error);
      toast.error(error.message || "Failed to update Date format. Please try again.");
      setError(
        error.message || "Failed to update Date format. Please try again."
      );
    }
  };
  

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Date Format</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="text"
            value={dateFormat}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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

export default EditDateFormat;
