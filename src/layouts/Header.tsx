// import React, { useEffect, useState } from "react";
// import { FaRegUser, FaUserCheck } from "react-icons/fa";
// import { IoIosNotificationsOutline } from "react-icons/io";
// import { LuLogOut } from "react-icons/lu";
// import { MdEmail } from "react-icons/md";
// import { useDispatch } from "react-redux";
// import { signOutSuccess } from "../redux/slices/adminSlice";
// import { fetchuserById, SingleUserDataResponse, UserData } from "@/api/admin-api/base-api/userApi";
// import { useSelector } from 'react-redux';
// import { Link, useNavigate } from "react-router-dom";
// import { BsEmojiExpressionless } from "react-icons/bs";
// import { FiMaximize, FiMinimize } from "react-icons/fi";
// const Header: React.FC = () => {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<SingleUserDataResponse>();
//   const handleLogoutConfirm = () => {
//     dispatch(signOutSuccess());
//     localStorage.removeItem('x-school-apikey');
//     localStorage.removeItem('schoolCode');
//     navigate("school/login");
//   };
//   const currentUser = useSelector((state: { user: { currentSchoolAdmin: any } }) => state.user.currentSchoolAdmin);
//   const userEmail = currentUser?.email || 'No Email';
//   const [showNotfDropdown, setShowNotfDropdown] = useState(false);
//   const [showAdmDropdown, setShowAdmDropdown] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [greeting, setGreeting] = useState('Good Morning!');

