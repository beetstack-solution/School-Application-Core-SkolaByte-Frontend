// import { Link, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { TbArrowBackUp } from "react-icons/tb";
// import {
//   fetchFeatureById,
//   FeatureModuleData,
// } from "@/api/FeatureModuleApi"; // Adjust the import path as needed
// import Breadcrumb from "@/components/Breadcumb";

// const ViewFeatureModule: React.FC = () => {
//   const { id } = useParams<{ id: string }>(); // Get feature ID from URL
//   const [featureData, setFeatureData] = useState<FeatureModuleData | null>(
//     null
//   );
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const getFeatureById = async (featureId: string) => {
//     try {
//       const responseData = await fetchFeatureById(featureId);
//       if (responseData.success) {
//         console.log("Data by Feature ID:", responseData);
//         setFeatureData(responseData.feature);
//       } else {
//         setError("Feature data not found");
//       }
//     } catch (error: any) {
//       console.error("Error fetching Feature data:", error);
//       setError(error.response?.data?.message || "Error fetching Feature data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       getFeatureById(id); // Fetch feature data when component mounts
//     }
//   }, [id]);

//   console.log("Feature data", featureData);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   const breadcrumbItems = [
//     { label: "Home", path: "/" },
//     { label: "Features", path: "/feature" },
//     { label: "View Feature", path: "" },
//   ];

//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">View Feature</h3>
//       <div className="flex flex-col md:flex-row justify-start items-center px-1">
//         <div className="breadcrumb-section">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>
//       </div>
//       <div className="header-btns">
//         <Link to={"/feature"}>
//           <button className="add-btn">
//             <TbArrowBackUp size={20} className="mr-2" />
//             Back
//           </button>
//         </Link>
//       </div>

//       {/* Display Feature Information */}
//       {featureData && (
//         <div className="w-full md:w-4/5 mt-5">
//           <table className="min-w-full border-collapse">
//             <tbody>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Code</td>
//                 <td className="border px-4 py-2">{featureData.code}</td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Name</td>
//                 <td className="border px-4 py-2">{featureData.name}</td>
//               </tr>
//               {featureData.nameAlias && (
//                 <tr>
//                   <td className="border px-4 py-2 font-semibold">Alias</td>
//                   <td className="border px-4 py-2">{featureData.nameAlias}</td>
//                 </tr>
//               )}
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Status</td>
//                 <td className="border px-4 py-2">
//                   {featureData.status ? "Active" : "Inactive"}
//                 </td>
//               </tr>
//               {/* <tr>
//                 <td className="border px-4 py-2 font-semibold">Created By</td>
//                 <td className="border px-4 py-2">{featureData.createdBy}</td>
//               </tr> */}
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Is Default</td>
//                 <td className="border px-4 py-2">
//                   {featureData.isDefault ? "Yes" : "No"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Created At</td>
//                 <td className="border px-4 py-2">
//                   {new Date(featureData.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Updated At</td>
//                 <td className="border px-4 py-2">
//                   {new Date(featureData.updatedAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewFeatureModule;
