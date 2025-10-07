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
  deleteData,
  updateStatusById,
  fetchDivisions,
  DivisionData,
} from "@/api/admin-api/lookups-api/divisionApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddDivisionModal from "./AddDivision";
import EditDivisionModal from "./EditDivision";

function Division() {
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 25;
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Division", path: "" },
  ];

  const fetchData = async () => {
    try {
      const page = currentPage 
      const { divisions, total } = await fetchDivisions(page, itemsPerPage);
      setDivisions(divisions);
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
      const filtered = divisions.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setDivisions(filtered);
    } else {
      setDivisions(divisions);
    }
    setCurrentPage(1);
  };


  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Show confirmation dialog
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      const responseData = await updateStatusById(_id, newStatus);
      console.log("Updated users:", responseData);

      if (responseData?.success) {
        toast.success(
          responseData.message ||
          `Division status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        fetchData();
      } else {
        console.error(
          "Updated Division is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update module status due to missing Division data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update Division status.");
    }
  };

  //   delete function

  const handleDelete = async (moduleId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Division?"
    );

    if (!confirmDelete) {
      return; // Exit the function if the Division cancels
    }

    try {
      const response = await deleteData(moduleId);
      console.log("Delete response:", response);

      if (response.success === true) {
        toast.success(response.message || "Division deleted successfully!");
        fetchData();
      } else {
        toast.error(
          response.message || "Failed to delete Division. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting Division:", error);
      toast.error(
        "An error occurred while deleting the Division. Please try again."
      );
    }
  };

  const handleEditClick = (divisionId: string) => {
    setSelectedDivisionId(divisionId);
    setShowEditModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Division List</h2>
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
            Add Division
          </button>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
      // style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 ">
              <tr>
                {[
                  { name: "Sl No.", width: "w-16" },
                  { name: "Actions" },
                  { name: "Status" },
                  { name: "Code" },
                  { name: "Name" },
                  { name: "Created At" }
                ].map((header) => (
                  <th
                    key={header.name}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {header.name}
                      <AiFillCaretUp className="text-gray-400 text-xs" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : divisions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                    No Divisions found
                  </td>
                </tr>
              ) : (
                divisions.map((division, index) => (
                  <tr key={division._id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/lookups/divisions/view/${division._id}`}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <GrOverview size={20} title="View" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(division._id)}
                          className="text-gray-500 hover:text-green-600 transition-colors"
                        >
                          <CiEdit size={22} title="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(division._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusUpdate(division._id, division.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${division.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {division.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {division.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {division.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {division.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddDivisionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showEditModal && (
        <EditDivisionModal
          divisionId={selectedDivisionId}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDivisionId(null);
          }}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default Division;
