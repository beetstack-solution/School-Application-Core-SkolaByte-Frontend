import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcumb';
import dragimg from "@/assets/images/drag.gif";
import React from 'react';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import { AcademicYear, Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, fetchSubjects, fetchTeachers, fetchTeacherSubjects, subjects } from '@/api/common-api/commonDropDownApi';
import { getTimeSlots } from '@/api/admin-api/lookups-api/timeSlotApi';
import { fetchTimeTableById, UpdateTimeTable } from '@/api/admin-api/lookups-api/timeTableApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
            const response:any = await fetchTimeTableById(id);
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
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: string, timeDisplay: string) => {
        e.preventDefault();
        if (!draggedItem || timeDisplay.includes('Break')) return;

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
                                                    className={`relative border p-2 h-24 text-center ${slot.isBreak ? 'bg-yellow-100 text-sm italic text-gray-600' :
                                                        slotData ? 'bg-green-50 hover:bg-green-100' : 'bg-white hover:bg-gray-50'
                                                        } ${editingSlot === slotKey ? 'ring-2 ring-blue-500' : ''}`}
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
                                                                {teacherSubjects.map(subject => (
                                                                    <option key={subject._id} value={subject._id}>
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