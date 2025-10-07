// // import React, { useState, useEffect } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import { FiHome } from "react-icons/fi";
// // import {
// //   FaExpand,
// //   FaBars,
// //   FaAngleDown,
// //   FaUsers,
// //   FaUserLock,
// //   FaUserTie,
// //   FaMoneyCheck,
// //   FaClipboardList,
// // } from "react-icons/fa";
// // import { VscFileSubmodule, VscSymbolMethod } from "react-icons/vsc";
// // import schooAppLogo from "@/assets/images/EDUMINUTE_LOGO_PNG.png";
// // import { RiAdminLine, RiCoinLine, RiMoneyRupeeCircleLine, RiTableLine } from "react-icons/ri";
// // import { IoSettings } from "react-icons/io5";
// // import {
// //   MdAttachMoney,
// //   MdCoPresent,
// //   MdEvent,
// //   MdNotificationAdd,
// //   MdOutlineAdminPanelSettings,
// //   MdOutlineChevronLeft,
// //   MdOutlineChevronRight,
// //   MdOutlineEmojiTransportation,
// //   MdOutlineEventRepeat,
// //   MdOutlineGrade,
// //   MdWebAsset,
// // } from "react-icons/md";
// // import { GoOrganization } from "react-icons/go";
// // import {
// //   GiBookshelf,
// //   GiCalendarHalfYear,
// //   GiPayMoney,
// //   GiReceiveMoney,
// //   GiTeacher,
// //   GiWhiteBook,
// // } from "react-icons/gi";
// // import {
// //   SiBookstack,
// //   SiGoogleclassroom,
// //   SiPrivatedivision,
// // } from "react-icons/si";
// // import { PiExamFill, PiStudent } from "react-icons/pi";
// // import { HiAcademicCap, HiOutlineAcademicCap, HiOutlineCalendar } from "react-icons/hi2";
// // import { LiaChalkboardTeacherSolid, LiaVoteYeaSolid } from "react-icons/lia";
// // import { GrMoney } from "react-icons/gr";
// // import {
// //   IoIosArrowBack,
// //   IoIosArrowForward,
// //   IoIosTimer,
// //   IoMdBookmarks,
// // } from "react-icons/io";
// // import { IoBookSharp, IoBusSharp, IoCloseSharp } from "react-icons/io5";
// // import { FaLocationDot, FaSquarePollVertical } from "react-icons/fa6";
// // import { CiShoppingTag, CiViewTable } from "react-icons/ci";
// // import { TbBellSchool, TbCalendarTime, TbListNumbers, TbPigMoney, TbReport, TbReportSearch } from "react-icons/tb";
// // import { TiThMenuOutline } from "react-icons/ti";
// // import { BiBusSchool, BiCoinStack, BiSolidBusSchool } from "react-icons/bi";
// // import { LuSchool } from "react-icons/lu";

// // enum DropdownType {
// //   STUDENT = 'student',
// //   TEACHER = 'teacher',
// //   LIBRARY = 'library',
// //   FINANCIAL = 'financial',
// //   TRANSPORT = 'transport',
// //   EVENTS = 'events',
// //   REPORTS = 'reports',
// //   LOOKUPS = 'lookups',
// //   SETTINGS = 'settings',
// //   NOTIFICATION = 'notification',
// //   ROLE = 'role',
// //   MASTER = 'master',
// //   OFFICE = 'office'
// // }

// // const Sidebar: React.FC = () => {
// //   const [isOpen, setIsOpen] = useState(true);
// //   const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
// //   const [openMainDropdown, setOpenMainDropdown] = useState<DropdownType | null>(null);
// //   const [openSettingsDropdown, setOpenSettingsDropdown] = useState<DropdownType | null>(null);
// //   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// //   const location = useLocation();

// //   const toggleMainDropdown = (type: DropdownType) => {
// //     setOpenMainDropdown(openMainDropdown === type ? null : type);
// //     if (type !== DropdownType.SETTINGS) {
// //       setOpenSettingsDropdown(null);
// //     }
// //   };

// //   const toggleSettingsDropdown = (type: DropdownType) => {
// //     setOpenSettingsDropdown(openSettingsDropdown === type ? null : type);
// //     setOpenMainDropdown(DropdownType.SETTINGS);
// //   };

// //   const toggleDropdown = (type: DropdownType) => {
// //     setOpenDropdown(openDropdown === type ? null : type);
// //   };

// //   const toggleSidebar = () => {
// //     setIsOpen((prev) => {
// //       if (prev && windowWidth <= 768) setOpenDropdown(null);
// //       return !prev;
// //     });
// //   };

// //   useEffect(() => {
// //     const handleResize = () => {
// //       setWindowWidth(window.innerWidth);
// //     };

// //     window.addEventListener("resize", handleResize);
// //     return () => {
// //       window.removeEventListener("resize", handleResize);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (windowWidth <= 768) {
// //       setIsOpen(false);
// //     } else {
// //       setIsOpen(true);
// //     }
// //   }, [windowWidth]);

// //   return (
// //     <div
// //       className={`bg-gradient-to-r from-gray-900 via-blue-980 to-gray-800 text-white h-screen flex flex-col ${isOpen ? "w-64" : "w-20"
// //         } transition-all duration-300 ease-in-out shadow-xl`}
// //     >
// //       {/* Header and toggle button */}
// //       <div className="relative">
// //         <button
// //           onClick={toggleSidebar}
// //           className="absolute top-2 right-2 text-black bg-white hover:text-white hover:bg-black p-2 rounded-full transition-colors duration-200 z-10"
// //         >
// //           {isOpen ? <IoCloseSharp /> : <TiThMenuOutline />}
// //         </button>

// //         <div
// //           className={`transition-all duration-300 ease-in-out ${isOpen
// //             ? "bg-gradient-to-br from-gray-800 to-gray-800 rounded-xl m-2 shadow-lg p-2"
// //             : "flex justify-center p-3"
// //             }`}
// //         >
// //           {isOpen ? (
// //             <div className="flex flex-col items-center space-y-2">
// //               <img
// //                 src={schooAppLogo}
// //                 alt="Edu Minute Logo"
// //                 className="w-20 h-20 rounded-full shadow-sm transition-transform hover:scale-105"
// //               />
// //               <h2 className="text-sm font-bold text-center text-gray-300 ">
// //                 <span className="font-['orbit'] tracking-tight"> EDU</span> Minute
// //               </h2>
// //             </div>
// //           ) : (
// //             <img
// //               src={schooAppLogo}
// //               alt="Edu Minute Icon"
// //               className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm transition-all hover:scale-110"
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {/* Navigation */}
// //       <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
// //         <ul className="space-y-1 px-2">
// //           <Link to="/">
// //             <li
// //               className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${location.pathname === "/"
// //                 ? "text-white-900 font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //             >
// //               <FiHome className="text-lg" />
// //               {isOpen && <span className="ml-3">Dashboard</span>}
// //             </li>
// //           </Link>

