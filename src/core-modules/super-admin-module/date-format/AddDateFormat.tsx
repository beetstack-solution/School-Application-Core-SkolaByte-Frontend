import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createData } from "@/api/super-admin-api/dateFormatApi";
import { toast } from "react-toastify";

interface AddFinancialYearProps {
  onClose: () => void;
  onReload: () => void;

}

const AddDateFormat: React.FC<AddFinancialYearProps> = ({ onClose, onReload }) => {
  const [name, setName] = useState<string>("");
  const [dateFormat, setDateFormat] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDateFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFormat(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const dateFormatData: any = {
      name,
      dateFormat,
      isDefault: false,
      isDeleted: false,
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "", // Replace with actual user ID
      __v: 0,
    };

    try {
      const response = await createData(dateFormatData);
      console.log("Date Format created:", response);

      if (response.success) {
        toast.success(response.message || "Date Format created successfully!");
      } else {
        toast.error(
          response.message || "Failed to create Date Format. Please try again."
        );
      }
      onReload();
      onClose(); // Close the modal or reset the form
    } catch (error: any) {
      console.error("Error creating date format:", error);
      toast.error(error.message || "Failed to create date format. Please try again.");
      setError("Failed to create date format. Please try again.");
    }
  };


  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Date Format</h2>
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
            onChange={handleNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date Format
          </label>
          <input
            type="text"
            value={dateFormat}
            onChange={handleDateFormatChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter date format (e.g., dd/mm/yyyy)"
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

export default AddDateFormat;
