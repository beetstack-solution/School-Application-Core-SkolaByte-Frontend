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
import { fetchStudents } from "@/api/admin-api/student-management/students-api/studentsApi";
import { createRollNo } from "@/api/admin-api/lookups-api/assignRollNoApi";
import ExportExcelButton from "@/components/ExcelExportButton";
import * as XLSX from 'xlsx';

function AssignRollNo() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(60);
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
    const [studentsWithRollNumbers, setStudentsWithRollNumbers] = useState<Student[]>([]);
    const [classOptions, setClassOptions] = useState<Classes[]>([]);
    const [divisionOptions, setDivisionOptions] = useState<Division[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedDivision, setSelectedDivision] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        academicYear: "",
        class: "",
        division: "",
        sortByAlpha: true
    });
    console.log("setStudentsWithRollNumbers", studentsWithRollNumbers);
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
            console.error("Failed to load academicyear:", error);
        }
    };

    useEffect(() => {
        getAllAcademicYears();
        getDivisionDD();
        getClassesDD();
    }, []);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const response: any = await fetchStudents(
                currentPage - 1,
                itemsPerPage,
                searchQuery,
                filters // Pass the current filters
            );

            setStudentsList(response.studentsList);
            setStudentsWithRollNumbers(response.studentsList);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch student details");
            setStudentsList([]);
            setStudentsWithRollNumbers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filters.academicYear && filters.class && filters.division && filters.sortByAlpha) {
            loadStudents();
        }
    }, [currentPage, itemsPerPage, filters]);
    const assignRollNumbers = () => {
        setLoading(true);
        try {
            // Generate roll numbers sequentially
            const updatedStudents = studentsList.map((student, index) => ({
                ...student,
                rollNumber: (index + 1).toString() // Formats as 01, 02, etc.
            }));

            setStudentsWithRollNumbers(updatedStudents);
            toast.success("Roll numbers assigned");
        } catch (error) {
            toast.error("Failed to assign roll numbers");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


const handleSubmit = async () => {
    setLoading(true);
    try {
        const payload:any = {
            classId: filters.class,
            divisionId: filters.division,
            academicYearId: filters.academicYear,
            details: studentsWithRollNumbers.map((student) => ({
                studentId: student._id,
                rollNumber: student.rollNumber,
            })),
        }
        console.log("payload", payload);
        const response = await createRollNo(payload);
        if (response.success) {
            toast.success(response.message || "Roll numbers assigned successfully!");
        } else {
            toast.error(response.message || "Failed to assign roll numbers");
        }
        loadStudents();
        setStudentsWithRollNumbers([]);
        setFilters({
            academicYear: "",
            class: "",
            division: "",
            sortByAlpha: true
        });
    } catch (error:any) {
        toast.error( error.message || "Failed to assign roll numbers");
        console.error(error);
    } finally {
        setLoading(false);
    }
};

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Assign Roll No", path: "" },
    ];
const exportToExcel = () => {
    const response = studentsWithRollNumbers.map((student, index) => ({
        "Sl. No.": index + 1,
        "Academic Year": student?.academicYear?.academicYear || "N/A",
        "Student Name": `${student?.firstName || ""} ${student?.lastName || ""}`,
        "Roll No": student.rollNumber || "Not assigned",
        "Class": student?.class?.name || "N/A",
        "Division": student?.division?.name || "N/A",
        "Gender" : student.gender || "N/A",
    }));
    const ws = XLSX.utils.json_to_sheet(response);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Students_${new Date().toISOString().split("T")[0]}.xlsx`);
}
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                 <ExportExcelButton
                            onExport={exportToExcel}
                            isLoading={isLoading}
                          />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Assign Roll Numbers
                    </h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Academic Year Dropdown */}
                    <div className="space-y-1">
                        <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                            Academic Year
                        </label>
                        <AcademicYearDropdown
                            value={filters.academicYear}
                            onChange={(value) => setFilters({ ...filters, academicYear: value })}
                        />
                    </div>

                    {/* Class Dropdown */}
                    <div className="space-y-1">
                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                            Class
                        </label>
                        <select
                            name="classId"
                            value={filters.class}
                            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Select Class</option>
                            {classOptions.map((classItem: Classes) => (
                                <option key={classItem._id} value={classItem._id}>
                                    {classItem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Division Dropdown */}
                    <div className="space-y-1">
                        <label htmlFor="divisionId" className="block text-sm font-medium text-gray-700">
                            Division
                        </label>
                        <select
                            name="divisionId"
                            value={filters.division}
                            onChange={(e) => setFilters({ ...filters, division: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Select Division</option>
                            {divisionOptions.map((division: Division) => (
                                <option key={division._id} value={division._id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Student Count Information */}
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Total Students:</span>
                                <span className="text-sm font-semibold text-blue-600">
                                    {studentsWithRollNumbers?.length || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Without Roll No:</span>
                                <span className="text-sm font-semibold text-red-500">
                                    {
                                        studentsWithRollNumbers?.filter(
                                            (student) => !student.rollNumber || student.rollNumber.trim() === ""
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                    <button
                        onClick={assignRollNumbers}
                        disabled={loading || !filters.academicYear || !filters.class || !filters.division}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${loading || !filters.academicYear || !filters.class || !filters.division
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? "Processing..." : "Assign Roll Numbers"}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {loading ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                    ) : studentsWithRollNumbers.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sl. No.
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Academic Year
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Division
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roll No
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                                    {studentsWithRollNumbers.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item?.academicYear?.academicYear || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item?.class?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item?.division?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item?.firstName || "N/A"} {item?.lastName || ""}
                                    </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.rollNumber || (
                                                    <span className="text-red-500">Not assigned</span>
                                                )}
                                            </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.gender || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="bg-white p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filters.academicYear && filters.class && filters.division
                                ? "No students match your criteria"
                                : "Please select academic year, class, and division to view students"}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {/* {studentsList.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>{' '}
                        of <span className="font-medium">{totalItems}</span> students
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage * itemsPerPage >= totalItems}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default AssignRollNo;