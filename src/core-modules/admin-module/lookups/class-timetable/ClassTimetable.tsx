// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
// import Breadcrumb from '@/components/Breadcumb';
// import dragimg from "@/assets/images/drag.gif";
// import React from 'react';
// import AcademicYearDropdown from '@/components/AcademicYearDropdown';
// import { AcademicYear, Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, fetchSubjects, fetchTeachers, fetchTeacherSubjects, subjects } from '@/api/common-api/commonDropDownApi';
// import { getTimeSlots } from '@/api/admin-api/lookups-api/timeSlotApi';
// import { createTimetable } from '@/api/admin-api/lookups-api/timeTableApi';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { MdDeleteOutline } from 'react-icons/md';

// // Define types
// interface Subject {
//   _id: string;
//   id: string;
//   name: string;
//   class?: string;
//   division?: string;
//   teacher?: string;
//   teacherName?: string;
// }

// interface Assignment {
//   class: string;
//   division: string;
//   subjects: Subject[];
// }

// interface TeacherAssignment {
//   teacher: string;
//   teacherName: string;
//   academicYear: string;
//   isClassTeacher: boolean;
//   classTeacherOf: {
//     class: string;
//     division: string;
//   };
//   assignments: Assignment[];
// }

// interface TimetableSlot {
//   [key: string]: Subject | undefined;
// }

// interface TimeSlot {
//   id: string;
//   display: string;
//   startTime: string;
//   endTime: string;
//   isBreak: boolean;
// }

// function ClassTimetable() {
//   const breadcrumbItems = [
//     { label: "Home", path: "/" },
//     { label: "Class Timetable", path: "" },
//   ];
//   const navigate = useNavigate();
//   const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [divisions, setDivisions] = useState<Division[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [allSubjects, setAllSubjects] = useState<subjects[]>([]);
//   const [teacherSubjects, setTeacherSubjects] = useState<Subject[]>([]);
//   const [timeSlotsData, setTimeSlotsData] = useState<any[]>([]);
//   const [timetable, setTimetable] = useState<TimetableSlot>({});
//   const [draggedItem, setDraggedItem] = useState<Subject | null>(null);
//   const [showIntro, setShowIntro] = useState(true);
//   const [formData, setFormData] = useState({
//     academicYear: '',
//     class: '',
//     division: '',
//   });  

  

//   useEffect(() => {
//     const timer = setTimeout(() => setShowIntro(false), 10200);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [academicYearData, classesData, divisionsData, teachersData, subjectsData] = await Promise.all([
//           fetchAcademicYear(),
//           fetchClasses(),
//           fetchDivisionsDD(),
//           fetchTeachers(),
//           fetchSubjects()
//         ]);
//         setAcademicYears(academicYearData.data);
//         setTeachers(teachersData.data);
//         setClasses(classesData.data);
//         setAllSubjects(subjectsData.data);
//         setDivisions(divisionsData.data);
//       } catch (error) {
//         console.error("Failed to load required data:", error);
//       }
//     }
//     fetchData();
//   }, []);

//   const fetchTimeSlots = async () => {
//     try {
//       const response = await getTimeSlots(0, 0);
//       setTimeSlotsData(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch time slots:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTimeSlots();
//   }, []);

//   const getTeacherSubjects = async (classId: string, divisionId: string) => {
//     try {
//      const response = await fetchTeacherSubjects(classId, divisionId);
//     const { assignments } = response.data;

//     // Flatten the assignments into a single array of subjects
//     const transformedSubjects = assignments.flatMap((assignment: any) =>
//       assignment.subjects.map((subject: any) => ({
//         ...subject,
//         id: subject._id, // Ensure the subject has an id for the key prop
//         class: classId,
//         division: divisionId,
//         teacher: assignment.teacher._id,
//         teacherName: assignment.teacher.name,
//       }))
//     );

//       setTeacherSubjects(transformedSubjects);
//     } catch (error) {
//       console.error("Failed to fetch teacher subjects:", error);
//     }
//   };

