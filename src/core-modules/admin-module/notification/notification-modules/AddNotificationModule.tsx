import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createModule } from "@/api/super-admin-api/notifications/notificationModuleApi";

interface AddModuleProps {
  onClose: () => void;
  refreshData: () => void;
}

const AddNotificationModule: React.FC<AddModuleProps> = ({
  onClose,
  refreshData,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [moduleName, setModuleName] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const moduleData: any = {
        name: moduleName,
      };
      const response = await createModule(moduleData);
      if (response.success) {
        toast.success(
          response.message || "Notification module created successfully!"
        );
        onClose();
        refreshData();
      } else {
        toast.error(response.message || "Failed to create notification module!");
      }
    } catch (error: any) {
      console.error(error.message || "Error creating module:", error);
      toast.error(
        error.message ||
          "Failed to create notification module. Please try again."
      );
      setError("Error creating module. Please try again.");
    }
  };

  // Handle error state
  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center">
  //       <p className="text-red-500">{error}</p>
  //       <button type="button" onClick={onClose} className="cancel-btn mt-2">
  //         <FcCancel size={20} className="mr-2" />
  //         Close
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add New Model</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Model Name
          </label>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Model Name"
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

export default AddNotificationModule;
