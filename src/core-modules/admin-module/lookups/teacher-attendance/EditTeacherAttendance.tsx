import { AttendanceDTO, updateAttendance, fetchAttendance, fetchAttendanceById } from '@/api/admin-api/lookups-api/teachersAttendanceApi'
import { AttendanceStatusType, AttendanceType, Division, fetchAcademicYear, fetchAttendanceStatusDd, fetchAttendanceTypeDd, fetchClasses, fetchDivisionsDD, fetchTeachers, getStudentsByClassDivisionAcademicYear, Student, Teacher } from '@/api/common-api/commonDropDownApi'
import Breadcrumb from '@/components/Breadcumb'
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai'
import { toast } from 'react-toastify'
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import AcademicYearDropdown from '@/components/AcademicYearDropdown'
import { useNavigate, useParams } from 'react-router-dom'

interface PeriodwiseField {
    period: number;
    time: string;
    subject: string;
    teacher: string;
}

interface AttendanceMarked {
    morning: boolean;
    afternoon: boolean;
}

interface TeacherAttendance {
    teacher: {
        _id: string;
        rollNumber: string;
        firstName: string;
        lastName: string;
    };
    rollNumber: string;
    firstName: string;
    lastName: string;
    firstHalfStatus: AttendanceStatusType | null;
    secondHalfStatus: AttendanceStatusType | null;
    remarks: string;
    _id: string;
}