// //           {/* Student Management */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.STUDENT
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.STUDENT)}
// //             >
// //               <HiAcademicCap className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Student</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.STUDENT ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.STUDENT ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/student-managements/students">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/student-managements/students"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <PiStudent className="text-lg" />
// //                   {isOpen && <span className="ml-3">Students</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/student-managements/students-attendance-marking">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname ===
// //                     "/student-managements/students-attendance-marking"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <FaClipboardList className="text-lg" />
// //                   {isOpen && <span className="ml-3">Mark Attendance</span>}
// //                 </li>
// //               </Link>
// //               {/* <Link to="/student-managements/edit-students-attendance-marking">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${
// //                     location.pathname ===
// //                     "/student-managements/edit-students-attendance-marking"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                   }`}
// //                 >
// //                   <FaClipboardList className="text-lg" />
// //                   {isOpen && <span className="ml-3"> Edit Mark Attendance</span>}
// //                 </li>
// //               </Link> */}

// //               <Link to="/student-managements/students-attendance">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname ===
// //                     "/student-managements/students-attendance"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <GiTeacher className="text-lg" />
// //                   {isOpen && <span className="ml-3">Attendance</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/grades/">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/grades/"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdOutlineGrade className="text-lg" />
// //                   {isOpen && <span className="ml-3">Student Grades</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/assign-rollNo/">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/assign-rollNo/"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbListNumbers className="text-lg" />
// //                   {isOpen && <span className="ml-3">Assign Roll No</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Teacher Management */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TEACHER
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.TEACHER)}
// //             >
// //               <MdCoPresent className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Teacher</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.TEACHER ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TEACHER ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/teachers">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/teachers"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <LiaChalkboardTeacherSolid className="text-lg" />
// //                   {isOpen && <span className="ml-3">Teachers</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/assign-teacher-class">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/assign-teacher-class"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <SiGoogleclassroom className="text-lg" />
// //                   {isOpen && <span className="ml-3">Assign Teachers Class</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/time-tables">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/time-tables"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbCalendarTime className="text-lg" />
// //                   {isOpen && <span className="ml-3">Time Table</span>}
// //                 </li>
// //               </Link>


// //               <Link to="/lookups/teacher-attendance">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/teacher-attendance"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <GiTeacher className="text-lg" />
// //                   {isOpen && <span className="ml-3">Attendance</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/teacher-attendance/add">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/teacher-attendance/add"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <LiaChalkboardTeacherSolid className="text-lg" />
// //                   {isOpen && <span className="ml-3">Mark Attendance</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/substitute-teachers">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/teacher-attendance/add"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <LiaChalkboardTeacherSolid className="text-lg" />
// //                   {isOpen && <span className="ml-3">Substitute Teacher</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Exam Management */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LIBRARY
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.LIBRARY)}
// //             >
// //               <GiBookshelf className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Exam</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.LIBRARY ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LIBRARY ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/exam-types">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/exam-types"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <PiExamFill className="text-lg" />
// //                   {isOpen && <span className="ml-3">Exam Type</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/exams">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/exams"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <LiaVoteYeaSolid className="text-lg" />
// //                   {isOpen && <span className="ml-3">Exam</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Fee Management */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.FINANCIAL
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.FINANCIAL)}
// //             >
// //               <RiMoneyRupeeCircleLine className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Fee</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.FINANCIAL ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.FINANCIAL ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/fee-types">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/fee-types"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <RiCoinLine className="text-lg" />
// //                   {isOpen && <span className="ml-3">Fee Type</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/fee-installment-types">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/fee-installment-types"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <BiCoinStack className="text-lg" />
// //                   {isOpen && <span className="ml-3">Installment Type</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/fee-structures">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/fee-structures"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <GrMoney className="text-lg" />
// //                   {isOpen && <span className="ml-3">Fee Structures</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/fee-collected">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/fee-collected"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <GiPayMoney className="text-lg" />
// //                   {isOpen && <span className="ml-3">Add Payment</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/payments">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/payments"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <GiReceiveMoney className="text-lg" />
// //                   {isOpen && <span className="ml-3">All Payments</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Transport Management */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TRANSPORT
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.TRANSPORT)}
// //             >
// //               <IoBusSharp className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Transport</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.TRANSPORT ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>
// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TRANSPORT ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/vehicle-types">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/vehicle-types"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <BiBusSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">Transport Type</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/vehicle-info">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/vehicle-info"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <MdOutlineEmojiTransportation className="text-lg" />
// //                   {isOpen && <span className="ml-3">Vehicles Info</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/students-transports">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/students-transports"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <FaLocationDot className="text-lg" />
// //                   {isOpen && <span className="ml-3">Students Transport</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Events */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.EVENTS
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.EVENTS)}
// //             >
// //               <MdOutlineEventRepeat className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Events</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.EVENTS ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.EVENTS ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/event-type/">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/event-type/"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <HiOutlineCalendar className="text-lg" />
// //                   {isOpen && <span className="ml-3">Event Type</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/event/">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/event/"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdEvent className="text-lg" />
// //                   {isOpen && <span className="ml-3">All Event</span>}
// //                 </li>
// //               </Link>


// //             </ul>
// //           </li>

// //           {/* Reports */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.REPORTS
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.REPORTS)}
// //             >
// //               <TbReportSearch className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Reports</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.REPORTS ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.REPORTS ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/reports/attendance-report">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/reports/attendance-report"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbReport className="text-lg" />
// //                   {isOpen && <span className="ml-3">Attendance Report</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/reports/progress-report">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/reports/progress-report"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbReport className="text-lg" />
// //                   {isOpen && <span className="ml-3">Progress Report</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>
// //           {/* office */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.OFFICE
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.OFFICE)}
// //             >
// //               <LuSchool className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Office</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.OFFICE ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.OFFICE ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/pta-role">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/pta-role"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbBellSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">P.T.A Role</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/pta-profile">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/pta-profile"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbBellSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">P.T.A Profile</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/lookups/department">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/department"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbBellSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">Department</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/designation">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/designation"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbBellSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">Designation</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/school-management">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/school-management"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <TbBellSchool className="text-lg" />
// //                   {isOpen && <span className="ml-3">School Management</span>}
// //                 </li>
// //               </Link>






// //             </ul>
// //           </li>


// //           {/* Lookups */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LOOKUPS
// //                 ? "text-white"
// //                 : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.LOOKUPS)}
// //             >
// //               <HiOutlineAcademicCap className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Academic Settings</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.LOOKUPS ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>
// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LOOKUPS ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/lookups/academic-years">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/academic-years"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <GiCalendarHalfYear className="text-lg" />
// //                   {isOpen && <span className="ml-3">Academic Year</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/classes">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/classes"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <SiGoogleclassroom className="text-lg" />
// //                   {isOpen && <span className="ml-3">Class</span>}
// //                 </li>
// //               </Link>

// //               {/* Class timetbable */}
// //               {/* <Link to="/lookups/class-timetable">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/class-timetable"
// //                     ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                     : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <CiViewTable className="text-lg" />
// //                   {isOpen && <span className="ml-3">Class Timetable</span>}
// //                 </li>
// //               </Link> */}

