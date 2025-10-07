// import React, { useEffect, useState } from "react";
// import MiniCalendar from "@/components/MiniCalendar";
// import { toast } from "react-toastify";
// import { fetchStudents } from "@/api/admin-api/student-management/students-api/studentsApi";
// import { fetchTeachers } from "@/api/admin-api/lookups-api/teachersApi";
// import { EventData, fetchEvents } from "@/api/admin-api/lookups-api/eventApi";
// import { fetchExams, ExamData } from "@/api/admin-api/lookups-api/examApi";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
// import { log } from "console";
// import { PiStudentDuotone } from "react-icons/pi";
// import { LiaChalkboardTeacherSolid } from "react-icons/lia";
// // import { fetchDdAllStudents } from "@/api/common-api/commonDropDownApi";

// // Animation variants
// const cardVariants: any = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   },
//   hover: {
//     y: -5,
//     boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
//     transition: { duration: 0.2 },
//   },
// };

// const glowVariants:any = {
//   initial: { opacity: 0.6, scale: 1 },
//   animate: {
//     opacity: [0.6, 1, 0.6],
//     scale: [1, 1.05, 1],
//     transition: {
//       duration: 2,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// const Dashboard: React.FC = () => {
//   const [totalStudents, setTotalStudents] = useState<number>(0);
//   const [totalTeachers, setTotalTeachers] = useState<number>(0);
//   const [events, setEvents] = useState<EventData[]>([]);
//   const [exams, setExams] = useState<ExamData[]>([]);
//   const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
//   const [upcomingEvent, setUpcomingEvent] = useState<EventData | null>(null);
//   const [currentExamIndex, setCurrentExamIndex] = useState(0);
//   const [students, setStudents] = useState<any[]>([]);
//   // Create motion values for animations
//   const studentCount = useMotionValue(0);
//   const teacherCount = useMotionValue(0);
//   const roundedStudents = useTransform(studentCount, Math.round);
//   const roundedTeachers = useTransform(teacherCount, Math.round);

//   const page = 0;
//   const limit = 0;

//   const fetchAllStudents = async () => {
//     const response = await fetchStudents();
//     setTotalStudents(response.total);
//     animate(studentCount, response.total, { duration: 2 });
//   };

//   const fetchAllTeachers = async () => {
//     const allTeachers = await fetchTeachers(page, limit, ""); // use 0 or Infinity for all
//     setTotalTeachers(allTeachers.total);
//     animate(teacherCount, allTeachers.total, { duration: 2 });
//   };

//   const fetchAllExams = async () => {
//     const response = await fetchExams(page, limit); // use 0 or Infinity for all
//     const exams = response?.data?.data || [];
//     setExams(exams);
//   };

//   const fetchAllEvents = async () => {
//     const response = await fetchEvents();
//     const sortedEvents = [...response.eventList].sort(
//       (a: any, b: any) =>
//         new Date(a.date).getTime() - new Date(b.date).getTime()
//     );
//     setEvents(sortedEvents);
//     setUpcomingEvent(sortedEvents[0] || null);
//   };

