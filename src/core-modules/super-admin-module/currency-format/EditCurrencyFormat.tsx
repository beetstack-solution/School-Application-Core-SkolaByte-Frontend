import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { updateDataById, fetchCurrencyFormatById } from "@/api/super-admin-api/currencyFormatApi";
import { toast } from "react-toastify";

interface EditCurrencyFormatProps {
  onClose: () => void;
  formatId: string;
  onReload: () => void;
}

const EditCurrencyFormat: React.FC<EditCurrencyFormatProps> = ({ onClose, formatId, onReload }) => {
  const [name, setName] = useState<string>("");
  const [formatPattern, setFormatPattern] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadCurrencyFormat = async () => {
      try {
        const response = await fetchCurrencyFormatById(formatId);
        setName(response.currencyFormat.name);
        setFormatPattern(response.currencyFormat.formatPattern);
      } catch (error) {
        console.error("Error loading currency format data:", error);
        setError("Failed to load currency format data.");
      }
    };
    loadCurrencyFormat();
  }, [formatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const updatedData: any = { name, formatPattern };

    try {
      const response:any = await updateDataById(formatId, updatedData);
      if (response.success) {
        toast.success(response.message || "Currency format updated successfully!");
      } else {
        toast.error(response.message || "Failed to update currency format. Please try again.");
        setError(response.message || "Failed to update currency format. Please try again.");
      }

      toast.success("Currency format updated successfully!");
      onReload();
      onClose();
    } catch (error:any) {
      console.error( error.message ||"Error updating currency format:", error);
      toast.error(error.message ||"Failed to update currency format. Please try again.");
      setError( error.message ||"Failed to update currency format. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Edit Currency Format</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Format Pattern</label>
          <input
            type="text"
            value={formatPattern}
            onChange={(e) => setFormatPattern(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-4 items-center">
          <button type="submit" className="submit-btn flex items-center">
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" /> Update
          </button>
          <button type="button" onClick={onClose} className="cancel-btn flex items-center">
            <FcCancel size={20} className="mr-2" /> Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCurrencyFormat;
