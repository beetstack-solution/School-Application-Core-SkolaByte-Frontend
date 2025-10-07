import { useCallback, useEffect, useRef, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  fetchModelType,
  PermissionModType,
} from "@/api/super-admin-api/authority-setting-api/permisModuleTypeApi";
import { fetchRoleById, updateRoleById, Roles } from "@/api/admin-api/common-setting-api/roleApi";
import { toast } from "react-toastify";

interface EditRoleProps {
  roleId: string;
  onEditClose: () => void;
  onReload: () => void
}

const EditRole: React.FC<EditRoleProps> = ({ roleId, onEditClose , onReload }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [moduleTypes, setModuleTypes] = useState<PermissionModType[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModuleTypes, setSelectedModuleTypes] = useState<PermissionModType[]>([]); // Store full objects now
  const [roleName, setRoleName] = useState<string>(""); // Role name state
  const [, setRole] = useState<Roles | null>(null);
  const [, setSuccessMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch role by id
  const getRoleById = async (paramId: string) => {
    try {
      setLoading(true);
      const responseData = await fetchRoleById(paramId);
      if (responseData.success) {
        setRole(responseData.role);
        setRoleName(responseData.role.name); // Set role name state from fetched data
        // Set selected module types based on permittedModuleTypes, storing full objects
        const fetchedModuleTypes = responseData.role.permittedModuleTypes || [];
        setSelectedModuleTypes(fetchedModuleTypes);
      } else {
        setError("Role not found.");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setError("Error fetching role");
    } finally {
      setLoading(false);

    }
  };




  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!roleName || selectedModuleTypes.length === 0) {
      setError("Please enter a role name and select at least one module type.");
      return;
    }
  
    try {
      const updatedRoleData: Partial<Roles> = {
        name: roleName,
        permittedModuleTypes: selectedModuleTypes.map((module) => ({
          _id: module._id,
          code: module.code,       // Include the code
          name: module.name,       // Include the name
          typeAlias: module.typeAlias, // Include the typeAlias
        })),
      };
  
      // Call backend API
      const response = await updateRoleById(roleId, updatedRoleData);
  
      // Handle success response
      if (response?.success) {
        setError(null);
        toast.success(response.message || "Role updated successfully.");
        setSuccessMessage(response.message || "Role updated successfully.");
        onEditClose();
        onReload();
      } else {
        throw new Error(response?.message || "An unknown error occurred.");
        toast.error(response?.message || "Failed to update role. Please try again.");                
      }
    } catch (error: unknown) {
      console.error("Error updating role:", error);
  
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Error updating role. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  
  


  // Fetch module types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const modules = await fetchModelType();
        setModuleTypes(modules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching module types:", error);
        setError("Failed to load module types");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch role data when roleId changes
  useEffect(() => {
    if (roleId) {
      getRoleById(roleId);
    }
  }, [roleId]);

  // Add event listener for outside clicks
  useEffect(() => {
    if (dropdownOpen) {
      window.addEventListener("click", handleOutsideClick);
    } else {
      window.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownOpen]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle outside click to close dropdown
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  }, []);

  // Handle checkbox change for module type selection
  const handleCheckboxChange = (module: PermissionModType) => {
    setSelectedModuleTypes((prevSelected) => {
      if (prevSelected.some((item) => item._id === module._id)) {
        // Remove from selection if already selected
        return prevSelected.filter((item) => item._id !== module._id);
      } else {
        // Add to selection if not selected
        return [...prevSelected, module];
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Role</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onEditClose}
        />
      </div>

      <form onSubmit={handleSubmit}>


        <div className="mb-4" ref={dropdownRef}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Module Types <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
            >
              <span>
                {selectedModuleTypes.length > 0
                  ? selectedModuleTypes
                    .map((module) => module.name)
                    .join(", ") // Join the selected module names with commas
                  : "Select module types"}{" "}
              </span>
              <IoIosArrowDown />
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {moduleTypes.map((item) => {
                  const isChecked = selectedModuleTypes.some(
                    (module) => module._id === item._id
                  );

                  return (
                    <div
                      key={item._id}
                      className="flex items-center p-2 hover:bg-gray-200"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={isChecked} // Set checkbox checked state
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <label>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)} // Update roleName state
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role name"
            required
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
            onClick={onEditClose}
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

export default EditRole;
