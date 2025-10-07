import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { createData } from "@/api/super-admin-api/currenctDecimalsApi"; // Ensure the import name is correct
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify"; // Add toast for notifications

interface AddCurrencyFormatProps {
  onClose: () => void;
  onReload: () => void;
}

const AddDecimals: React.FC<AddCurrencyFormatProps> = ({ onClose, onReload }) => {
  const [currencyData, setCurrencyData] = useState<any>({
    decimalValue: undefined,
    displayValue: "",
  });
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCurrencyData((prevData: any) => ({
      ...prevData,
      [name]: name === "decimalValue" ? (isNaN(Number(value)) ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous error message

    // Ensure decimalValue and displayValue are defined
    if (currencyData.decimalValue === undefined || currencyData.displayValue.trim() === "") {
      setError("Please provide valid decimal and display values.");
      return;
    }

    try {
      const response = await createData(currencyData); // Send currencyData directly to the API
      if (response.success) {
        toast.success(`${response.message}` || "Currency Decimals created successfully!");
      } else {
        toast.error(response.error || "Failed to create Currency Decimals. Please try again.");
        setError(response.error || "Failed to create Currency Decimals. Please try again.");
      }

      onReload();
      onClose();
    } catch (error: any) {
      console.error("Error submitting currency Decimals:", error);
      setError(error.message || "Failed to create currency Decimals. Please try again.");
      toast.error(error.message || "Failed to create currency Decimals. Please try again."); // Error toast message
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Currency Decimals</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>

      {error && <div className="mb-4 text-red-500">{error}</div>} {/* Error message */}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Decimal Value</label>
          <input
            type="text" // Keep it as text to allow input of decimal numbers
            name="decimalValue"
            value={currencyData.decimalValue !== undefined ? currencyData.decimalValue.toString() : ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter decimal value"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Display Value</label>
          <input
            type="text"
            name="displayValue"
            value={currencyData.displayValue}
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

export default AddDecimals;