// const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch(err => {
//         console.error(`Error attempting to enable fullscreen: ${err.message}`);
//       });
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) {
//       setGreeting('Good Morning!');
//     } else if (hour < 18) {
//       setGreeting('Good Afternoon!');
//     } else {
//       setGreeting('Good Evening!');
//     }
//   }, []);
//   const toggleDropdown = () => {
//     setShowNotfDropdown((prev) => !prev);
//     setShowAdmDropdown(false);
//   };
//   const toggleAdmDropdown = () => {
//     setShowAdmDropdown((prev) => !prev);
//     setShowNotfDropdown(false); // Admin dropdwn
//   };
//   const handleClickOutside = (e: any) => {
//     if (!e.target.closest(".dropdown-container")) {
//       setShowNotfDropdown(false);
//     }
//   };
//   const handleClickAdmOutside = (e: any) => {
//     if (!e.target.closest(".dropdown-adm-container")) {
//       setShowAdmDropdown(false);
//     }
//   };
//   useEffect(() => {
//     if (showNotfDropdown) {
//       setShowAdmDropdown(false); // Hide Admin Dropdown
//       window.addEventListener("click", handleClickOutside);
//     } else {
//       window.removeEventListener("click", handleClickOutside);
//     }

//     if (showAdmDropdown) {
//       setShowNotfDropdown(false); //Admin Dropdown
//       window.addEventListener("click", handleClickAdmOutside);
//     } else {
//       window.removeEventListener("click", handleClickAdmOutside);
//     }
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//       window.removeEventListener("click", handleClickAdmOutside);
//     };
//   }, [showNotfDropdown, showAdmDropdown]);

//   const handleOpenLogout =()=>
//   {
//     setShowAdmDropdown(false);
//     setShowConfirm(true)
//   }


//   return (
//     <>
// <header className="bg-gradient-to-r from-stone-50 via-stone-100 to-stone-50 mx-2 my-2 p-6 rounded-lg shadow-md relative">
//   {/* Left edge content */}
//   <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//     <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
//       <h1 className="text-sm text-white">
//         <span className="greet-text">Hi, {greeting}</span>
//       </h1>
//       <button 
//         onClick={toggleFullscreen}
//         className="p-2 hover:bg-gray-100 rounded transition-colors"
//       >
//         {isFullscreen ? (
//           <FiMinimize size={20} cursor="pointer" title="Minimize" />
//         ) : (
//           <FiMaximize size={20} cursor="pointer" title="Fullscreen" />
//         )}
//       </button>
//     </div>
//   </div>
//           {/* Right side*/}
//          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-6 z-50">
//             {/* Notification*/}
//             <div className="relative dropdown-container">
//               <IoIosNotificationsOutline
//                 size={23}
//                 onClick={toggleDropdown}
//                 className="cursor-pointer"
//               />
//               {showNotfDropdown && (
//                 <div className="absolute right-0 mt-4 w-48 bg-white border border-gray-200 shadow-lg animate-fade-in-down">
//                   <ul className="p-2">
//                     <li className="hover:bg-gray-100 p-2 cursor-pointer drop-list-text">
//                       Notification 1
//                     </li>
//                     <hr />
//                     <li className="hover:bg-gray-100 p-2 cursor-pointer drop-list-text">
//                       Notification 2
//                     </li>
//                     <hr />
//                     <li className="hover:bg-gray-100 p-2 cursor-pointer drop-list-text">
//                       Notification 3
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//             {/* Admin icon */}
//             <div className="relative dropdown-adm-container">
//               <button
//                 onClick={toggleAdmDropdown}
//                 className="flex items-center space-x-2 group"
//               >
//                 <div className="relative">
//                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-black/10 group-hover:border-white/50 transition-colors ">
//                     <FaRegUser size={16} color="gray" />
//                   </div>
//                   <span className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full w-3 h-3"></span>
//                 </div>
//                 <span className="text-black text-sm font-regular hidden md:inline-block">
//                   Admin
//                 </span>
//               </button>
//               {showAdmDropdown && (
//                 <>
//                  <div 
//                  className="fixed inset-0 bg-opacity-30 z-40"
//                  onClick={() => setShowAdmDropdown(false)}
//                />
//                 <div className="absolute right-0 mt-4 bg-white border rounded border-gray-200 shadow-lg z-50 animate-fade-in-down">
//                   <ul className="p-2">
//                     <Link to={"/profile/profile"}>
//                       <li
//                         className="p-3 grid grid-cols-[auto,1fr] gap-1 drop-list-text"
//                         title="Designation"
//                       >
//                         <span className="font-semibold text-left">
//                           <FaUserCheck size={18} />
//                         </span>
//                         <span>Profile</span>
//                       </li>
//                     </Link>
//                     <hr />
//                     <li
//                       className="p-3 grid grid-cols-[auto,1fr] gap-1 drop-list-text"
//                       title="Email Id"
//                     >
//                       <span className="font-semibold text-left">
//                         <MdEmail size={18} />
//                       </span>
//                       <span className="drop-text-li">{userEmail}</span>
//                     </li>
//                     <hr />
//                     <li
//                       className="hover:bg-gray-200 p-3 text-center drop-list-text cursor-pointer"
//                       title="Logout"
//                       onClick={handleOpenLogout}
//                     >
//                       <span className="font-semibold text-left">
//                         <LuLogOut color="red" size={18} />
//                       </span>
//                       <span className="drop-text-li">Logout</span>
//                     </li>
//                   </ul>
//                 </div>
//                 </>
//               )}
//             </div>
//           </div>

//       </header>
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//   <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in-down mx-4">
//     <div className="flex flex-col items-center space-y-6">
//       <div className="text-5xl">
//         <BsEmojiExpressionless className="mx-auto text-gray-600" />
//       </div>
//       <h3 className="text-lg font-medium text-gray-800 text-center">
//         Are you sure you want to log out?
//       </h3>
      
//       {/* Buttons Container */}
//       <div className="flex space-x-4 w-full justify-center">
//         {/* Cancel Button */}
//         <button
//           onClick={() => setShowConfirm(false)}
//           className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
//         >
//           Cancel
//         </button>
        
//         {/* Logout Button */}
//         <button
//           onClick={handleLogoutConfirm}
//           className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
//       )}

//       <hr className="header_hr " />
//     </>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { FaUserCircle, FaBell, FaSignOutAlt, FaEnvelope, FaUserCog } from "react-icons/fa";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/slices/adminSlice";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: { user: { currentSchoolAdmin: any } }) => state.user.currentSchoolAdmin);
  const userEmail = currentUser?.email || 'admin@school.com';
  const [showNotfDropdown, setShowNotfDropdown] = useState(false);
  const [showAdmDropdown, setShowAdmDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Dropdown handlers
  const toggleDropdown = () => {
    setShowNotfDropdown(!showNotfDropdown);
    setShowAdmDropdown(false);
  };

  const toggleAdmDropdown = () => {
    setShowAdmDropdown(!showAdmDropdown);
    setShowNotfDropdown(false);
  };

  // Logout handlers
  const handleLogout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem('x-school-apikey');
    localStorage.removeItem('schoolCode');
    navigate("school/login");
  };

  // Notification data
  const notifications = [
    { id: 1, title: "New student registration", time: "2 mins ago", unread: true },
    { id: 2, title: "System maintenance scheduled", time: "1 hour ago", unread: true },
    { id: 3, title: "New message from parent", time: "3 hours ago", unread: false }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-2">
      <div className="flex items-center justify-between h-16">
        {/* Left side - Branding and greeting */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#a8c04b] to-[#90a63b] flex items-center justify-center text-white font-bold">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-800">{greeting}</h1>
              <p className="text-xs text-gray-500">Welcome back, Admin</p>
            </div>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-6">
          {/* Fullscreen toggle */}
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-100 relative transition-colors text-gray-600 hover:text-blue-600"
            >
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <AnimatePresence>
              {showNotfDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((note) => (
                      <div 
                        key={note.id} 
                        className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${note.unread ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${note.unread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                          <div>
                            <p className="font-medium text-gray-800">{note.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{note.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <button className="text-sm font-medium text-blue-600 hover:underline">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={toggleAdmDropdown}
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cae26d] to-[#90a63b] flex items-center justify-center text-white">
                  <FaUserCircle size={24} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{userEmail}</p>
              </div>
            </button>

            <AnimatePresence>
              {showAdmDropdown && (
                <>
                  <div 
                    className="fixed inset-0 bg-black/10 z-40"
                    onClick={() => setShowAdmDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">Admin Account</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                    <ul className="py-1">
                      <Link to="/profile/profile">
                        <li className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center space-x-3">
                          <FaUserCog className="text-blue-500" />
                          <span className="text-sm text-gray-700">Profile Settings</span>
                        </li>
                      </Link>
                      <li className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center space-x-3">
                        <FaEnvelope className="text-blue-500" />
                        <span className="text-sm text-gray-700">Messages</span>
                      </li>
                      <li 
                        className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors flex items-center space-x-3"
                        onClick={() => setShowConfirm(true)}
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span className="text-sm text-red-500">Logout</span>
                      </li>
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
            >
              <div className="flex flex-col items-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <FaSignOutAlt className="text-red-500 text-2xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
                  <p className="text-sm text-gray-500 mt-1">Are you sure you want to sign out?</p>
                </div>
                <div className="flex space-x-3 w-full">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition-opacity font-medium shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
