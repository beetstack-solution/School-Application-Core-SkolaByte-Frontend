import { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import Breadcrumb from "@/components/Breadcumb";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import {
  getAllModulePermissionsDataList,
  changeModulePermissionStatus,
  deleteModulePermissionById,
} from "@/api/admin-api/erp-setting-api/authortity-setting-api/permissionApi";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface ModulePermission {
  _id: string;
  code: string;
  role?: { _id: string }; // Updated to match the API response
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  
}

function Permission() {
  const [modulePermissions, setModulePermissions] = useState<
    ModulePermission[]
  >([]);
  const [filteredModulePermissions, setFilteredModulePermissions] = useState<
    ModulePermission[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [moduleType, setModuleType] = useState<string>("module"); // Add module type

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });

  // Determine the title based on the 'moduleType' prop
  const getTitle = (moduleType: string) => {
    switch (moduleType) {
      case "module":
        return "Permissions";
      case "report":
        return "Report Permissions";
      case "dashboard":
        return "Dashboard Permissions";
      default:
        return "Role Permissions";
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (id: string) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  // Fetch module permissions
  const fetchModulePermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await getAllModulePermissionsDataList(
        moduleType
      );
      if (!data.success) {
        if (status === 500) {
          throw new Error("Internal Server Error!");
        } else {
          throw new Error(data.message || "An error occurred!");
        }
      }

      const { dataList } = data;
      if (!dataList) {
        throw new Error("No data found!");
      }

      setModulePermissions(dataList);
      setFilteredModulePermissions(dataList);
    } catch (error) {
      console.error("Error fetching module permissions:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModulePermissions();
  }, [moduleType]);

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = modulePermissions.filter(
        (module) => module.code.toLowerCase().includes(query.toLowerCase()) // Removed reference to module.module.name
      );
      setFilteredModulePermissions(filtered);
    } else {
      setFilteredModulePermissions(modulePermissions);
    }
    setCurrentPage(1);
  };

  // Handle sorting
  const changeSort = (column: keyof ModulePermission) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredModulePermissions].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredModulePermissions(sortedData);
  };

  // Pagination logic
  const totalPages = filteredModulePermissions?.length
    ? Math.ceil(filteredModulePermissions.length / itemsPerPage)
    : 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModulePermissions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${
        newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) return;

    try {
      const response = await changeModulePermissionStatus(id);
      if (response.data.success) {
        toast.success(
          response.data.message || "Module permission status updated."
        );
        fetchModulePermissions();
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module permission?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteModulePermissionById(id);
      if (response.data.success) {
        toast.success(response.data.message || "Deleted successfully.");
        fetchModulePermissions();
      } else {
        toast.error(response.data.message || "Failed to delete.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete.");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Permission", path: "" },
  ];

  return (
    <div className="grid grid-cols-1">
      <div className="page-header">
        <h3>{getTitle(moduleType)}</h3>{" "}
        {/* Use getTitle to dynamically set the title */}
      </div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center px-1">
        <button className="add-btn" onClick={handleShow}>
          <RiPlayListAddFill className="mr-2" />
          Add
        </button>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full data_table">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th>Sl No.</th>
              <th>Actions</th>
              <th onClick={() => changeSort("status")}>
                Status <AiFillCaretUp />
              </th>
              <th onClick={() => changeSort("code")}>
                Code <AiFillCaretUp />
              </th>{" "}
              {/* Removed reference to module */}
              <th onClick={() => changeSort("createdAt")}>
                Created At <AiFillCaretUp />
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((module, index) => (
              <tr key={module._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/view-role/${module._id}`}>
                    <GrOverview size={25} title="View" className="view-icon" />
                  </Link>
                  <CiEdit
                    size={28}
                    title="Edit"
                    className="edit-icon"
                    onClick={() => handleEditShow(module._id)}
                  />
                  {/* <MdDeleteOutline
                    size={28}
                    title="Delete"
                    className="delete-icon"
                    onClick={() => handleDelete(module._id)}
                  />   */}
                </td>
                <td>
                  <button
                    className={`rounded-full border-2 ${
                      module.status
                        ? "active-btn border-green-500 text-green-500"
                        : "inactive-btn border-red-500 text-red-500"
                    } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() =>
                      handleStatusUpdate(module._id, module.status)
                    }
                  >
                    {module.status ? "Active" : "Inactive"}
                  </button>
                </td>
                {/* Removed reference to module.module.name */}
                <td>{module.code}</td>
                <td>{format(new Date(module.createdAt), "yyyy-MM-dd")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Permission;
