import { RiPlayListAddFill } from "react-icons/ri";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";
import {
  deleteAttendanceStatus,
  updateAttendanceStatusStatus,
  fetchAttendanceStatuses,
  AttendanceStatusData,
} from "@/api/admin-api/lookups-api/attendanceStatusApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddAttendanceStatusModal from "./AddAttendanceStatus";
import EditAttendanceStatusModal from "./EditAttendanceStatus";
import { formatDate } from "@/helpers/helper";

function AttendanceStatus() {
  const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceStatusData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendanceStatusId, setSelectedAttendanceStatusId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 25;
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Attendance Status", path: "" },
  ];

  const fetchData = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const { attendanceStatuses, total } = await fetchAttendanceStatuses(skip, itemsPerPage);
      setAttendanceStatuses(attendanceStatuses);
      setTotalItems(total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = attendanceStatuses.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setAttendanceStatuses(filtered);
    } else {
      setAttendanceStatuses(attendanceStatuses);
    }
    setCurrentPage(1);
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
      return;
    }

    try {
      const responseData = await updateAttendanceStatusStatus(_id, newStatus);
      console.log("Updated attendance status:", responseData);

      if (responseData?.success) {
        toast.success(
          responseData.message ||
            `Attendance status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        fetchData();
      } else {
        console.error(
          "Updated attendance status is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
            "Failed to update attendance status due to missing data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update attendance status.");
    }
  };

  // Delete function
  const handleDelete = async (attendanceStatusId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Attendance Status?"
    );

    if (!confirmDelete) {
      return; // Exit the function if user cancels
    }

    try {
      const response = await deleteAttendanceStatus(attendanceStatusId);
      console.log("Delete response:", response);

      if (response.success === true) {
        toast.success(response.message || "Attendance Status deleted successfully!");
        fetchData();
      } else {
        toast.error(
          response.message || "Failed to delete Attendance Status. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting Attendance Status:", error);
      toast.error(
        "An error occurred while deleting the Attendance Status. Please try again."
      );
    }
  };

  const handleEditClick = (attendanceStatusId: string) => {
    setSelectedAttendanceStatusId(attendanceStatusId);
    setShowEditModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Attendance Status</h2>
        <div className="mt-1">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
  
      <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
        <button 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
          onClick={() => setShowAddModal(true)}
        >
          <RiPlayListAddFill className="text-lg" />
          Add
        </button>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  
    {/* Table Section */}
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
    //  style={{ minHeight: '400px' }}
     >
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div className="flex items-center">
                  Sl No. <AiFillCaretUp />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div className="flex items-center">
                  Status <AiFillCaretUp />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div className="flex items-center">
                  Code <AiFillCaretUp />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div className="flex items-center">
                  Name <AiFillCaretUp />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div className="flex items-center">
                  Created At <AiFillCaretUp />
                </div>
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceStatuses.map((status, index) => (
              <tr key={status._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/lookups/attendance-status/view/${status._id}`}>
                      <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleEditClick(status._id)}
                      className="text-gray-500 hover:text-green-600"
                    >
                      <CiEdit size={22} title="Edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(status._id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <MdDeleteOutline size={18} title="Delete" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      status.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => handleStatusUpdate(status._id, status.status || false)}
                  >
                    {status.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{status.code}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{status.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(status.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    {/* Footer Section */}
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
      <div className="text-sm text-gray-600">
        Showing {attendanceStatuses.length} of {totalItems} entries
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  
    {/* Modals */}
    {showAddModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <AddAttendanceStatusModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchData}
          />
        </div>
      </div>
    )}
  
    {showEditModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <EditAttendanceStatusModal
            attendanceStatusId={selectedAttendanceStatusId}
            onClose={() => {
              setShowEditModal(false);
              setSelectedAttendanceStatusId(null);
            }}
            onSuccess={fetchData}
          />
        </div>
      </div>
    )}
  </div>
  );
}

export default AttendanceStatus;