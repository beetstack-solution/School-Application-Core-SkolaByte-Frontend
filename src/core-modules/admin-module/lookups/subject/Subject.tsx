import { RiPlayListAddFill } from "react-icons/ri";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import {
  fetchSubjects,
  SubjectData,
  updateStatusById,
  deleteData,
} from "@/api/admin-api/lookups-api/subjectApi";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddSubjectModal from "./AddSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import { formatDate } from "@/helpers/helper";
import ExportSubjectModal from "@/components/ExportSubjectModal";
import { RiExportFill } from "react-icons/ri";
import { FaRegClone } from "react-icons/fa";
import ExportExcelButton from "@/components/ExcelExportButton";
import * as XLSX from 'xlsx';

function Subject() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [showCloneModal, setShowCloneModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 25;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Subject", path: "" },
  ];

  const fetchData = async () => {
    try {
      const page = currentPage 
      const { subjects, total } = await fetchSubjects(page, itemsPerPage);
      setSubjects(subjects);
      setTotalItems(total);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(subjects, "sssss");

  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = subjects.filter(
        (item) =>
          item?.code.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSubjects(filtered);
    } else {
      setSubjects(subjects);
    }
    setCurrentPage(1);
  };

  //   status update
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
          `subject status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        fetchData();
      } else {
        console.error(
          "Updated subject is undefined or missing _id",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update module status due to missing subject data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(error.message || "Failed to update subject status.");
    }
  };
  const exportToExcel = async () => {

    const response = await fetchSubjects(
      0, // skip
      Number.MAX_SAFE_INTEGER,
      // searchTerm,
      // filters
    );
    const data = response.subjects.map((subject) => ({
      "Sl No.": response.subjects.indexOf(subject) + 1,
      "Subject": subject?.name,
      "Code": subject?.code,
      "Academic Year": subject?.academicYear?.academicYear,
      "Created At": formatDate(subject.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subjects");
    XLSX.writeFile(wb, `subjects_${new Date().toISOString()}.xlsx`);
  }
  // delete data
  const handleDelete = async (moduleId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) {
      return; // Exit the function if the subject cancels
    }

    try {
      const response = await deleteData(moduleId);
      console.log("Delete response:", response);

      if (response.success === true) {
        toast.success(response.message || "subject deleted successfully!");
        fetchData();
      } else {
        toast.error(
          response.message || "Failed to delete subject. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast.error(
        "An error occurred while deleting the subject. Please try again."
      );
    }
  };

  const handleEditClick = (SubjectId: string) => {
    setSelectedSubjectId(SubjectId);
    setShowEditModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subject</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div>
          <ExportExcelButton
            onExport={exportToExcel}
            isLoading={isLoading}
          />
          <button
            className="fixed right-4 z-50 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => setShowCloneModal(true)}
          >
            <FaRegClone className="text-lg" />
            <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300">
              Clone
            </span>
          </button>
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
      // style={{ minHeight: '400px' }}
      >
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Sl No. <AiFillCaretUp />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Status <AiFillCaretUp />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Academic Year <AiFillCaretUp />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Code <AiFillCaretUp />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Subject Name <AiFillCaretUp />
                  </div>
                </th>
               
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Start Month <AiFillCaretUp />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    End Month <AiFillCaretUp />
                  </div>
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    CreatedAt <AiFillCaretUp />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/lookups/subjects/view/${subject._id}`}>
                          <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(subject._id)}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <CiEdit size={22} title="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${subject.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                        onClick={() => handleStatusUpdate(subject._id, subject.status)}
                      >
                        {subject.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{subject.academicYear?.academicYear}</td>

                    <td className="px-4 py-3 text-sm text-gray-900">{subject.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{subject.name}</td>
                    {/* <td className="px-4 py-3 text-sm text-gray-500">{subject.academicYear?.startMonth}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{subject.academicYear?.endMonth}</td> */}
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(subject.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Total Count: {totalItems}
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
          <AddSubjectModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchData}
          />
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <EditSubjectModal
            SubjectId={selectedSubjectId}
            onClose={() => {
              setShowEditModal(false);
              setSelectedSubjectId(null);
            }}
            onSuccess={fetchData}
          />
        </div>
      )}


      {showCloneModal && (
        <ExportSubjectModal
          onClose={() => setShowCloneModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default Subject;