//   useEffect(() => {
//     if (formData.class && formData.division) {
//       getTeacherSubjects(formData.class, formData.division);
//     }
//   }, [formData.class, formData.division]);

//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, subject: Subject) => {
//     setDraggedItem(subject);
//     e.dataTransfer.setData('text/plain', JSON.stringify(subject));
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleRemoveSubject = (day: string, timeDisplay: string) => {
//     const slotKey = `${day}-${timeDisplay}`;
//     setTimetable(prev => {
//       const newTimetable = { ...prev };
//       delete newTimetable[slotKey];
//       return newTimetable;
//     });
//   };
//   const formatTimeSlots = (): TimeSlot[] => {
//     if (!timeSlotsData || timeSlotsData.length === 0) return [];

//     const sortedSlots = [...timeSlotsData].sort((a, b) =>
//       a.startTime.localeCompare(b.startTime)
//     );

//     return sortedSlots.map(slot => ({
//       id: slot._id,
//       display: `${slot.startTime}-${slot.endTime}${slot.isBreak ? ' - Break' : ''}`,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       isBreak: slot.isBreak,
//     }));
//   };
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: string, timeDisplay: string) => {
//     if (timeDisplay.includes('Break')) return;
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: string, timeDisplay: string) => {
//     e.preventDefault();
//     if (!draggedItem || timeDisplay.includes('Break')) return;

//     const slotKey = `${day}-${timeDisplay}`;
//     setTimetable(prev => ({
//       ...prev,
//       [slotKey]: draggedItem
//     }));
//   };

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   const formattedTimeSlots = formatTimeSlots();
//   console.log("Formatted Time Slots:", formattedTimeSlots);
//   console.log("timetable", timetable);

//   const timeTableData = {
//     academicYear: formData.academicYear,
//     class: formData.class,
//     division: formData.division,
//     timeTableSchedule: days.map(day => ({
//       day,
//       subjects: formattedTimeSlots.map(slot => {
//         const slotKey = `${day}-${slot.display}`;
//         const subjectData = timetable[slotKey];
//         return subjectData ? {
//           subject: subjectData._id,
//           teacher: subjectData.teacher,
//           timeSlot: slot.id
//         } : null;
//       }).filter(Boolean)
//     }))
//   }
//   console.log("Time Table Data:", timeTableData);


//   const prepareTimetableData = () => {
//     const timetableByDay: Record<string, Array<{
//       subject: string;
//       teacher: string;
//       timeSlot: string;
//     }>> = {};

//     // Initialize each day with empty array
//     days.forEach(day => {
//       timetableByDay[day] = [];
//     });

//     // Populate the timetable data
//     Object.entries(timetable).forEach(([key, subjectData]) => {
//       if (!subjectData) return;

//       const [day, timeDisplay] = key.split('-');
//       const timeSlot = formattedTimeSlots.find(slot =>
//         slot.display === timeDisplay ||
//         `${slot.startTime}-${slot.endTime}` === timeDisplay
//       );
//       console.log("Time Slot:", timeSlot);
//       console.log("day:", day);
//       console.log("timeDisplay:", timeDisplay);
//       if (timeSlot && subjectData._id && subjectData.teacher) {
//         timetableByDay[day].push({
//           subject: subjectData._id,
//           teacher: subjectData.teacher,
//           timeSlot: timeSlot.id
//         });
//       }
//     });

//     // Convert to the API format
//     const timeTableSchedule = days.map(day => ({
//       day,
//       subjects: timetableByDay[day]
//     }));

//     return {
//       academicYear: formData.academicYear,
//       class: formData.class,
//       division: formData.division,
//       timeTableSchedule
//     };
//   };
//   console.log("Prepared Timetable Data:", prepareTimetableData());
//   const handleSaveTimetable = async () => {
//     if (!formData.academicYear || !formData.class || !formData.division) {
//       alert("Please select academic year, class, and division before saving");
//       return;
//     }

//     // const timetableData = prepareTimetableData();

//     try {
//       const response = await createTimetable(timeTableData);
//       if (response.success) {
//         toast.success(response.message || "Timetable created successfully!");
//       }
//       navigate("/lookups/time-tables")
//     } catch (error) {
//       console.error("Failed to save timetable:", error);
//       alert("Failed to save timetable. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Class Time Table</h2>
//           <div className="mt-1">
//             <Breadcrumb items={breadcrumbItems} />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div className="w-full md:w-1/2 px-2 mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Academic Year <span className="text-red-500">*</span>
//           </label>
//           <AcademicYearDropdown
//             value={formData.academicYear}
//             onChange={(value) => setFormData({ ...formData, academicYear: value })}
//             required={true}
//             disabled={false}
//           />
//         </div>
//         <div className="w-full md:w-1/2 px-2 mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Class <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={formData.class}
//             onChange={(e) => setFormData({ ...formData, class: e.target.value })}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Class</option>
//             {classes.map((cls) => (
//               <option key={cls._id} value={cls._id}>
//                 {cls.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="w-full md:w-1/2 px-2 mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Division <span className="text-red-500">*</span>
//           </label>
//           <select
//             value={formData.division}
//             onChange={(e) => setFormData({ ...formData, division: e.target.value })}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Division</option>
//             {divisions.map((division) => (
//               <option key={division._id} value={division._id}>
//                 {division.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {showIntro && (
//         <div className="fixed top-5 right-5 w-full max-w-sm z-50 transition-transform transform-gpu duration-500 ease-out animate-slide-in bg-blue-50 border border-blue-300 rounded-md shadow-md p-4">
//           <div className="flex justify-between items-start">
//             <div className="flex items-start gap-3">
//               <img src={dragimg} alt="Drag icon" width={40} className="mt-1" />
//               <div>
//                 <h3 className="text-md font-semibold text-blue-800 mb-1">Quick Guide</h3>
//                 <p className="text-sm text-gray-700 leading-snug">
//                   Drag a subject from the sidebar and drop it into a time slot.
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowIntro(false)}
//               className="text-blue-600 hover:text-blue-800 ml-3 text-xl leading-none font-bold"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Sidebar */}
//         <motion.div 
//           className="w-full md:w-1/6 bg-gray-50 p-4 rounded-lg"
//           initial={{ x: -50 }}
//           animate={{ x: 0 }}
//           transition={{ type: "spring", stiffness: 200 }}
//         >
//          <motion.h3 
//             className="font-bold mb-4"
//             whileHover={{ color: "#3b82f6" }}
//           >
//             Subjects & Teachers
//           </motion.h3>
//           <div className="space-y-2">
//     {teacherSubjects.map(subject => (
//       <div
//         key={`${subject.id}-${subject.teacher}`}
//         draggable
//         onDragStart={(e) => handleDragStart(e, subject)}
//         className="p-3 mb-2 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
//       >
//                 <div className="font-medium">{subject.name}</div>
//                 <div className="text-xs text-gray-600">Teacher: {subject.teacherName}</div>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Timetable */}
//         <div className="flex-1 overflow-auto">
//           <div className="grid grid-cols-7 gap-1">
//             <div className="font-semibold p-2"></div>
//             {days.map(day => (
//               <div key={day} className="font-semibold p-2 text-center">{day}</div>
//             ))}

