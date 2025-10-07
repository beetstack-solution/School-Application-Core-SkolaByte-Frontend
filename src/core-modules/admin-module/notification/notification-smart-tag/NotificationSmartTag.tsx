import { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { RiPlayListAddFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

// import AddNotificationSmartTags from "./AddNotificationSmartTags";
// import EditNotificationSmartTag from "./EditNotificationSmartTag";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { formatDate } from '@/helpers/helper';
import { deleteNotificationSmartTag, fetchAllNotificationSmartTags, Notification, updateSmartTagStatusById } from "@/api/super-admin-api/notifications/notificationSmartTagsApi";
import AddNotificationSmartTags from "./AddNotificationSmartTags";
import EditNotificationSmartTag from "./EditNotificationSmartTag";


function NotificationSmartTag() {
    const [functionality, setFunctionality] = useState<Notification[]>([]);
    const [filteredModule, setFilteredModule] = useState<Notification[]>([]); // For search and pagination
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
            const data = await fetchAllNotificationSmartTags();
            const notifications: any = data.notifications || []; // Ensure it's an array
            setFunctionality(notifications);
            setFilteredModule(notifications);
        } catch (error: any) { }
    };

    useEffect(() => {
        getAllFunctionality();
    }, []);

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
    const changeSort = (column: keyof Notification) => {
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
            `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"
            }?`
        );

        if (!confirmUpdate) {
            return; // Exit the function if the user cancels
        }

        try {
            const responseData = await updateSmartTagStatusById(_id, newStatus);

            // Check if responseData has the expected structure
            if (responseData.success) {
                toast.success(responseData.message);
                getAllFunctionality();
            } else {
                console.error(
                    "Updated Notification smart tags is undefined or missing _id",
                    responseData
                );
                toast.error(
                    responseData.message ||
                    "Failed to update smart tags status due to missing Notification smart tags data."
                );
            }
        } catch (error: any) {
            console.error("Error in handleStatusUpdate:", error); // Log error details
            toast.error(error.message || "Failed to update smart tags status.");
        }
    };

    const handleDelete = async (dealId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Notification smart tags?"
        );

        if (confirmDelete) {
            try {
                const response = await deleteNotificationSmartTag(dealId);
                if (response.success) {
                    const updatedModule = filteredModule.filter(
                        (format) => format._id !== dealId
                    );

                    if (updatedModule.length <= (currentPage - 1) * itemsPerPage) {
                        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
                    }

                    setFilteredModule(updatedModule);

                    toast.success(
                        response.message || "Notification smart tags deleted successfully!"
                    );
                    getAllFunctionality();
                } else {
                    toast.error(
                        response.message ||
                        "Failed to delete Notification smart tags. Please try again."
                    );
                }
            } catch (error: any) {
                console.error("Error deleting Notification smart tags:", error);
                toast.error(
                    "An error occurred while deleting the Notification smart tags. Please try again."
                );
            }
        }
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Smart Tags", path: "" },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Smart Tag</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
      <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          
              <button  onClick={handleShow} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                <RiPlayListAddFill className="text-lg" />
                Add Student
              </button>
         

            {/* <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
        <FaFileImport  className="text-lg" />
       Bulk
      </button> */}
            <SearchBar onSearch={handleSearch} />
          </div>
             
      </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                           <tr>
  {[
    { name: "Sl No.", width: "w-16", sortKey: "_id" },
    { name: "Actions" },
    { name: "Status", sortKey: "status" },
    { name: "Code", sortKey: "code" },
    { name: "Name", sortKey: "name" },
    { name: "Created At", sortKey: "createdAt" }
  ].map((header) => (
    <th
      key={header.name}
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ""}`}
    //   onClick={() => header.sortKey && changeSort(header.sortKey)}
      style={{ cursor: header.sortKey ? "pointer" : "default" }}
    >
      <div className="flex items-center gap-1">
        {header.name}
        {header.sortKey && sortState.column === header.sortKey && sortState.order === "ascending" && (
          <AiFillCaretUp className="text-gray-400 text-xs" />
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
                                        <Link to={`/notifications/notification-smart-tags/view/${module._id}`}>
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
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${module.status
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
                                      <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{module.code}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{module.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{formatDate(module.createdAt)}</td>
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
                            <AddNotificationSmartTags tableData={getAllFunctionality} onClose={handleClose} />
                        </div>
                    </div>
                )}
                {/* Edit Tax Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <EditNotificationSmartTag
                                functionalityId={selectedId}
                                onClose={handleCloseEdit}
                                tableData={getAllFunctionality}
                            />{" "}
                        </div>
                    </div>
                )}
            </div>
            );
}

            export default NotificationSmartTag;
