import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcumb';
import dragimg from "@/assets/images/drag.gif";
import React from 'react';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import { AcademicYear, Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, fetchSubjects, fetchTeachers, fetchTeacherSubjects, subjects } from '@/api/common-api/commonDropDownApi';
import { getTimeSlots } from '@/api/admin-api/lookups-api/timeSlotApi';
import { fetchTimeTable, fetchTimeTableById, UpdateTimeTable } from '@/api/admin-api/lookups-api/timeTableApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';


// Define types
interface Subject {
    _id: string;
    id: string;
    name: string;
    class?: string;
    division?: string;
    teacher?: string;
    teacherName?: string;
}


interface Assignment {
    class: string;
    division: string;
    subjects: Subject[];
}


interface TeacherAssignment {
    teacher: string;
    teacherName: string;
    academicYear: string;
    isClassTeacher: boolean;
    classTeacherOf: {
        class: string;
        division: string;
    };
    assignments: Assignment[];
}


interface TimetableSlot {
    [key: string]: Subject | undefined;
}


interface TimeSlot {
    id: string;
    display: string;
    startTime: string;
    endTime: string;
    isBreak: boolean;
}


function EditClassTimeTable() {
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Class Timetable", path: "" },
    ];
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allSubjects, setAllSubjects] = useState<subjects[]>([]);
    const [teacherSubjects, setTeacherSubjects] = useState<Subject[]>([]);
    const [timeSlotsData, setTimeSlotsData] = useState<any[]>([]);
    const [timetable, setTimetable] = useState<TimetableSlot>({});
    const [draggedItem, setDraggedItem] = useState<Subject | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const [editingSlot, setEditingSlot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTimetableLoading, setIsTimetableLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Subject | null>(null);
    const [assignedTeacher, setAssignedTeacher] = useState<any[]>([]);
    const [teacherAvailability, setTeacherAvailability] = useState<any[]>([]);
    const [hoveredSlot, setHoveredSlot] = useState<{ day: string, timeDisplay: string } | null>(null);


    const [formData, setFormData] = useState({
        academicYear: '',
        class: '',
        division: '',
    });


    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 20000);
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [academicYearData, classesData, divisionsData, teachersData, subjectsData, timeSlotsResponse] = await Promise.all([
                    fetchAcademicYear(),
                    fetchClasses(),
                    fetchDivisionsDD(),
                    fetchTeachers(),
                    fetchSubjects(),
                    getTimeSlots(0, 0)
                ]);


                setAcademicYears(academicYearData.data);
                setTeachers(teachersData.data);
                setClasses(classesData.data);
                setAllSubjects(subjectsData.data);
                setDivisions(divisionsData.data);
                setTimeSlotsData(timeSlotsResponse.data.data);


                if (id) {
                    await getTimetableById(id);
                }


                setInitialized(true);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load data:", error);
                setIsLoading(false);
            }
        };


        fetchInitialData();
    }, [id]);
    const getTeacherThatSubjectAlreadyAssigned = async () => {
        try {
            const response = await fetchTimeTable("", "", "", "", "");
            const timetables: any[] = response.data?.data || [];


            const schedule = timetables.flatMap((timetable: any) => {
                if (!timetable.timeTableSchedule) return [];


                return timetable.timeTableSchedule.flatMap((daySchedule: any) => {
                    if (!daySchedule.subjects) return [];


                    return daySchedule.subjects.map((subjectSlot: any) => ({
                        day: daySchedule.day,
                        class: timetable.class?.name || 'N/A',
                        division: timetable.division?.name || 'N/A',
                        subjectId: subjectSlot.subject?._id,
                        subjectName: subjectSlot.subject?.name,
                        teacherId: subjectSlot.teacher?._id,
                        teacherName: subjectSlot.teacher?.name,
                        startTime: subjectSlot.startTime,
                        endTime: subjectSlot.endTime
                    }));
                });
            });


            setAssignedTeacher(schedule);
        } catch (error) {
            console.error("Error processing timetable data:", error);
            setAssignedTeacher([]);
        }
    };


    useEffect(() => {
        getTeacherThatSubjectAlreadyAssigned();
    }, []);
    useEffect(() => {
        if (initialized && id && timeSlotsData.length > 0 && formData.class && formData.division) {
            const loadTimetableData = async () => {
                try {
                    setIsTimetableLoading(true);
                    const response = await fetchTimeTableById(id);
                    const timetableData = response.data;


                    const formattedTimeSlots = formatTimeSlots();
                    const initializedTimetable = initializeTimetable(
                        timetableData.timeTableSchedule,
                        formattedTimeSlots
                    );


                    setTimetable(initializedTimetable);
                } catch (error) {
                    console.error("Failed to load timetable:", error);
                } finally {
                    setIsTimetableLoading(false);
                }
            };


            loadTimetableData();
        }
    }, [initialized, timeSlotsData, formData.class, formData.division, id]);;
    const getTeacherSubjects = async (classId: string, divisionId: string) => {
        try {
            const response = await fetchTeacherSubjects(classId, divisionId);
            const { assignments } = response.data;


            const transformedSubjects = assignments.flatMap((assignment: any) =>
                assignment.subjects.map((subject: any) => ({
                    ...subject,
                    id: subject._id,
                    class: classId,
                    division: divisionId,
                    teacher: assignment.teacher._id,
                    teacherName: assignment.teacher.name,
                }))
            );


            setTeacherSubjects(transformedSubjects);
        } catch (error) {
            console.error("Failed to fetch teacher subjects:", error);
        }
    };
    const getAvailableTeachersForSlot = (day: string, timeDisplay: string) => {
        // Find the time slot details
        const timeSlot = formattedTimeSlots.find(slot =>
            slot.display === timeDisplay ||
            `${slot.startTime}-${slot.endTime}` === timeDisplay
        );

        if (!timeSlot) return teacherSubjects;

        return teacherSubjects.filter(subject => {
            // Check if teacher is already assigned during this time
            const isTeacherAssigned = assignedTeacher.some((assignment: any) => {
                return (
                    assignment.day === day &&
                    assignment.teacherId === subject.teacher &&
                    assignment.subjectId === subject._id &&
                    (
                        (timeSlot.startTime >= assignment.startTime && timeSlot.startTime < assignment.endTime) ||
                        (timeSlot.endTime > assignment.startTime && timeSlot.endTime <= assignment.endTime) ||
                        (timeSlot.startTime <= assignment.startTime && timeSlot.endTime >= assignment.endTime)
                    )
                );
            });

            return !isTeacherAssigned;
        });
    };


    const showTeacherAvailability = (subject: Subject) => {
        setSelectedTeacher(subject);


        // Calculate available slots for this teacher (only unused slots)
        const availability: any[] = days.map(day => {
            // Get all slots where this teacher is not assigned AND the slot isn't already used
            const availableSlots = formattedTimeSlots.filter(slot => {
                if (slot.isBreak) return false;


                // Check if teacher is already assigned in this day/time
                const isTeacherAssigned = assignedTeacher.some(assignment => {
                    return (
                        assignment.day === day &&
                        assignment.teacherId === subject.teacher &&

                        (
                            (slot.startTime >= assignment.startTime && slot.startTime < assignment.endTime) ||
                            (slot.endTime > assignment.startTime && slot.endTime <= assignment.endTime) ||
                            (slot.startTime <= assignment.startTime && slot.endTime >= assignment.endTime)
                        )
                    );
                });


                // Check if this slot is already used in the current timetable
                const isSlotUsed = Object.keys(timetable).some(key => {
                    const [tDay, tTimeDisplay] = key.split('-');
                    return (
                        tDay === day &&
                        (tTimeDisplay === slot.display || tTimeDisplay === `${slot.startTime}-${slot.endTime}`)
                    );
                });


                return !isTeacherAssigned && !isSlotUsed;
            });


            return {
                day,
                availableSlots
            };
        });


        setTeacherAvailability(availability);
    };
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, subject: Subject) => {
        setDraggedItem(subject);
        e.dataTransfer.setData('text/plain', JSON.stringify(subject));
        e.dataTransfer.effectAllowed = 'move';
    };


    const formatTimeSlots = (): TimeSlot[] => {
        if (!timeSlotsData || timeSlotsData.length === 0) return [];


        // Sort by start time
        const sortedSlots = [...timeSlotsData].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );


        return sortedSlots.map(slot => ({
            id: slot._id,
            display: `${slot.startTime}-${slot.endTime}${slot.isBreak ? ' - Break' : ''}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBreak: slot.isBreak
        }));
    };


    const initializeTimetable = (schedule: any[], timeSlots: TimeSlot[]): TimetableSlot => {
        const newTimetable: TimetableSlot = {};


        schedule?.forEach(daySchedule => {
            const day = daySchedule.day;


            daySchedule.subjects?.forEach((subjectItem: any) => {
                if (!subjectItem?.subject || !subjectItem?.teacher) return;


                // Find the matching time slot
                const timeSlot = timeSlots.find(slot =>
                    slot.startTime === subjectItem.startTime &&
                    slot.endTime === subjectItem.endTime
                );


                if (timeSlot) {
                    const slotKey = `${day}-${timeSlot.display}`;


                    newTimetable[slotKey] = {
                        _id: subjectItem.subject._id,
                        id: subjectItem.subject._id,
                        name: subjectItem.subject.name,
                        teacher: subjectItem.teacher._id,
                        teacherName: subjectItem.teacher.name,
                        class: formData.class,
                        division: formData.division
                    };
                }
            });
        });


        return newTimetable;
    };


    useEffect(() => {
        console.log('Timetable state updated:', timetable);
    }, [timetable]);


    useEffect(() => {
        console.log('TimeSlotsData updated:', timeSlotsData);
    }, [timeSlotsData]);
    const getTimetableById = async (id: string) => {
        try {
            const response: any = await fetchTimeTableById(id);
            const timetableData = response.data;


            setFormData({
                academicYear: timetableData.academicYear.id,
                class: timetableData.class.id,
                division: timetableData.division.id,
            });


            await getTeacherSubjects(timetableData.class.id, timetableData.division.id);
        } catch (error) {
            console.error("Failed to fetch timetable:", error);
        }
    };




    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: string, timeDisplay: string) => {
        if (timeDisplay.includes('Break')) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setHoveredSlot({ day, timeDisplay });
    };
    const isSlotValidForDrop = (day: string, timeDisplay: string, subject: Subject | null) => {
        if (!subject || timeDisplay.includes('Break')) return false;


        const timeSlot = formattedTimeSlots.find(slot =>
            slot.display === timeDisplay ||
            `${slot.startTime}-${slot.endTime}` === timeDisplay
        );


        if (!timeSlot) return false;


        const isTeacherAlreadyAssigned = assignedTeacher.some((assignment: any) => {
            return (
                assignment.day === day &&
                assignment.teacherId === subject.teacher &&
                assignment.subjectId === subject._id &&
                (
                    (timeSlot.startTime >= assignment.startTime && timeSlot.startTime < assignment.endTime) ||
                    (timeSlot.endTime > assignment.startTime && timeSlot.endTime <= assignment.endTime) ||
                    (timeSlot.startTime <= assignment.startTime && timeSlot.endTime >= assignment.endTime)
                )
            );
        });


        return !isTeacherAlreadyAssigned;
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: string, timeDisplay: string) => {
        e.preventDefault();
        setHoveredSlot(null);
        if (!draggedItem || timeDisplay.includes('Break')) return;

        const timeSlot = formattedTimeSlots.find(slot =>
            slot.display === timeDisplay ||
            `${slot.startTime}-${slot.endTime}` === timeDisplay
        );

        if (!timeSlot) return;

        if (!isSlotValidForDrop(day, timeDisplay, draggedItem)) {
            toast.info(
                <span>
                    This teacher <b>{draggedItem.teacherName}</b> is already assigned to another class during <b>{timeDisplay}</b> on <b>{day}</b>.
                </span>
            );
            return;
        }

        const slotKey = `${day}-${timeDisplay}`;
        setTimetable(prev => ({
            ...prev,
            [slotKey]: draggedItem
        }));
    };


    const handleEditSlot = (slotKey: string) => {
        setEditingSlot(slotKey);
    };


    const handleClearSlot = (slotKey: string) => {
        setTimetable(prev => {
            const newTimetable = { ...prev };
            delete newTimetable[slotKey];
            return newTimetable;
        });
    };


    const handleSubjectChange = (slotKey: string, subjectId: string) => {
        const selectedSubject = teacherSubjects.find(subj => subj._id === subjectId);
        if (selectedSubject) {

            setTimetable(prev => ({
                ...prev,
                [slotKey]: selectedSubject
            }));
        }
        setEditingSlot(null);
    };


    const handleFormDataChange = async (field: string, value: string) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);


        if (['class', 'division'].includes(field) && newFormData.class && newFormData.division) {
            await getTeacherSubjects(newFormData.class, newFormData.division);
        }
    };


    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    const formattedTimeSlots = formatTimeSlots();
    const timeTableData = {
        academicYear: formData.academicYear,
        class: formData.class,
        division: formData.division,
        timeTableSchedule: days.map(day => ({
            day,
            subjects: formattedTimeSlots.map(slot => {
                const slotKey = `${day}-${slot.display}`;
                const subjectData = timetable[slotKey];
                return subjectData ? {
                    subject: subjectData._id,
                    teacher: subjectData.teacher,
                    timeSlot: slot.id
                } : null;
            }).filter(Boolean)
        }))
    }
    console.log("Time Table Data day:", timeTableData);




    const prepareTimetableData = () => {
        const timeTableSchedule = days.map(day => {
            // Get all subjects for this day
            const daySubjects = Object.entries(timetable)
                .filter(([key]) => key.startsWith(`${day}-`))
                .map(([key, subjectData]) => {
                    const timeDisplay = key.replace(`${day}-`, '');
                    const timeSlot = formattedTimeSlots.find(slot => slot.display === timeDisplay);


                    return {
                        subject: subjectData?._id || '',
                        teacher: subjectData?.teacher || '',
                        startTime: timeSlot?.startTime || '',
                        endTime: timeSlot?.endTime || '',
                        timeSlot: timeSlot?.id || ''
                    };
                });


            return {
                day,
                subjects: daySubjects.filter(subj => subj.subject && subj.teacher)
            };
        });


        return {
            academicYear: formData.academicYear,
            class: formData.class,
            division: formData.division,
            timeTableSchedule
        };
    };


    const handleSaveTimetable = async () => {
        if (!formData.academicYear || !formData.class || !formData.division) {
            alert("Please select academic year, class, and division before saving");
            return;
        }


        const timetableData = prepareTimetableData();


        try {
            if (id) {
                const response = await UpdateTimeTable(id, timetableData);
                toast.success(response.message || "Timetable updated successfully!");
            }
            navigate("/lookups/time-tables")
        } catch (error) {
            console.error("Failed to save timetable:", error);
            alert("Failed to save timetable. Please try again.");
        }
    };


    if (isLoading) {
        return <div className="text-center py-10">Loading initial data...</div>;
    }


    if (isTimetableLoading) {
        return <div className="text-center py-10">Loading timetable data...</div>;
    }


    const assignFromModal = (day: string, slot: TimeSlot) => {
        if (!selectedTeacher) return;

        const slotKey = `${day}-${slot.display}`;
        setTimetable(prev => ({
            ...prev,
            [slotKey]: selectedTeacher
        }));

        // Update availability in the modal
        setTeacherAvailability(prev =>
            prev.map(dayAvailability => {
                if (dayAvailability.day === day) {
                    return {
                        ...dayAvailability,
                        availableSlots: dayAvailability.availableSlots.filter((s: any) => s.id !== slot.id)
                    };
                }
                return dayAvailability;
            })
        );
    };
    return (
        <>
            {/* {(isLoading || isTimetableLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        {isLoading ? 'Loading initial data...' : 'Loading timetable...'}
                    </div>
                </div>
            )} */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{id ? 'Edit' : 'Create'} Class Time Table</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Academic Year <span className="text-red-500">*</span>
                        </label>
                        <AcademicYearDropdown
                            value={formData.academicYear}
                            onChange={(value) => handleFormDataChange('academicYear', value)}
                            required={true}
                            disabled={true}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.class}
                            onChange={(e) => handleFormDataChange('class', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={true}
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Division <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.division}
                            onChange={(e) => handleFormDataChange('division', e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={true}
                        >
                            <option value="">Select Division</option>
                            {divisions.map((division) => (
                                <option key={division._id} value={division._id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                {/* {showIntro && (
                    <div className="fixed top-5 right-5 w-full max-w-sm z-50 transition-transform transform-gpu duration-500 ease-out animate-slide-in bg-blue-50 border border-blue-300 rounded-md shadow-md p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                                <img src={dragimg} alt="Drag icon" width={40} className="mt-1" />
                                <div>
                                    <h3 className="text-md font-semibold text-blue-800 mb-1">Quick Guide</h3>
                                    <p className="text-sm text-gray-700 leading-snug">
                                        Drag a subject from the sidebar and drop it into a time slot.
                                        You can also click on a slot to edit it.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowIntro(false)}
                                className="text-blue-600 hover:text-blue-800 ml-3 text-xl leading-none font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )} */}


                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-4">Subjects & Teachers</h3>
                        <div className="space-y-2 overflow-y-auto max-h-[calc(125vh-200px)]"> {/* Added scrollable container */}
                            {teacherSubjects.map(subject => (
                                <div
                                    key={`${subject.id}-${subject.teacher}`}
                                    draggable
                                    onClick={() => showTeacherAvailability(subject)}
                                    onDragStart={(e) => handleDragStart(e, subject)}
                                    className="p-3 mb-2 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
                                >
                                    <div className="font-medium">{subject.name}</div>
                                    <div className="text-xs text-gray-600">Teacher: {subject.teacherName}</div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Timetable */}
                    <div className="flex-1 overflow-auto">
                        <div className="grid grid-cols-7 gap-1">
                            <div className="font-semibold p-2"></div>
                            {days.map(day => (
                                <div key={day} className="font-semibold p-2 text-center">{day}</div>
                            ))}


                            {formattedTimeSlots.map(slot => {
                                return (
                                    <React.Fragment key={slot.id}>
                                        <div className={`font-semibold p-2 ${slot.isBreak ? 'text-yellow-600 italic' : ''}`}>
                                            {slot.display}
                                        </div>
                                        {days.map(day => {
                                            const slotKey = `${day}-${slot.display}`;
                                            const slotData = timetable[slotKey];


                                            return (
                                                <div
                                                    key={`${day}-${slot.id}`}
                                                    onDragOver={(e) => handleDragOver(e, day, slot.display)}
                                                    onDrop={(e) => handleDrop(e, day, slot.display)}
                                                    onClick={() => !slot.isBreak && setEditingSlot(slotKey)}
                                                    className={`border p-2 h-24 text-center relative ${slot.isBreak
                                                        ? 'bg-yellow-100 text-sm italic text-gray-600'
                                                        : hoveredSlot?.day === day && hoveredSlot?.timeDisplay === slot.display
                                                            ? isSlotValidForDrop(day, slot.display, draggedItem)
                                                                ? 'bg-green-100 border-2 border-green-500'
                                                                : 'bg-red-100 border-2 border-red-500'
                                                            : slotData
                                                                ? 'bg-green-50'
                                                                : 'bg-white'
                                                        }`}
                                                >
                                                    {slot.isBreak ? (
                                                        <span>Break</span>
                                                    ) : editingSlot === slotKey ? (
                                                        <div className="flex flex-col h-full">
                                                            <select
                                                                value={slotData?._id || ''}
                                                                onChange={(e) => handleSubjectChange(slotKey, e.target.value)}
                                                                className="flex-grow p-1 border rounded mb-1 text-sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <option value="">Select Subject</option>
                                                                {getAvailableTeachersForSlot(day.split('-')[0], slot.display).map(subject => (
                                                                    <option
                                                                        key={subject._id}
                                                                        value={subject._id}
                                                                        className={subject._id === slotData?._id ? 'font-bold' : ''}
                                                                    >
                                                                        {subject.name} ({subject.teacherName})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleClearSlot(slotKey);
                                                                    setEditingSlot(null);
                                                                }}
                                                                className="text-xs text-red-600 hover:text-red-800"
                                                            >
                                                                Clear
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Add time display at the top of each cell */}
                                                            <div className="text-xs text-gray-500 font-medium mb-1">
                                                                {slot.startTime} - {slot.endTime}
                                                            </div>
                                                            {slotData && (
                                                                <>
                                                                    <div className="text-sm">
                                                                        <div className="font-medium">{slotData.name}</div>
                                                                        <div className="text-xs text-gray-600">Teacher: {slotData.teacherName}</div>
                                                                    </div>
                                                                    <div className="absolute bottom-1 right-1 flex space-x-1">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditSlot(slotKey);
                                                                            }}
                                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleClearSlot(slotKey);
                                                                            }}
                                                                            className="text-xs text-red-600 hover:text-red-800"
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {selectedTeacher && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Availability for {selectedTeacher.teacherName} - {selectedTeacher.name}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {teacherAvailability.map(({ day, availableSlots }) => (
                                    <div key={day} className="border rounded-lg p-4">
                                        <h4 className="font-medium text-center mb-3">{day}</h4>
                                        {availableSlots.length > 0 ? (
                                            <div className="space-y-2">
                                                {availableSlots.map((slot: any) => (
                                                    <div
                                                        key={`${day}-${slot.id}`}
                                                        className="flex justify-between items-center p-2 bg-blue-50 rounded"
                                                    >
                                                        <span>{slot.display}</span>
                                                        <button
                                                            onClick={() => assignFromModal(day, slot)}
                                                            className="p-1 text-green-600 hover:text-green-800"
                                                            title="Assign to this slot"
                                                        >
                                                            <MdAdd className="text-xl" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center">No available slots</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-[#5c8360] text-white rounded hover:bg-[#4f6f52]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveTimetable}
                        className="px-4 py-2 bg-[#5c8360] text-white rounded hover:bg-[#4f6f52] ml-4"
                    >
                        {id ? 'Update' : 'Save'} Timetable
                    </button>
                </div>


            </div>
        </>
    );
}


export default EditClassTimeTable;