//             {formattedTimeSlots.map(slot => {
//               return (
//                 <React.Fragment key={slot.id}>
//                   <div className={`font-semibold p-2 ${slot.isBreak ? 'text-yellow-600 italic' : ''}`}>
//                     {slot.display}
//                   </div>
//                   {days.map(day => {
//                     const slotKey = `${day}-${slot.display}`;
//                     const slotData = timetable[slotKey];

//                     return (
//                       <div
//                         key={`${day}-${slot.id}`}
//                         onDragOver={(e) => handleDragOver(e, day, slot.display)}
//                         onDrop={(e) => handleDrop(e, day, slot.display)}
//                         className={`border p-2 h-24 text-center relative  ${slot.isBreak ? 'bg-yellow-100 text-sm italic text-gray-600' :
//                           slotData ? 'bg-green-50' : 'bg-white'
//                           }`}
//                       >
//                         {slot.isBreak ? (
//                           <span>{slot.display.split(' - ')[1]}</span>
//                         ) : (
//                           <>
//                             <div className="text-xs text-gray-500">{slot.display}</div>
//                             {slotData && (
//                               <div className="mt-1 text-sm">
//                                   <button
//                                     onClick={() => handleRemoveSubject(day, slot.display)}
//                                     className="absolute  bottom-0 right-0 p-1 text-xl text-red-500 hover:text-red-700"
//                                     title="Remove subject"
//                                   >
//                                     <MdDeleteOutline />

