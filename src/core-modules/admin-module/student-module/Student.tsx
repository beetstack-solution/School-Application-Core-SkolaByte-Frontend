// import { RiFilterLine, RiPlayListAddFill } from "react-icons/ri";
// import { AiFillCaretUp } from "react-icons/ai";
// import Breadcrumb from "@/components/Breadcumb";
// import SearchBar from "@/components/SearchBar";
// import Pagination from "@/components/Pagination";
// import { useEffect, useState } from "react";
// import { fetchStudents, Student, updateStudentStatusById, deleteStudent } from "@/api/admin-api/student-management/students-api/studentsApi";
// import { Link, useNavigate } from "react-router-dom";
// import { GrOverview } from "react-icons/gr";
// import { CiEdit } from "react-icons/ci";
// import { toast } from "react-toastify";
// import MessagePopup, { MessageType } from "@/components/MessagePopup";
// import FilterationTab from "@/components/FilterationTab";
// import FilterButton from "@/components/FilterButton";
// import * as XLSX from 'xlsx';
// import ExportExcelButton from "@/components/ExcelExportButton";
// import { FaFileImport } from "react-icons/fa";

// function Students() {
//   const baseUrl = import.meta.env.VITE_API_BASE_URL;
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(25);
//   const [totalItems, setTotalItems] = useState(0);
//   const [studentsList, setStudentsList] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
// const [filters, setFilters] = useState({
//   academicYear: "",
//   class: "",
//   division: "",
//   startDate: "",
//   endDate: "",
//   sortByAlpha: false
// });
//   const [message, setMessage] = useState<{
//     text: string;
//     type: MessageType;
//   } | null>(null);
//   const breadcrumbItems = [
//     { label: "Home", path: "/" },
//     { label: "Students", path: "" },
//   ];

//   const loadStudents = async (search = "") => {
//   setIsLoading(true);
//   try {
//     const { studentsList: data, total } = await fetchStudents(
//       currentPage,
//       itemsPerPage,
//       search,
//       filters // Pass the current filters
//     );
//     setStudentsList(data);
//     setTotalItems(total);
//     setError(null);
//   } catch (err: any) {
//     setError(err.message || "Failed to fetch student details");
//     setStudentsList([]);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   useEffect(() => {
//     loadStudents(searchTerm);
//   }, [currentPage, itemsPerPage, searchTerm, filters]);

//   // Handle search
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     setCurrentPage(1);
//   };
// const handleApplyFilters = (newFilters: {
//   academicYear?: string;
//   class?: string;
//   division?: string;
//   startDate?: string;
//   endDate?: string;
// }) => {
//   setFilters(prev => ({
//     ...prev,
//     ...newFilters
//   }));
//   setCurrentPage(1); // Reset to first page when filters change
// };
// const handleClearFilters = () => {
//   setFilters({
//     academicYear: "",
//     class: "",
//     division: "",
//     startDate: "",
//     endDate: "",
//     sortByAlpha: false
//   });
//   setCurrentPage(1);
// };
//   // Get the correct ID field from student object
//   const getStudentId = (student: any): string => {
//     return student._id || student.id || "";
//   };

//   // Status change with fix for undefined ID
//   const handleStatusUpdate = async (student: Student) => {
//     const studentId = getStudentId(student);
//     if (!studentId) {
//       toast.error("Cannot update status: Student ID is missing or invalid");
//       return;
//     }
//     const newStatus = !student.status;
//     const confirmUpdate = window.confirm(
//       `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"}?`
//     );
//     if (!confirmUpdate) {
//       return;
//     }
//     try {
//       const responseData = await updateStudentStatusById(studentId, newStatus);

//       if (responseData?.success) {
//         setMessage({
//           text: `Student status updated to ${newStatus ? "Active" : "Inactive"}.`,
//           type: "success"
//         });
//         loadStudents(searchTerm);
//       } else {
//         toast.error(
//           responseData?.message ||
//           "Failed to update student status."
//         );
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update student status.");
//     }
//   };

//   // Add this new function for Excel export
//   const exportToExcel = async () => {
//     // Prepare data for export
//     const { studentsList: allStudents } = await fetchStudents(
//       0,
//       Number.MAX_SAFE_INTEGER,
//       searchTerm,
//       filters
//     );

