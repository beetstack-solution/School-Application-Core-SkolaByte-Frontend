// import React, { useState, useEffect } from "react";
// import { FcCancel } from "react-icons/fc";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import {
//   fetchFeatureById,
//   updateFeatureById,
//   fetchFeatures,
//   FeatureData,
// } from "@/api/FeatureApi"; // Adjust import path if necessary

// import { toast } from "react-toastify";

// interface EditFeatureModuleProps {

//   onClose: () => void;
//   onReload: () => void;
//   featureId: string; // The ID of the feature to edit
// }

// const EditFeature: React.FC<EditFeatureModuleProps> = ({ featureId, onClose }) => {
//   const [featureName, setFeatureName] = useState<string>("");
//   const [featureCode, setFeatureCode] = useState<string>("");
//   const [categories, setCategories] = useState<FeatureData[]>([]);

//   const [error, setError] = useState<string>("");


//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const response = await fetchFeatures(featureId);
//         setCategories(response.features); // Ensure this matches your API response structure
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     const loadFeatureData = async () => {
//       try {
//         const response = await fetchFeatureById(featureId);
//         if (response.feature) {
//           const feature: any = response.feature;
//           setFeatureName(feature.name);
//           setFeatureCode(feature.code);
//         }
//       } catch (error) {
//         console.error("Error fetching feature data:", error);
//       }
//     };

//     loadCategories();
//     loadFeatureData();
//   }, [featureId]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureName(e.target.value);
//   };

//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureCode(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");



//     const updatedData = {
//       name: featureName,
//       code: featureCode,
//     };

//     try {
//       const response = await updateFeatureById(featureId, updatedData);
//       toast.success("Feature updated successfully!");
//       console.log("Feature updated:", response);
//     } catch (error) {
//       console.error("Error updating feature:", error);
//       toast.error("Failed to update feature. Please try again.");
//       setError("Failed to update feature. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h2 className="text-xl font-bold mb-4">Edit Feature</h2>
//         <IoIosCloseCircleOutline
//           className="text-3xl cursor-pointer"
//           onClick={onClose}
//         />
//       </div>
//       {error && <div className="mb-4 text-red-500">{error}</div>}
//       <form onSubmit={handleSubmit} className="mt-4">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Feature Name
//           </label>
//           <input
//             type="text"
//             value={featureName}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter feature name"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Feature Code
//           </label>
//           <input
//             type="text"
//             value={featureCode}
//             onChange={handleCodeChange}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter feature code"

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

// export default EditFeature;
