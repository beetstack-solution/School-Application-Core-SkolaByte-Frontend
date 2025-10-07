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
  fetchusers,
  UserData,
  updateStatusById,
  deleteData,
} from "@/api/admin-api/base-api/userApi";
import { formatDate } from "@/helpers/helper";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "@/components/Pagination";

function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]); // For search and pagination
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

  // Function to fetch all users
  const getAllUsers = async () => {
    try {
      const data = await fetchusers();
      setUsers(data.data);
      setFilteredUsers(data.data); // Initialize filteredUsers with all users
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = users.filter(
        (module) =>
          module.name.toLowerCase().includes(query.toLowerCase()) ||
          module.phone.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to original users if the search query is empty
    }
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  // Handle sorting
  const changeSort = (column: keyof UserData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredUsers].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Show confirmation dialog
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );

    if (!confirmUpdate) {
      return; // Exit the function if the user cancels
    }

    try {
      const responseData = await updateStatusById(_id, newStatus);

      // Log the full responseData response for debugging
      console.log("Updated users:", responseData);

      // Check if responseData has the expected structure
      if (responseData?.success) {
        // Update both users and filteredUsers states with the new data
        // setUsers((prevModules) =>
        //   prevModules.map((module) =>
        //     module.id === responseData.id ? responseData : module
        //   )
        // );

        // setFilteredUsers((prevFilteredModules) =>
        //   prevFilteredModules.map((module) =>
        //     module.id === responseData.id ? responseData : module
        //   )
        // );

        toast.success(
          responseData.message ||
          `User status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        getAllUsers();
      } else {
        console.error("Updated User is undefined or missing _id", responseData);
        toast.error(
          responseData.message ||
          "Failed to update module status due to missing User data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      setError(error.message);
      toast.error(error.message || "Failed to update User status.");
    }
  };

  console.log(users);
  console.log(filteredUsers);

  const handleDelete = async (moduleId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this User?"
    );

    if (!confirmDelete) {
      return; // Exit the function if the user cancels
    }

    try {
      const response = await deleteData(moduleId);
      console.log("Delete response:", response);

      if (response.success === true) {
        // Assuming the delete operation returns a 204 No Content status
        //  setUsers((prevModules) =>
        //    prevModules.filter((module) => module.id !== moduleId)
        //  );
        //  setFilteredUsers((prevFilteredModules) =>
        //    prevFilteredModules.filter((module) => module.id !== moduleId)
        //  );
        toast.success(response.message || "User deleted successfully!");
        getAllUsers();
      } else {
        toast.error(
          response.message || "Failed to delete User. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting User:", error);
      toast.error(
        "An error occurred while deleting the User. Please try again."
      );
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Users", path: "" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Users</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="md:mr-auto">
          <Link to={"/users/add"}>
            <button className="add-btn">
              <RiPlayListAddFill className="mr-2" />
              Add
            </button>
          </Link>
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
                onClick={() => changeSort("id")}
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
                onClick={() => changeSort("GSTNumber")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  GST Number
                  {sortState.column === "GSTNumber" &&
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
                onClick={() => changeSort("phone")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Phone Number
                  {sortState.column === "phone" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((module, index) => (
              <tr className="border" key={module.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/users/view/${module.id}`}>
                    <GrOverview size={25} title="View" className="view-icon" />
                  </Link>
                  <Link to={`/users/edit/${module.id}`}>
                    <CiEdit
                      size={28}
                      title="Edit"
                      className="edit-icon"
                    // onClick={() => handleEditShow(module.id)}
                    />
                  </Link>
                  <MdDeleteOutline
                    size={28}
                    title="Delete"
                    className="delete-icon"
                    onClick={() => handleDelete(module.id)}
                  />
                </td>
                <td>
                  <button
                    className={`rounded-full border-2 ${module.status
                      ? "active-btn border-green-500 text-green-500"
                      : "inactive-btn border-red-500 text-red-500"
                      } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(module.id, module.status)}
                  >
                    {module.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{module.GSTNumber}</td>
                <td>{module.name}</td>
                <td>{module.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Total Count and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredUsers.length}</span>
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
            {/* <AddTax onClose={handleClose} /> */}
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* <EditTax taxId={selectedId} onClose={handleCloseEdit} />{" "} */}
            {/* Pass correct props */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