//   // useEffect to call all in parallel
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await Promise.all([
//           fetchAllStudents(),
//           fetchAllTeachers(),
//           fetchAllEvents(),
//           fetchAllExams(),
//         ]);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         toast.error("Failed to load required data");
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div
//     //  className="h-[calc(100vh-4rem)] p-2 overflow-hidden"
//     >
//       <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
//       <hr />

//       <div className="flex flex-col lg:flex-row gap-6 h-full mt-4">
//         {/* Left Side - Stats Cards */}
//         {/* overflow-y-auto */}
//         <div className="w-full lg:w-2/3 space-y-6 pr-2">
//           {/* Welcome Banner */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={cardVariants}
//             className="pl-6 rounded-lg shadow-md bg-gradient-to-br from-pink-800 to-pink-600/50"
//           >
//             <div className="flex items-center justify-between flex-wrap gap-6">
//               <div className="admin-text-bnr max-w-xl">
//                 <h2 className="text-white text-xl font-semibold">
//                   Welcome to Dashboard!
//                 </h2>
//                 <p className="text-gray-200 text-sm font-medium mt-2">
//                   Let go of the stress and enjoy a smoother way to manage your
//                   school.
//                 </p>
//               </div>
//               <div className="admin-bnr-image">
//                 <img
//                   src="https://pub-59b2359efd8b4a47a5f0f73005d2a16c.r2.dev/itsme/uploads/homeBanner/1745413615066-output-onlinegiftools%20%281%29.gif"
//                   alt="Dashboard Animation"
//                   className="w-[110px] h-auto object-contain"
//                 />
//               </div>
//             </div>
//           </motion.div>
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               whileHover="hover"
//               className="p-7 rounded-lg shadow-md bg-gradient-to-br from-blue-800 to-blue-600/50"
//             >
//               <div className="flex justify-between items-center">
//                 {/* Left side: label + value */}
//                 <div>
//                   <h3 className="text-gray-300 text-sm font-medium">
//                     Total Students
//                   </h3>
//                   <motion.p
//                     className="text-4xl font-bold mt-2 text-white"
//                     style={{ fontVariantNumeric: "tabular-nums" }}
//                   >
//                     {roundedStudents}
//                   </motion.p>
//                 </div>

//                 {/* Right side: icon */}
//                 <PiStudentDuotone size={45} />
//               </div>
//             </motion.div>

//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               whileHover="hover"
//               className="p-7 rounded-lg shadow-md bg-gradient-to-br from-purple-800 to-purple-600/50"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-300 text-sm font-medium">
//                     Total Teachers
//                   </h3>
//                   <motion.p
//                     className="text-4xl font-bold mt-2 text-white"
//                     style={{ fontVariantNumeric: "tabular-nums" }}
//                   >
//                     {roundedTeachers}
//                   </motion.p>
//                 </div>
//                 <LiaChalkboardTeacherSolid size={45} />
//               </div>
//             </motion.div>
//           </div>

//           {/* Exams List */}
//           <div className="relative rounded-lg shadow-md p-3 h-[calc(100vh-200px)] lg:h-full flex flex-col max-h-[calc(100vh-300px)] overflow-hidden bg-white/20 bg-cover bg-center">
//             <div
//               className="absolute inset-0 rounded-lg z-0 bg-gradient-to-br from-blue-900/70 to-blue-800/70"
//               style={{
//                 backgroundImage:
//                   "url('https://pub-7919446e36f4478fb63336bce154bb78.r2.dev/itsme/uploads/homeBanner/1746700535973-top-view-copy-space-white-green-blue-paper-clips-with-blue-light-green-pencils-green-background_141793-11774.avif')",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             />
//             <div className="absolute inset-0 bg-black/40 rounded-lg z-0 backdrop-blur-sm" />

//             <div className="relative z-10 flex flex-col h-full">
//               {/* Header with dots navigation */}
//               <div className="flex justify-between items-center mb-4 min-h-[40px]">
//                 <h3 className="text-xl font-bold text-white">Upcoming Exams</h3>
//                 {exams.length > 1 && (
//                   <div className="flex space-x-2">
//                     {exams.map((_, index) => (
//                       <button
//                         key={index}
//                         className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                           currentExamIndex === index
//                             ? "bg-white w-4"
//                             : "bg-white/30"
//                         }`}
//                         onClick={() => setCurrentExamIndex(index)}
//                         aria-label={`Go to exam ${index + 1}`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Carousel container with constrained height */}
//               <div className="flex-1 flex flex-col overflow-hidden">
//                 {exams.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                     <svg
//                       className="w-12 h-12 text-blue-300 mb-3"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                     <p className="text-blue-200">No upcoming exams scheduled</p>
//                   </div>
//                 ) : (
//                   <div className="flex-1 relative overflow-hidden">
//                     <motion.div
//                       className="absolute top-0 left-0 w-full h-full"
//                       animate={{ x: `-${currentExamIndex * 100}%` }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 300,
//                         damping: 30,
//                       }}
//                     >
//                       {exams.map((exam, index) => (
//                         <div
//                           key={exam._id}
//                           className="absolute top-0 left-0 w-full h-full p-1"
//                           style={{ left: `${index * 100}%` }}
//                         >
//                           {/* Scrollable exam card */}
//                           <div className="h-full flex flex-col">
//                             {/* Exam Header (fixed height) */}
//                             <div className="p-3 rounded-t-lg bg-gradient-to-r from-blue-800/60 to-blue-900/60 backdrop-blur-sm">
//                               <h3 className="text-lg font-bold text-white line-clamp-1">
//                                 {exam.name}
//                               </h3>
//                               <div className="flex justify-between items-center mt-2">
//                                 <div className="flex items-center text-sm text-blue-200">
//                                   <svg
//                                     className="w-4 h-4 mr-1"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                                     />
//                                   </svg>
//                                   <span>Total: {exam.totalMarks} Marks</span>
//                                 </div>
//                                 <span className="px-2 py-1 text-xs rounded-full bg-blue-700/40 text-blue-100">
//                                   {exam.subjects.length}{" "}
//                                   {exam.subjects.length === 1
//                                     ? "Subject"
//                                     : "Subjects"}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Scrollable Subjects List */}
//                             <div className="flex-1 overflow-y-auto p-2 bg-blue-900/20 rounded-b-lg">
//                               {exam.subjects.map((subject: any) => {
//                                 const examDate = new Date(subject.date);
//                                 const isToday =
//                                   examDate.toDateString() ===
//                                   new Date().toDateString();

//                                 return (
//                                   <div
//                                     key={subject._id}
//                                     className={`p-3 mb-2 rounded-lg ${
//                                       isToday
//                                         ? "bg-blue-700/40"
//                                         : "bg-blue-900/30"
//                                     } backdrop-blur-sm`}
//                                   >
//                                     <div className="flex items-start gap-3">
//                                       <div
//                                         className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
//                                           isToday
//                                             ? "bg-blue-500/70"
//                                             : "bg-blue-700/50"
//                                         } text-blue-100`}
//                                       >
//                                         <svg
//                                           className="w-4 h-4"
//                                           fill="none"
//                                           stroke="currentColor"
//                                           viewBox="0 0 24 24"
//                                         >
//                                           <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                                           />
//                                         </svg>
//                                       </div>

//                                       <div className="flex-1 min-w-0">
//                                         <div className="flex justify-between items-start flex-wrap gap-1">
//                                           <h5 className="font-medium text-white truncate">
//                                             {subject.subject.name}
//                                           </h5>
//                                           <div className="flex items-center gap-1">
//                                             {isToday && (
//                                               <span className="text-xs px-2 py-0.5 rounded bg-blue-500 text-white whitespace-nowrap">
//                                                 Today
//                                               </span>
//                                             )}
//                                             <span className="text-xs px-2 py-0.5 rounded bg-blue-800/50 text-blue-100 whitespace-nowrap">
//                                               {subject.examType.name}
//                                             </span>
//                                           </div>
//                                         </div>

//                                         <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-blue-200">
//                                           <div className="flex items-center truncate">
//                                             <svg
//                                               className="w-3 h-3 mr-1 flex-shrink-0"
//                                               fill="none"
//                                               stroke="currentColor"
//                                               viewBox="0 0 24 24"
//                                             >
//                                               <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                               />
//                                             </svg>
//                                             <span className="truncate">
//                                               {examDate.toLocaleDateString(
//                                                 "en-US",
//                                                 {
//                                                   month: "short",
//                                                   day: "numeric",
//                                                 }
//                                               )}
//                                             </span>
//                                           </div>

//                                           <div className="flex items-center truncate">
//                                             <svg
//                                               className="w-3 h-3 mr-1 flex-shrink-0"
//                                               fill="none"
//                                               stroke="currentColor"
//                                               viewBox="0 0 24 24"
//                                             >
//                                               <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                                               />
//                                             </svg>
//                                             <span className="truncate">
//                                               {subject.duration}
//                                             </span>
//                                           </div>

//                                           <div className="flex items-center truncate">
//                                             <svg
//                                               className="w-3 h-3 mr-1 flex-shrink-0"
//                                               fill="none"
//                                               stroke="currentColor"
//                                               viewBox="0 0 24 24"
//                                             >
//                                               <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                                               />
//                                             </svg>
//                                             <span className="truncate">
//                                               {subject.marks} Marks
//                                             </span>
//                                           </div>

//                                           {isToday && (
//                                             <div className="col-span-2 flex items-center text-blue-100 truncate">
//                                               <svg
//                                                 className="w-3 h-3 mr-1 flex-shrink-0"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                               >
//                                                 <path
//                                                   strokeLinecap="round"
//                                                   strokeLinejoin="round"
//                                                   strokeWidth={2}
//                                                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                                                 />
//                                               </svg>
//                                               <span className="truncate">
//                                                 At{" "}
//                                                 {examDate.toLocaleTimeString(
//                                                   "en-US",
//                                                   {
//                                                     hour: "2-digit",
//                                                     minute: "2-digit",
//                                                   }
//                                                 )}
//                                               </span>
//                                             </div>
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </motion.div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Events List */}
//         <div className="w-full lg:w-1/3 flex flex-col gap-6 border-8 border-[#8B5E3C] rounded-2xl">
//           <div
//             className="relative rounded shadow-md p-4 flex-1 overflow-y-auto h-[calc(100vh-300px)] lg:h-[calc(100vh-300px)] lg:max-h-[calc(100vh-100px)] backdrop-blur-md bg-white/90 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url('https://img.freepik.com/free-photo/back-school-witch-school-supplies_23-2148151047.jpg?t=st=1746706655~exp=1746710255~hmac=c32229cf91dc3793fb93cd9d18f62441b965b648abf0e07707945d8b7b469a1c&w=740')",
//             }}
//           >
//             {/* Overlay to improve contrast */}
//             <div className="absolute inset-0 bg-black/20 rounded-lg z-0" />
//             {/* Content wrapper to stay on top */}
//             <div className="relative z-10">
//               {/* Today's Events Section */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold text-white">
//                     Today's Events
//                   </h3>
//                 </div>

//                 <div className="space-y-3">
//                   {events
//                     .filter((event) => {
//                       const eventDate = new Date(event.date).toDateString();
//                       const today = new Date().toDateString();
//                       return eventDate === today;
//                     })
//                     .map((event, index) => (
//                       <motion.div
//                         key={event._id}
//                         initial="hidden"
//                         animate="visible"
//                         variants={cardVariants}
//                         transition={{ delay: index * 0.1 }}
//                         whileHover="hover"
//                         className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors bg-white/70 backdrop-blur-sm"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="bg-blue-100 p-2 rounded-lg">
//                             {/* Event Icon */}
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="font-medium text-gray-800">
//                               {event.title}
//                             </h4>
//                             <div className="flex items-center text-xs text-gray-600 mt-1">
//                               <span>
//                                 {event.startTime} - {event.endTime}
//                               </span>
//                             </div>
//                             {event.venue && (
//                               <div className="flex items-center text-xs text-gray-600 mt-1">
//                                 <span>{event.venue}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}

//                   {events.filter(
//                     (event) =>
//                       new Date(event.date).toDateString() ===
//                       new Date().toDateString()
//                   ).length === 0 && (
//                     <div className="text-center py-4 text-white">
//                       <p className="mt-2">No events scheduled for today</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Upcoming Events Section */}
//               <div>
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold text-white">
//                     Upcoming Events
//                   </h3>
//                   <button
//                     onClick={() => setShowAllEvents(!showAllEvents)}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                   >
//                     {showAllEvents ? "Show Less" : "Show All"}
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {events
//                     .filter((event) => new Date(event.date) > new Date())
//                     .slice(0, showAllEvents ? undefined : 3)
//                     .map((event, index) => (
//                       <motion.div
//                         key={event._id}
//                         initial="hidden"
//                         animate="visible"
//                         variants={cardVariants}
//                         transition={{ delay: index * 0.1 }}
//                         whileHover="hover"
//                         className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="bg-purple-100 p-2 rounded-lg">
//                             <svg
//                               className="w-5 h-5 text-purple-600"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                               />
//                             </svg>
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="font-medium text-white">
//                               {event.title}
//                             </h4>
//                             <div className="flex items-center text-xs text-gray-500 mt-1">
//                               <svg
//                                 className="w-3 h-3 mr-1"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                 />
//                               </svg>
//                               <span>
//                                 {new Date(event.date).toLocaleDateString(
//                                   "en-US",
//                                   {
//                                     weekday: "short",
//                                     month: "short",
//                                     day: "numeric",
//                                   }
//                                 )}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}

//                   {events.filter((event) => new Date(event.date) > new Date())
//                     .length === 0 && (
//                     <div className="text-center py-4 text-gray-500">
//                       <svg
//                         className="w-10 h-10 mx-auto text-gray-300"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1}
//                           d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                         />
//                       </svg>
//                       <p className="mt-2 text-white">
//                         No upcoming events scheduled
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { fetchStudents } from "@/api/admin-api/student-management/students-api/studentsApi";
import { fetchTeachers } from "@/api/admin-api/lookups-api/teachersApi";
import { EventData, fetchEvents } from "@/api/admin-api/lookups-api/eventApi";
import { fetchExams, ExamData } from "@/api/admin-api/lookups-api/examApi";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  PiStudentDuotone,
  PiChalkboardTeacherDuotone,
  PiExamDuotone,
  PiCalendarBlankDuotone,
} from "react-icons/pi";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiChevronRight,
  FiChevronLeft,
  FiUserX,
  FiUserCheck,
  FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import MessagePopup from "@/components/MessagePopup";

const Dashboard: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [events, setEvents] = useState<EventData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [upcomingEvent, setUpcomingEvent] = useState<EventData | null>(null);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    show: boolean;
  } | null>(null);

  // Animation values
  const studentCount = useMotionValue(0);
  const teacherCount = useMotionValue(0);
  const roundedStudents = useTransform(studentCount, Math.round);
  const roundedTeachers = useTransform(teacherCount, Math.round);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "error"
  ) => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    if (exams.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentExamIndex((prev) => (prev + 1) % exams.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [exams.length]);

  const fetchAllStudents = async () => {
    const response = await fetchStudents();
    setTotalStudents(response.total);
    animate(studentCount, response.total, { duration: 2 });
  };

  const fetchAllTeachers = async () => {
    const allTeachers = await fetchTeachers(0, 0, "");
    setTotalTeachers(allTeachers.total);
    animate(teacherCount, allTeachers.total, { duration: 2 });
  };

  const fetchAllExams = async () => {
    const response = await fetchExams(0, 0);
    setExams(response?.data?.data || []);
  };

  const fetchAllEvents = async () => {
    const response = await fetchEvents();
    console.log("Fetched Events:", response);

    const sortedEvents = [...response.eventList].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sortedEvents);
    setUpcomingEvent(sortedEvents[0] || null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAllStudents(),
          fetchAllTeachers(),
          fetchAllEvents(),
          fetchAllExams(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showNotification("Failed to load required data", "error");
      }
    };
    fetchData();
  }, []);

  // Today's date formatted
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const todayFormatted = today.toLocaleDateString("en-US", options);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Notification */}
      {notification?.show && (
        <MessagePopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center">
            <RiDashboardFill className="text-indigo-600 mr-3 text-3xl" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              School Dashboard
            </h1>
          </div>
          <p className="text-gray-500 mt-2">{todayFormatted}</p>
        </div>
        <div className="mt-4 md:mt-0  p-3 rounded-xl">
          <div className="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative group">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-indigo-500" />
                <span className="text-sm font-medium">
                  Academic Year 2024-2025
                </span>
              </div>
              <FiChevronDown className="text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:rotate-180" />
            </div>

            {/* Calendar Dropdown */}
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 hidden group-hover:block">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Academic Calendar
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    Current
                  </span>
                </div>

                {/* Month Navigation */}
                <div className="flex justify-between items-center mb-3">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <FiChevronLeft className="text-gray-500" />
                  </button>
                  <span className="font-medium">July 2024</span>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <FiChevronRight className="text-gray-500" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs text-gray-500 font-medium py-1"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar Dates - Example for July */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const date = i + 1;
                    const isCurrent =
                      date === new Date().getDate() &&
                      new Date().getMonth() === 6;
                    const isEventDay = [5, 12, 19, 26].includes(date); // Example event days

                    return (
                      <div
                        key={date}
                        className={`p-1 text-sm rounded-full relative ${
                          isCurrent
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : isEventDay
                            ? "hover:bg-gray-100 cursor-pointer"
                            : ""
                        }`}
                      >
                        {date}
                        {isEventDay && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Key Events */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Key Events
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2">
                        <FiCalendar size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Term 1 Begins</p>
                        <p className="text-xs text-gray-500">July 5, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 text-green-800 p-1 rounded mr-2">
                        <FiCalendar size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mid-Term Break</p>
                        <p className="text-xs text-gray-500">
                          August 15-20, 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Vibrant */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Students Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-blue-100 opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Students
              </p>
              <motion.p
                className="text-3xl font-bold text-gray-800 mt-1"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {roundedStudents}
              </motion.p>
              <div className="flex items-center mt-3 text-xs text-blue-600">
                <span>↑ 12% this year</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <PiStudentDuotone size={24} />
            </div>
          </div>
        </motion.div>

        {/* Teachers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-purple-100 opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Teachers
              </p>
              <motion.p
                className="text-3xl font-bold text-gray-800 mt-1"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {roundedTeachers}
              </motion.p>
              <div className="flex items-center mt-3 text-xs text-purple-600">
                <span>↑ 5% this year</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <PiChalkboardTeacherDuotone size={24} />
            </div>
          </div>
        </motion.div>

        {/* Events Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-amber-100 opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Upcoming Events
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {events.filter((e) => new Date(e.date) > new Date()).length}
              </p>
              {upcomingEvent && (
                <div className="flex items-center mt-3 text-xs text-amber-600 truncate">
                  <span>Next: {upcomingEvent.title}</span>
                </div>
              )}
            </div>
            <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
              <PiCalendarBlankDuotone size={24} />
            </div>
          </div>
        </motion.div>

        {/* Exams Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-green-100 opacity-30"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Upcoming Exams
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {exams.length}
              </p>
              {exams.length > 0 && (
                <div className="flex items-center mt-3 text-xs text-green-600 truncate">
                  <span>Next: {exams[0]?.name}</span>
                </div>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <PiExamDuotone size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Banner with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="relative z-10 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white max-w-md">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome to School Management!
                  </h2>
                  <p className="opacity-90 mb-4">
                    Everything you need to manage your school efficiently in one
                    place.
                  </p>
                  <button className="flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors">
                    Quick Tour <FiChevronRight className="ml-1" />
                  </button>
                </div>
                <div className="mt-6 md:mt-0">
                  <img
                    src="https://pub-59b2359efd8b4a47a5f0f73005d2a16c.r2.dev/itsme/uploads/homeBanner/1745413615066-output-onlinegiftools%20%281%29.gif"
                    alt="Welcome Animation"
                    className="w-40 h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Exams Section */}
          {/* Exams Section - Alternative Carousel Design */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaGraduationCap className="text-indigo-600 mr-2" />
                Upcoming Exams
              </h3>
              {exams.length > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentExamIndex(
                        (prev) => (prev - 1 + exams.length) % exams.length
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiChevronLeft className="text-gray-500" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentExamIndex((prev) => (prev + 1) % exams.length)
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiChevronRight className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-5">
              {exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <PiExamDuotone className="text-gray-300 text-4xl" />
                  <p className="text-gray-500 mt-4">
                    No upcoming exams scheduled
                  </p>
                </div>
              ) : (
                <div className="relative h-[400px] overflow-hidden">
                  {/* Auto-rotating exam cards */}
                  {exams.map((exam, index) => {
                    const isActive = index === currentExamIndex;
                    const daysRemaining = Math.ceil(
                      (new Date(exam.subjects[0].date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <motion.div
                        key={exam._id}
                        className={`absolute inset-0 p-4 ${
                          isActive ? "z-10" : "z-0"
                        }`}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{
                          scale: isActive ? 1 : 0.9,
                          opacity: isActive ? 1 : 0.7,
                          x: `${(index - currentExamIndex) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)"
                            : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        }}
                      >
                        <div className="h-full flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                          {/* Exam Header with Countdown */}
                          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-xl font-bold">
                                  {exam.name}
                                </h4>
                                <p className="text-sm opacity-90 mt-1">
                                  Class {exam.class.name} • Division{" "}
                                  {exam.division.name}
                                </p>
                              </div>
                              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                {daysRemaining > 0
                                  ? `${Math.ceil(daysRemaining)} days left`
                                  : "Starting today"}
                              </div>
                            </div>
                          </div>

                          {/* Exam Summary */}
                          <div className="p-4 border-b border-gray-100">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2">
                                <div className="text-xs text-gray-500">
                                  Subjects
                                </div>
                                <div className="text-lg font-bold text-indigo-600">
                                  {exam.subjects.length}
                                </div>
                              </div>
                              <div className="p-2">
                                <div className="text-xs text-gray-500">
                                  Total Marks
                                </div>
                                <div className="text-lg font-bold text-indigo-600">
                                  {exam.totalMarks}
                                </div>
                              </div>
                              <div className="p-2">
                                <div className="text-xs text-gray-500">
                                  Duration
                                </div>
                                <div className="text-lg font-bold text-indigo-600">
                                  {exam.subjects[0]?.duration || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Subject Timeline */}
                          <div className="flex-1 overflow-y-auto p-4">
                            <div className="relative">
                              {/* Timeline line */}
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                              {exam.subjects.map(
                                (subject: any, subIndex: any) => {
                                  const subjectDate = new Date(subject.date);
                                  const isToday =
                                    subjectDate.toDateString() ===
                                    new Date().toDateString();
                                  const isPast =
                                    subjectDate < new Date() && !isToday;
                                  const isFirst = subIndex === 0;
                                  const isLast =
                                    subIndex === exam.subjects.length - 1;

                                  return (
                                    <div
                                      key={subject._id}
                                      className="relative pl-8 pb-4"
                                    >
                                      {/* Timeline dot */}
                                      <div
                                        className={`absolute left-0 top-0 w-3 h-3 rounded-full border-2 ${
                                          isPast
                                            ? "border-gray-400 bg-gray-100"
                                            : isToday
                                            ? "border-blue-500 bg-blue-100"
                                            : "border-indigo-500 bg-white"
                                        }`}
                                      ></div>

                                      {/* Subject card */}
                                      <div
                                        className={`p-3 rounded-lg border ${
                                          isPast
                                            ? "bg-gray-50 border-gray-200"
                                            : isToday
                                            ? "bg-blue-50 border-blue-200"
                                            : "bg-indigo-50 border-indigo-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h5 className="font-medium text-gray-800">
                                              {subject.subject.name}
                                            </h5>
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                              <FiCalendar className="mr-1" />
                                              <span>
                                                {subjectDate.toLocaleDateString(
                                                  "en-US",
                                                  {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                  }
                                                )}
                                              </span>
                                              <span className="mx-1">•</span>
                                              <FiClock className="mr-1" />
                                              <span>
                                                {subjectDate.toLocaleTimeString(
                                                  "en-US",
                                                  {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                  }
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            {isToday && (
                                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                                Today
                                              </span>
                                            )}
                                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                                              {subject.marks} pts
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Combined Events Tile - Replaces both Today's Events and Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiCalendar className="text-purple-500 mr-2" />
                Events Calendar
              </h3>
              <div className="flex mt-2 border-b border-gray-200 -mb-5">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    showAllEvents
                      ? "text-gray-500 hover:text-purple-600"
                      : "text-purple-600 border-b-2 border-purple-600"
                  }`}
                  onClick={() => setShowAllEvents(false)}
                >
                  Today's Events
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    !showAllEvents
                      ? "text-gray-500 hover:text-purple-600"
                      : "text-purple-600 border-b-2 border-purple-600"
                  }`}
                  onClick={() => setShowAllEvents(true)}
                >
                  Upcoming Events
                </button>
              </div>
            </div>

            <div className="p-5">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FiCalendar className="text-gray-300 text-4xl" />
                  <p className="text-gray-500 mt-4">No events scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllEvents
                    ? events.filter((e) => new Date(e.date) >= new Date())
                    : events.filter(
                        (e) =>
                          new Date(e.date).toDateString() ===
                          new Date().toDateString()
                      )
                  )
                    .slice(0, 4)
                    .map((event) => {
                      const eventDate = new Date(event.date);
                      const isToday =
                        eventDate.toDateString() === new Date().toDateString();
                      const isTomorrow =
                        new Date(eventDate).setHours(0, 0, 0, 0) ===
                        new Date().setHours(0, 0, 0, 0) + 86400000;

                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border ${
                            isToday
                              ? "border-purple-200 bg-purple-50"
                              : "border-gray-200 hover:border-purple-100 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-lg ${
                                isToday
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <span className="font-bold text-lg">
                                {eventDate.getDate()}
                              </span>
                              <span className="text-xs -mt-1">
                                {eventDate.toLocaleString("default", {
                                  month: "short",
                                })}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800">
                                  {event.title}
                                </h4>
                                {(isToday || isTomorrow) && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      isToday
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {isToday ? "Today" : "Tomorrow"}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <FiClock className="mr-1" size={14} />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>

                              {event.venue && (
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <FiMapPin className="mr-1" size={14} />
                                  <span>{event.venue}</span>
                                </div>
                              )}

                              {!isToday && (
                                <div className="flex items-center text-xs text-purple-600 mt-2">
                                  <FiCalendar className="mr-1" size={12} />
                                  <span>
                                    {eventDate.toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                  {events.filter((e) =>
                    showAllEvents
                      ? new Date(e.date) >= new Date()
                      : new Date(e.date).toDateString() ===
                        new Date().toDateString()
                  ).length > 4 && (
                    <button
                      className="w-full py-2 text-sm text-purple-600 font-medium hover:bg-purple-50 rounded-lg"
                      onClick={() => setShowAllEvents(!showAllEvents)}
                    >
                      View {showAllEvents ? "Today's" : "All Upcoming"} Events
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiUsers className="text-amber-500 mr-2" />
                Teacher Substitutions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Today's classroom coverage
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {/* 9A */}
              <div className="p-4 hover:bg-amber-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm mr-3">
                      9A
                    </span>
                    <div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiUserX className="mr-2 text-red-500" />
                        <span>NIMMI (MATHS)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FiUserCheck className="mr-2 text-green-500" />
                        <span>ROSHIN</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
              </div>

              {/* 5C */}
              <div className="p-4 hover:bg-blue-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-3">
                      5C
                    </span>
                    <div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiUserX className="mr-2 text-red-500" />
                        <span>ANU (ENGLISH)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <FiUserCheck className="mr-2" />
                        <span>Not assigned</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Urgent
                  </span>
                </div>
              </div>

              {/* 10C */}
              <div className="p-4 hover:bg-green-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-3">
                      10C
                    </span>
                    <div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiUserX className="mr-2 text-red-500" />
                        <span>VINAYAN (HISTORY)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FiUserCheck className="mr-2 text-green-500" />
                        <span>ARUN</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Notified
                  </span>
                </div>
              </div>

              {/* View All Button */}
              <div className="p-3 text-center">
                <button className="text-sm text-amber-600 font-medium hover:bg-amber-100 px-3 py-1 rounded-lg">
                  View all substitutions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
