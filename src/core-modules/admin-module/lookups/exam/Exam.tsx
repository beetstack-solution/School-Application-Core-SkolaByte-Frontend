import { useEffect, useState } from "react";
import { RiPlayListAddFill } from "react-icons/ri";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchExams,
  ExamData,
  deleteExam,
  updateExamStatus,
} from "@/api/admin-api/lookups-api/examApi";
import { toast } from "react-toastify";
import ExportExcelButton from "@/components/ExcelExportButton";
import * as XLSX from 'xlsx';
import FilterationTab from "@/components/FilterationTab";
import FilterButton from "@/components/FilterButton";


function Exam() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamData[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
 const [filters, setFilters] = useState({
    academicYear: '',
    class: '',
    division: '',
    startDate: '',
    endDate: '',
  });
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [sortState, setSortState] = useState({
    column: "name",
    order: "ascending",
  });

  const getAllExams = async (page: number = 1) => {
    try {
      setLoading(true);
       setError(null);
      const response: any = await fetchExams(page, itemsPerPage, filters.academicYear,
        filters.class,
        filters.division,
        undefined, // examTypeId not used here
        filters.startDate,
        filters.endDate);
      setExams(response.data.data);
      setTotalItems(response.data.total);
      setFilteredExams(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      setError(error.response?.data?.message || "Failed to fetch data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllExams(currentPage);
  }, [currentPage, filters]);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = exams.filter(
        (exam) =>
          exam.name.toLowerCase().includes(query.toLowerCase()) ||
          exam.subject?.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
    setCurrentPage(1);
  };

  const handleReload = () => {
    getAllExams(currentPage);
  };

  // Handle sorting
  const changeSort = (column: keyof ExamData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredExams].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredExams(sortedData);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleApplyFilters = (newFilters: {
    academicYear?: string;
    class?: string;
    division?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setFilters({
      academicYear: newFilters.academicYear || '',
      class: newFilters.class || '',
      division: newFilters.division || '',
      startDate: newFilters.startDate || '',
      endDate: newFilters.endDate || '',
    });
    setCurrentPage(1);
  };

    const handleClearFilters = () => {
    setFilters({
      academicYear: '',
      class: '',
      division: '',
      startDate: '',
      endDate: '',
    });
      setCurrentPage(1);
  setError(null);
  };
  // Handle status update
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
      const responseData = await updateExamStatus(_id, newStatus);
      console.log("Status Update Response:", responseData);
      if (responseData?.success) {
        toast.success(
          responseData.message ||
          `Exam status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        getAllExams(currentPage);
      } else {
        toast.error(responseData.message || "Failed to update exam status.");
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      setError(error.message);
      toast.error(error.message || "Failed to update exam status.");
    }
  };

  const handleDelete = async (examId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteExam(examId);
      if (response.success === true) {
        toast.success(response.message || "Exam deleted successfully!");
        getAllExams(currentPage); // Reload exams after deletion
      } else {
        toast.error(
          response.message || "Failed to delete exam. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting exam:", error);
      toast.error(
        "An error occurred while deleting the exam. Please try again."
      );
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Exams", path: "" },
  ];
  const exportToExcel = async () => {
    const response = await fetchExams(0, Number.MAX_SAFE_INTEGER);
    const data = response.data?.data || [];
    if (data.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    const dataToExport: any = [];
    let slNo = 1;
    data.forEach((exam: ExamData) => {
      const examData = {
        "Sl No.": slNo++,
        "Exam Name": exam.name,
        "Academic Year": exam.academicYear?.academicYear || "N/A",
        "Class": exam.class?.name || "N/A",
        "Date": exam.subjects[0]?.date ? new Date(exam.subjects[0]?.date).toLocaleDateString("en-US") : "N/A",
        "Duration": exam.subjects[0]?.duration || "N/A",
        "Total Marks": exam.totalMarks || 0,
        "Status": exam.status ? "Active" : "Inactive",
        "Created At": exam.createdAt ? new Date(exam.createdAt).toLocaleString("en-US") : "N/A"
      };
      dataToExport.push(examData);
    });
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exams");
    XLSX.writeFile(wb, `exams_${new Date().toISOString()}.xlsx`);
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <ExportExcelButton
          onExport={exportToExcel}
          isLoading={isLoading}
        />
        <FilterButton
          onClick={() => setShowFilters(prev => !prev)}
          onHover={(isHovering) => {
            // Only open on hover for desktop devices
            // if (window.innerWidth > 768) {
            //   setShowFilters(isHovering);
            // }
          }}
        />

        <FilterationTab
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          initialFilters={filters}
          showDivisionFilter={true}
          showDateFilters={true}
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Exam List</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <button
            onClick={() => navigate("/lookups/exams/add")}

            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
          >
            <RiPlayListAddFill className="text-lg" />
            Add Exam
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
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    Sl No.
                    {sortState.column === "slno" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th
                  onClick={() => changeSort("status")}
                  style={{ cursor: "pointer" }}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    Status
                    {sortState.column === "status" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={12} className="px-4 py-4 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam, index) => (
                  <tr key={exam._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/lookups/exams/view/${exam._id}`)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <GrOverview size={20} title="View" />
                        </button>
                        <Link
                          to={`/lookups/exams/edit/${exam._id}`}
                          className="text-gray-500 hover:text-green-600 transition-colors"
                        >
                          <CiEdit size={22} title="Edit" />
                        </Link>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusUpdate(exam._id, exam.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${exam.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {exam.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {exam.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {exam.academicYear?.academicYear}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {exam.class?.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(exam.subjects[0]?.date).toLocaleDateString("en-US")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {exam.subjects[0]?.duration}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {exam.totalMarks}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {exam?.createdAt
                        ? new Date(exam.createdAt).toLocaleString("en-US", {
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
          Showing {filteredExams.length} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Exam;
