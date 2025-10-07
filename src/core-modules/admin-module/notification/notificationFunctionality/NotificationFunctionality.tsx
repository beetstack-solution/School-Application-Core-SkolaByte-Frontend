import { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { RiPlayListAddFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { formatDate } from '@/helpers/helper';
import { deleteNotificationFunctionality, fetchAllNotificationFunctionality, NotificationFunctionalityData, updateFunctionalityStatusById } from "@/api/super-admin-api/notifications/notificationFunctionalityApi";
import AddNotificationFunctionality from "./AddNotificationFunctionality";
import EditNotificationFunctionality from "./EditNotificationFunctionality";

// import AddNotificationFunctionality from "./AddNotificationFunctionality";
// import EditNotificationFunctionality from "./EditNotificationFunctionality";
// import AddNotificationModule from "./AddNotificationModule";
// import EditNotificationModule from "./EditNotificationModule";

function NotificationFunctionality() {
  const [functionality, setFunctionality] = useState<NotificationFunctionalityData[]>([]);
  const [filteredModule, setFilteredModule] = useState<NotificationFunctionalityData[]>(
    []
  ); // For search and pagination
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

  // Function to fetch all stax
  const getAllFunctionality = async () => {
    try {
      const data = await fetchAllNotificationFunctionality();
      const notifications = data.notifications || []; // Ensure it's an array
      setFunctionality(notifications);
      setFilteredModule(notifications); // Initialize filteredModule with all notifications
    } catch (error: any) {}
  };

  useEffect(() => {
    getAllFunctionality();
  }, []);
const handleRefresh = () => {
  getAllFunctionality();
}
  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = functionality.filter(
        (functionality) =>
          functionality.name.toLowerCase().includes(query.toLowerCase()) ||
          functionality.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredModule(filtered);
    } else {
      setFilteredModule(functionality); // Reset to original stax if the search query is empty
    }
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  // Handle sorting
  const changeSort = (column: keyof NotificationFunctionalityData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredModule].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredModule(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredModule.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModule.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Show confirmation dialog
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${
        newStatus ? "Active" : "Inactive"
      }?`
    );

    if (!confirmUpdate) {
      return; // Exit the function if the user cancels
    }

    try {
      const responseData = await updateFunctionalityStatusById(_id, newStatus);

      // Check if responseData has the expected structure
      if (responseData.success) {
        toast.success(responseData.message);
        getAllFunctionality();
      } else {
        console.error(
          "Updated Notification Functionality is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
            "Failed to update module status due to missing Notification Functionality data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update module status.");
    }
  };

  const handleDelete = async (dealId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Notification Functionality?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteNotificationFunctionality(dealId);
        if (response.success) {
          const updatedModule = filteredModule.filter(
            (format) => format._id !== dealId
          );

          if (updatedModule.length <= (currentPage - 1) * itemsPerPage) {
            setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
          }

          setFilteredModule(updatedModule);

          toast.success(
            response.message ||
              "Notification Functionality deleted successfully!"
          );
          getAllFunctionality();
        } else {
          toast.error(
            response.message ||
              "Failed to delete Notification Functionality. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Notification Functionality:", error);
        toast.error(
          "An error occurred while deleting the Notification Functionality. Please try again."
        );
      }
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Functionality", path: "" },
  ];

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">


  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Functionality</h2>
            <div className="mt-1">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>


          <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
         
              <button onClick={handleShow} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                <RiPlayListAddFill className="text-lg" />
                Add 
              </button>
           

            {/* <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
        <FaFileImport  className="text-lg" />
       Bulk
      </button> */}
            <SearchBar onSearch={handleSearch}/>
          </div>
        </div>










     
     
     
       
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto">
                 <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
  {[
    { 
      name: "Sl No.", 
      width: "w-16", 
      sortKey: "_id",
      sortable: true 
    },
    { 
      name: "Actions", 
      sortable: false 
    },
    { 
      name: "Status", 
      sortKey: "status",
      sortable: true 
    },
    { 
      name: "Code", 
      sortKey: "code",
      sortable: true 
    },
    { 
      name: "Name", 
      sortKey: "name",
      sortable: true 
    },
    { 
      name: "Created At", 
      sortKey: "createdAt",
      sortable: true 
    }
  ].map((header) => (
    <th
      key={header.name}
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''}`}
 
      style={{ cursor: header.sortable ? "pointer" : "default" }}
    >
      <div className="flex items-center gap-1">
        {header.name}
        {header.sortable && sortState.column === header.sortKey && (
          <AiFillCaretUp className={`text-gray-400 text-xs ${
            sortState.order === "descending" ? "transform rotate-180" : ""
          }`} />
        )}
      </div>
    </th>
  ))}
</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((module, index) => (
              <tr className="border" key={module._id}>
                <td className="px-4 py-3 text-sm text-gray-500">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                  <Link to={`/notifications/notification-functionality/view/${module._id}`}>
                    <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                  </Link>
                  <CiEdit
                    size={22}
                    title="Edit"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => handleEditShow(module._id)}
                  />
                  <MdDeleteOutline
                    size={20}
                    title="Delete"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => handleDelete(module._id)}
                  />
                  </div>
                </td>
                <td>
                  <button
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      module.status
                          ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                    } `}
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
    </div>
      {/* Total Count and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredModule.length}</span>
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
            <AddNotificationFunctionality
              refreshData={handleRefresh}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
      {/* Edit Tax Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditNotificationFunctionality
              functionalityId={selectedId}
              refreshData={handleRefresh}
              onClose={handleCloseEdit}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationFunctionality;
