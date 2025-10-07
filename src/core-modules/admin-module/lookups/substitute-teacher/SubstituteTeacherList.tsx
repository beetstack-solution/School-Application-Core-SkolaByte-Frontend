import { RiPlayListAddFill } from "react-icons/ri";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { formatDate } from "@/helpers/helper";
import ExportExcelButton from "@/components/ExcelExportButton";
import * as XLSX from 'xlsx';
import FilterationTab from "@/components/FilterationTab";
import FilterButton from "@/components/FilterButton";
import { deleteSubstituteTeacher, fetchSubstituteTeachers, SubstituteTeacher, updateSubstituteTeacherStatus } from "@/api/admin-api/lookups-api/substituteTeacherApi";


function SubstituteTeacherAdd() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [substituteList, setSubstituteList] = useState<SubstituteTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    academicYear: '',
    class: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Substitute", path: "" },
  ];

  const loadSubstitute = async () => {
    setIsLoading(true);
    try {
      const { substituteTeachers: data, total } = await fetchSubstituteTeachers(
        currentPage, // API uses 0-based index
        itemsPerPage,
        filters.academicYear || undefined,
        filters.class || undefined
      );
      setSubstituteList(data);
      setTotalItems(total);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch substitute");
      setSubstituteList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubstitute();
  }, [currentPage, itemsPerPage, filters]);

  // Handle search
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = substituteList.filter(
        (item) =>
          item.substituteTeacher.name.toLowerCase().includes(query.toLowerCase())
        // item.class?.name.toLowerCase().includes(query.toLowerCase()) 

      );
      setSubstituteList(filtered);
    } else {
     loadSubstitute(); // Reload full list if search query is empty
    }
    setCurrentPage(1);
  };

   const handleApplyFilters = (newFilters: {
    academicYear?: string;
    class?: string;
  }) => {
    setFilters({
      academicYear: newFilters.academicYear || '',
      class: newFilters.class || '',
    });
    setCurrentPage(1); // Reset to first page when filters change
  };
    const handleClearFilters = () => {
    setFilters({
      academicYear: '',
      class: '',
    });
    setCurrentPage(1);
  };
//   const exportToExcel = async () => {
//     const response = await fetchSubstitute(0, Number.MAX_SAFE_INTEGER);
//     const data = response.substituteList.map((substitute) => {
//       // Process subjects and topics
//       const subjectsWithTopics = substitute.subjects.map((subject: any) => {
//         const subjectName = subject.subject?.name?.name || 'N/A';
//         const topics = subject.topics.map((topic: any) =>
//           `${topic.topicName}${topic.description ? ` (${topic.description})` : ''}`
//         ).join(", ");

//         return {
//           subject: subjectName,
//           topics: topics || 'N/A'
//         };
//       });

//       // Combine all subjects and topics for this substitute
//       const allSubjects = subjectsWithTopics.map((s: any) => s.subject).join("; ");
//       const allTopics = subjectsWithTopics.map((s: any) => s.topics).join("; ");

//       return {
//         "Sl No.": response.substituteList.indexOf(substitute) + 1,
//         "Academic Year": substitute.academicYear?.academicYear || 'N/A',
//         "Class": substitute.class?.name || 'N/A',
//         "Subjects": allSubjects,
//         "Topics": allTopics,
//         "Status": substitute.status ? "Active" : "Inactive",
//         "CreatedAt": formatDate(substitute.createdAt),
//       };
//     });

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "substitute");
//     XLSX.writeFile(wb, `substitute_${new Date().toISOString()}.xlsx`);
//   }

  // status change
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
      const responseData = await updateSubstituteTeacherStatus(_id, newStatus);
      console.log("Updated syllabous:", responseData);

      if (responseData?.success) {
        toast.success(
          responseData.message ||
          `substitute status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        loadSubstitute();
      } else {
        console.error(
          "Updated substitute is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update module status due to missing substitute data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update substitute status.");
    }
  };
  // delete data
  const handleDelete = async (moduleId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this substitute?"
    );

    if (!confirmDelete) {
      return; // Exit the function if the substitute cancels
    }

    try {
      const response = await deleteSubstituteTeacher(moduleId);
      console.log("Delete response:", response);

      if (response.success === true) {
        toast.success(response.message || "substitute deleted successfully!");
        loadSubstitute();
      } else {
        toast.error(
          response.message || "Failed to delete substitute. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting substitute:", error);
      toast.error(
        "An error occurred while deleting the substitute. Please try again."
      );
    }
  };

  const formatTime = (timeStr: string): string => {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; 
  return `${hour}:${minute} ${ampm}`;
};



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* <ExportExcelButton
          onExport={exportToExcel}
          isLoading={isLoading}
        /> */}
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
           showDivisionFilter={false}
          showDateFilters={false}
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Substitute Teacher List</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <Link to={'/lookups/substitute-teachers/add'} className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
              <RiPlayListAddFill className="text-lg" />
              Add Substitute Teacher
            </button>
          </Link>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>

                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Month
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Month
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent Teacher
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Substitute Teacher
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : substituteList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500">
                    No substitute found.
                  </td>
                </tr>
              ) : (
                substituteList.map((substitute, index) => (
                  <tr key={substitute._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* <Link to={`/lookups/substitutes/view/${substitute._id}`}>
                          <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600" />
                        </Link>
                        <Link to={`/lookups/substitutees/edit/${substitute._id}`}>
                          <CiEdit size={22} title="Edit" className="text-gray-500 hover:text-green-600" />
                        </Link> */}
                        <MdDeleteOutline
                          size={20}
                          title="Delete"
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDelete(substitute._id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${substitute.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                        onClick={() => handleStatusUpdate(substitute._id, substitute.status)}
                      >
                        {substitute.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                   
                   
                    <td className="px-4 py-3 text-sm text-gray-900"> {substitute.class?.name || 'N/A'}</td>
 <td className="px-4 py-3 text-sm text-gray-900"> {substitute.division?.name || 'N/A'}</td>
                    {/* <td className="px-4 py-3 text-sm text-gray-500">
                      {substitute.academicYear?.startMonth || 'N/A'}
                    </td> */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {substitute.originalTeacher?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {substitute.substituteTeacher.name}
                    </td>
                     <td className="px-4 py-3 text-sm text-gray-500">
                      {(substitute?.timeSlot?.startTime && substitute?.timeSlot?.endTime)
  ? `${formatTime(substitute.timeSlot.startTime)} - ${formatTime(substitute.timeSlot.endTime)}`
  : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(substitute.createdAt)}
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
    </div>
  );
}

export default SubstituteTeacherAdd;
