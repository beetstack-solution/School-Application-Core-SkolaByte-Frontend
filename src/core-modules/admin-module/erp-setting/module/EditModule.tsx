import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  updateModuleById,
  fetchModelById,
  ModuleItems,
} from "@/api/admin-api/erp-setting-api/authortity-setting-api/moduleApi";
import { toast } from "react-toastify";

interface EditFinancialYearProps {
  onClose: () => void;
  yearId: string; // ID of the financial year to be edited
}

const EditModule: React.FC<EditFinancialYearProps> = ({ onClose, yearId }) => {
  const [name, setName] = useState<string>("");
  //   const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadFinancialYear = async () => {
      try {
        const response = await fetchModelById(yearId);
        setName(response.module.name);
        // setDate(response.dateFormat.dateFormat);
      } catch (error) {
        console.error("Error loading  Module data:", error);
        setError("Failed to load Module data.");
      }
    };
    loadFinancialYear();
  }, [yearId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const updatedData = { name };

    try {
      const response = await updateModuleById(yearId, updatedData);
      console.log("Module updated successfully!", response);

      toast.success("Module updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating Module:", error);
      toast.error("Failed to update Module. Please try again.");
      setError("Failed to update Module. Please try again.");
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default EditModule;
