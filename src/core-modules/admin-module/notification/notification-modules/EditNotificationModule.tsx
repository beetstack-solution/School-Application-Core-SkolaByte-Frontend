import { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";


import { toast } from "react-toastify";
import { fetchModuleById, updateModuleById ,Module} from "@/api/super-admin-api/notifications/notificationModuleApi";

interface EditModelProps {
  moduleId: string;
  onClose: () => void;
  moduletabledata:()=>void;
}

const EditNotificationModule: React.FC<EditModelProps> = ({
  moduleId,
  onClose,
  moduletabledata
}) => {
  const [error, setError] = useState<string | null>(null);
  const [module, setModule] = useState<Module | null>(
    null
  );

  const getTaxById = async (moduleId: string) => {
    try {
      const responseData = await fetchModuleById(moduleId);
      if (responseData.success) {
        setModule(responseData.module); // Use singular 'module'
      } else {
        setError("Module not found.");
      }
     
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError("Error fetching module");
    } 
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!module?.name) {
      setError("Please fill out the tax name.");
      return;
    }

    try {
      const updatedModuleData: any = {
        name: module.name,
      };

      await updateModuleById(moduleId, updatedModuleData); // Pass the partial data
      toast.success("Module updated successfully!");
      setError(null);
      onClose();
      moduletabledata();
    } catch (error) {
      console.error("Error updating tax:", error);
      setError("Error updating tax. Please try again.");
      toast.error("Error updating module. Please try again.");
    }
  };
  // Fetch tax data when moduleId changes
  useEffect(() => {
    if (moduleId) {
      getTaxById(moduleId);
    }
  }, [moduleId]);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Module</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onClose}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Module Name
          </label>
          <input
            type="text"
            value={module?.name || ""}
            onChange={(e) => {
              if (module) {
                setModule({ ...module, name: e.target.value }); // Update module name
              }
            }}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Module name "
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end space-x-4 items-center">
          <button type="submit" className="submit-btn flex items-center">
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn flex items-center"
          >
            <FcCancel size={20} className="mr-2" />
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotificationModule;
