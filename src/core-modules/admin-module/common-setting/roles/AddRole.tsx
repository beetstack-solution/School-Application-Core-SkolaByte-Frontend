import React, { useEffect, useState, useRef, useCallback } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createRole, ModuleType, Roles } from "@/api/admin-api/common-setting-api/roleApi";
import { fetchModelType, PermissionModType } from "@/api/super-admin-api/authority-setting-api/permisModuleTypeApi";
import { toast } from "react-toastify";

interface AddRoleProps {
  onClose: () => void;
  onReload: () => void;

}

const AddRole: React.FC<AddRoleProps> = ({ onClose, onReload }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleTypes, setModuleTypes] = useState<PermissionModType[]>([]);
  const [selectedModuleTypes, setSelectedModuleTypes] = useState<string[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modules = await fetchModelType();
        setModuleTypes(modules || []); // Set the fetched module types
        setLoading(false);
      } catch (error) {
        console.error("Error fetching module types:", error);
        setError("Failed to load module types");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log("moduleTypes:",moduleTypes);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create the permittedModuleTypes with full ModuleType objects
    const permittedModuleTypes = selectedModuleTypes
      .map((typeAlias) => {
        const module = moduleTypes.find((mod) => mod.typeAlias === typeAlias);
        return module ? { ...module } : null; // Return the full module object if found
      })
      .filter((mod): mod is ModuleType => mod !== null); // Filter out any null values

    if (permittedModuleTypes.length === 0) {
      setError("Please select at least one module type");
      return;
    }

    const roleData: any = {
      success: true,
      _id: "",
      name: roleName,
      status: true,
      permittedModuleTypes,
      roleAlias: roleName,
      code: selectedModuleTypes.join(", "),
      createdAt: new Date().toISOString(),
      updatedAt: "",
      message: ""
    };

    try {
      const response = await createRole(roleData);
      console.log("Role created successfully:", response);
      onReload();
      onClose();
      toast.success(response.message || "Role created successfully:");

    } catch (error : any) {
      console.error("Error creating role:", error);
      setError("Error creating role");
      toast.error(error.message || "Error creating role");
    }
  };



  // Handle checkbox change for module type selection
  const handleCheckboxChange = (typeAlias: string) => {
    setSelectedModuleTypes((prevSelected) => {
      if (prevSelected.includes(typeAlias)) {
        return prevSelected.filter((item) => item !== typeAlias);
      } else {
        return [...prevSelected, typeAlias];
      }
    });
  };

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

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">{error}</p>
        <button type="button" onClick={onClose} className="cancel-btn mt-2">
          <FcCancel size={20} className="mr-2" />
          Close
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add New Role</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
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
                  ? selectedModuleTypes.map(typeAlias => {
                    const module = moduleTypes.find(mod => mod.typeAlias === typeAlias);
                    return module ? module.name : "";
                  }).join(", ")
                  : "Select module types"}
              </span>
              <IoIosArrowDown />
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {moduleTypes.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModuleTypes.includes(item.typeAlias)}
                      onChange={() => handleCheckboxChange(item.typeAlias)}
                      className="mr-2"
                      required
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
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
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role name"
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

export default AddRole;
