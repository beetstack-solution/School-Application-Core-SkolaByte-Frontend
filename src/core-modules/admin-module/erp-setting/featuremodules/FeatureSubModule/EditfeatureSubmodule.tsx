// import React, { useState, useEffect } from "react";
// import { FcCancel } from "react-icons/fc";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import {
//   fetchFeatureSubModuleById,
//   updateFeatureSubModuleById,
//   fetchFeatureSubModules,
//   FeatureSubModuleData,
// } from "@/api/FeaturesubModuleApi"; // Adjust import path if necessary
// import { toast } from "react-toastify";

// interface EditFeatureSubModuleProps {
//   onClose: () => void;
//   onReload: () => void;
//   subModuleId: string; // The ID of the feature submodule to edit
//   featureId: string; // The ID of the feature for the submodule
// }

// const EditFeatureSubModule: React.FC<EditFeatureSubModuleProps> = ({
//   subModuleId,
//   featureId,
//   onClose,
//   onReload
// }) => {
//   const [subModuleName, setSubModuleName] = useState<string>("");
//   const [subModuleCode, setSubModuleCode] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const loadFeatureSubModuleData = async () => {
//       try {
//         const response = await fetchFeatureSubModuleById(subModuleId);
//         if (response.featuresubmodule) {
//           const featuresubmodule: FeatureSubModuleData = response.featuresubmodule;
//           setSubModuleName(featuresubmodule.name);
//           setSubModuleCode(featuresubmodule.code);
//         }
//       } catch (error) {
//         console.error("Error fetching feature submodule data:", error);
//       }
//     };

//     const loadFeatureData = async () => {
//       try {
//         const response = await fetchFeatureSubModules(featureId); // Fetch feature data using the provided featureId
//         if (response.feature) {
//           const feature: any = response.feature;
//           setSubModuleCode(feature.code); // Set the feature code in submodule code if needed
//         }
//       } catch (error) {
//         console.error("Error fetching feature data:", error);
//       }
//     };

//     loadFeatureSubModuleData();
//     loadFeatureData();
//   }, [subModuleId, featureId]); // The effect will run when subModuleId or featureId changes

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSubModuleName(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     const updatedData = {
//       name: subModuleName,
//       code: subModuleCode,
//     };

//     try {
//       const response = await updateFeatureSubModuleById(subModuleId, updatedData);
//       toast.success("Feature SubModule updated successfully!");
//       console.log("Feature SubModule updated:", response);
//       onReload();
//     } catch (error) {
//       console.error("Error updating feature submodule:", error);
//       toast.error("Failed to update feature submodule. Please try again.");
//       setError("Failed to update feature submodule. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h2 className="text-xl font-bold mb-4">Edit Feature SubModule</h2>
//         <IoIosCloseCircleOutline
//           className="text-3xl cursor-pointer"
//           onClick={onClose}
//         />
//       </div>
//       {error && <div className="mb-4 text-red-500">{error}</div>}
//       <form onSubmit={handleSubmit} className="mt-4">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Feature SubModule Name
//           </label>
//           <input
//             type="text"
//             value={subModuleName}
//             onChange={handleNameChange}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter feature submodule name"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Feature SubModule Code
//           </label>
//           <input
//             type="text"
//             value={subModuleCode}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter feature submodule code"
//             disabled
//           />
//         </div>
//         <div className="flex justify-end space-x-4 items-center">
//           <div className="flex space-x-2">
//             <button type="submit" className="submit-btn">
//               <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
//               Submit
//             </button>
//             <button type="button" onClick={onClose} className="cancel-btn">
//               <FcCancel size={20} className="mr-2" />
//               Close
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditFeatureSubModule;
