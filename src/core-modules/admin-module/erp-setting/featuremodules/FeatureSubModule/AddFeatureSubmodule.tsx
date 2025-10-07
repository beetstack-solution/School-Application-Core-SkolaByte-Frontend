// import React, { useState, useEffect } from "react";
// import { FcCancel } from "react-icons/fc";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { createFeatureSubModule, FeatureSubModuleData } from "@/api/FeaturesubModuleApi"; // Assuming FeatureModuleApi is where the createFeatureModule API is defined
// import { FeatureData, fetchFeatures } from "@/api/common-api/commonDropDownApi"
// import { fetchFeatureModule } from "@/api/common-api/commonDropDownApi"; // Assuming FeatureModuleApi contains fetchFeatureModule function for feature modules
// import { toast } from "react-toastify";

// interface AddFeatureModuleWithTwoDropdownsProps {
//   onClose: () => void; // Function to close the modal
//   onReload: () => void; // Function to reload the feature module list
// }

// const AddFeatureSubModule: React.FC<AddFeatureModuleWithTwoDropdownsProps> = ({
//   onClose,
//   onReload,
// }) => {
//   const [featureName, setFeatureName] = useState<string>(""); // State for feature module name
//   const [selectedFeature, setSelectedFeature] = useState<string>(""); // State for selected feature ID
//   const [selectedFeatureModule, setSelectedFeatureModule] = useState<string>(""); // State for selected feature module ID
//   const [features, setFeatures] = useState<FeatureData[]>([]); // State for feature options
//   const [featureModules, setFeatureModules] = useState<FeatureSubModuleData[]>([]); // State for feature module options
//   const [error, setError] = useState<string>(""); // State for error messages

//   // Fetch features and feature modules on component mount
//   useEffect(() => {
//     const loadFeatures = async () => {
//       try {
//         const response = await fetchFeatures();
//         if (response.success) {
//           setFeatures(response.feature); // Save features to state
//         } else {
//           toast.error(response.message || "Failed to load features.");
//         }
//       } catch (error: any) {
//         console.error("Error fetching features:", error.message);
//         toast.error("Error fetching features. Please try again.");
//       }
//     };

//     const loadFeatureModules = async () => {
//       try {
//         const response = await fetchFeatureModule();
//         if (response.success) {
//           setFeatureModules(response.feature); // Save feature modules to state
//         } else {
//           toast.error(response.message || "Failed to load feature modules.");
//         }
//       } catch (error: any) {
//         console.error("Error fetching feature modules:", error.message);
//         toast.error("Error fetching feature modules. Please try again.");
//       }
//     };

//     loadFeatures();
//     loadFeatureModules();
//   }, []);

//   // Handle input change for feature module name
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFeatureName(e.target.value);
//   };

//   // Handle dropdown change for feature selection
//   const handleFeatureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedFeature(e.target.value);
//   };

//   // Handle dropdown change for feature module selection
//   const handleFeatureModuleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedFeatureModule(e.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     // Validate input
//     if (!featureName.trim()) {
//       setError("Please provide a feature module name.");
//       return;
//     }




//     if (!selectedFeatureModule) {
//       setError("Please select a feature Module");
//       return;
//     }

//     // Prepare data for API
//     const moduleData = {
//       name: featureName.trim(),
//       feature: selectedFeature,
//       featuremodule: selectedFeatureModule, // Added featureModuleId
//     };

//     try {
//       // Call API to create feature module
//       const response = await createFeatureSubModule(moduleData);

//       if (response.success) {
//         toast.success("Feature module created successfully!");
//         onReload(); // Reload the list after successful creation
//         onClose(); // Close the modal
//       } else {
//         toast.error(response.message || "Failed to create feature module.");
//         setError(response.message || "Failed to create feature module.");
//       }
//     } catch (error: any) {
//       console.error("Error creating feature module:", error);
//       toast.error("Failed to create feature module. Please try again.");
//       setError("Failed to create feature module. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h2 className="text-xl font-bold mb-4">Add Feature Module</h2>
//         <IoIosCloseCircleOutline
//           className="text-3xl cursor-pointer"
//           onClick={onClose}
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Select Feature
//         </label>
//         <select
//           value={selectedFeature}
//           onChange={handleFeatureSelect}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         >
//           <option value="">-- Select a Feature --</option>
//           {features.map((feature) => (
//             <option key={feature._id} value={feature._id}>
//               {feature.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Select Feature Module
//         </label>
//         <select
//           value={selectedFeatureModule}
//           onChange={handleFeatureModuleSelect}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         >
//           <option value="">-- Select a Feature Module --</option>
//           {featureModules.map((module) => (
//             <option key={module._id} value={module._id}>
//               {module.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {error && <div className="mb-4 text-red-500">{error}</div>}

//       <form onSubmit={handleSubmit} className="mt-4">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Feature Module Name
//           </label>
//           <input
//             value={featureName}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter feature module name"
//             required
//           />
//         </div>

//         <div className="flex justify-end space-x-4 items-center">
//           <div className="flex space-x-2">
//             <button type="submit" className="submit-btn flex items-center">
//               <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
//               Submit
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="cancel-btn flex items-center"
//             >
//               <FcCancel size={20} className="mr-2" />
//               Close
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddFeatureSubModule;