interface AttendanceRecord {
    _id: string;
    halfDayTimes?: {
        firstHalf?: string;
        secondHalf?: string;
    };
    academicYear: {
        _id: string;
        academicYear: string;
    };
    class: {
        _id: string;
        name: string;
    };
    division: {
        _id: string;
        name: string;
    };
    attendanceType: {
        _id: string;
        name: string;
        nameAlias: string;
    } | null;
    date: string;
    teachers: TeacherAttendance[];
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface StatusMap {
    [key: string]: any;
}

interface RemarksMap {
    [key: string]: string;
}
interface AttendanceStatus {
    _id: string;
    name: string;
    nameAlias: string;
}



const EditTeacherAttendance: React.FC = () => {
    const ATTENDANCE_TYPE_MAP = {
        FULL_DAY: 'fullday',
        HALF_DAY: 'halfday',
        PERIODWISE: 'periodwise'
    };

    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [attendanceTypes, setAttendanceTypes] = useState<AttendanceType[]>([]);
    const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceStatusType[]>([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [teacherStatusMap, setTeacherStatusMap] = useState<any>({});
    const [updateteacherListId, setUpdateteacherListId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        academicYear: "",
        class: "",
        division: "",
        attendanceType: "",
        date: "",
        halfDayTimes: {
            firstHalf: "morning",
            secondHalf: "",
        },
        periodwiseFields: [] as PeriodwiseField[]
    });
    console.log("teacherStatusMap", teacherStatusMap);
    const [attendanceList, setAttendanceList] = useState<Teacher[]>([]);
    const [existingAttendance, setExistingAttendance] = useState<AttendanceRecord[]>([]);
    const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

    const [attendanceMarked, setAttendanceMarked] = useState<AttendanceMarked>({
        morning: false,
        afternoon: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const teacherIdsArray = Object.keys(teacherStatusMap);
    const teacherIdsString = teacherIdsArray.join(", ");

    console.log("teacher IDs in teacherStatusMap:", teacherIdsString);
    console.log("Array of teacher IDs:", teacherIdsArray);
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Edit Attendance Marking", path: "" },
    ];

    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [academicYearData, classesData, divisionsData, attendanceTypeData, attendanceStatusData] = await Promise.all([
                    fetchAcademicYear(),
                    fetchClasses(),
                    fetchDivisionsDD(),
                    fetchAttendanceTypeDd(),
                    fetchAttendanceStatusDd()
                ]);
                setAcademicYears(academicYearData.data);
                setClasses(classesData.data);
                setDivisions(divisionsData.data);
                setAttendanceTypes(attendanceTypeData.data);
                setAttendanceStatuses(attendanceStatusData.data);
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


    const loadTeacherData = async () => {
        // if (!formData.class || !formData.division || !formData.academicYear) {
        //     return; 
        // }

        // setIsLoading(true);
        // setError(null);
        try {
            const response = await fetchTeachers(

            );
            setAttendanceList(response.data || []);
        } catch (err: any) {
            console.error("Failed to fetch teachers", err);
            setError(err.message || "Failed to fetch teachers");
            setAttendanceList([]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        loadTeacherData();
    }, [formData.class, formData.division, formData.academicYear]);

    useEffect(() => {
        const fetchAttendanceDataById = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchAttendanceById(id);
                const data = response.data;

                setAttendanceData(data);

                setFormData(prev => ({
                    ...prev,
                    academicYear: data.academicYear._id,
                    date: data.date.split('T')[0],
                    attendanceType: data.attendanceType._id,
                    halfDayTimes: {
                        firstHalf: data.halfDayTimes?.firstHalf || '',
                        secondHalf: data.halfDayTimes?.secondHalf || ''
                    },
                    periodwiseFields: data.periodwise || []
                }));

                if (data.halfDayTimes?.firstHalf === 'morning') {
                    setAttendanceMarked(prev => ({ ...prev, morning: true }));
                }
                if (data.halfDayTimes?.secondHalf === 'afternoon') {
                    setAttendanceMarked(prev => ({ ...prev, afternoon: true }));
                }

                const initialStatusMap: StatusMap = {};
                const initialRemarksMap: RemarksMap = {};

                data.teachers.forEach((teacher: { firstHalfStatus: any; teacher: { _id: string | number }; remarks: string }) => {
                    if (teacher.firstHalfStatus) {
                        initialStatusMap[teacher.teacher._id] = teacher.firstHalfStatus;
                    }
                    if (teacher.remarks) {
                        initialRemarksMap[teacher.teacher._id] = teacher.remarks;
                    }
                });
                data.teachers.forEach((teacher: { secondHalfStatus: any; teacher: { _id: string | number }; remarks: string }) => {
                    if (teacher.secondHalfStatus) {
                        initialStatusMap[teacher.teacher._id] = teacher.secondHalfStatus;
                    }
                    if (teacher.remarks) {
                        initialRemarksMap[teacher.teacher._id] = teacher.remarks;
                    }
                });

                setTeacherStatusMap(initialStatusMap);
                setRemarksMap(initialRemarksMap);

            } catch (error) {
                console.error("Failed to fetch attendance data", error);
                setError("Failed to fetch attendance data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendanceDataById();
    }, [id]);



    const handleAttendanceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const type = attendanceTypes.find(t => t._id === selectedId);

        setFormData({
            ...formData,
            attendanceType: selectedId,
            halfDayTimes: { firstHalf: "", secondHalf: "" },
            periodwiseFields: []
        });
    };



    const handleSingleSelect = (teacherId: string | number, status: AttendanceStatusType) => {
        setTeacherStatusMap((prev: any) => ({
            ...prev,
            [teacherId]: prev[teacherId]?._id === status._id ? null : status,
        }));
    };



    const getCurrentAttendanceType = () => {
        return attendanceTypes.find(t => t._id === formData.attendanceType);
    };

    const handleHalfDayChange = (half: 'morning' | 'afternoon') => {
        setFormData(prev => ({
            ...prev,
            halfDayTimes: {
                firstHalf: half === 'morning' ? 'morning' : '',
                secondHalf: half === 'afternoon' ? 'afternoon' : ''
            }
        }));
    };
    const [message, setMessage] = useState<{
        text: string;
        type: MessageType;
    } | null>(null);


    const handleSubmit = async () => {
        const selectedType = attendanceTypes.find(t => t._id === formData.attendanceType);
        if (!selectedType) {
            setMessage({ text: "Invalid attendance type selected", type: "error" });
            return;
        }

        const submissionData: AttendanceDTO = {
            teachers: attendanceList.map(teacher => {
                const baseData = {
                    teacher: teacher._id,
                    code: teacher.code,
                    remarks: remarksMap[teacher._id] || "",
                }

                if (selectedType.nameAlias === ATTENDANCE_TYPE_MAP.HALF_DAY) {
                    return {
                        ...baseData,
                        fullDayStatus: undefined,
                        ...(formData.halfDayTimes.firstHalf === 'morning' && {
                            firstHalfStatus: teacherStatusMap[teacher._id]?._id || '',
                            secondHalfStatus: undefined
                        }),
                        ...(formData.halfDayTimes.secondHalf === 'afternoon' && {
                            firstHalfStatus: undefined,
                            secondHalfStatus: teacherStatusMap[teacher._id]?._id || ''
                        })
                    }
                } else {
                    return {
                        ...baseData,
                        fullDayStatus: teacherStatusMap[teacher._id]?._id || '',
                        firstHalfStatus: undefined,
                        secondHalfStatus: undefined,
                    }
                }
            }),
            ...(editingRecordId && { _id: editingRecordId }),
            createdBy: '',
            data: undefined,
            academicYear: '',
            attendanceType: '',
            date: ''
        };

        try {
            const response = await updateAttendance(id!, submissionData);

            if (response.success) {
                toast.success(response.message);


            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to update grade");
            console.error(error);
        }
    };

    const bothMarked = attendanceMarked.morning && attendanceMarked.afternoon;

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
            <div className="flex flex-col md:flex-row justify-start items-center px-1 mb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Edit Attendance Marking</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                {/* Academic Year Dropdown */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Academic Year <span className="text-red-500">*</span>
                    </label>
                    <AcademicYearDropdown
                        value={formData.academicYear}
                        onChange={() => { }}
                        disabled
                        required={true}
                    />
                </div>

                {/* Class Dropdown */}
                {/* <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Class <span className="text-red-500">*</span>
                    </label>
                    <select
                        style={{ padding: "10.5px" }}
                        value={formData.class}
                        onChange={() => { }}
                        disabled
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div> */}

                {/* Division Dropdown */}
                {/* <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Division <span className="text-red-500">*</span>
                    </label>
                    <select
                        style={{ padding: "10.5px" }}
                        value={formData.division}
                        onChange={() => { }}
                        disabled
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                            <option key={division._id} value={division._id}>
                                {division.name}
                            </option>
                        ))}
                    </select>
                </div> */}

                {/* Date Input */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={() => { }}
                        disabled
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ padding: "10.5px" }}
                        required
                    />
                </div>

                {/* Attendance Type Dropdown */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Attendance Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.attendanceType}
                        onChange={handleAttendanceTypeChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                        style={{ padding: "10.5px" }}
                        required
                    >
                        <option value="">Select Type</option>
                        {attendanceTypes.slice(1, 2).map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>


            </div>

            {/* Half Day Fields */}

            <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">Selected Half Day</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Show ONLY Morning Option if marked */}
                    {attendanceMarked.morning ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">First Half</label>
                            <div className="flex items-center p-4 space-x-3 min-h-[100px] border-2 border-blue-300 rounded-lg bg-blue-50">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <span className="block font-medium text-gray-800">Morning</span>
                                    <span className="block text-xs text-gray-500 mt-1">8:00 AM - 12:00 PM</span>

                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Show ONLY Afternoon Option if marked */}
                    {attendanceMarked.afternoon ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Second Half</label>
                            <div className="flex items-center p-4 space-x-3 min-h-[100px] border-2 border-blue-300 rounded-lg bg-blue-50">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <span className="block font-medium text-gray-800">Afternoon</span>
                                    <span className="block text-xs text-gray-500 mt-1">1:00 PM - 5:00 PM</span>

                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Show selection options ONLY if nothing is marked */}
                    {!attendanceMarked.morning && !attendanceMarked.afternoon && (
                        <>
                            {/* Morning Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">First Half</label>
                                <label className={`flex items-center p-4 space-x-3 min-h-[100px] border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.halfDayTimes?.firstHalf === 'morning' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className={`p-2 rounded-full ${formData.halfDayTimes?.firstHalf === 'morning' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-medium text-gray-800">Morning</span>
                                        <span className="block text-xs text-gray-500 mt-1">8:00 AM - 12:00 PM</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="halfDay"
                                        value="morning"
                                        checked={formData.halfDayTimes?.firstHalf === 'morning'}
                                        onChange={() => handleHalfDayChange('morning')}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Afternoon Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Second Half</label>
                                <label className={`flex items-center p-4 space-x-3 min-h-[100px] border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.halfDayTimes?.secondHalf === 'afternoon' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className={`p-2 rounded-full ${formData.halfDayTimes?.secondHalf === 'afternoon' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-medium text-gray-800">Afternoon</span>
                                        <span className="block text-xs text-gray-500 mt-1">1:00 PM - 5:00 PM</span>
                                    </div>
                                    <input
                                        type="radio"
                                        name="halfDay"
                                        value="afternoon"
                                        checked={formData.halfDayTimes?.secondHalf === 'afternoon'}
                                        onChange={() => handleHalfDayChange('afternoon')}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </>
                    )}
                </div>
            </div>


            {/* Attendance Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {[
                                { name: "Sl No.", width: "w-16" },
                                { name: "Roll No." },
                                { name: "Name" },
                                { name: "Attendance" },
                                { name: "Remarks" }
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
                        {attendanceList.map((teacher, index) => (
                            <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {teacher.code}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {teacher.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-2">
                                        {attendanceStatuses.map((status) => {
                                            const isSelected = teacherStatusMap[teacher._id]?._id === status._id;
                                            const isAbsent = status.name.toLowerCase() === 'absent';

                                            return (
                                                <button
                                                    key={`${teacher._id}_${status._id}`}
                                                    type="button"
                                                    onClick={() => handleSingleSelect(teacher._id, status)}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border
                                    ${isSelected
                                                            ? isAbsent
                                                                ? 'bg-red-600 text-white border-red-600'
                                                                : 'bg-green-600 text-white border-green-600'
                                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {status.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {teacherStatusMap[teacher._id]?.name.toLowerCase() === 'absent' && (
                                        <input
                                            type="text"
                                            className="border p-1 rounded w-full"
                                            value={remarksMap[teacher._id] || ''}
                                            onChange={(e) =>
                                                setRemarksMap((prev) => ({
                                                    ...prev,
                                                    [teacher._id]: e.target.value,
                                                }))
                                            }
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => navigate(`/teacher-managements/teachers-attendance`)}
                    className="px-6 py-2 me-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className={`px-6 py-2 me-2 rounded ${formData.date &&
                            formData.attendanceType

                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                    disabled={
                        !(
                            formData.date &&
                            formData.attendanceType)

                    }

                >
                    Update Attendance
                </button>
            </div>
        </div>
    );
};

export default EditTeacherAttendance;