//     const data = allStudents.map((student, index) => ({
//       'Sl No.': index + 1,
//       'Roll No.': student.rollNumber,
//       'Name': `${student.firstName} ${student.lastName}`,
//       'Class': student.class?.name || 'N/A',
//       'Division': student.division?.name || 'N/A',
//       'Status': student.status ? 'Active' : 'Inactive',
//       'Academic Year': student.academicYear?.academicYear || 'N/A',
//       'Created At': new Date(student.createdAt).toLocaleDateString(),
//     }));
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Students");
//     XLSX.writeFile(wb, `Students_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   // Delete data with fix for undefined ID
//   // const handleDelete = async (student: Student) => {
//   //   const studentId = getStudentId(student);
//   //   if (!studentId) {
//   //     toast.error("Cannot delete: Student ID is missing or invalid");
//   //     return;
//   //   }
//   //   const confirmDelete = window.confirm(
//   //     "Are you sure you want to delete this student?"
//   //   );
//   //   if (!confirmDelete) {
//   //     return; 
//   //   }
//   //   try {
//   //     const response = await deleteStudent(studentId);

//   //     if (response && response.success === true) {
//   //       toast.success(response.message || "Student deleted successfully!");
//   //       loadStudents(searchTerm);
//   //     } else {
//   //       toast.error(
//   //         response?.message || "Failed to delete student. Please try again."
//   //       );
//   //     }
//   //   } catch (error: any) {
//   //     console.error("Error deleting student:", error);
//   //     toast.error(
//   //       error.message || "An error occurred while deleting the student. Please try again."
//   //     );
//   //   }
//   // };

//   // Format full name
//   const getFullName = (student: Student): string => {
//     return `${student.firstName} ${student.lastName}`;
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
//       {/* Message Popup */}
//       {message && (
//         <MessagePopup
//           message={message.text}
//           type={message.type}
//           onClose={() => setMessage(null)}
//           duration={4000}
//         />
//       )}
//       <div className="">
//         <ExportExcelButton
//           onExport={exportToExcel}
//           isLoading={isLoading}
//         />
//         <FilterButton
//           onClick={() => setShowFilters(prev => !prev)}
//           onHover={(isHovering) => {
//             // Only open on hover for desktop devices
//             // if (window.innerWidth > 768) {
//             //   setShowFilters(isHovering);
//             // }
//           }}
//         />

//         <FilterationTab
//           isOpen={showFilters}
//           onClose={() => setShowFilters(false)}
//           onApply={handleApplyFilters}
//           onClear={handleClearFilters}
//           initialFilters={filters}
//           showDateFilters={true}
//         />
//       </div>
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Student List</h2>
//             <div className="mt-1">
//               <Breadcrumb items={breadcrumbItems} />
//             </div>
//           </div>


//           <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
//             <Link to={'add'} className="w-full md:w-auto">
//               <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
//                 <RiPlayListAddFill className="text-lg" />
//                 Add Student
//               </button>
//             </Link>

//             {/* <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
//         <FaFileImport  className="text-lg" />
//        Bulk
//       </button> */}
//             <SearchBar onSearch={handleSearch} />
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
//         //  style={{ height: 'calc(100vh - 200px)' }}
//         >
//           <div className="flex-1 overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   {[
//                     { name: "Sl No.", width: "w-16" },
//                     { name: "Actions" },
//                     { name: "Status" },
//                     { name: "Academic Year" },
//                     { name: "Name" },
//                     { name: "Class" },
//                     { name: "Division" },
//                     { name: "Roll No." },
//                     { name: "Admission No." },
//                     { name: "Image" },
//                     // { name: "Gender"},