// //               <Link to="/lookups/divisions">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/divisions"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <SiPrivatedivision className="text-lg" />
// //                   {isOpen && <span className="ml-3">Division</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/attendance-status">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/attendance-status"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <MdCoPresent className="text-lg" />
// //                   {isOpen && <span className="ml-3">Attendance Status</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/subjects">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/subjects"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <GiWhiteBook className="text-lg" />
// //                   {isOpen && <span className="ml-3">Subject</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/syllabuses">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/syllabuses"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <SiBookstack className="text-lg" />
// //                   {isOpen && <span className="ml-3">Syllabus</span>}
// //                 </li>
// //               </Link>
// //               <Link to="/lookups/time-slot">
// //                 <li className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/lookups/time-slot"
// //                   ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                   }`}>
// //                   <IoIosTimer className="text-lg" />
// //                   {isOpen && <span className="ml-3">Time Slot</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>

// //           {/* Settings */}
// //           <li>
// //             <div
// //               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.SETTINGS
// //                   ? "text-white"
// //                   : "hover:bg-blue-700 hover:text-white"
// //                 }`}
// //               onClick={() => toggleDropdown(DropdownType.SETTINGS)}
// //             >
// //               <IoSettings className="text-lg" />
// //               {isOpen && <span className="ml-3 flex-1">Settings</span>}
// //               {isOpen && (
// //                 <FaAngleDown
// //                   className={`transition-transform duration-200 ${openDropdown === DropdownType.SETTINGS ? "rotate-180" : ""
// //                     }`}
// //                 />
// //               )}
// //             </div>

// //             <ul
// //               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.SETTINGS ? "max-h-screen" : "max-h-0"
// //                 }`}
// //             >
// //               <Link to="/page">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/page"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdWebAsset className="text-lg" />
// //                   {isOpen && <span className="ml-3">CMS Page</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/notifications/notification-smart-tags/">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/notifications/notification-smart-tags/"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdNotificationAdd className="text-lg" />
// //                   {isOpen && <span className="ml-3">Smart tags</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/notifications/notification-functionality">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/notifications/notification-functionality"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdNotificationAdd className="text-lg" />
// //                   {isOpen && <span className="ml-3">Functionalities</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/notifications/notification-module">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/notifications/notification-module"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdNotificationAdd className="text-lg" />
// //                   {isOpen && <span className="ml-3">Modules</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/notifications/notification-template">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/notifications/notification-template"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdNotificationAdd className="text-lg" />
// //                   {isOpen && <span className="ml-3">Templates</span>}
// //                 </li>
// //               </Link>

// //               <Link to="/notifications/notification">
// //                 <li
// //                   className={`flex items-center p-3 pl-10 rounded-lg transition-all duration-200 relative ${location.pathname === "/notifications/notification"
// //                       ? "text-white font-medium before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-blue-500 before:rounded-r"
// //                       : "hover:bg-blue-700 hover:text-white"
// //                     }`}
// //                 >
// //                   <MdNotificationAdd className="text-lg" />
// //                   {isOpen && <span className="ml-3">Notification</span>}
// //                 </li>
// //               </Link>
// //             </ul>
// //           </li>
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiHome } from "react-icons/fi";
// import {
//   FaExpand,
//   FaBars,
//   FaAngleDown,
//   FaUsers,
//   FaUserLock,
//   FaUserTie,
//   FaMoneyCheck,
//   FaClipboardList,
// } from "react-icons/fa";
// import { VscFileSubmodule, VscSymbolMethod } from "react-icons/vsc";
// import schooAppLogo from "@/assets/images/Skolabyte Logo.png";
// import beatStack from '@/assets/images/Beetstack Logo.png'
// import { RiAdminLine, RiCoinLine, RiMoneyRupeeCircleLine, RiTableLine } from "react-icons/ri";
// import { IoSettings } from "react-icons/io5";
// import {
//   MdAttachMoney,
//   MdCoPresent,
//   MdEvent,
//   MdNotificationAdd,
//   MdOutlineAdminPanelSettings,
//   MdOutlineChevronLeft,
//   MdOutlineChevronRight,
//   MdOutlineEmojiTransportation,
//   MdOutlineEventRepeat,
//   MdOutlineGrade,
//   MdWebAsset,
// } from "react-icons/md";
// import { GoOrganization } from "react-icons/go";
// import {
//   GiBookshelf,
//   GiCalendarHalfYear,
//   GiPayMoney,
//   GiReceiveMoney,
//   GiTeacher,
//   GiWhiteBook,
// } from "react-icons/gi";
// import {
//   SiBookstack,
//   SiGoogleclassroom,
//   SiPrivatedivision,
// } from "react-icons/si";
// import { PiExamFill, PiStudent } from "react-icons/pi";
// import { HiAcademicCap, HiOutlineAcademicCap, HiOutlineCalendar } from "react-icons/hi2";
// import { LiaChalkboardTeacherSolid, LiaVoteYeaSolid } from "react-icons/lia";
// import { GrMoney } from "react-icons/gr";
// import {
//   IoIosArrowBack,
//   IoIosArrowForward,
//   IoIosTimer,
//   IoMdBookmarks,
// } from "react-icons/io";
// import { IoBookSharp, IoBusSharp, IoCloseSharp } from "react-icons/io5";
// import { FaLocationDot, FaSquarePollVertical } from "react-icons/fa6";
// import { CiShoppingTag, CiViewTable } from "react-icons/ci";
// import { TbBellSchool, TbCalendarTime, TbListNumbers, TbPigMoney, TbReport, TbReportSearch } from "react-icons/tb";
// import { TiThMenuOutline } from "react-icons/ti";
// import { BiBusSchool, BiCoinStack, BiSolidBusSchool } from "react-icons/bi";
// import { LuSchool } from "react-icons/lu";

// enum DropdownType {
//   STUDENT = 'student',
//   TEACHER = 'teacher',
//   LIBRARY = 'library',
//   FINANCIAL = 'financial',
//   TRANSPORT = 'transport',
//   EVENTS = 'events',
//   REPORTS = 'reports',
//   LOOKUPS = 'lookups',
//   SETTINGS = 'settings',
//   NOTIFICATION = 'notification',
//   ROLE = 'role',
//   MASTER = 'master',
//   OFFICE = 'office'
// }

// const Sidebar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
//   const [openMainDropdown, setOpenMainDropdown] = useState<DropdownType | null>(null);
//   const [openSettingsDropdown, setOpenSettingsDropdown] = useState<DropdownType | null>(null);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const location = useLocation();

//   const toggleMainDropdown = (type: DropdownType) => {
//     setOpenMainDropdown(openMainDropdown === type ? null : type);
//     if (type !== DropdownType.SETTINGS) {
//       setOpenSettingsDropdown(null);
//     }
//   };

//   const toggleSettingsDropdown = (type: DropdownType) => {
//     setOpenSettingsDropdown(openSettingsDropdown === type ? null : type);
//     setOpenMainDropdown(DropdownType.SETTINGS);
//   };

//   const toggleDropdown = (type: DropdownType) => {
//     setOpenDropdown(openDropdown === type ? null : type);
//   };

