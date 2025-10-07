import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { fetchData, PermissionModuleData } from "@/api/super-admin-api/authority-setting-api/PermissionModuleApi";
import { createData } from "@/api/super-admin-api/authority-setting-api/ModuleActionsApi";
import { toast } from "react-toastify";

interface AddPermissionModulesProps {
  onClose: () => void;
  onReload: () => void;
}

const PermissionModuleActions = {
  List: "List",
  Add: "Add",
  Edit: "Edit",
  Delete: "Delete",
  Approve: "Approve",
  Reject: "Reject",
  Export: "Export",
};

const AddModuleActions: React.FC<AddPermissionModulesProps> = ({
  onClose,
  onReload,
}) => {
  const [moduleTypeData, setModuleTypeData] = useState<PermissionModuleData[]>([]);
  const [selectedModuleType, setSelectedModuleType] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [payload, setPayload] = useState<any>({
    name: "",
    moduleRef: "",
  });

  const fetchModuleType = async () => {
    try {
      const response = await fetchData();
      setModuleTypeData(response.dataList || []); // Ensure moduleTypeData is an array
    } catch (error) {
      console.error("Error fetching Module type data:", error);
    }
  };

  useEffect(() => {
    fetchModuleType();
  }, []);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPayload((prevPayload: any) => ({
      ...prevPayload,
      name: type,
    }));
  };

  const handleModuleChange = (module: string) => {
    setSelectedModuleType(module);
    setPayload((prevPayload: any) => ({
      ...prevPayload,
      moduleRef: module,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors

    try {
      // Call API to create the module
      const response = await createData(payload);

      // Handle API response
      if (response.success) {
        toast.success(response.message || "Module action created successfully!");
        onReload(); // Reload the parent list
        onClose(); // Close the modal
      } else {
        toast.error(response.message || "Failed to create Module action.");
        setError(response.error || "An unexpected error occurred.");
      }
    } catch (error: any) {
      // Handle unexpected errors
      console.error("Error creating Module action:", error);
      toast.error(error.message || "An error occurred while creating the Module Type.");
      setError(error.message || "An error occurred while creating the Module Type.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Module Type</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onClose}
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>} {/* Error message */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            {Object.entries(PermissionModuleActions).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Module
          </label>
          <select
            value={selectedModuleType}
            onChange={(e) => handleModuleChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Module
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

export default AddModuleActions;
