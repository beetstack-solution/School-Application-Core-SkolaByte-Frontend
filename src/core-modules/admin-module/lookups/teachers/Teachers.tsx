import { RiPlayListAddFill } from "react-icons/ri";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import { fetchTeachers, Teacher, updateTeacherStatusById, deleteTeacher } from "@/api/admin-api/lookups-api/teachersApi";
import { Link, useNavigate } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { formatDate } from "@/helpers/helper";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import * as XLSX from 'xlsx';
import ExportExcelButton from "@/components/ExcelExportButton";
import FilterButton from "@/components/FilterButton";
import FilterationTab from "@/components/FilterationTab";
import { AcademicYear } from "@/api/common-api/commonDropDownApi";

function Teachers() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    classId: "",
    division: "",
  });

  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Teachers", path: "" },
  ];

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const loadTeachers = async (search = "") => {
    setIsLoading(true);
    try {
      const { teachersList: data, total } = await fetchTeachers(
        currentPage , 
        itemsPerPage,
        search,
        filters.academicYear,
        filters.classId,
        filters.division
      );
      
      setTeachersList(data);
      setTotalItems(total);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch teachers");
      setTeachersList([]);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers(searchTerm);
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  const handleSearch = (query: string) => {
    setSearchTerm(query); 
    setCurrentPage(1);  
    if (query.trim() === "") {
      setTeachersList([]); // Clear the list if search term is empty
    } else {
      loadTeachers(query);
    }  
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters({
      academicYear: newFilters.academicYear,
      classId: newFilters.classId,
      division: newFilters.division,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      academicYear: "",
      classId: "",
      division: "",
    });
    setCurrentPage(1);
  };

  const getTeacherId = (teacher: any): string => {
    return teacher._id || teacher.id || "";
  };

  const handleStatusUpdate = async (teacher: Teacher) => {
    const teacherId = getTeacherId(teacher);
    if (!teacherId) {
      toast.error("Cannot update status: Teacher ID is missing or invalid");
      return;
    }

    const newStatus = !teacher.status;
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"}?`
    );

    if (!confirmUpdate) return;

    try {
      const responseData = await updateTeacherStatusById(teacherId, newStatus);
      if (responseData?.success) {
        setMessage({
          text: `Teacher status updated to ${newStatus ? "Active" : "Inactive"}.`,
          type: "success"
        });
        loadTeachers(searchTerm);
      } else {
        toast.error(responseData?.message || "Failed to update teacher status.");
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update teacher status.");
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    const teacherId = getTeacherId(teacher);
    if (!teacherId) {
      toast.error("Cannot delete: Teacher ID is missing or invalid");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) return;

    try {
      const response = await deleteTeacher(teacherId);
      if (response && response.success === true) {
        setMessage({
          text: "Teacher deleted successfully!",
          type: "success"
        });
        loadTeachers(searchTerm);
      } else {
        toast.error(response?.message || "Failed to delete teacher. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      toast.error(error.message || "An error occurred while deleting the teacher. Please try again.");
    }
  };

  const getAcademicYear = (academicYear: string | AcademicYear): string => {
    if (typeof academicYear === 'string') return academicYear;
    return academicYear?.academicYear || 'N/A';
  };

  const exportToExcel = () => {
    const data = teachersList.map((teacher, index) => ({
      'Sl No.': (currentPage - 1) * itemsPerPage + index + 1,
      'Code': teacher.code,
      'Profile Image': teacher.imageUrl,
      'Name': teacher.name,
      'Email': teacher.email || 'N/A',
      'Contact Number': teacher.contactNumber,
      'Status': teacher.status ? 'Active' : 'Inactive',
      'Academic Year': getAcademicYear(teacher.academicYear),
      'Created At': new Date(teacher.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, `Teachers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          duration={4000}
        />
      )}
      
      <div className="">
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
           showDateFilters={false}
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Teachers List</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <Link to={'add'} className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
              <RiPlayListAddFill className="text-lg" />
              Add Teacher
            </button>
          </Link>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Headers */}
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { name: "Sl No.", width: "w-16" },
                  { name: "Actions" },
                  { name: "Status" },
                  { name: "Academic Year"},
                  { name: "Code" },
                  { name: "Photo"},
                  { name: "Name" },
                  { name: "Email" },
                  { name: "Contact Number" },
                  { name: "Gender" },
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
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : teachersList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500">
                    No Teachers found
                  </td>
                </tr>
              ) : (
                teachersList.map((teacher, index) => (
                  <tr key={getTeacherId(teacher) || index} className="hover:bg-gray-50">
                    {/* Table Cells */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>navigate(`view/${getTeacherId(teacher)}`)}  className="text-gray-500 hover:text-blue-600 transition-colors">
                          <GrOverview size={20} title="View" />
                        </button>
                        <Link to={`edit/${getTeacherId(teacher)}`} className="text-gray-500 hover:text-green-600 transition-colors">
                          <CiEdit size={22} title="Edit" />
                        </Link>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusUpdate(teacher)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          teacher.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {teacher.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {getAcademicYear(teacher.academicYear)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {teacher.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        {teacher.imageUrl ? (
                          <img
                            src={teacher.imageUrl}
                            alt={`${teacher.name}'s profile`}
                            className="w-10 h-10 rounded-full object-cover transform transition-transform duration-200 hover:scale-125"
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random&color=fff`}
                            alt="Default Profile"
                            className="w-8 h-8 rounded-full object-cover opacity-70"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {teacher.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {teacher.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {teacher.contactNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {teacher.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(teacher.createdAt)}
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
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}

export default Teachers;