//   const toggleSidebar = () => {
//     setIsOpen((prev) => {
//       if (prev && windowWidth <= 768) setOpenDropdown(null);
//       return !prev;
//     });
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     if (windowWidth <= 768) {
//       setIsOpen(false);
//     } else {
//       setIsOpen(true);
//     }
//   }, [windowWidth]);

//   return (
//     <div
//       className={`bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 ${isOpen ? "w-64" : "w-20"
//         } transition-all duration-300 ease-in-out shadow-lg`}
//     >
//       {/* Header and toggle button */}
//       <div className="relative border-b border-gray-200">
//         <button
//           onClick={toggleSidebar}
//           className={`absolute top-4 ${isOpen ? 'right-4' : 'right-2'} text-white bg-[#90a63b] hover:text-white hover:bg-[#798c2f] p-2 rounded-full transition-all duration-200 z-10`}
//         >
//           {isOpen ? (
//             <MdOutlineChevronLeft className="text-xl" />
//           ) : (
//             <MdOutlineChevronRight className="text-xl" />
//           )}
//         </button>

//         <div
//           className={`flex items-center justify-center ${isOpen ? "px-4 py-6" : "py-6"}`}
//         >
//           {isOpen ? (
//             <div className="flex flex-col items-center space-y-2">
//               <img src={schooAppLogo} alt="School App Logo" className="h-12 w-32 object-fit-contain" />
//               <p className="text-xs text-gray-500">School Management System</p>
//             </div>
//           ) : (
//             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
//         <ul className="space-y-1 px-2">
//           <Link to="/">
//             <li
//               className={`flex items-center p-3 rounded-lg transition-all duration-200 ${location.pathname === "/"
//                 ? "bg-[#90a63b]/30 text-[#7a9122] font-medium border-l-4 border-[#90a63b]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//             >
//               <FiHome className="text-lg" />
//               {isOpen && <span className="ml-3">Dashboard</span>}
//             </li>
//           </Link>

//           {/* Student Management */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.STUDENT
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.STUDENT)}
//             >
//               <HiAcademicCap className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Student</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.STUDENT ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.STUDENT ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/student-managements/students">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/student-managements/students"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <PiStudent className="text-lg" />
//                   {isOpen && <span className="ml-3">Students</span>}
//                 </li>
//               </Link>

//               <Link to="/student-managements/students-attendance-marking">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname ===
//                     "/student-managements/students-attendance-marking"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <FaClipboardList className="text-lg" />
//                   {isOpen && <span className="ml-3">Mark Attendance</span>}
//                 </li>
//               </Link>

//               <Link to="/student-managements/students-attendance">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname ===
//                     "/student-managements/students-attendance"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <GiTeacher className="text-lg" />
//                   {isOpen && <span className="ml-3">Attendance</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/grades/">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/grades/"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdOutlineGrade className="text-lg" />
//                   {isOpen && <span className="ml-3">Student Grades</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/assign-rollNo/">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/assign-rollNo/"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbListNumbers className="text-lg" />
//                   {isOpen && <span className="ml-3">Assign Roll No</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Teacher Management */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TEACHER
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.TEACHER)}
//             >
//               <MdCoPresent className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Teacher</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.TEACHER ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TEACHER ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/teachers">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teachers"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <LiaChalkboardTeacherSolid className="text-lg" />
//                   {isOpen && <span className="ml-3">Teachers</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/assign-teacher-class">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/assign-teacher-class"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <SiGoogleclassroom className="text-lg" />
//                   {isOpen && <span className="ml-3">Assign Teachers Class</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/time-tables">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/time-tables"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbCalendarTime className="text-lg" />
//                   {isOpen && <span className="ml-3">Time Table</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/teacher-attendance">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <GiTeacher className="text-lg" />
//                   {isOpen && <span className="ml-3">Attendance</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/teacher-attendance/add">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance/add"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <LiaChalkboardTeacherSolid className="text-lg" />
//                   {isOpen && <span className="ml-3">Mark Attendance</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/substitute-teachers">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance/add"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <LiaChalkboardTeacherSolid className="text-lg" />
//                   {isOpen && <span className="ml-3">Substitute Teacher</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Exam Management */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LIBRARY
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.LIBRARY)}
//             >
//               <GiBookshelf className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Exam</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.LIBRARY ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LIBRARY ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/exam-types">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/exam-types"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <PiExamFill className="text-lg" />
//                   {isOpen && <span className="ml-3">Exam Type</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/exams">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/exams"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <LiaVoteYeaSolid className="text-lg" />
//                   {isOpen && <span className="ml-3">Exam</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Fee Management */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.FINANCIAL
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.FINANCIAL)}
//             >
//               <RiMoneyRupeeCircleLine className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Fee</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.FINANCIAL ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.FINANCIAL ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/fee-types">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-types"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <RiCoinLine className="text-lg" />
//                   {isOpen && <span className="ml-3">Fee Type</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/fee-installment-types">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-installment-types"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <BiCoinStack className="text-lg" />
//                   {isOpen && <span className="ml-3">Installment Type</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/fee-structures">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-structures"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <GrMoney className="text-lg" />
//                   {isOpen && <span className="ml-3">Fee Structures</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/fee-collected">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-collected"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <GiPayMoney className="text-lg" />
//                   {isOpen && <span className="ml-3">Add Payment</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/payments">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/payments"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <GiReceiveMoney className="text-lg" />
//                   {isOpen && <span className="ml-3">All Payments</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Transport Management */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TRANSPORT
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.TRANSPORT)}
//             >
//               <IoBusSharp className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Transport</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.TRANSPORT ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>
//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TRANSPORT ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/vehicle-types">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/vehicle-types"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <BiBusSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">Transport Type</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/vehicle-info">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/vehicle-info"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <MdOutlineEmojiTransportation className="text-lg" />
//                   {isOpen && <span className="ml-3">Vehicles Info</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/students-transports">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/students-transports"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <FaLocationDot className="text-lg" />
//                   {isOpen && <span className="ml-3">Students Transport</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Events */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.EVENTS
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.EVENTS)}
//             >
//               <MdOutlineEventRepeat className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Events</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.EVENTS ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.EVENTS ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/event-type/">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/event-type/"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <HiOutlineCalendar className="text-lg" />
//                   {isOpen && <span className="ml-3">Event Type</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/event/">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/event/"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdEvent className="text-lg" />
//                   {isOpen && <span className="ml-3">All Event</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Reports */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.REPORTS
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.REPORTS)}
//             >
//               <TbReportSearch className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Reports</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.REPORTS ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.REPORTS ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/reports/attendance-report">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/reports/attendance-report"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbReport className="text-lg" />
//                   {isOpen && <span className="ml-3">Attendance Report</span>}
//                 </li>
//               </Link>

//               <Link to="/reports/progress-report">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/reports/progress-report"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbReport className="text-lg" />
//                   {isOpen && <span className="ml-3">Progress Report</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>
          
