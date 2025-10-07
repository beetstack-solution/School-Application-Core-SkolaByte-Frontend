import { useEffect, useState } from "react";
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
  fetchAcademicYears,
  AcademicYearData,
  deleteAcademicYear,
  updateAcademicYearStatus,
} from "@/api/admin-api/lookups-api/academicYearApi";
import { toast } from "react-toastify";
import AddAcademicYear from "./AddAcademicYear";
import EditAcademicYear from "./EditAcademicYear";

function AcademicYear() {
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
  const [filteredAcademicYears, setFilteredAcademicYears] = useState<
    AcademicYearData[]
  >([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAcademicyearId, setSelectedId] = useState<string>("");
  const [selectedAcademicyearName, setSelectedAcademicyearName] =
    useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleEditShow = (academicYearId: any) => {
    setSelectedId(academicYearId);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => setShowEditModal(false);

  const getAllAcademicYears = async (page: number = 1) => {
  try {
    setLoading(true);
    const response: any = await fetchAcademicYears(page, rowsPerPage); // Pass both page and limit
    console.log(response, "data");

    setAcademicYears(response.data.data);
    setTotalItems(response.data.total); // Assuming the API provides totalItems
    setFilteredAcademicYears(response.data.data);
    setLoading(false);
  } catch (error: any) {
    console.error("Error fetching academic years:", error);
    setError(error.response?.data?.message || "Failed to fetch data.");
    setLoading(false);
  }
};

useEffect(() => {
  getAllAcademicYears(currentPage);
}, [currentPage, rowsPerPage]); 

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = academicYears.filter(
        (module) =>
          module.code.toLowerCase().includes(query.toLowerCase()) ||
          module.academicYear.toLowerCase().includes(query.toLowerCase())
        // getMonthName(module.startMonth).toLowerCase().includes(query.toLowerCase()) ||
        // getMonthName(module.endMonth).toLowerCase().includes(query.toLowerCase())

      );
      setFilteredAcademicYears(filtered);
    } else {
      setFilteredAcademicYears(academicYears);
    }
    setCurrentPage(1);
  };

  const handleReload = () => {
    getAllAcademicYears(currentPage);
  };

  // Handle sorting
  const changeSort = (column: keyof AcademicYearData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredAcademicYears].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredAcademicYears(sortedData);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      const responseData = await updateAcademicYearStatus(_id, newStatus);
      console.log("Updated academicYear:", responseData);

      if (responseData?.success) {
        toast.success(
          responseData.message ||
          `academicYear status updated to ${newStatus ? "Active" : "Inactive"
          }.`
        );
        getAllAcademicYears(currentPage);
      } else {
        console.error(
          "Updated academicYear is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update module status due to missing academicYear data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      setError(error.message);
      toast.error(error.message || "Failed to update academicYear status.");
    }
  };

  const handleDelete = async (moduleId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this academicYear?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteAcademicYear(moduleId);
      console.log("Delete response:", response);
      if (response.success === true) {
        toast.success(response.message || "academicYear deleted successfully!");
        getAllAcademicYears(currentPage); // Reload with current page
      } else {
        toast.error(
          response.message || "Failed to delete academicYear. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting academicYear:", error);
      toast.error(
        "An error occurred while deleting the academicYear. Please try again."
      );
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Academic Year", path: "" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Academic Year List</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
            onClick={handleShow}
          >
            <RiPlayListAddFill className="text-lg" />
            Add Academic Year
          </button>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col" 
      // style={{ minHeight: '400px' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => changeSort("_id")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Sl No.
                    {sortState.column === "slno" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Actions</th>
                <th
                  onClick={() => changeSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Status
                    {sortState.column === "status" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th
                  onClick={() => changeSort("code")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Code
                    {sortState.column === "Name" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th
                  onClick={() => changeSort("academicYear")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Academic Year
                    {sortState.column === "Name" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th
                  onClick={() => changeSort("startMonth")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Start Month
                    {sortState.column === "Name" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th
                  onClick={() => changeSort("endMonth")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    End Month
                    {sortState.column === "Name" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th
                  onClick={() => changeSort("createdAt")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ display: "flex", alignItems: "center" }}>
                    Created At
                    {sortState.column === "Name" &&
                      sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredAcademicYears.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                    No academic years found
                  </td>
                </tr>
              ) : (
                filteredAcademicYears.map((module, index) => (
                  <tr key={module._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/lookups/academic-years/view/${module._id}`}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <GrOverview size={20} title="View" />
                        </Link>
                        <button
                          onClick={() => handleEditShow(module._id)}
                          className="text-gray-500 hover:text-green-600 transition-colors"
                        >
                          <CiEdit size={22} title="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(module._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusUpdate(module._id, module.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${module.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {module.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {module.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {module.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {module.startMonth}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {module.endMonth}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {module?.createdAt
                        ? new Date(module.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                        : "N/A"}
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
          Showing {filteredAcademicYears.length} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <AddAcademicYear onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditAcademicYear
              academicYearId={selectedAcademicyearId}
              Name={selectedAcademicyearName}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicYear;
