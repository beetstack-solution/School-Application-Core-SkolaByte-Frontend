import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createCurrencyFormat } from "@/api/super-admin-api/currencyFormatApi";
import { toast } from "react-toastify";

interface AddFinancialYearProps {
  onClose: () => void;
  onReload: () => void;
}

const AddcurrencyFormat: React.FC<AddFinancialYearProps> = ({ onClose, onReload }) => {
  // Initialize the state object for currency format data
  const [dateFormatData, setDateFormatData] = useState<any>({
    name: "",
    formatPattern: "",
    isDefault: false,
    isDeleted: false,
    status: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "currentUserId",
    __v: 0,
  });

  const [error, setError] = useState<string>("");

  // Handle changes in name and formatPattern
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDateFormatData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous error message

    // Ensure that name and formatPattern are not empty
    if (dateFormatData.name.trim() === "" || dateFormatData.formatPattern.trim() === "") {
      setError("Please provide both name and format pattern.");
      return;
    }

    try {
      const response = await createCurrencyFormat(dateFormatData);
      if (response.success) {
        toast.success(response.message || "Currency Format created successfully!");
      }
      else {
        toast.error(response.error || "Failed to create Currency Format. Please try again.");
        setError(response.error || "Failed to create Currency Format. Please try again.");
      }
      onReload();
      onClose();
    } catch (error: any) {
      console.error("Error creating Currency Format:", error);
      toast.error(error.message || "Failed to create Currency Format. Please try again.");
      setError(error.message || "Failed to create Currency Format. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Currency Format</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>} {/* Error message */}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={dateFormatData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Format Pattern</label>
          <input
            type="text"
            name="formatPattern"
            value={dateFormatData.formatPattern}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter format pattern"
            required
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

export default AddcurrencyFormat;
