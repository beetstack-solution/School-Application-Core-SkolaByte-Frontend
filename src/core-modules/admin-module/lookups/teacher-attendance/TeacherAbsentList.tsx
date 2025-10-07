import { Class } from '@/api/admin-api/student-management/students-api/studentsApi';
import { fetchAttendance } from '@/api/admin-api/lookups-api/teachersAttendanceApi';
import { Division, fetchAttendanceStatusDd, fetchClasses, fetchDivisionsDD } from '@/api/common-api/commonDropDownApi';
import Breadcrumb from '@/components/Breadcumb';
import MessagePopup, { MessageType } from '@/components/MessagePopup';
import SearchBar from '@/components/SearchBar';
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { FiCheck, FiFilter, FiX } from 'react-icons/fi';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ExportExcelButton from '@/components/ExcelExportButton';
import * as XLSX from 'xlsx';


const TeacherAbsentList: React.FC = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [attendanceStatus, setAttendanceStatus] = useState<Division[]>([]);
    const [formData, setFormData] = useState({
        class: "",
        division: "",
        firstHalfStatus: '',
        secondHalfStatus: '',
        startDate: "",
        endDate: ""
    });
    const [allAttendance, setAllAttendance] = useState<any[]>([]); 
    const [displayedAttendance, setDisplayedAttendance] = useState<any[]>([]);
    const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{
        text: string;
        type: MessageType;
    } | null>(null);
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Teacher Absent List", path: "" },
    ];
    const initialFormData = {
        class: '',
        division: '',
        firstHalfStatus: '',
        secondHalfStatus: '',
        startDate: '',
        endDate: ''
    };
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, divisionsData, attendanceStatusData] = await Promise.all([
                    fetchClasses(),
                    fetchDivisionsDD(),
                    fetchAttendanceStatusDd(),
                ]);
                setClasses(classesData.data);
                setDivisions(divisionsData.data);
                setAttendanceStatus(attendanceStatusData.data);

                const absentStatus = attendanceStatusData.data.find((status: any) => status.name === 'Absent');
      if (absentStatus) {
        setFormData((prev) => ({
          ...prev,
          firstHalfStatus: absentStatus._id,
          secondHalfStatus: '',
        }));
      }
            } catch (error) {
                console.error("Failed to load required data:", error);
            }
        }

        fetchData();
    }, []);


    useEffect(() => {
        if (searchTerm.trim() === '') {
            setDisplayedAttendance(allAttendance);
            return;
        }

        const filtered = allAttendance
            .map(attendance => {
                const filteredteachers = attendance.teachers.filter((teacher: any) => {
                    const name = `${teacher.teacher?.name || ''}  }`.toLowerCase();
                    const code = teacher.code?.toString().toLowerCase() || '';
                    return (
                        name.includes(searchTerm.toLowerCase()) ||
                        code.includes(searchTerm.toLowerCase())
                    );
                });

                if (filteredteachers.length > 0) {
                    return {
                        ...attendance,
                        teachers: filteredteachers
                    };
                }


                return null;
            })
            .filter(Boolean);

        setDisplayedAttendance(filtered);
    }, [searchTerm, allAttendance]);


    const absentStatus = attendanceStatus.find(status => status.name === 'Absent');


    const handleFilter = async () => {
        // if (!formData.class || !formData.division) {
        //   setMessage({
        //     text: "Please select both class and division",
        //     type: "error",
        //   });
        //   return;
        // }

      if (!formData.startDate) {
    setMessage({
      text: "Please select a date",
      type: "error",
    });
    return;
  }

  if (session === 'morning' && !formData.firstHalfStatus) {
    setMessage({
      text: "Morning session status not set",
      type: "error",
    });
    return;
  }

  if (session === 'afternoon' && !formData.secondHalfStatus) {
    setMessage({
      text: "Afternoon session status not set",
      type: "error",
    });
    return;
  }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchAttendance(

                formData.startDate,
                formData.endDate,
               session === 'morning' ? formData.firstHalfStatus : undefined,
      session === 'afternoon' ? formData.secondHalfStatus : undefined,
            );
            const attendanceData = response.data?.data || [];
            setAllAttendance(attendanceData);
            setDisplayedAttendance(attendanceData);
            setSearchTerm('');
        } catch (err: any) {
            console.error("Failed to fetch timetable", err);
            setError(err.message || "Failed to fetch timetable");
            setAllAttendance([]);
            setDisplayedAttendance([]);
        } finally {
            setIsLoading(false);
        }
    };

    const morningAttendance = displayedAttendance.filter(att => att.halfDayTimes?.firstHalf === "morning");
    const afternoonAttendance = displayedAttendance.filter(att => att.halfDayTimes?.secondHalf === "afternoon");

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const getAttenndanceId = (attendance: any): string => {
        return attendance._id || attendance.id || "";
    };
    const exportToExcel = async () => {
        const response = await fetchAttendance(
            formData.startDate,
            formData.endDate
        );
        const data = response.data?.data || [];
        if (data.length === 0) {
            toast.error("No attendance data available for export");
            return;
        }
        const dataToExport: any[] = [];
        let slNo = 1;

        data.forEach((attendance: any) => {
            attendance.teachers.forEach((teacherEntry: any) => {
                const status = session === 'morning' ? teacherEntry.firstHalfStatus?.name : teacherEntry.secondHalfStatus?.name;
                dataToExport.push({
                    "Sl No.": slNo++,
                    "Code": teacherEntry.code || "N/A",
                    "Name": teacherEntry.teacher?.name || "N/A",
                    "Attendance Status": status || "N/A",
                    "Remarks": teacherEntry.remarks || "N/A",
                    "Date": new Date(teacherEntry.createdAt || attendance.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }),
                });
            });
        });
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
        XLSX.writeFile(wb, "Attendance Data.xlsx", { type: "buffer" });

    }
    return (

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {message && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage(null)}
                    duration={4000}
                />
            )}
            <ExportExcelButton
                onExport={exportToExcel}
                isLoading={isLoading}
            />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Teacher Absent List</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                {/* Main Filters - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {/* Class Selector */}
                    {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              name="class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div> */}

                    {/* Division Selector */}
                    {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div> */}

                    {/* Date Range - Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    setFormData({
                                        ...formData,
                                        startDate: selectedDate,
                                        endDate: selectedDate
                                    });
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Secondary Filters - Session Selection and Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-gray-200">
                    {/* Session Toggle Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setSession('morning');
                                if (formData.startDate) {
                                    setFormData({
                                        ...formData,
                                        firstHalfStatus: absentStatus?._id || '',
                                        secondHalfStatus: ''
                                    });
                                }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${session === 'morning'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Morning Session
                        </button>
                        <button
                            onClick={() => {
                                setSession('afternoon');
                                if (formData.startDate) {
                                    setFormData({
                                        ...formData,
                                        firstHalfStatus: '',
                                        secondHalfStatus: absentStatus?._id || ''
                                    });
                                }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${session === 'afternoon'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Afternoon Session
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                        <button
                            onClick={() => {
                                setFormData(initialFormData);
                                setSession('morning');
                                setSearchTerm('');
                                setAllAttendance([]);
                                setDisplayedAttendance([]);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleFilter}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm font-medium flex items-center gap-2"
                        >
                            Find Attendance
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-auto"
                //  style={{ maxHeight: 'calc(100vh - 300px)' }}
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {[
                                    { name: "Sl No.", width: "w-16" },
                                    { name: "Action", },
                                    { name: "Code." },
                                    { name: "Name" },
                                    { name: "Attendance Status" },
                                    { name: "Remarks" },
                                    { name: "Date" }
                                ].map((header) => (
                                    <th
                                        key={header.name}
                                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
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
                                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-red-500 font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : displayedAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                        {allAttendance.length === 0
                                            ? "Please provide class and division"
                                            : "No matching records found"}
                                    </td>
                                </tr>
                            ) : (() => {
                                let serialNumber = 1;
                                const currentAttendance = session === 'morning' ? morningAttendance : afternoonAttendance;

                                if (currentAttendance.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                                No {session} attendance records found
                                            </td>
                                        </tr>
                                    );
                                }

                                return currentAttendance.flatMap((attendance, index) =>
                                    attendance.teachers.map((teacherEntry: any) => {
                                        const statusColor = session === 'morning'
                                            ? teacherEntry.firstHalfStatus?.name === 'Present'
                                                ? 'text-green-600 bg-green-50'
                                                : teacherEntry.firstHalfStatus?.name === 'Absent'
                                                    ? 'text-red-600 bg-red-50'
                                                    : 'text-gray-600 bg-gray-50'
                                            : teacherEntry.secondHalfStatus?.name === 'Present'
                                                ? 'text-green-600 bg-green-50'
                                                : teacherEntry.secondHalfStatus?.name === 'Absent'
                                                    ? 'text-red-600 bg-red-50'
                                                    : 'text-gray-600 bg-gray-50';

                                        const statusName = session === 'morning'
                                            ? teacherEntry.firstHalfStatus?.name
                                            : teacherEntry.secondHalfStatus?.name;

                                        return (
                                            <tr key={`${session}-${serialNumber}`} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {serialNumber++}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`edit/${getAttenndanceId(attendance)}`)}
                                                        className="bg-gray-100 text-gray-700 px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                            hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {teacherEntry.code || "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                                                    {teacherEntry.teacher?.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                                        {statusName === 'Present' && (
                                                            <FiCheck className="mr-1 h-3 w-3" />
                                                        )}
                                                        {statusName === 'Absent' && (
                                                            <FiX className="mr-1 h-3 w-3" />
                                                        )}
                                                        {statusName || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {teacherEntry.remarks || "N/A"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(teacherEntry.createdAt || attendance.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TeacherAbsentList;