//                     // { name: "Created By", width: "w-32" },
//                     { name: "Created At" }
//                   ].map((header) => (
//                     <th
//                       key={header.name}
//                       className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
//                     >
//                       <div className="flex items-center gap-1">
//                         {header.name}
//                         <AiFillCaretUp className="text-gray-400 text-xs" />
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={11} className="px-4 py-4 text-center text-gray-500">
//                       <div className="flex justify-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={11} className="px-4 py-4 text-center text-red-500 font-medium">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : studentsList.length === 0 ? (
//                   <tr>
//                     <td colSpan={11} className="px-4 py-4 text-center text-gray-500">
//                       No students found
//                     </td>
//                   </tr>
//                 ) : (
//                   studentsList.map((student, index) => (
//                     <tr key={getStudentId(student) || index} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm text-gray-500">
//                         {(currentPage - 1) * itemsPerPage + index + 1}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <button onClick={()=>navigate(`view/${getStudentId(student)}`)} className="text-gray-500 hover:text-blue-600 transition-colors">
//                             <GrOverview size={20} title="View" />
//                           </button>
//                           <button onClick={()=>navigate(`edit/${getStudentId(student)}`)}   className="text-gray-500 hover:text-blue-600 transition-colors">
//                             <CiEdit size={22} title="Edit" />
//                           </button>
//                           {/* <button 
//                       onClick={() => handleDelete(student)} 
//                       className="text-gray-500 hover:text-red-600 transition-colors"
//                     >
//                       <MdDeleteOutline size={18} title="Delete" />
//                     </button> */}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => handleStatusUpdate(student)}
//                           className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.status
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                             }`}
//                         >
//                           {student.status ? "Active" : "Inactive"}
//                         </button>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
//                         {student.academicYear?.academicYear || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs capitalize">
//                         {getFullName(student)}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
//                         {student.class?.name || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
//                         {student.division?.name || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">
//                         {student.rollNumber}
//                       </td>
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">
//                         {student?.admissionNumber || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
//                         <div className="flex items-center gap-3">
//                           {student.imageUrl ? (() => {
//                             const cleanedImageUrl = student.imageUrl.replace(/^\/?public\/?/, '');
//                             const finalImageUrl = `${baseUrl.replace(/\/$/, '')}/${cleanedImageUrl.replace(/^\/+/, '')}`;
//                             return (
//                               <img
//                                 src={student.imageUrl}
//                                 alt={getFullName(student)}
//                                 className="w-10 h-10 rounded-full object-cover transform transition-transform duration-200 hover:scale-125"
//                               />
//                             );
//                           })() : (
//                             <img
//                               src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(student))}&background=random&color=fff`}
//                               alt="Default Profile"
//                               className="w-8 h-8 rounded-full object-cover opacity-70"
//                             />
//                           )}
//                         </div>
//                       </td>
//                       {/* <td className="px-4 py-3 text-sm text-gray-500">
//                   {student.gender}
//                 </td> */}
//                       {/* <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
//                   {student.createdBy?.name || 'N/A'}
//                 </td> */}
//                       <td className="px-4 py-3 text-sm text-gray-500">
//                         {new Date(student.createdAt).toLocaleDateString()}
//                       </td>

//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Footer Section */}
//         <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
//           <div className="text-sm text-gray-600">
//             Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(totalItems / itemsPerPage)}
//             onPageChange={(newPage) => setCurrentPage(newPage)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Students;

import { RiFilterLine, RiPlayListAddFill, RiCloseLine } from "react-icons/ri";
import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import { fetchStudents, Student, updateStudentStatusById } from "@/api/admin-api/student-management/students-api/studentsApi";
import { fetchClasses, fetchDivisionsDD, fetchAcademicYear } from "@/api/common-api/commonDropDownApi";
import { Link, useNavigate } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import * as XLSX from 'xlsx';
import ExportExcelButton from "@/components/ExcelExportButton";

