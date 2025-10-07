import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiDownload, FiPrinter, FiSearch, FiUser, FiUsers } from "react-icons/fi";
import Breadcrumb from "@/components/Breadcumb";
import { fetchAttendanceReports, AttendanceSummary, fetchStudentsAttendanceReports } from "@/api/admin-api/reports-api/attendenceReportApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, getStudentsByClassDivisionAcademicYear } from "@/api/common-api/commonDropDownApi";
import { MessageType } from "@/components/MessagePopup";
import ExportExcelButton from "@/components/ExcelExportButton";
import * as XLSX from 'xlsx';


function AttendanceReport() {
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'student'>('summary');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  // const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);
  const [formData, setFormData] = useState({
    academicYear: "",
    class: "",
    division: "",
    student: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearData, classesData, divisionsData] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),

        ]);
        setAcademicYears(academicYearData.data);
        setClasses(classesData.data);
        setDivisions(divisionsData.data);

        if (academicYearData.data?.length) {
          const currentYear = academicYearData.data.find((year) => {
            if (!year.academicYear) return false;
            return year.academicYear.includes(new Date().getFullYear().toString());
          });

          if (currentYear?._id) {
            setFormData(prev => ({
              ...prev,
              academicYear: currentYear._id
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (formData.class && formData.division && formData.academicYear) {
        try {
          const response = await getStudentsByClassDivisionAcademicYear(
            formData.class,
            formData.division,
            formData.academicYear
          );
          setStudents(response.data || []);
        } catch (error) {
          console.error("Failed to fetch students", error);
          setStudents([]);
        }
      }
    };

    fetchStudents();
  }, [formData.class, formData.division, formData.academicYear]);


  const fetchAttendanceData = async (startDate: string, endDate: string) => {

    try {
      setLoading(true);
      const response = await fetchAttendanceReports(startDate, endDate);
      setAttendanceData(response.data || []);
    } catch (error: any) {
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };




  const studentAttendanceReport = async (startDate: string, endDate: string, selectedStudent: string) => {

    try {
      setLoading(true);
      const response = await fetchStudentsAttendanceReports(startDate, endDate, selectedStudent);
      setAttendanceData(response.data || []);
    } catch (error: any) {
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };





  const filteredData = useMemo(() => {
    if (!searchQuery) return attendanceData;

    return attendanceData.filter(item =>
      item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.divisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.totalStudents.toString().includes(searchQuery) ||
      item.presentCount.toString().includes(searchQuery) ||
      item.absentCount.toString().includes(searchQuery)
    );
  }, [attendanceData, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };



  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Attendance Report", path: "" },
  ];

  const overallStats = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      return {
        totalStudents: acc.totalStudents + item.totalStudents,
        totalPresent: acc.totalPresent + item.presentCount,
        totalAbsent: acc.totalAbsent + item.absentCount,
      };
    }, { totalStudents: 0, totalPresent: 0, totalAbsent: 0 });
  }, [filteredData]);

  const handleTabChange = (tab: 'summary' | 'student') => {
    setActiveTab(tab);
    setError(null);
  };

  useEffect(() => {
    if (activeTab === 'summary' && startDate && endDate) {
      fetchAttendanceData(startDate, endDate);
    }
  }, [activeTab, startDate]);

  useEffect(() => {
    if (activeTab === 'student' && startDate && endDate && selectedStudent) {
      studentAttendanceReport(startDate, endDate, selectedStudent);
    }
  }, [activeTab, startDate, endDate, selectedStudent]);

