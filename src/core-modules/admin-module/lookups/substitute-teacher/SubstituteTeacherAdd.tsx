import React, { useEffect, useState } from "react";
import {
    AcademicYear,
    Division,
    fetchAcademicYear,
    fetchAttendanceStatusDd,
    fetchClasses,
    fetchDivisionsDD,
    fetchTeachers,
} from "@/api/common-api/commonDropDownApi";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { fetchAttendance } from "@/api/admin-api/lookups-api/teachersAttendanceApi";
import { getTimeSlots } from "@/api/admin-api/lookups-api/timeSlotApi";
import { fetchTimeTable } from "@/api/admin-api/lookups-api/timeTableApi";
import { createSubstituteTeacher } from "@/api/admin-api/lookups-api/substituteTeacherApi";
import { getAssignedTeachersClass } from "@/api/admin-api/lookups-api/assignTeachersClassApi";
import { AiFillCaretUp } from "react-icons/ai";

const SubstituteTeacherAdd: React.FC = () => {
    const navigate = useNavigate();
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [attendanceStatus, setAttendanceStatus] = useState<any[]>([]);
    const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
    const [timeSloats, setTimeSlots] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        class: "",
        division: "",
        academicYear: "",
        day: "",
        name: "",
        firstHalfStatus: '',
        secondHalfStatus: '',
        timeSlot: "",
        startDate: "",
        endDate: "",
        teacher: "",
        substituteTeacher: "",
        reason: "",
    })
    const [allAttendance, setAllAttendance] = useState<any[]>([]);
    const itemsPerPage = 25;
    const [currentPage, setCurrentPage] = useState(1);
    const [freeTeachers, setFreeTeachers] = useState<any[]>([]);
    const [slotToCover, setSlotToCover] = useState<any[]>([]);
    const [isFetchingFreeTeachers, setIsFetchingFreeTeachers] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: MessageType;
    } | null>(null);
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "substitute Teacher List", path: "/lookups/substitute-teacher" },
        { label: "Add Substitute Teacher", path: "" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [academicYearData, classesData, divisionsData, attendanceStatusData] = await Promise.all([
                    fetchAcademicYear(),
                    fetchClasses(),
                    fetchDivisionsDD(),
                    fetchAttendanceStatusDd(),
                ]);
                setAcademicYears(academicYearData.data);
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

    const fetchTimeSlots = async (page: number, limit: number) => {
        setIsLoading(true);

        try {
            const response: any = await getTimeSlots(page, limit);
            if (response.success) {
                setTimeSlots(response.data?.data);
            } else {
                setError("Failed to fetch fee structures.");
            }
        } catch (error: any) {
            setError(error.message);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTimeSlots(currentPage, itemsPerPage);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const absentStatus = attendanceStatus.find(status => status.name === 'Absent');
    const handleFilter = async () => {
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

            console.log("attendanceData", attendanceData);

        } catch (err: any) {
            console.error("Failed to fetch timetable", err);
            setError(err.message || "Failed to fetch timetable");
            setAllAttendance([]);
        } finally {
            setIsLoading(false);
        }
    };





    const findFreeTeachers = async (page: number, limit: number) => {
        if (!formData.teacher || !formData.day) {
            setMessage({
                text: "Please select absent teacher, day, and time slot",
                type: "error"
            });
            return;
        }

        setIsFetchingFreeTeachers(true);
        try {
            // Get all teachers and filter out absent ones
            const allTeachersResponse = await getAssignedTeachersClass(
                1,
                25,
                formData.academicYear,
                formData.class,
                formData.division,

            );
            const absentTeacherIds = new Set(
                allAttendance.flatMap(attendance =>
                    attendance.teachers.map((t: any) => t.teacher._id)
                )
            );

            const teachersData = allTeachersResponse.data.data;

            const availableTeachers = teachersData.filter(
                (teacher: any) =>
                    teacher.teacher._id !== formData.teacher &&
                    !absentTeacherIds.has(teacher.teacher._id)
            );

            // Get absent teacher's timetable for the selected day
            const absentTeacherTimetable = await fetchTimeTable(
                formData.class,
                formData.division,
                formData.academicYear,
                formData.teacher,
                formData.day
            );

            // Get all time slots from API
            const allTimeSlotsResponse = await getTimeSlots(1, 100);
            const allTimeSlots = allTimeSlotsResponse.data.data;

            // Extract the time slots we need to cover and match with allTimeSlots to include timeSlotId
            const slotsToCover = absentTeacherTimetable.data.data.flatMap((timetable: any) =>
                timetable.timeTableSchedule
                    .filter((daySchedule: any) => daySchedule.day === formData.day)
                    .flatMap((daySchedule: any) =>
                        daySchedule.subjects.map((subject: any) => {
                            const matchingTimeSlot = allTimeSlots.find(
                                (timeSlot: any) =>
                                    timeSlot.startTime === subject.startTime &&
                                    timeSlot.endTime === subject.endTime
                            );
                            return {
                                startTime: subject.startTime,
                                endTime: subject.endTime,
                                timeSlotId: matchingTimeSlot ? matchingTimeSlot._id : null 
                            };
                        })
                    )
            );

            // Filter out slots where no matching timeSlotId was found (optional, based on your needs)
            const validSlotsToCover = slotsToCover.filter((slot: { timeSlotId: null; }) => slot.timeSlotId !== null);

            setSlotToCover(validSlotsToCover);

            console.log("slotsToCover", validSlotsToCover);

            // Find available teachers with matching free time slots
            const freeTeachers = [];

            for (const teacher of availableTeachers) {
                // Get teacher's timetable
                const teacherTimetable = await fetchTimeTable(
                    "",
                    "",
                    formData.academicYear,
                    teacher.teacher._id,
                    formData.day
                );

                const teacherBusySlots = teacherTimetable.data.data.flatMap((timetable: any) =>
                    timetable.timeTableSchedule
                        .filter((daySchedule: any) => daySchedule.day === formData.day)
                        .flatMap((daySchedule: any) =>
                            daySchedule.subjects.map((subject: any) => ({
                                startTime: subject.startTime,
                                endTime: subject.endTime
                            }))
                        )
                );

                console.log("teacherBusySlots", teacherBusySlots);

                const hasMatchingFreeSlot = validSlotsToCover.some((slotToCover: { startTime: string; endTime: string; timeSlotId: string }) => {
                    return allTimeSlots.some(timeSlot => {
                        const isSlotFree = !teacherBusySlots.some((busySlot: { startTime: string; endTime: string }) =>
                            isTimeOverlap(busySlot.startTime, busySlot.endTime, timeSlot.startTime, timeSlot.endTime)
                        );

                        return isSlotFree && timeSlot._id === slotToCover.timeSlotId;
                    });
                });
                console.log("hasMatchingFreeSlot", hasMatchingFreeSlot);
                if (hasMatchingFreeSlot) {
                    freeTeachers.push(teacher);
                }
            }

            setFreeTeachers(freeTeachers);

            console.log("freeTeachers", freeTeachers);

            if (freeTeachers.length === 0) {
                setMessage({
                    text: "No available substitute teachers found with matching free time slots",
                    type: "info"
                });
            } else {
                setMessage({
                    text: `Found ${freeTeachers.length} available substitute teachers`,
                    type: "success"
                });
            }

        } catch (error: any) {
            console.error("Error finding free teachers:", error);
            setMessage({
                text: error.message || "Failed to find available teachers",
                type: "error"
            });
            setFreeTeachers([]);
        } finally {
            setIsFetchingFreeTeachers(false);
        }
    };
    // Helper function to check time overlap
    const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const s1 = timeToMinutes(start1);
        const e1 = timeToMinutes(end1);
        const s2 = timeToMinutes(start2);
        const e2 = timeToMinutes(end2);

        return s1 < e2 && e1 > s2;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.academicYear || !formData.startDate || !formData.teacher || !formData.substituteTeacher) {
            setMessage({
                text: "Please fill all required fields",
                type: "error"
            });
            return;
        }

        setIsLoading(true);

        try {
            const substitutionData = {
                academicYear: formData.academicYear,
                date: formData.startDate,
                timeSlot: formData.timeSlot,
                class: formData.class,
                division: formData.division,
                originalTeacher: formData.teacher,
                substituteTeacher: formData.substituteTeacher,
                reason: formData.reason || undefined,
            };

            const response = await createSubstituteTeacher(substitutionData);
            if (response.success) {
                setMessage({
                    text: "Substitute teacher assigned successfully",
                    type: "success"
                });
                // setTimeout(() => navigate("/lookups/substitute-teachers"), 1500);
            } else {
                setMessage({
                    text: response.message || "Failed to assign substitute teacher",
                    type: "error"
                });
            }
        } catch (error: any) {
            console.error("Substitution error:", error);
            setMessage({
                text: error.message || "An error occurred while assigning substitute teacher",
                type: "error"
            });
        } finally {
            setIsLoading(false);
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
        <div className="container mx-auto p-2">
            {/* Message Popup */}
            {message && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage(null)}
                    duration={4000}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Substitute Teacher</h1>
                    <div className="mt-2">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    onClick={() => navigate("/lookups/substitute-teachers")}
                >
                    <TbArrowBackUp size={20} className="mr-2" />
                    Back to List
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <form
                    onSubmit={handleSubmit}
                    className="p-6">
                    <div className="mb-8">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <p className="text-sm text-gray-500">Fill in the details for the substitution</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Academic Year <span className="text-red-500">*</span>
                                </label>
                                <AcademicYearDropdown
                                    value={formData.academicYear}
                                    onChange={(value) => setFormData({ ...formData, academicYear: value })}
                                    required={true}
                                    disabled={false}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
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
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Division <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="division"
                                    value={formData.division}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map((division) => (
                                        <option key={division._id} value={division._id}>
                                            {division.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Day <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <p className="text-sm text-gray-500">Select the session for substitution</p>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                type="button"
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
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${session === 'morning'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
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
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${session === 'afternoon'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                Afternoon Session
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleFilter}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm font-medium flex items-center gap-2"
                        >
                            {session === 'morning'
                                ? 'Find Morning Session Absent Teachers'
                                : session === 'afternoon'
                                    ? 'Find Afternoon Session Absent Teachers'
                                    : 'Find the Absent Teachers'}
                        </button>
                    </div>

                    {/* Teacher Details */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Absent Teacher */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Absent Teacher <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="teacher"
                                    value={formData.teacher}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">
                                        {allAttendance[0]?.halfDayTimes?.firstHalf === 'morning'
                                            ? 'Morning Session Teachers'
                                            : 'Afternoon Session Teachers'}
                                    </option>
                                    {allAttendance.flatMap((attendance) =>
                                        attendance.teachers.map((teacher: any) => (
                                            <option key={teacher.teacher._id} value={teacher.teacher._id}>
                                                {teacher.teacher.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Select the teacher who is absent</p>
                            </div>
                        </div>

                        {/* Available Teachers Table */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Substitute Teacher <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => findFreeTeachers(1, 25)}
                                disabled={!formData.teacher || !formData.day || isFetchingFreeTeachers}
                                className="mb-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                            >
                                {isFetchingFreeTeachers ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Finding...
                                    </>
                                ) : (
                                    "Find Available Teachers"
                                )}
                            </button>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            {[
                                                { name: "Sl No.", width: "w-16" },
                                                { name: "Name" },
                                                { name: "Available Slots" },
                                                { name: "Actions" },
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
                                        {isFetchingFreeTeachers ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                                                    <div className="flex justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : freeTeachers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                                                    No available teachers found
                                                </td>
                                            </tr>
                                        ) : (
                                            freeTeachers.map((teacher, index) => (
                                                <tr key={teacher._id}>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                                                        {teacher.teacher.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        <div className="flex flex-wrap gap-2">
                                                            {slotToCover.map((slot, slotIndex) => {
                                                                const isSelected = formData.substituteTeacher === teacher.teacher._id && formData.timeSlot === slot.timeSlotId;
                                                                return (
                                                                    <button
                                                                        key={`${teacher.teacher._id}_${slotIndex}`}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData({
                                                                                ...formData,
                                                                                substituteTeacher: teacher.teacher._id,
                                                                                timeSlot: slot.timeSlotId 
                                                                            });
                                                                        }}
                                                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border
                        ${isSelected
                                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                                                            }`}
                                                                    >
                                                                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="submit"
                                                            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                                                        >
                                                            Assign Teacher
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Select a time slot for substitution and click Assign Teacher</p>
                        </div>
                    </div>

                    

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <Link to="/lookups/substitute-teachers">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FcCancel size={18} />
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubstituteTeacherAdd;
