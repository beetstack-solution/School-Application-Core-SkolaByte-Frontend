import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  updateDataById,
  fetchCurrencyFormatById,
} from "@/api/super-admin-api/currenctDecimalsApi";
import { toast } from "react-toastify";

interface EditCurrencyDecimalsProps {
  slabId: string; // Pass the ID of the currency decimal to edit
  onClose: () => void;
  onReload: () => void;
}

const EditCurrencyDecimals: React.FC<EditCurrencyDecimalsProps> = ({ slabId, onClose, onReload }) => {
  const [decimalValue, setDecimalValue] = useState<number | undefined>(undefined);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetchCurrencyFormatById(slabId);
        const { decimalValue, displayValue } = response.currencyDecimal;
        setDecimalValue(decimalValue);
        setDisplayValue(displayValue);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load currency decimal.");
      }
    };

    loadInitialData();
  }, [slabId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "decimalValue") {
      const numberValue = Number(value);
      if (!isNaN(numberValue)) {
        setDecimalValue(numberValue);
      } else {
        setDecimalValue(undefined);
      }
    } else if (name === "displayValue") {
      setDisplayValue(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (decimalValue === undefined || displayValue.trim() === "") {
      setError("Please provide valid decimal and display values.");
      return;
    }

    const updatedData: any = {
      decimalValue,
      displayValue,
      status: true,
      isDeleted: false,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response:any = await updateDataById(slabId, updatedData);
      if(response.success) {
        console.log("Currency decimal updated:", response);
        toast.success(response.message||"Currency decimal updated successfully!");
   
      }else{
        toast.error(response.message||"Failed to update currency decimal. Please try again.");
        setError(response.message||"Failed to update currency decimal. Please try again.");
      }
      onReload();
      onClose();
    } catch (error:any) {
      console.error(error.message ||"Error updating currency decimal:", error);
      setError(error.message ||"Failed to update currency decimal. Please try again.");
      toast.error(error.message ||"Failed to update currency decimal. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Currency Decimals</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Decimal Value
          </label>
          <input
            type="text"
            name="decimalValue"
            value={decimalValue !== undefined ? decimalValue.toString() : ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter decimal value"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Display Value
          </label>
          <input
            type="text"
            name="displayValue"
            value={displayValue}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter display value"
            required
          />
        </div>
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              <FcCancel size={20} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCurrencyDecimals;