//           {/* office */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.OFFICE
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.OFFICE)}
//             >
//               <LuSchool className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Office</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.OFFICE ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.OFFICE ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/pta-role">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/pta-role"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbBellSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">P.T.A Role</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/pta-profile">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/pta-profile"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbBellSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">P.T.A Profile</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/department">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/department"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbBellSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">Department</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/designation">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/designation"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbBellSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">Designation</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/school-management">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/school-management"
//                     ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                     : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <TbBellSchool className="text-lg" />
//                   {isOpen && <span className="ml-3">School Management</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Lookups */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LOOKUPS
//                 ? "bg-[#90a63b]/30 text-[#7a9122]"
//                 : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.LOOKUPS)}
//             >
//               <HiOutlineAcademicCap className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Academic Settings</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.LOOKUPS ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>
//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LOOKUPS ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/lookups/academic-years">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/academic-years"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <GiCalendarHalfYear className="text-lg" />
//                   {isOpen && <span className="ml-3">Academic Year</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/classes">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/classes"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <SiGoogleclassroom className="text-lg" />
//                   {isOpen && <span className="ml-3">Class</span>}
//                 </li>
//               </Link>

//               <Link to="/lookups/divisions">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/divisions"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <SiPrivatedivision className="text-lg" />
//                   {isOpen && <span className="ml-3">Division</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/attendance-status">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/attendance-status"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <MdCoPresent className="text-lg" />
//                   {isOpen && <span className="ml-3">Attendance Status</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/subjects">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/subjects"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <GiWhiteBook className="text-lg" />
//                   {isOpen && <span className="ml-3">Subject</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/syllabuses">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/syllabuses"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <SiBookstack className="text-lg" />
//                   {isOpen && <span className="ml-3">Syllabus</span>}
//                 </li>
//               </Link>
//               <Link to="/lookups/time-slot">
//                 <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/time-slot"
//                   ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                   }`}>
//                   <IoIosTimer className="text-lg" />
//                   {isOpen && <span className="ml-3">Time Slot</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>

//           {/* Settings */}
//           <li>
//             <div
//               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.SETTINGS
//                   ? "bg-[#90a63b]/30 text-[#7a9122]"
//                   : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                 }`}
//               onClick={() => toggleDropdown(DropdownType.SETTINGS)}
//             >
//               <IoSettings className="text-lg" />
//               {isOpen && <span className="ml-3 flex-1">Settings</span>}
//               {isOpen && (
//                 <FaAngleDown
//                   className={`transition-transform duration-200 ${openDropdown === DropdownType.SETTINGS ? "rotate-180 text-[#7a9122]" : "text-gray-400"
//                     }`}
//                 />
//               )}
//             </div>

//             <ul
//               className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.SETTINGS ? "max-h-screen" : "max-h-0"
//                 }`}
//             >
//               <Link to="/page">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/page"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdWebAsset className="text-lg" />
//                   {isOpen && <span className="ml-3">CMS Page</span>}
//                 </li>
//               </Link>

//               <Link to="/notifications/notification-smart-tags/">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-smart-tags/"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdNotificationAdd className="text-lg" />
//                   {isOpen && <span className="ml-3">Smart tags</span>}
//                 </li>
//               </Link>

//               <Link to="/notifications/notification-functionality">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-functionality"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdNotificationAdd className="text-lg" />
//                   {isOpen && <span className="ml-3">Functionalities</span>}
//                 </li>
//               </Link>

//               <Link to="/notifications/notification-module">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-module"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdNotificationAdd className="text-lg" />
//                   {isOpen && <span className="ml-3">Modules</span>}
//                 </li>
//               </Link>

//               <Link to="/notifications/notification-template">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-template"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdNotificationAdd className="text-lg" />
//                   {isOpen && <span className="ml-3">Templates</span>}
//                 </li>
//               </Link>

//               <Link to="/notifications/notification">
//                 <li
//                   className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification"
//                       ? "bg-[#90a63b]/30 text-[#7a9122] font-medium"
//                       : "hover:bg-[#90a63b]/30 hover:text-[#7a9122]"
//                     }`}
//                 >
//                   <MdNotificationAdd className="text-lg" />
//                   {isOpen && <span className="ml-3">Notification</span>}
//                 </li>
//               </Link>
//             </ul>
//           </li>
//         </ul>
//       </div>