function Students() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    class: "",
    division: "",
    startDate: "",
    endDate: "",
    sortByAlpha: false
  });
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);
  const [academicYearOptions, setAcademicYearOptions] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Students", path: "" },
  ];

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      const [academicYearResponse, classResponse, divisionResponse] = await Promise.all([
        fetchAcademicYear(),
        fetchClasses(),
        fetchDivisionsDD()
      ]);
      setAcademicYearOptions(academicYearResponse.data);
      setClassOptions(classResponse.data);
      setDivisionOptions(divisionResponse.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const loadStudents = async (search = "") => {
    setIsLoading(true);
    try {
      const { studentsList: data, total } = await fetchStudents(
        currentPage,
        itemsPerPage,
        search,
        filters
      );
      setStudentsList(data);
      setTotalItems(total);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch student details");
      setStudentsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    loadStudents(searchTerm);
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setFiltersApplied(true);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      academicYear: "",
      class: "",
      division: "",
      startDate: "",
      endDate: "",
      sortByAlpha: false
    });
    setFiltersApplied(false);
    setCurrentPage(1);
    setShowFilters(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStudentId = (student: any): string => {
    return student._id || student.id || "";
  };

  const handleStatusUpdate = async (student: Student) => {
    const studentId = getStudentId(student);
    if (!studentId) {
      toast.error("Cannot update status: Student ID is missing or invalid");
      return;
    }
    const newStatus = !student.status;
    const confirmUpdate = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"}?`
    );
    if (!confirmUpdate) {
      return;
    }
    try {
      const responseData = await updateStudentStatusById(studentId, newStatus);

      if (responseData?.success) {
        setMessage({
          text: `Student status updated to ${newStatus ? "Active" : "Inactive"}.`,
          type: "success"
        });
        loadStudents(searchTerm);
      } else {
        toast.error(
          responseData?.message ||
          "Failed to update student status."
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update student status.");
    }
  };

  const exportToExcel = async () => {
    const { studentsList: allStudents } = await fetchStudents(
      0,
      Number.MAX_SAFE_INTEGER,
      searchTerm,
      filters
    );

    const data = allStudents.map((student, index) => ({
      'Sl No.': index + 1,
      'Roll No.': student.rollNumber,
      'Name': `${student.firstName} ${student.lastName}`,
      'Class': typeof student.class === 'object' && student.class ? student.class.name || 'N/A' : 'N/A',
      'Division': typeof student.division === 'object' && student.division ? student.division.name || 'N/A' : 'N/A',
      'Status': student.status ? 'Active' : 'Inactive',
      'Academic Year': typeof student.academicYear === 'object' && student.academicYear ? student.academicYear.academicYear || 'N/A' : 'N/A',
      'Created At': new Date(student.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Students_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getFullName = (student: Student): string => {
    return `${student.firstName} ${student.lastName}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Message Popup */}
      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          duration={4000}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Student Management</h2>
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showFilters ? 'bg-[#90a63b] text-white' : 'bg-white text-[#90a63b] border border-[#90a63b]'}`}
              >
                <RiFilterLine className="text-lg" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {filtersApplied && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <RiCloseLine className="text-lg" />
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
              <ExportExcelButton
                onExport={exportToExcel}
                isLoading={isLoading}
                className="bg-[#90a63b] hover:bg-[#7d8f34] text-white"
              />
              
              <Link to={'add'} className="w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 bg-[#90a63b] hover:bg-[#7d8f34] text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto shadow-md">
                  <RiPlayListAddFill className="text-lg" />
                  Add Student
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
                >
                  <option value="">All Years</option>
                  {academicYearOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.academicYear}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  name="class"
                  value={filters.class}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
                >
                  <option value="">All Classes</option>
                  {classOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <select
                  name="division"
                  value={filters.division}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
                >
                  <option value="">All Divisions</option>
                  {divisionOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-[#90a63b] hover:bg-[#7d8f34] text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name, roll number..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90a63b] focus:border-[#90a63b] transition-all"
            />
          </div>
        </div>

        {/* Table Section */}
        {filtersApplied || searchTerm ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#90a63b] sticky top-0 z-10">
                  <tr>
                    {[
                      { name: "Sl No.", width: "w-16" },
                      { name: "Actions" },
                      { name: "Status" },
                      { name: "Academic Year" },
                      { name: "Name" },
                      { name: "Class" },
                      { name: "Division" },
                      { name: "Roll No." },
                      { name: "Admission No." },
                      { name: "Image" },
                      { name: "Created At" }
                    ].map((header) => (
                      <th
                        key={header.name}
                        className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${header.width}`}
                      >
                        <div className="flex items-center gap-1">
                          {header.name}
                          <AiFillCaretDown className="text-white text-xs" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#90a63b]"></div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-4 text-center text-red-500 font-medium">
                        {error}
                      </td>
                    </tr>
                  ) : studentsList.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                        No students found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    studentsList.map((student, index) => (
                      <tr key={getStudentId(student) || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => navigate(`view/${getStudentId(student)}`)} 
                              className="text-gray-500 hover:text-[#90a63b] transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                              <GrOverview size={18} title="View" />
                            </button>
                            <button 
                              onClick={() => navigate(`edit/${getStudentId(student)}`)} 
                              className="text-gray-500 hover:text-[#90a63b] transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                              <CiEdit size={20} title="Edit" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleStatusUpdate(student)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${student.status
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                          >
                            {student.status ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {student.academicYear?.academicYear || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                          {getFullName(student)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {student.class?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {student.division?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {student?.admissionNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {student.imageUrl ? (
                              <img
                                src={student.imageUrl}
                                alt={getFullName(student)}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-[#90a63b] transition-all"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                {getFullName(student).charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} students
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalItems / itemsPerPage)}
                onPageChange={(newPage) => setCurrentPage(newPage)}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <RiFilterLine className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Apply filters to view students</h3>
              <p className="text-gray-500 mb-6">Use the filters above to find specific students based on your criteria.</p>
              <button
                onClick={() => setShowFilters(true)}
                className="bg-[#90a63b] hover:bg-[#7d8f34] text-white px-6 py-2 rounded-lg shadow-md transition-colors"
              >
                Show Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;