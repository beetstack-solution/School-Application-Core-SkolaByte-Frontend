import { deleteGrade, fetchGrades, GradeData, updateGradeStatus } from '@/api/admin-api/lookups-api/gradeApi';
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper'
import { log } from 'console';
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddGrade from './AddGrade';
import ExportExcelButton from '@/components/ExcelExportButton';
import * as XLSX from 'xlsx';
import { MessageType } from '@/components/MessagePopup';
import FilterationTab from '@/components/FilterationTab';
import FilterButton from '@/components/FilterButton';

function Grade() {
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
   const [filters, setFilters] = useState({
    academicYear: "",
    class: "",
    division: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
   const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState({
    column: "student",
    order: "ascending",
  });
  const [message, setMessage] = useState<{
      text: string;
      type: MessageType;
    } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');
  const [selectedGradeName, setSelectedGradedata] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (gradeId: string) => {
    // setSelectedGradeId(gradeId);
    // setShowEdit(true);
    navigate(`/lookups/grades/edit/${gradeId}`);
  };
  const navigate = useNavigate();
  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  // const page = (currentPage - 1) * itemsPerPage;
  // const limit = itemsPerPage;

 const handleApplyFilters = (newFilters: any) => {
    setFilters({
      academicYear: newFilters.academicYear,
      class: newFilters.class,
      division: newFilters.division,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      academicYear: "",
      class: "",
      division: "",
    });
    setCurrentPage(1);
  };




  const getGrades = async (page: number, limit: number,search = "") => {
    setLoading(true);
    try {
      const response: any = await fetchGrades(page, limit, search,
         filters.academicYear,
        filters.class,
        filters.division
      );
      if (response.success) {
        setGrades(response.data?.data);
        setFilteredGrades(response.data?.data);
        setTotalItems(response?.data?.total || 0);
      } else {
        setError('Failed to fetch grades.');
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getGrades(currentPage, itemsPerPage,searchTerm);
  }, [currentPage, itemsPerPage,searchTerm, filters]);
  console.log("setFilteredGrades", filteredGrades);

  // const handleReload = () => {
  //   getGrades(page, limit);
  // };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
    );
    if (!isConfirmed) return;

    try {
      const response = await updateGradeStatus(_id, newStatus);
      if (response?.success) {
        toast.success(
          response.message || `Grade status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        getGrades(currentPage, itemsPerPage);
      } else {
        toast.error(response.message || "Failed to update grade status.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update grade status.");
    }
  };

  const handleSearch = (query: string) => {
    const searchQuery = query.trim();
    if (searchQuery) {
      const filtered = grades.filter((item) =>
        item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.academicYear?.academicYear?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${item.grades[0].student?.firstName} ${item.student?.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.grades[0].exams[0].exam?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marksObtained?.toString().includes(searchQuery) ||  // Numbers like marks and percentage are strings
        item.grades[0].totalPercentage?.toString().includes(searchQuery) ||    // Percentage is a number, converting to string for search
        item.grades[0].grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remarks?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGrades(filtered);
    } else {
      getGrades(currentPage, itemsPerPage);
    }
    setCurrentPage(1);  // Reset to first page when searching
  };

  const exportToExcel = async () => {
    const response:any = await fetchGrades(0, Number.MAX_SAFE_INTEGER);
    const gradesData = response.data?.data|| [];

    if (!gradesData || gradesData.length === 0) {
      console.log("No grades data available to export.");
      return;
    }

    const dataToExport:any = [];
    let slNo = 1; // Initialize Sl no

    gradesData.forEach((gradeEntry:any) => {
      const academicYear = gradeEntry.academicYear?.academicYear || 'N/A';
      const className = gradeEntry.class?.name || 'N/A';
      const divisionName = gradeEntry.division?.name || 'N/A';

      gradeEntry.grades.forEach((studentGrade:any) => {
        const studentName = studentGrade.student ? `${studentGrade.student.firstName} ${studentGrade.student.lastName}` : 'N/A';

 const exams = Array.isArray(studentGrade.exams) ? studentGrade.exams : [];

        studentGrade.exams.forEach((examDetail:any) => {
          const examName = examDetail.exam?.name || 'N/A';
          const subjectName = examDetail.subject?.name || 'N/A';
          const examType = examDetail.examType?.name || 'N/A';
          const duration = examDetail.exam.subjects.find(
            (sub:any) => sub.subject === examDetail.subject?._id && sub.examType === examDetail.examType?._id
          )?.duration || 'N/A';
          const marksObtained = examDetail.marksObtained;
          const totalMarks = examDetail.totalMarks;
          const percentage = studentGrade.totalPercentage;
          const studentOverallGrade = studentGrade.grade;


          dataToExport.push({
            "Sl No": slNo++,
            "Academic Year": academicYear,
            "Class": className,
            "Division": divisionName,
            "Student Name": studentName,
            "Exam Name": examName,
            "Subject": subjectName,
            "Exam Type": examType,
            "Duration": duration,
            "Marks Obtained": marksObtained,
            "Total Marks": totalMarks,
            "Overall Percentage": percentage,
            "Overall Grade": studentOverallGrade
          });
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grades");
    XLSX.writeFile(wb, `grades_${new Date().toISOString()}.xlsx`);
  };

  const changeSort = (column: keyof GradeData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredGrades].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredGrades(sortedData);
  };

  const handleDelete = async (gradeId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteGrade(gradeId);
      if (response.success) {
        toast.success(response.message || "Grade deleted successfully!");
        getGrades(currentPage, itemsPerPage);
      } else {
        toast.error(response.message || "Failed to delete grade.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete grade.");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Grade", path: "" },
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
       <div className="">
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
        <ExportExcelButton
          onExport={exportToExcel}
          isLoading={isLoading}
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grade</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
            onClick={() => navigate('/lookups/grades/add')}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Sl No.
                    {sortState.column === "_id" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Status
                    {sortState.column === "status" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Code
                    {sortState.column === "code" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Academic Year
                    {sortState.column === "academicYear" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Student
                    {sortState.column === "student" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Marks Obtained
                    {sortState.column === "marksObtained" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Percentage
                    {sortState.column === "percentage" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Grade
                    {sortState.column === "grade" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Created At
                    {sortState.column === "createdAt" && sortState.order === "ascending" && <AiFillCaretUp />}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades && filteredGrades.length > 0 ? (
                filteredGrades.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/lookups/grades/view/${item._id}`}>
                          <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600" />
                        </Link>
                        <button
                          onClick={() => item._id && handleEditShow(item._id)}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <CiEdit size={22} title="Edit" />
                        </button>
                        <button
                          onClick={() => item._id && handleDelete(item._id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <MdDeleteOutline size={18} title="Delete" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                        onClick={() => item._id && handleStatusUpdate(item._id, item.status)}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    {/* <td className="px-4 py-3 text-sm text-gray-900">{item.code}</td> */}
                    <td className="px-4 py-3 text-sm text-gray-500">{item?.academicYear?.academicYear}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{`${item.grades[0].student?.firstName} ${item.grades[0].student?.lastName}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.grades[0].totalMarksObtained}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.grades[0].totalPercentage.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.grades[0].grade}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
                    No data available
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
          Showing {filteredGrades?.length || 0} of {totalItems} entries
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* Edit modal content remains the same */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Grade