//       {/* Powered by section */}
//       <div className="p-4 border-t border-gray-200">
//         <div className="flex flex-col items-center">
//           {isOpen ? (
//             <>
//               <div className="text-xs text-gray-500 mb-1">Powered by</div>
//               <div className="flex items-center">
//                 <span className="text-sm font-medium text-gray-700"><img src={beatStack} alt="logo" className="w-20 h-7" /></span>
//               </div>
//             </>
//           ) : (
//             <div className="text-xs text-gray-500">
//               <img src={beatStack} className="w-28 h-5"/>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import {
  FaAngleDown,
  FaClipboardList,
} from "react-icons/fa";
import schooAppLogo from "@/assets/images/Skolabyte Logo.png";
import beatStack from '@/assets/images/Beetstack Logo.png';
import { RiMoneyRupeeCircleLine, RiCoinLine } from "react-icons/ri";
import { IoSettings, IoTimerOutline } from "react-icons/io5";
import {
  MdCoPresent,
  MdEvent,
  MdNotificationAdd,
  MdOutlineEmojiTransportation,
  MdOutlineEventRepeat,
  MdOutlineGrade,
  MdWebAsset,
} from "react-icons/md";
import {
  GiBookshelf,
  GiCalendarHalfYear,
  GiPayMoney,
  GiReceiveMoney,
  GiTeacher,
  GiWhiteBook,
} from "react-icons/gi";
import {
  SiBookstack,
  SiGoogleclassroom,
  SiPrivatedivision,
} from "react-icons/si";
import { PiExamFill, PiStudent } from "react-icons/pi";
import { HiAcademicCap, HiOutlineAcademicCap, HiOutlineCalendar } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid, LiaVoteYeaSolid } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import { IoAnalyticsOutline, IoBusSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { TbBellSchool, TbCalendarTime, TbListNumbers, TbReport, TbReportSearch } from "react-icons/tb";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { BiBusSchool, BiCoinStack } from "react-icons/bi";
import { LuSchool } from "react-icons/lu";

enum DropdownType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  LIBRARY = 'library',
  FINANCIAL = 'financial',
  TRANSPORT = 'transport',
  EVENTS = 'events',
  REPORTS = 'reports',
  LOOKUPS = 'lookups',
  SETTINGS = 'settings',
  OFFICE = 'office'
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      if (prev && windowWidth <= 768) setOpenDropdown(null);
      return !prev;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth <= 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [windowWidth]);

  
  const colors = {
    primary: '#4f6f52',
    secondary: '#86a789',
    accent: '#d2e3c8',
    highlight: '#f5efe6', 
    text: '#333333',
    lightText: '#5a5a5a',
    border: '#e0e0e0', 
    icon: '#6b7280',
    activeIcon: '#4f6f52',
    toggleBtn : '#90a63b'
  };

  return (
    <div
      className={`bg-white text-${colors.text} h-screen flex flex-col border-r border-${colors.border} ${isOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out shadow-lg relative`}
      style={{ backgroundColor: "white" }}
    >
      {/* Header section with school logo */}
      <div className={`relative border-b border-${colors.border} bg-white`}>
        <button
          onClick={toggleSidebar}
          className={`absolute top-4 ${isOpen ? 'right-4' : 'right-2'} text-white bg-${colors.primary} hover:bg-${colors.secondary} p-2 rounded-full transition-all duration-200 z-10 shadow-md`}
          style={{ backgroundColor: colors.toggleBtn }}
        >
          {isOpen ? (
            <MdOutlineChevronLeft className="text-xl" />
          ) : (
            <MdOutlineChevronRight className="text-xl" />
          )}
        </button>

        <div
          className={`flex items-center justify-center ${isOpen ? "px-4 py-6" : "py-6"}`}
        >
          {isOpen ? (
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={schooAppLogo} 
                alt="School App Logo" 
                className="h-12 w-auto object-contain transition-transform hover:scale-105" 
              />
              <p className="text-xs text-gray-500 font-medium tracking-wider">SCHOOL MANAGEMENT SYSTEM</p>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: colors.primary }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2">
        <ul className="space-y-1 px-2">
          {/* Dashboard */}
          <Link to="/">
            <li
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${location.pathname === "/"
                ? `bg-${colors.accent} text-${colors.primary} font-medium border-l-4`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              style={{
                backgroundColor: location.pathname === "/" ? colors.accent : '',
                color: location.pathname === "/" ? colors.primary : colors.text,
                borderLeftColor: location.pathname === "/" ? colors.primary : 'transparent'
              }}
            >
              <FiHome 
                className="text-lg" 
                style={{ color: location.pathname === "/" ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3">Dashboard</span>}
            </li>
          </Link>

          {/* Student Management */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.STUDENT
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.STUDENT)}
              style={{
                backgroundColor: openDropdown === DropdownType.STUDENT ? colors.accent : '',
                color: openDropdown === DropdownType.STUDENT ? colors.primary : colors.text
              }}
            >
              <HiAcademicCap 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.STUDENT ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Student</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.STUDENT ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.STUDENT ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.STUDENT ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/student-managements/students">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/student-managements/students"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/student-managements/students" ? colors.accent : '',
                    color: location.pathname === "/student-managements/students" ? colors.primary : colors.text
                  }}
                >
                  <PiStudent 
                    className="text-lg" 
                    style={{ color: location.pathname === "/student-managements/students" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Students</span>}
                </li>
              </Link>

              <Link to="/student-managements/students-attendance-marking">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname ===
                    "/student-managements/students-attendance-marking"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/student-managements/students-attendance-marking" ? colors.accent : '',
                    color: location.pathname === "/student-managements/students-attendance-marking" ? colors.primary : colors.text
                  }}
                >
                  <FaClipboardList 
                    className="text-lg" 
                    style={{ color: location.pathname === "/student-managements/students-attendance-marking" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Mark Attendance</span>}
                </li>
              </Link>

              <Link to="/student-managements/students-attendance">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname ===
                    "/student-managements/students-attendance"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/student-managements/students-attendance" ? colors.accent : '',
                    color: location.pathname === "/student-managements/students-attendance" ? colors.primary : colors.text
                  }}
                >
                  <GiTeacher 
                    className="text-lg" 
                    style={{ color: location.pathname === "/student-managements/students-attendance" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Attendance</span>}
                </li>
              </Link>

              <Link to="/lookups/grades/">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/grades/"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/grades/" ? colors.accent : '',
                    color: location.pathname === "/lookups/grades/" ? colors.primary : colors.text
                  }}
                >
                  <MdOutlineGrade 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/grades/" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Student Grades</span>}
                </li>
              </Link>
              <Link to="/lookups/assign-rollNo/">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/assign-rollNo/"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/assign-rollNo/" ? colors.accent : '',
                    color: location.pathname === "/lookups/assign-rollNo/" ? colors.primary : colors.text
                  }}
                >
                  <TbListNumbers 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/assign-rollNo/" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Assign Roll No</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Teacher Management */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TEACHER
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.TEACHER)}
              style={{
                backgroundColor: openDropdown === DropdownType.TEACHER ? colors.accent : '',
                color: openDropdown === DropdownType.TEACHER ? colors.primary : colors.text
              }}
            >
              <MdCoPresent 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.TEACHER ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Teacher</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.TEACHER ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.TEACHER ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TEACHER ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/teachers">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teachers"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/teachers" ? colors.accent : '',
                    color: location.pathname === "/lookups/teachers" ? colors.primary : colors.text
                  }}
                >
                  <LiaChalkboardTeacherSolid 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/teachers" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Teachers</span>}
                </li>
              </Link>
              <Link to="/lookups/assign-teacher-class">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/assign-teacher-class"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/assign-teacher-class" ? colors.accent : '',
                    color: location.pathname === "/lookups/assign-teacher-class" ? colors.primary : colors.text
                  }}
                >
                  <SiGoogleclassroom 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/assign-teacher-class" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Assign Teachers Class</span>}
                </li>
              </Link>
              <Link to="/lookups/time-tables">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/time-tables"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/time-tables" ? colors.accent : '',
                    color: location.pathname === "/lookups/time-tables" ? colors.primary : colors.text
                  }}
                >
                  <TbCalendarTime 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/time-tables" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Time Table</span>}
                </li>
              </Link>

              <Link to="/lookups/teacher-attendance">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/teacher-attendance" ? colors.accent : '',
                    color: location.pathname === "/lookups/teacher-attendance" ? colors.primary : colors.text
                  }}
                >
                  <GiTeacher 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/teacher-attendance" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Attendance</span>}
                </li>
              </Link>

              <Link to="/lookups/teacher-attendance/add">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance/add"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/teacher-attendance/add" ? colors.accent : '',
                    color: location.pathname === "/lookups/teacher-attendance/add" ? colors.primary : colors.text
                  }}
                >
                  <LiaChalkboardTeacherSolid 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/teacher-attendance/add" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Mark Attendance</span>}
                </li>
              </Link>
              <Link to="/lookups/substitute-teachers">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/teacher-attendance/add"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/teacher-attendance/add" ? colors.accent : '',
                    color: location.pathname === "/lookups/teacher-attendance/add" ? colors.primary : colors.text
                  }}
                >
                  <LiaChalkboardTeacherSolid 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/teacher-attendance/add" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Substitute Teacher</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Exam Management */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LIBRARY
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.LIBRARY)}
              style={{
                backgroundColor: openDropdown === DropdownType.LIBRARY ? colors.accent : '',
                color: openDropdown === DropdownType.LIBRARY ? colors.primary : colors.text
              }}
            >
              <GiBookshelf 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.LIBRARY ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Exam</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.LIBRARY ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.LIBRARY ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LIBRARY ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/exam-types">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/exam-types"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/exam-types" ? colors.accent : '',
                    color: location.pathname === "/lookups/exam-types" ? colors.primary : colors.text
                  }}
                >
                  <PiExamFill 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/exam-types" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Exam Type</span>}
                </li>
              </Link>

              <Link to="/lookups/exams">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/exams"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/exams" ? colors.accent : '',
                    color: location.pathname === "/lookups/exams" ? colors.primary : colors.text
                  }}
                >
                  <LiaVoteYeaSolid 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/exams" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Exam</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Fee Management */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.FINANCIAL
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.FINANCIAL)}
              style={{
                backgroundColor: openDropdown === DropdownType.FINANCIAL ? colors.accent : '',
                color: openDropdown === DropdownType.FINANCIAL ? colors.primary : colors.text
              }}
            >
              <RiMoneyRupeeCircleLine 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.FINANCIAL ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Fee</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.FINANCIAL ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.FINANCIAL ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.FINANCIAL ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/fee-types">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-types"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/fee-types" ? colors.accent : '',
                    color: location.pathname === "/lookups/fee-types" ? colors.primary : colors.text
                  }}
                >
                  <RiCoinLine 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/fee-types" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Fee Type</span>}
                </li>
              </Link>

              <Link to="/lookups/fee-installment-types">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-installment-types"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/fee-installment-types" ? colors.accent : '',
                    color: location.pathname === "/lookups/fee-installment-types" ? colors.primary : colors.text
                  }}
                >
                  <BiCoinStack 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/fee-installment-types" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Installment Type</span>}
                </li>
              </Link>

              <Link to="/lookups/fee-structures">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-structures"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/fee-structures" ? colors.accent : '',
                    color: location.pathname === "/lookups/fee-structures" ? colors.primary : colors.text
                  }}
                >
                  <GrMoney 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/fee-structures" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Fee Structures</span>}
                </li>
              </Link>

              <Link to="/lookups/fee-collected">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/fee-collected"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/fee-collected" ? colors.accent : '',
                    color: location.pathname === "/lookups/fee-collected" ? colors.primary : colors.text
                  }}
                >
                  <GiPayMoney 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/fee-collected" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Add Payment</span>}
                </li>
              </Link>

              <Link to="/lookups/payments">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/payments"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/payments" ? colors.accent : '',
                    color: location.pathname === "/lookups/payments" ? colors.primary : colors.text
                  }}
                >
                  <GiReceiveMoney 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/payments" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">All Payments</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Transport Management */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.TRANSPORT
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.TRANSPORT)}
              style={{
                backgroundColor: openDropdown === DropdownType.TRANSPORT ? colors.accent : '',
                color: openDropdown === DropdownType.TRANSPORT ? colors.primary : colors.text
              }}
            >
              <IoBusSharp 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.TRANSPORT ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Transport</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.TRANSPORT ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.TRANSPORT ? colors.primary : colors.icon }}
                />
              )}
            </div>
            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.TRANSPORT ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/vehicle-types">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/vehicle-types"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/vehicle-types" ? colors.accent : '',
                    color: location.pathname === "/lookups/vehicle-types" ? colors.primary : colors.text
                  }}
                >
                  <BiBusSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/vehicle-types" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Transport Type</span>}
                </li>
              </Link>
              <Link to="/lookups/vehicle-info">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/vehicle-info"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/vehicle-info" ? colors.accent : '',
                    color: location.pathname === "/lookups/vehicle-info" ? colors.primary : colors.text
                  }}
                >
                  <MdOutlineEmojiTransportation 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/vehicle-info" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Vehicles Info</span>}
                </li>
              </Link>
              <Link to="/lookups/students-transports">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/students-transports"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/students-transports" ? colors.accent : '',
                    color: location.pathname === "/lookups/students-transports" ? colors.primary : colors.text
                  }}
                >
                  <FaLocationDot 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/students-transports" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Students Transport</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Events */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.EVENTS
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.EVENTS)}
              style={{
                backgroundColor: openDropdown === DropdownType.EVENTS ? colors.accent : '',
                color: openDropdown === DropdownType.EVENTS ? colors.primary : colors.text
              }}
            >
              <MdOutlineEventRepeat 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.EVENTS ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Events</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.EVENTS ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.EVENTS ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.EVENTS ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/event-type/">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/event-type/"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/event-type/" ? colors.accent : '',
                    color: location.pathname === "/lookups/event-type/" ? colors.primary : colors.text
                  }}
                >
                  <HiOutlineCalendar 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/event-type/" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Event Type</span>}
                </li>
              </Link>
              <Link to="/lookups/event/">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/event/"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/event/" ? colors.accent : '',
                    color: location.pathname === "/lookups/event/" ? colors.primary : colors.text
                  }}
                >
                  <MdEvent 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/event/" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">All Event</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Reports */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.REPORTS
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.REPORTS)}
              style={{
                backgroundColor: openDropdown === DropdownType.REPORTS ? colors.accent : '',
                color: openDropdown === DropdownType.REPORTS ? colors.primary : colors.text
              }}
            >
              <TbReportSearch 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.REPORTS ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Reports</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.REPORTS ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.REPORTS ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.REPORTS ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/reports/attendance-report">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/reports/attendance-report"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/reports/attendance-report" ? colors.accent : '',
                    color: location.pathname === "/reports/attendance-report" ? colors.primary : colors.text
                  }}
                >
                  <TbReport 
                    className="text-lg" 
                    style={{ color: location.pathname === "/reports/attendance-report" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Attendance Report</span>}
                </li>
              </Link>

              <Link to="/reports/progress-report">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/reports/progress-report"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/reports/progress-report" ? colors.accent : '',
                    color: location.pathname === "/reports/progress-report" ? colors.primary : colors.text
                  }}
                >
                  <TbReport 
                    className="text-lg" 
                    style={{ color: location.pathname === "/reports/progress-report" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Progress Report</span>}
                </li>
              </Link>
            </ul>
          </li>
          
          {/* office */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.OFFICE
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.OFFICE)}
              style={{
                backgroundColor: openDropdown === DropdownType.OFFICE ? colors.accent : '',
                color: openDropdown === DropdownType.OFFICE ? colors.primary : colors.text
              }}
            >
              <LuSchool 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.OFFICE ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Office</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.OFFICE ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.OFFICE ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.OFFICE ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/pta-role">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/pta-role"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/pta-role" ? colors.accent : '',
                    color: location.pathname === "/lookups/pta-role" ? colors.primary : colors.text
                  }}
                >
                  <TbBellSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/pta-role" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">P.T.A Role</span>}
                </li>
              </Link>
              <Link to="/lookups/pta-profile">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/pta-profile"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/pta-profile" ? colors.accent : '',
                    color: location.pathname === "/lookups/pta-profile" ? colors.primary : colors.text
                  }}
                >
                  <TbBellSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/pta-profile" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">P.T.A Profile</span>}
                </li>
              </Link>

              <Link to="/lookups/department">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/department"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/department" ? colors.accent : '',
                    color: location.pathname === "/lookups/department" ? colors.primary : colors.text
                  }}
                >
                  <TbBellSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/department" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Department</span>}
                </li>
              </Link>
              <Link to="/lookups/designation">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/designation"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/designation" ? colors.accent : '',
                    color: location.pathname === "/lookups/designation" ? colors.primary : colors.text
                  }}
                >
                  <TbBellSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/designation" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Designation</span>}
                </li>
              </Link>
              <Link to="/lookups/school-management">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/school-management"
                    ? `bg-${colors.accent} text-${colors.primary} font-medium`
                    : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/school-management" ? colors.accent : '',
                    color: location.pathname === "/lookups/school-management" ? colors.primary : colors.text
                  }}
                >
                  <TbBellSchool 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/school-management" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">School Management</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Lookups */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.LOOKUPS
                ? `bg-${colors.accent} text-${colors.primary}`
                : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.LOOKUPS)}
              style={{
                backgroundColor: openDropdown === DropdownType.LOOKUPS ? colors.accent : '',
                color: openDropdown === DropdownType.LOOKUPS ? colors.primary : colors.text
              }}
            >
              <HiOutlineAcademicCap 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.LOOKUPS ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Academic Settings</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.LOOKUPS ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.LOOKUPS ? colors.primary : colors.icon }}
                />
              )}
            </div>
            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.LOOKUPS ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/lookups/academic-years">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/academic-years"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/academic-years" ? colors.accent : '',
                    color: location.pathname === "/lookups/academic-years" ? colors.primary : colors.text
                  }}
                >
                  <GiCalendarHalfYear 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/academic-years" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Academic Year</span>}
                </li>
              </Link>
              <Link to="/lookups/classes">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/classes"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/classes" ? colors.accent : '',
                    color: location.pathname === "/lookups/classes" ? colors.primary : colors.text
                  }}
                >
                  <SiGoogleclassroom 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/classes" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Class</span>}
                </li>
              </Link>

              <Link to="/lookups/divisions">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/divisions"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/divisions" ? colors.accent : '',
                    color: location.pathname === "/lookups/divisions" ? colors.primary : colors.text
                  }}
                >
                  <SiPrivatedivision 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/divisions" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Division</span>}
                </li>
              </Link>
              <Link to="/lookups/attendance-status">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/attendance-status"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/attendance-status" ? colors.accent : '',
                    color: location.pathname === "/lookups/attendance-status" ? colors.primary : colors.text
                  }}
                >
                  <MdCoPresent 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/attendance-status" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Attendance Status</span>}
                </li>
              </Link>
              <Link to="/lookups/subjects">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/subjects"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/subjects" ? colors.accent : '',
                    color: location.pathname === "/lookups/subjects" ? colors.primary : colors.text
                  }}
                >
                  <GiWhiteBook 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/subjects" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Subject</span>}
                </li>
              </Link>
              <Link to="/lookups/syllabuses">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/syllabuses"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/syllabuses" ? colors.accent : '',
                    color: location.pathname === "/lookups/syllabuses" ? colors.primary : colors.text
                  }}
                >
                  <SiBookstack 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/syllabuses" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Syllabus</span>}
                </li>
              </Link>
              <Link to="/lookups/time-slot">
                <li className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/lookups/time-slot"
                  ? `bg-${colors.accent} text-${colors.primary} font-medium`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                  }`}
                  style={{
                    backgroundColor: location.pathname === "/lookups/time-slot" ? colors.accent : '',
                    color: location.pathname === "/lookups/time-slot" ? colors.primary : colors.text
                  }}
                >
                  <IoTimerOutline 
                    className="text-lg" 
                    style={{ color: location.pathname === "/lookups/time-slot" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Time Slot</span>}
                </li>
              </Link>
            </ul>
          </li>

          {/* Settings */}
          <li>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${openDropdown === DropdownType.SETTINGS
                  ? `bg-${colors.accent} text-${colors.primary}`
                  : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                }`}
              onClick={() => toggleDropdown(DropdownType.SETTINGS)}
              style={{
                backgroundColor: openDropdown === DropdownType.SETTINGS ? colors.accent : '',
                color: openDropdown === DropdownType.SETTINGS ? colors.primary : colors.text
              }}
            >
              <IoSettings 
                className="text-lg" 
                style={{ color: openDropdown === DropdownType.SETTINGS ? colors.primary : colors.icon }} 
              />
              {isOpen && <span className="ml-3 flex-1">Settings</span>}
              {isOpen && (
                <FaAngleDown
                  className={`transition-transform duration-200 ${openDropdown === DropdownType.SETTINGS ? "rotate-180" : ""
                    }`}
                  style={{ color: openDropdown === DropdownType.SETTINGS ? colors.primary : colors.icon }}
                />
              )}
            </div>

            <ul
              className={`overflow-hidden transition-all duration-300 ${openDropdown === DropdownType.SETTINGS ? "max-h-screen" : "max-h-0"
                }`}
            >
              <Link to="/page">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/page"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/page" ? colors.accent : '',
                    color: location.pathname === "/page" ? colors.primary : colors.text
                  }}
                >
                  <MdWebAsset 
                    className="text-lg" 
                    style={{ color: location.pathname === "/page" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">CMS Page</span>}
                </li>
              </Link>

              <Link to="/notifications/notification-smart-tags/">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-smart-tags/"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/notifications/notification-smart-tags/" ? colors.accent : '',
                    color: location.pathname === "/notifications/notification-smart-tags/" ? colors.primary : colors.text
                  }}
                >
                  <MdNotificationAdd 
                    className="text-lg" 
                    style={{ color: location.pathname === "/notifications/notification-smart-tags/" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Smart tags</span>}
                </li>
              </Link>

              <Link to="/notifications/notification-functionality">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-functionality"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/notifications/notification-functionality" ? colors.accent : '',
                    color: location.pathname === "/notifications/notification-functionality" ? colors.primary : colors.text
                  }}
                >
                  <MdNotificationAdd 
                    className="text-lg" 
                    style={{ color: location.pathname === "/notifications/notification-functionality" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Functionalities</span>}
                </li>
              </Link>

              <Link to="/notifications/notification-module">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-module"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/notifications/notification-module" ? colors.accent : '',
                    color: location.pathname === "/notifications/notification-module" ? colors.primary : colors.text
                  }}
                >
                  <MdNotificationAdd 
                    className="text-lg" 
                    style={{ color: location.pathname === "/notifications/notification-module" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Modules</span>}
                </li>
              </Link>

              <Link to="/notifications/notification-template">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification-template"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/notifications/notification-template" ? colors.accent : '',
                    color: location.pathname === "/notifications/notification-template" ? colors.primary : colors.text
                  }}
                >
                  <MdNotificationAdd 
                    className="text-lg" 
                    style={{ color: location.pathname === "/notifications/notification-template" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Templates</span>}
                </li>
              </Link>

              <Link to="/notifications/notification">
                <li
                  className={`flex items-center p-3 ${isOpen ? "pl-10" : "pl-3"} rounded-lg transition-all duration-200 ${location.pathname === "/notifications/notification"
                      ? `bg-${colors.accent} text-${colors.primary} font-medium`
                      : `hover:bg-${colors.accent} hover:text-${colors.primary}`
                    }`}
                  style={{
                    backgroundColor: location.pathname === "/notifications/notification" ? colors.accent : '',
                    color: location.pathname === "/notifications/notification" ? colors.primary : colors.text
                  }}
                >
                  <MdNotificationAdd 
                    className="text-lg" 
                    style={{ color: location.pathname === "/notifications/notification" ? colors.primary : colors.icon }} 
                  />
                  {isOpen && <span className="ml-3">Notification</span>}
                </li>
              </Link>
            </ul>
          </li>
        </ul>
      </div>

      {/* Footer section with powered by */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col items-center">
          {isOpen ? (
            <>
              <div className="text-xs text-gray-500 mb-1 font-medium tracking-wider">POWERED BY</div>
              <div className="flex items-center justify-center w-full">
                <img 
                  src={beatStack} 
                  alt="Beetstack Logo" 
                  className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <img 
                src={beatStack} 
                alt="Beetstack Logo" 
                className="h-5 w-auto object-contain opacity-80"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;