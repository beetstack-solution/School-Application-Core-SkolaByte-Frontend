import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { fetchData } from "@/api/super-admin-api/authority-setting-api/ModuleTypeApi";
import { createData } from "@/api/super-admin-api/authority-setting-api/PermissionModuleApi";
import { toast } from "react-toastify";

interface AddPermissionModulesProps {
  onClose: () => void;
  onReload: () => void;
}

interface ModuleType {
  _id: string;
  name: string;
  typeAlias: string;
}

const PermissionModuleTypeValues = {
  Dashboard: "dashboard",
  Report: "report",
  Module: "module",
};

const AddPermissionModules: React.FC<AddPermissionModulesProps> = ({
  onClose,
  onReload,
}) => {
  const [dateFormatData, setDateFormatData] = useState<{ name: string }>({
    name: "",
  });

  const [moduleTypeData, setModuleTypeData] = useState<ModuleType[]>([]);
  const [selectedModuleType, setSelectedModuleType] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFormatData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchModuleType = async () => {
    try {
      const response = await fetchData();
      setModuleTypeData(response.dataList); // Ensure moduleTypeData is an array
    } catch (error) {
      console.error("Error fetching Module type data:", error);
    }
  };

  useEffect(() => {
    fetchModuleType();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors

    // Validate inputs
    if (!dateFormatData.name) {
      setError("Name is required.");
      return;
    }
    if (!selectedType) {
      setError("Type is required.");
      return;
    }
    if (!selectedModuleType) {
      setError("Module Type is required.");
      return;
    }

    // Construct the payload
    const payload: any = {
      name: dateFormatData.name, // Name from the input
      type: selectedType,        // Type selected from the dropdown
      moduleType: selectedModuleType, // Module Type ID from the dropdown
    };

    try {
      // Call API to create the module
      const response = await createData(payload);

      // Handle API response
      if (response.success) {
        toast.success(response.message || "Module Type created successfully!");
        onReload(); // Reload the parent list
        onClose();  // Close the modal
      } else {
        toast.error(response.message || "Failed to create Module Type.");
        setError(response.error || "An unexpected error occurred.");
      }
    } catch (error: any) {
      // Handle unexpected errors
      console.error("Error creating Module Type:", error);
      toast.error(
        error.message || "An error occurred while creating the Module Type."
      );
      setError(
        error.message || "An error occurred while creating the Module Type."
      );
    }
  };


  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Permission Modules</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onClose}
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}{" "}
      {/* Error message */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            {Object.entries(PermissionModuleTypeValues).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Module Type
          </label>
          <select
            value={selectedModuleType}
            onChange={(e) => setSelectedModuleType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Module Type
            </option>
            {moduleTypeData.map((module) => (
              <option key={module._id} value={module.name}>
                {module.name}
              </option>
            ))}
          </select>
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

export default AddPermissionModules;
