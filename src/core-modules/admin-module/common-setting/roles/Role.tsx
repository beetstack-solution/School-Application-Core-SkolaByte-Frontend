import { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import SearchBar from "@/components/SearchBar";
import { TbArrowBackUp } from "react-icons/tb";
import { RiPlayListAddFill } from "react-icons/ri";
import Breadcrumb from "@/components/Breadcumb";
import { Link } from "react-router-dom";
import {
  fetchRoles,
  deleteRole,
  Roles,
  updateRoleStatus,
} from "@/api/admin-api/common-setting-api/roleApi";
import { formatDate } from "@/helpers/helper";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@/components/Pagination";
import AddRole from "./AddRole";
import EditRole from "./EditRole";

function Role() {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Roles[]>([]); // For search and pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Number of items per page
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
   const [totalItems, setTotalItems] = useState(0);
  
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (taxId: any) => {
    setSelectedId(taxId);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  // Function to fetch all roles
  const getRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data.roles);
      setFilteredRoles(data.roles); // Initialize filteredRoles with all roles
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = roles.filter(
        (module) =>
          module.name.toLowerCase().includes(query.toLowerCase()) ||
          module.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles); // Reset to original roles if the search query is empty
    }
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  // Handle sorting
  const changeSort = (column: keyof Roles) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredRoles].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredRoles(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleReload = () => {
    getRoles(); // Function to fetch the updated data
  };
  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    try {
      const updatedModule = await updateRoleStatus(_id, newStatus);

      // Log the full updatedModule response for debugging
      console.log("Updated Role:", updatedModule);

      // Check if updatedModule has the expected structure
      if (updatedModule.success) {
        toast.success(
          `${updatedModule.message || "Role status updated successfully."}`
        );
        getRoles(); // Refresh the currencies list
      } else {
        console.error(
          "Updated Role is undefined or missing expected properties",
          updatedModule
        );
        toast.error(
          "Failed to update roles status due to unexpected response."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      setError(error.message);
      toast.error(error.message || "Failed to update roles status.");
    }
  };

  console.log(roles);
  console.log(filteredRoles);

  const handleDelete = async (moduleId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this roles?"
    );

    if (!confirmDelete) {
      return; // Exit the function if the user cancels
    }

    try {
      const response = await deleteRole(moduleId);
      console.log("Delete response:", response);

      if (response.success) {
        // Assuming the delete operation returns a 204 No Content status

        toast.success(response.message || "roles deleted successfully!");
        getRoles();
      } else {
        toast.error(
          response.message || "Failed to delete roles. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting roles:", error);
      toast.error(
        error.message ||
        "An error occurred while deleting the roles. Please try again."
      );
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Role", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Role</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="md:mr-auto">
          <button className="add-btn" onClick={handleShow}>
            <RiPlayListAddFill className="mr-2" />
            Add
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full data_table">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th
                onClick={() => changeSort("_id")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Sl No.
                  {sortState.column === "_id" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th>Actions</th>
              <th
                onClick={() => changeSort("status")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("code")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Code
                  {sortState.column === "code" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("name")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Role
                  {sortState.column === "name" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Created At
                  {sortState.column === "createdAt" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {currentItems.map((module, index) => (
              <tr className="border" key={module._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/roles/view/${module._id}`}>
                    <GrOverview size={25} title="View" className="view-icon" />
                  </Link>
                  <CiEdit
                    size={28}
                    title="Edit"
                    className="edit-icon"
                    onClick={() => handleEditShow(module._id)}
                  />
                  <MdDeleteOutline
                    size={28}
                    title="Delete"
                    className="delete-icon"
                    onClick={() => handleDelete(module._id)}
                  />
                </td>
                <td>
                  <button
                    className={`rounded-full border-2 ${module.status
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
                <td>{module.code}</td>
                <td>{module.name}</td>
                <td>{formatDate(module.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Total Count and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total: {filteredRoles.length}</span>
          &nbsp;|&nbsp;
          <span>Page Count: {rowsPerPage}</span>
        </div>
        <div className="pagination flex items-center gap-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* Render the Add Module component */}
            <AddRole onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {/* Edit Tax Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditRole
              onEditClose={handleCloseEdit}
              roleId={selectedId}
              onReload={handleReload}
            />
            {/* Pass correct props */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;