const exportToExcel = async () => {
  try {
    setLoading(true);
    let data;
    let fileName = "attendance_report";
    let sheetName = "Attendance Report";

    if (activeTab === 'summary') {
      const response = await fetchAttendanceReports(startDate, endDate);
      data = response.data;
      fileName = "class_attendance_report";
      sheetName = "Class Attendance Report";
    } else {
      if (!selectedStudent) {
        setError("Please select a student to export data.");
        return;
      }
      const response = await fetchStudentsAttendanceReports(startDate, endDate, selectedStudent);
      data = response.data;
      fileName = "students_attendance_report";
      sheetName = "Students Attendance Report";
    }

    if (!data || data.length === 0) {
      setError("No data available to export.");
      return;
    }

    const formattedData = data.map(item => {
      if (activeTab === 'summary') {
        // Class/Division Report format
        return {
          Class: item.className,
          Division: item.divisionName,
          "Total Students": item.totalStudents,
          Present: item.presentCount,
          Absent: item.absentCount,
          Percentage: ((item.presentCount / item.totalStudents) * 100).toFixed(2) + '%'
        };
      } else {
        // Student Report format
        const totalDays = item.presentCount + item.absentCount;
        return {
          "Student Name": item.studentName,
          Class: item.className,
          Division: item.divisionName,
          "Present Days": item.presentCount,
          "Absent Days": item.absentCount,
          // "Total Days": totalDays,
          "Date": `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
          Percentage: totalDays > 0 
            ? ((item.presentCount / totalDays) * 100).toFixed(2) + '%' 
            : '0%'
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

  } catch (error) {
    setError("Failed to export data. Please try again.");
    console.error("Export error:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
       
       <ExportExcelButton
        onExport={exportToExcel} 
        isLoading={loading} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Report</h2>

          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('summary')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <FiUsers className="text-lg" />
              Class/Division Report
            </div>
          </button>
          <button
            onClick={() => handleTabChange('student')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'student'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <FiUser className="text-lg" />
              Student Report
            </div>
          </button>
        </nav>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Conditional Filters Based on Tab */}
        {activeTab === 'summary' ? (
          <div className="space-y-4">
            {/* Academic Year and Search in single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Academic Year Dropdown (Summary Tab) */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <AcademicYearDropdown
                  value={formData.academicYear}
                  onChange={(value) => setFormData({ ...formData, academicYear: value })}
                  required={true}
                  disabled={false}
                />
              </div>

              {/* Class Search (Summary Tab) */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Classes
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by class, division..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Academic Year and Class in single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Academic Year Dropdown */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <AcademicYearDropdown
                  value={formData.academicYear}
                  onChange={(value) => setFormData({ ...formData, academicYear: value })}
                  required={true}
                  disabled={false}
                />
              </div>

              {/* Class Dropdown */}
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Division and Student Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Division Dropdown */}
              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division._id} value={division._id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Dropdown (Conditional) */}
              {students.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'summary' ? (
        <>

          {/* Summary Cards */}
          {filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Classes</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{filteredData.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{overallStats.totalStudents}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      {overallStats.totalStudents > 0
                        ? ((overallStats.totalPresent / overallStats.totalStudents) * 100).toFixed(1) + '%'
                        : '0%'}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No attendance records</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {startDate ?
                    `No attendance data available for ${new Date(startDate).toLocaleDateString()}` :
                    "Please select a date to view attendance records"}
                </p>
                {/* <div className="mt-6">
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Today's Attendance
              </button>
            </div> */}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Division
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Present
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => {
                      const percentage = (item.presentCount / item.totalStudents) * 100;
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.className}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.divisionName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.totalStudents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {item.presentCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {item.absentCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 mr-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${percentage > 90 ? 'bg-green-500' : percentage > 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No attendance records</h3>
              <p className="mt-1 text-sm text-gray-500">
                {startDate ?
                  `No attendance data available for ${new Date(startDate).toLocaleDateString()}` :
                  "Please select a date to view attendance records"}
              </p>
              {/* <div className="mt-6">
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Today's Attendance
              </button>
            </div> */}
            </div>
          ) : (
            <div >
              {filteredData.length > 1 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">
                    Please select class and division to see student report
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {filteredData.map((item, index) => {
                    const totalDays = item.presentCount + item.absentCount;
                    const attendancePercentageRaw = totalDays > 0
                      ? (item.presentCount / totalDays) * 100
                      : 0;
                    const attendancePercentage = attendancePercentageRaw.toFixed(2);

                    const percentageColor =
                      attendancePercentageRaw > 90
                        ? 'text-green-600'
                        : attendancePercentageRaw > 75
                          ? 'text-blue-600'
                          : attendancePercentageRaw > 50
                            ? 'text-yellow-600'
                            : 'text-red-600';

                    const progressBarColor =
                      attendancePercentageRaw > 90
                        ? 'bg-green-500'
                        : attendancePercentageRaw > 75
                          ? 'bg-blue-500'
                          : attendancePercentageRaw > 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500';

                    return (
                      <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-800">{item.studentName}</h2>
                              <p className="text-sm text-gray-600">{item.className} - {item.divisionName}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`text-3xl font-bold ${percentageColor}`}>
                                {attendancePercentage}%
                              </span>
                              <span className="text-sm text-gray-500">Attendance</span>
                            </div>
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="p-6">
                          {/* Progress Bar with Labels */}
                          <div className="mb-8">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">Attendance Progress</span>
                              <span className="text-sm font-medium text-gray-500">
                                {item.presentCount} present / {item.absentCount} absent
                              </span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${progressBarColor}`}
                                style={{ width: `${attendancePercentageRaw}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Detailed Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Present Days */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-800">Present Days</p>
                                  <p className="text-3xl font-bold text-green-600">{item.presentCount}</p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Absent Days */}
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-red-800">Absent Days</p>
                                  <p className="text-3xl font-bold text-red-600">{item.absentCount}</p>
                                </div>
                                <div className="p-3 rounded-full bg-red-100 text-red-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            View Detailed Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              )}
            </div>
          )}
        </div>
      )}
      {/* Date Display */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing attendance data from {new Date(startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} to {new Date(endDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;