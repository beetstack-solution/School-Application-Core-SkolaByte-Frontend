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
// import AddModule from "./AddModule";
import {
  fetchData,
  ModuleTypeItem,
  //   deleteData,
  //   updateCurrencyFormatStatus,
} from "@/api/super-admin-api/authority-setting-api/ModuleTypeApi";
import { formatDate } from "@/helpers/helper";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
// import AddcurrencyFormat from "./AddCurrencyFormat";
// import EditCurrencyFormat from "./EditCurrencyFormat";
import Pagination from "@/components/Pagination";
// import AddModuleType from "./AddModuleType";
// import EditModuleType from "./EditModuleType";

function ViewPermissionModules() {
  const [subGroup, setSubGroup] = useState<ModuleTypeItem[]>([]);
  const [filteredSubGroup, setFilteredSubGroup] = useState<ModuleTypeItem[]>(
    []
  ); // For search and pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Number of items per page
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

  // Function to fetch all subGroup
  const getCurrencyFormts = async () => {
    try {
      const data = await fetchData();
      setSubGroup(data.dataList);
      setFilteredSubGroup(data.dataList); // Initialize filteredSubGroup with all subGroup
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrencyFormts();
  }, []);

  const handleReload = () => {
    getCurrencyFormts(); // Function to fetch the updated data
  };

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = subGroup.filter(
        (module) =>
          module.name.toLowerCase().includes(query.toLowerCase()) ||
          module.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSubGroup(filtered);
    } else {
      setFilteredSubGroup(subGroup); // Reset to original subGroup if the search query is empty
    }
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  // Handle sorting
  const changeSort = (column: keyof ModuleTypeItem) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredSubGroup].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredSubGroup(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSubGroup.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubGroup.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //   const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
  //     const newStatus = !currentStatus;

  //     // Show confirmation dialog
  //     const confirmUpdate = window.confirm(
  //       `Are you sure you want to change the status to ${
  //         newStatus ? "Active" : "Inactive"
  //       }?`
  //     );

  //     if (!confirmUpdate) {
  //       return; // Exit the function if the user cancels
  //     }

  //     try {
  //       const responseData = await updateCurrencyFormatStatus(_id, newStatus);

  //       // Log the full updatedTax response for debugging
  //       console.log("Updated Tax:", responseData);

  //       // Check if updatedTax has the expected structure
  //       if (responseData && responseData.data) {
  //         // Update both subGroup and filteredSubGroup states with the new data
  //         // setSubGroup((prevModules) =>
  //         //   prevModules.map((module) =>
  //         //     module._id === updatedTax._id ? updatedTax : module
  //         //   )
  //         // );

  //         // setFilteredSubGroup((prevFilteredModules) =>
  //         //   prevFilteredModules.map((module) =>
  //         //     module._id === updatedTax._id ? updatedTax : module
  //         //   )
  //         // );

  //         toast.success( responseData.message ||
  //           `Sub Group status updated to ${newStatus ? "Active" : "Inactive"}.`
  //         );
  //         getCurrencyFormts();
  //       } else {
  //         console.error(
  //           "Updated Sub Group is undefined or missing _id",
  //           responseData
  //         );
  //         toast.error(responseData.message ||
  //           "Failed to update Sub Group status due to missing Sub Group data."
  //         );
  //       }
  //     } catch (error: any) {
  //       console.error("Error in handleStatusUpdate:", error); // Log error details
  //       setError(error.message);
  //       toast.error(error.message || "Failed to update Sub Group status.");
  //     }
  //   };

  console.log(subGroup);
  console.log(filteredSubGroup);

  //   const handleDelete = async (moduleId: string) => {
  //     // Show confirmation dialog
  //     const confirmDelete = window.confirm(
  //       "Are you sure you want to delete this Sub Group?"
  //     );

  //     if (!confirmDelete) {
  //       return; // Exit the function if the user cancels
  //     }

  //     try {
  //       const response = await deleteData(moduleId);
  //       console.log("Delete response:", response);

  //       if (response.success === true) {
  //         // Assuming the delete operation returns a 204 No Content status
  //         // setSubGroup((prevModules) =>
  //         //   prevModules.filter((module) => module._id !== moduleId)
  //         // );
  //         // setFilteredSubGroup((prevFilteredModules) =>
  //         //   prevFilteredModules.filter((module) => module._id !== moduleId)
  //         // );
  //         toast.success( response.message ||"Sub Group deleted successfully!");
  //         getCurrencyFormts();
  //       } else {
  //         toast.error( response.message ||"Failed to delete Sub Group. Please try again.");
  //       }
  //     } catch (error: any) {
  //       console.error("Error deleting Sub Group:", error);
  //       toast.error( error.message ||
  //         "An error occurred while deleting the Sub Group. Please try again."
  //       );
  //     }
  //   };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Module Type", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>permission Module Type</h3>
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
              {/* <th
                onClick={() => changeSort("status")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th> */}
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
              {/* <th
                onClick={() => changeSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Created At
                  {sortState.column === "createdAt" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th> */}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((module, index) => (
              <tr className="border" key={module._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/permission-modules/view/${module._id}`}>
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
                  /> */}
                </td>
                {/* <td>
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
                </td> */}
                <td>{module.code}</td>
                <td>{module.name}</td>
                {/* <td>{formatDate(module.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Total Count and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredSubGroup.length}</span>
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
            {/* <AddModuleType onClose={handleClose}   onReload={handleReload}/> */}
          </div>
        </div>
      )}
      {/* Edit Tax Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* <EditModuleType formatId={selectedId} onClose={handleCloseEdit}  onReload={handleReload}/>{" "} */}
            {/* Pass correct props */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPermissionModules;
