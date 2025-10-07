import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createData } from "@/api/admin-api/erp-setting-api/authortity-setting-api/moduleApi";
import { toast } from "react-toastify";

interface AddModuleProps {
  onClose: () => void;
  onReload: () => void;
}

const AddModule: React.FC<AddModuleProps> = ({ onClose, onReload }) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const dateFormatData: any = {
      name,
      isDefault: false,
      isDeleted: false,
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "currentUserId",
      __v: 0,
    };

    try {
      const response = await createData(dateFormatData);
      if (response.success) {
        toast.success(response.message || "Module created successfully!");
      }
      else {
        toast.error(response.error || "Failed to create Module. Please try again.");
        setError(response.error || "Failed to create Module. Please try again.");
      }
      // console.log("Date Format created:", response);
      // toast.success("Date Format created successfully!");
      onReload();
      onClose();
    } catch (error: any) {
      console.error("Error creating date format:", error);
      toast.error(error.message || "Failed to create Module. Please try again.");
      setError(error.message || "Failed to create Module. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Module</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>
      {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
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

export default AddModule;
