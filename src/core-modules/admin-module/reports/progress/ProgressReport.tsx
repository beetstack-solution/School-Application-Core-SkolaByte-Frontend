import { useEffect, useMemo, useState } from "react";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineSearch,
} from "react-icons/ai";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcumb";
import {
  fetchProgressReport,
  ExamRecord,
} from "@/api/admin-api/reports-api/progressReportApi";
import {
  Classes,
  Division,
  fetchAcademicYear,
  fetchClasses,
  fetchDdAllStudents,
  fetchDivisionsDD,
  getStudentsByClassDivisionAcademicYear,
  Student,
} from "@/api/common-api/commonDropDownApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import * as XLSX from 'xlsx';
import ExportExcelButton from '@/components/ExcelExportButton';


function ProgressReport() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<any[]>([]);
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [academicYearOptions, setAcademicYearOptions] = useState<any[]>([]);
  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>(
    {}
  );
  const [classOptions, setClassOptions] = useState<Classes[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<Division[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

  const getClassesDD = async () => {
    const response = await fetchClasses();
    if (response.success) {
      setClassOptions(response.data);
    } else {
      setClassOptions([]);
    }
  };

  const getDivisionDD = async () => {
    const response = await fetchDivisionsDD();
    if (response.success) {
      setDivisionOptions(response.data);
    } else {
      setDivisionOptions([]);
    }
  };

  const getAllAcademicYears = async () => {
    try {
      const response = await fetchAcademicYear();
      setAcademicYearOptions(response.data || []);
    } catch (error: any) {
      setAcademicYearOptions([]);
      console.error("Failed to load academic year:", error);
    }
  };

  useEffect(() => {
    getAllAcademicYears();
    getDivisionDD();
    getClassesDD();
  }, []);

  const getStudentsByClassAndDivision = async (
    classId: string,
    divisionId: string
  ) => {
    try {
      const response = await getStudentsByClassDivisionAcademicYear(
        classId,
        divisionId,
        academicYearId
      );
      if (response.success) {
        setStudentOptions(response.data);
      } else {
        setStudentOptions([]);
      }
    } catch (error: any) {
      setStudentOptions([]);
      console.error(error.message || "Failed to fetch students");
    }
  };

  useEffect(() => {
    if (selectedClass && selectedDivision) {
      getStudentsByClassAndDivision(selectedClass, selectedDivision);
    }
  }, [selectedClass, selectedDivision, academicYearId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetchProgressReport(studentId, academicYearId);
      setProgressData(response.data || []);
    } catch (error: any) {
      setProgressData([]);
      toast.error(error.message || "Failed to fetch progress report");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return progressData;

    return progressData.filter(
      (item) =>
        item.class.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.division.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.student.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.student.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.student.rollNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.examType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [progressData, searchQuery]);

  // Group data by exam name
  const groupedData = useMemo(() => {
    const groups: Record<string, any[]> = {};

    filteredData.forEach((item) => {
      if (!groups[item.exam.name]) {
        groups[item.exam.name] = [];
      }
      groups[item.exam.name].push(item);
    });

    return groups;
  }, [filteredData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (studentId && academicYearId) {
      fetchProgressData();
    }
  }, [studentId, academicYearId]);

  const toggleExamExpand = (examName: string) => {
    setExpandedExams((prev) => ({
      ...prev,
      [examName]: !prev[examName],
    }));
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Progress Report", path: "" },
  ];

  // Calculate average percentage
  const averagePercentage = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const total = filteredData.reduce(
      (sum, item) =>
        sum +
        (Array.isArray(item.percentage)
          ? item.percentage.reduce((a: any, b: any) => a + b, 0)
          : item.percentage),
      0
    );
    return (total / filteredData.length).toFixed(2);
  }, [filteredData]);



  const exportToExcel = async () => {
    // Use the already fetched progress data
    const data = progressData || [];

    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const dataToExport: any[] = [];
    let slNo = 1;

    data.forEach((item: any) => {
      dataToExport.push({
        "Sl No": slNo++,
        "Academic Year": item.academicYear?.academicYear || "N/A",
        "Class": item.class?.name || "N/A",
        "Division": item.division?.name || "N/A",
        "Student Name": `${item.student?.firstName || ""} ${item.student?.lastName || ""}`.trim() || "N/A",
        "Roll Number": item.student?.rollNumber || "N/A",
        "Subject": item.subject?.name || "N/A",
        "Exam": item.exam?.name || "N/A",
        "Exam Type": item.examType?.name || "N/A",
        "Total Marks": item.marksPerEachExam?.reduce((a: number, b: number) => a + b, 0) || "N/A",
        "Marks Obtained": item.marksObtainedPerEachExam?.reduce((a: number, b: number) => a + b, 0) || "N/A",
        "Percentage": item.percentage ? `${item.percentage.toFixed(2)}%` : "N/A",
        "Grade": item.grade || "N/A",
        "Created At": formatDate(item.createdAt) || "N/A"
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exam Results");
    XLSX.writeFile(wb, "exam_results.xlsx");
  };

  // Helper function to format date (you can replace with your own implementation)
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <ExportExcelButton
                              onExport={exportToExcel}
                              isLoading={isLoading}
                            /> 
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Student Progress Report
          </h2>

          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="academicYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Academic Year
            </label>
            <AcademicYearDropdown
              value={academicYearId}
              onChange={(value) => setAcademicYearId(value)}
            />
          </div>
          <div>
            <label
              htmlFor="classId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Class
            </label>
            <select
              name="classId"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Class</option>
              {classOptions.map((classItem: Classes) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="divisionId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Division
            </label>
            <select
              name="divisionId"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Division</option>
              {divisionOptions.map((division: Division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Student
            </label>
            <select
              name="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Students</option>
              {studentOptions.map((student: Student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} (Roll No:
                  {student.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="relative w-full">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Records
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 mb-5">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Total Exams Taken
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredData.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              Average Percentage
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {averagePercentage}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-sm font-medium text-purple-800 mb-2">
              Total Marks Obtained: <b>{filteredData[0].totalMarksObtained}</b>
            </h3>
            <p className="text-2xl font-bold text-purple-800">
              Grade: {filteredData[0].grade}
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {studentId
                ? "No progress data available for the selected criteria"
                : "Please select a student to view progress report"}
            </div>
            <button
              onClick={() => {
                setStudentId("");
                setAcademicYearId("");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Exam
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Exam Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(groupedData).map(
                  ([examName, examItems], index) => (
                    <>
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {examName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {examItems[0].examType.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {examItems[0].createdAt
                              ? new Date(
                                  examItems[0].createdAt
                                ).toLocaleDateString("en-GB")
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExamExpand(examName)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            {expandedExams[examName]
                              ? "Hide Subjects"
                              : "View Subjects"}
                            {expandedExams[examName] ? (
                              <AiFillCaretUp className="transition-transform" />
                            ) : (
                              <AiFillCaretDown className="transition-transform" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedExams[examName] && (
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Subject
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Marks Obtained
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Total Marks
                                    </th>
                                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th> */}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {examItems.map((item, itemIndex) => (
                                    <tr
                                      key={itemIndex}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                          {item.subject.name}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm">
                                          {item.marksObtainedPerEachExam.join(
                                            ", "
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="text-sm">
                                          {item.marksPerEachExam.join(", ")}
                                        </div>
                                      </td>
                                      {/* <td className="px-4 py-2 whitespace-nowrap">
                                                                            <div className="text-sm font-medium text-blue-600">
                                                                                {item.percentage}%
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                                            <div className={`text-sm font-medium ${item.grade === 'A' ? 'text-green-600' :
                                                                                    item.grade === 'F' ? 'text-red-600' :
                                                                                        'text-yellow-600'
                                                                                }`}>
                                                                                {item.grade}
                                                                            </div>
                                                                        </td> */}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressReport;
