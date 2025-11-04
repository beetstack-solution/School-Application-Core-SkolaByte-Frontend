import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Breadcrumb from '@/components/Breadcumb';
import dragimg from "@/assets/images/drag.gif";
import React from 'react';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import { AcademicYear, Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, fetchSubjects, fetchTeachers, fetchTeacherSubjects, subjects } from '@/api/common-api/commonDropDownApi';
import { getTimeSlots } from '@/api/admin-api/lookups-api/timeSlotApi';
import { createTimetable, fetchTimeTable } from '@/api/admin-api/lookups-api/timeTableApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdAdd } from 'react-icons/md';

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

interface TeacherAvailability {
  day: string;
  availableSlots: TimeSlot[];
}

function ClassTimetable() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Class Timetable", path: "" },
  ];
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
  const [assignedTeacher, setAssignedTeacher] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    academicYear: '',
    class: '',
    division: '',
  });
  const [hoveredSlot, setHoveredSlot] = useState<{ day: string, timeDisplay: string } | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Subject | null>(null);
  const [teacherAvailability, setTeacherAvailability] = useState<TeacherAvailability[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 10200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearData, classesData, divisionsData, teachersData, subjectsData] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),
          fetchTeachers(),
          fetchSubjects()
        ]);
        setAcademicYears(academicYearData.data);
        setTeachers(teachersData.data);
        setClasses(classesData.data);
        setAllSubjects(subjectsData.data);
        setDivisions(divisionsData.data);
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    }
    fetchData();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await getTimeSlots(0, 0);
      setTimeSlotsData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

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

  useEffect(() => {
    if (formData.class && formData.division) {
      getTeacherSubjects(formData.class, formData.division);
    }
    setTimetable({});
    setTeacherSubjects([]);
  }, [formData.class, formData.division]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, subject: Subject) => {
    setDraggedItem(subject);
    e.dataTransfer.setData('text/plain', JSON.stringify(subject));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRemoveSubject = (day: string, timeDisplay: string) => {
    const slotKey = `${day}-${timeDisplay}`;
    setTimetable(prev => {
      const newTimetable = { ...prev };
      delete newTimetable[slotKey];
      return newTimetable;
    });
  };

  const formatTimeSlots = (): TimeSlot[] => {
    if (!timeSlotsData || timeSlotsData.length === 0) return [];

    const sortedSlots = [...timeSlotsData].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    return sortedSlots.map(slot => ({
      id: slot._id,
      display: `${slot.startTime}-${slot.endTime}${slot.isBreak ? ' - Break' : ''}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBreak: slot.isBreak,
    }));
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
        (
          (timeSlot.startTime >= assignment.startTime && timeSlot.startTime < assignment.endTime) ||
          (timeSlot.endTime > assignment.startTime && timeSlot.endTime <= assignment.endTime) ||
          (timeSlot.startTime <= assignment.startTime && timeSlot.endTime >= assignment.endTime)
        )
      );
    });

    return !isTeacherAlreadyAssigned;
  };

  const handleDragLeave = () => {
    setHoveredSlot(null);
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
      .filter(daySchedule => daySchedule.subjects.length > 0),
  }

  const handleSaveTimetable = async () => {
    if (!formData.academicYear || !formData.class || !formData.division) {
      toast.error("Please select academic year, class, and division before saving");
      return;
    }
    const requiredDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const missingDays = requiredDays.filter(day => {
      const daySchedule = timeTableData.timeTableSchedule.find(schedule => schedule.day === day);
      return !daySchedule || daySchedule.subjects.length === 0;
    });

    if (missingDays.length > 0) {
      toast.error(`Please assign at least one subject to the following days: ${missingDays.join(', ')}`);
      return;
    }

    try {
      const response = await createTimetable(timeTableData);
      if (response.success) {
        toast.success(response.message || "Timetable created successfully!");
      }
      navigate("/lookups/time-tables")
    } catch (error) {
      console.error("Failed to save timetable:", error);
      alert("Failed to save timetable. Please try again.");
    }
  };

  // New function to show teacher availability
  const showTeacherAvailability = (subject: Subject) => {
    setSelectedTeacher(subject);

    // Calculate available slots for this teacher (only unused slots)
    const availability: TeacherAvailability[] = days.map(day => {
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

  // Function to assign teacher to a slot from the modal
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
            availableSlots: dayAvailability.availableSlots.filter(s => s.id !== slot.id)
          };
        }
        return dayAvailability;
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Class Time Table</h2>
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
            onChange={(value) => setFormData({ ...formData, academicYear: value })}
            required={true}
            disabled={false}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Division <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.division}
            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {showIntro && (
        <div className="fixed top-5 right-5 w-full max-w-sm z-50 transition-transform transform-gpu duration-500 ease-out animate-slide-in bg-blue-50 border border-blue-300 rounded-md shadow-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <img src={dragimg} alt="Drag icon" width={40} className="mt-1" />
              <div>
                <h3 className="text-md font-semibold text-blue-800 mb-1">Quick Guide</h3>
                <p className="text-sm text-gray-700 leading-snug">
                  Drag a subject from the sidebar and drop it into a time slot.
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
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          className="w-full md:w-1/6 bg-gray-50 p-4 rounded-lg"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.h3
            className="font-bold mb-4"
            whileHover={{ color: "#3b82f6" }}
          >
            Subjects & Teachers
          </motion.h3>
          <div className="space-y-2 overflow-y-auto max-h-[calc(125vh-200px)]">
            {teacherSubjects.map(subject => (
              <div
                key={`${subject.id}-${subject.teacher}`}
                draggable
                onClick={() => showTeacherAvailability(subject)}
                onDragStart={(e) => handleDragStart(e, subject)}
                className="p-3 mb-2 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
              >
                <div className="font-medium">{subject.name}</div>
                <div className="text-xs text-gray-600">Teacher: {subject.teacherName}</div>
              </div>
            ))}
          </div>
        </motion.div>

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
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, slot.display)}
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
                          <span>{slot.display.split(' - ')[1]}</span>
                        ) : (
                          <>
                            <div className="text-xs text-gray-500">{slot.display}</div>
                            {slotData && (
                              <div className="mt-1 text-sm">
                                <button
                                  onClick={() => handleRemoveSubject(day, slot.display)}
                                  className="absolute bottom-0 right-0 p-1 text-xl text-red-500 hover:text-red-700"
                                  title="Remove subject"
                                >
                                  <MdDeleteOutline />
                                </button>
                                <div className="font-medium">{slotData.name}</div>
                                <div className="text-xs text-gray-600">Teacher: {slotData.teacherName}</div>
                              </div>
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

      {/* Teacher Availability Modal */}
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
                      {availableSlots.map(slot => (
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
          Save Timetable
        </button>
      </div>
    </div>
  );
}

export default ClassTimetable;