//                                   </button>
//                                 <div className="font-medium">{slotData.name}</div>
//                                 <div className="text-xs text-gray-600">Teacher: {slotData.teacherName}</div>
                                 
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 flex justify-end">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSaveTimetable}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
//         >
//           Save Timetable
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ClassTimetable;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Breadcrumb from '@/components/Breadcumb';
import dragimg from "@/assets/images/drag.gif";
import React from 'react';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import { AcademicYear, Division, fetchAcademicYear, fetchClasses, fetchDivisionsDD, fetchSubjects, fetchTeachers, fetchTeacherSubjects, subjects } from '@/api/common-api/commonDropDownApi';
import { getTimeSlots } from '@/api/admin-api/lookups-api/timeSlotApi';
import { createTimetable } from '@/api/admin-api/lookups-api/timeTableApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from 'react-icons/md';

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
  const [formData, setFormData] = useState({
    academicYear: '',
    class: '',
    division: '',
  });



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

  const getTeacherSubjects = async (classId: string, divisionId: string) => {
    try {
      const response = await fetchTeacherSubjects(classId, divisionId);
      const { assignments } = response.data;

      // Flatten the assignments into a single array of subjects
      const transformedSubjects = assignments.flatMap((assignment: any) =>
        assignment.subjects.map((subject: any) => ({
          ...subject,
          id: subject._id, // Ensure the subject has an id for the key prop
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formattedTimeSlots = formatTimeSlots();
  console.log("Formatted Time Slots:", formattedTimeSlots);
  console.log("timetable", timetable);

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
  console.log("Time Table Data:", timeTableData);


  const prepareTimetableData = () => {
    const timetableByDay: Record<string, Array<{
      subject: string;
      teacher: string;
      timeSlot: string;
    }>> = {};

    // Initialize each day with empty array
    days.forEach(day => {
      timetableByDay[day] = [];
    });

    // Populate the timetable data
    Object.entries(timetable).forEach(([key, subjectData]) => {
      if (!subjectData) return;

      const [day, timeDisplay] = key.split('-');
      const timeSlot = formattedTimeSlots.find(slot =>
        slot.display === timeDisplay ||
        `${slot.startTime}-${slot.endTime}` === timeDisplay
      );
      console.log("Time Slot:", timeSlot);
      console.log("day:", day);
      console.log("timeDisplay:", timeDisplay);
      if (timeSlot && subjectData._id && subjectData.teacher) {
        timetableByDay[day].push({
          subject: subjectData._id,
          teacher: subjectData.teacher,
          timeSlot: timeSlot.id
        });
      }
    });

    // Convert to the API format
  const timeTableSchedule = days
    .map(day => ({
      day,
      subjects: timetableByDay[day],
    }))
    .filter(daySchedule => daySchedule.subjects.length > 0);

  return {
    academicYear: formData.academicYear,
    class: formData.class,
    division: formData.division,
    timeTableSchedule,
  };
};
  console.log("Prepared Timetable Data:", prepareTimetableData());
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
    // const timetableData = prepareTimetableData();

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
                onDragStart={(e) => handleDragStart(e, subject)}
                className="p-3 mb-2 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition-colors"
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
                        onDrop={(e) => handleDrop(e, day, slot.display)}
                        className={`border p-2 h-24 text-center relative  ${slot.isBreak ? 'bg-yellow-100 text-sm italic text-gray-600' :
                          slotData ? 'bg-green-50' : 'bg-white'
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
                                  className="absolute  bottom-0 right-0 p-1 text-xl text-red-500 hover:text-red-700"
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