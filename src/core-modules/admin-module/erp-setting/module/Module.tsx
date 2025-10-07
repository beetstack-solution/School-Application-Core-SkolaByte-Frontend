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
import AddModule from "./AddModule";
import {
  fetchModules,
  ModuleItems,
  updateModulesStatusById,
  deleteModule,
  ModuleResponse,
} from "@/api/admin-api/erp-setting-api/authortity-setting-api/moduleApi";
import { formatDate } from "@/helpers/helper";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
// import EditDateFormat from "../dateFormat/EditDateFormat";
import EditModule from "./EditModule";
import Pagination from "@/components/Pagination";

function Module() {
  const [modules, setModules] = useState<ModuleItems[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleItems[]>([]); // For search and pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Number of items per page
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleEditShow = (taxId: any) => {
    setSelectedId(taxId);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Function to fetch all modules
  const getAllModules = async () => {
    try {
      const data = await fetchModules();
      setModules(data.modules);
      setFilteredModules(data.modules); // Initialize filteredModules with all modules
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllModules();
  }, []);

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = modules.filter(
        (module) =>
          module.name.toLowerCase().includes(query.toLowerCase()) ||
          module.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredModules(filtered);
    } else {
      setFilteredModules(modules); // Reset to original modules if the search query is empty
    }
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  // Handle sorting
  const changeSort = (column: keyof ModuleItems) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredModules].sort((a, b) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredModules(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      const response = await updateModulesStatusById(_id, newStatus);

      // Log the full response response for debugging
      console.log("Updated Module:", response);

      // Check if response has the expected structure
      if (response.success) {
        // Extract the updated module from the data property
        // const moduleData = response.data;

        // setModules((prevModules) =>
        //   prevModules.map((module) =>
        //     module._id === moduleData._id ? moduleData : module
        //   )
        // );

        // setFilteredModules((prevFilteredModules) =>
        //   prevFilteredModules.map((module) =>
        //     module._id === moduleData._id ? moduleData : module
        //   )
        // );

        toast.success(
          response.message ||
          `Module status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
      } else {
        console.error("Updated module is undefined or missing _id", response);
        toast.error(
          response.message ||
          "Failed to update module status due to missing module data."
        );
      }
      getAllModules();
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      setError(error.message);
      toast.error(error.message || "Failed to update module status.");
    }
  };

  console.log(modules);
  console.log(filteredModules);

  const handleReload = () => {
    getAllModules();
  };

  const handleDelete = async (moduleId: string) => {
    try {
      const response = await deleteModule(moduleId);
      console.log("Delete response:", response);
      if (response.success == true) {
        // setModules((prevModules) =>
        //   prevModules.filter((module) => module._id !== moduleId)
        // );
        // setFilteredModules((prevFilteredModules) =>
        //   prevFilteredModules.filter((module) => module._id !== moduleId)
        // );
        toast.success(response.message || "Module deleted successfully!");
      } else {
        toast.error(
          response.message || "Failed to delete module. Please try again."
        );
      }
      getAllModules();
    } catch (error: any) {
      console.error("Error deleting Module:", error);
      toast.error(
        "An error occurred while deleting the Module. Please try again."
      );
    }
  };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Module", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Module</h3>
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
                  {sortState.column === "slno" &&
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
                  Name
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
                  <Link to={`/module/view/${module._id}`}>
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
          <span>Total Count: {filteredModules.length}</span>
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
            <AddModule onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditModule yearId={selectedId} onClose={handleCloseEdit} />{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default Module;
