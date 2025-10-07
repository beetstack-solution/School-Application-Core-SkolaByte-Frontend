import { RiPlayListAddFill } from "react-icons/ri";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import { deleteAssignedTeacherClass, getAssignedTeachersClass, updateAssignedTeachersClassByTeacherStatus } from "@/api/admin-api/lookups-api/assignTeachersClassApi";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { formatDate } from "@/helpers/helper";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import * as XLSX from 'xlsx';
import ExportExcelButton from "@/components/ExcelExportButton";

interface AssignedTeacherClass {
  _id: string;
  teacher: {
    _id: string;
    name: string;
    contactNumber: string;
    imageUrl?: string;
    code: string;
    gender: string;
    status: boolean;
  } | null;
  academicYear: {
    academicYear: string;
  };
  isClassTeacher: boolean;
  classTeacherOf: {
    class: {
      name: string;
    };
    division: {
      name: string;
    };
  } | null;
  assignments: {
    class: {
      name: string;
    };
    division: {
      name: string;
    };
    subjects: {
      name: string;
    }[];
  }[];
  createdAt: string;
  updatedAt?: string;
  status: boolean;
}

function AssignTeachersClass() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [assignedTeachers, setAssignedTeachers] = useState<AssignedTeacherClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Assign Teachers to Class", path: "" },
  ];

  const loadAssignedTeachers = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      // Fetch paginated data from API with search term if needed
      const response: any = await getAssignedTeachersClass(
        page,
        limit,
        // Pass search term to API if your backend supports search
      );

      // Fetch all data for export
   

      if (response.data && response.data.data) {
        setAssignedTeachers(response.data.data);
        setTotalItems(response.data.total || 0);
        setError(null);
      } else {
        setAssignedTeachers([]);
        setTotalItems(0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch assigned teachers");
      setAssignedTeachers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedTeachers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getTeacherInfo = (teacher: AssignedTeacherClass) => {
    if (teacher.teacher) {
      return {
        name: teacher.teacher.name,
        contactNumber: teacher.teacher.contactNumber,
        imageUrl: teacher.teacher.imageUrl,
        code: teacher.teacher.code,
        gender: teacher.teacher.gender,
        status: teacher.teacher.status
      };
    }
    return {
      name: "Not Assigned",
      contactNumber: "N/A",
      imageUrl: undefined,
      code: "N/A",
      gender: "N/A",
      status: false
    };
  };

  const getClassTeacherInfo = (teacher: AssignedTeacherClass) => {
    if (teacher.isClassTeacher && teacher.classTeacherOf) {
      return `${teacher.classTeacherOf.class.name} - ${teacher.classTeacherOf.division.name}`;
    }
    return "N/A";
  };

  const getAssignedSubjects: any = (teacher: AssignedTeacherClass) => {
    return teacher.assignments.map((assignment: any) => {
      const className = assignment.classDetails?.[0]?.name || '';
      const divisionName = assignment.divisionDetails?.[0]?.name || '';
      const subjectNames = (assignment.subjectDetails || [])
        .map((s: any) => s.name)
        .join(", ");

      return `${className}-${divisionName}: ${subjectNames}`;
    }).join("; ");
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

const exportToExcel = async () => {
  try {
    setIsLoading(true);
    // Fetch all data for export when the button is clicked
    const response: any = await getAssignedTeachersClass(
      0, // page 0 to get all records
      Number.MAX_SAFE_INTEGER, // get all records
    );

    const exportTeachers = response.data?.data || [];
    
    const data = exportTeachers.map((teacher: AssignedTeacherClass, index: number) => {
      const teacherInfo = getTeacherInfo(teacher);
      return {
        'Sl No.': index + 1,
        'Teacher Code': teacherInfo.code,
        'Teacher Name': teacherInfo.name,
        'Contact Number': teacherInfo.contactNumber,
        'Status': teacher.teacher?.status ? 'Active' : 'Inactive',
        'Class Teacher Of': getClassTeacherInfo(teacher),
        'Assigned Class and Subjects': getAssignedSubjects(teacher),
        'Academic Year': teacher.academicYear.academicYear,
        'Created At': formatDate(teacher.createdAt),
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AssignedTeachers");
    XLSX.writeFile(wb, `AssignedTeachers_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error("Export failed:", error);
    setMessage({ text: "Failed to export data", type: "error" });
  } finally {
    setIsLoading(false);
  }
};

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assigned teacher?")) {
      try {
        const response = await deleteAssignedTeacherClass(id);
        if (response.success) {
          setMessage({ text: "Assigned teacher deleted successfully", type: "success" });
          loadAssignedTeachers(currentPage, itemsPerPage);
        } else {
          setMessage({ text: "Failed to delete assigned teacher", type: "error" });
        }
      } catch (error: any) {
        setMessage({ text: error.message || "Failed to delete assigned teacher", type: "error" });
      }
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await updateAssignedTeachersClassByTeacherStatus(id, newStatus);
      if (response.success) {
        setMessage({ text: `Assigned teacher status updated to ${newStatus ? 'Active' : 'Inactive'}`, type: 'success' });
        loadAssignedTeachers(currentPage, itemsPerPage);
      } else {
        setMessage({ text: "Failed to update assigned teacher status", type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Failed to update assigned teacher status", type: "error" });
    }
  };
  const filteredTeachers = assignedTeachers.filter((teacher) =>
    teacher.teacher?.name.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

      <div className="flex justify-end mb-4">
        <ExportExcelButton
          onExport={exportToExcel}
          isLoading={isLoading}
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assigned Teachers to Classes</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <Link to={'/lookups/assign-teacher-class/add'} className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
              <RiPlayListAddFill className="text-lg" />
              Assign Teacher
            </button>
          </Link>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { name: "Sl No.", width: "w-16" },
                  { name: "Actions" },
                  { name: "Status" },
                  { name: "Academic Year" },
                  { name: "Teacher Name" },
                  { name: "Contact" },
                  { name: "Class Teacher Of" },
                  { name: "Created At" },
                  { name: "Updated At" }
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
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    {searchTerm ? "No matching teachers found" : "No assigned teachers found"}
                  </td>
                </tr>
              )
              : (
                filteredTeachers.map((teacher, index) => {
                  const teacherInfo = getTeacherInfo(teacher);
              const classTeacherInfo = getClassTeacherInfo(teacher);
              const assignedSubjects = getAssignedSubjects(teacher);

              return (
              <tr key={teacher._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/lookups/assign-teacher-class/view/${teacher._id}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                      <GrOverview size={20} title="View" />
                    </Link>
                    <Link to={`/lookups/assign-teacher-class/edit/${teacher._id}`} className="text-gray-500 hover:text-green-600 transition-colors">
                      <CiEdit size={22} title="Edit" />
                    </Link>
                    <MdDeleteOutline
                      size={20}
                      title="Delete"
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                      onClick={() => handleDelete(teacher._id)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${teacher.teacher?.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                    onClick={() => handleStatusUpdate(teacher._id, teacher?.teacher?.status ?? false)}
                  >
                    {teacher.teacher?.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {teacher.academicYear.academicYear}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {teacherInfo.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {teacherInfo.contactNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {classTeacherInfo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(teacher.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(teacher.updatedAt || "N/A")}
                </td>
              </tr>
              );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} of {filteredTeachers.length} entries
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

export default AssignTeachersClass;