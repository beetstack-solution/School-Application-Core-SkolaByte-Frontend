

// import { Link, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { TbArrowBackUp } from "react-icons/tb";
// import { fetchFeatureById, FeatureData } from "@/api/FeatureApi"; // Adjust the import path as needed
// import Breadcrumb from "../Breadcumb";

// const ViewFeature: React.FC = () => {
//   const { id } = useParams<{ id: string }>(); // Get feature module ID from URL
//   const [featureDatas, setFeatureData] = useState<FeatureData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch feature module by ID
//   const getFeatureModuleById = async (featureId: string) => {
//     try {
//       const responseData: any = await fetchFeatureById(featureId);
//       console.log("API Response:", responseData);

//       if (responseData) {
//         // Set the first feature from the array
//         console.log('calling')
//         setFeatureData(responseData.feature);

//       } else {
//         setError("No feature data found");
//       }
//     } catch (error: any) {
//       console.error("Error fetching Feature Module data:", error);
//       setError(
//         error.response?.data?.message || "Error fetching Feature Module data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(featureDatas, 'dataa')

//   useEffect(() => {
//     if (id) {
//       getFeatureModuleById(id); // Fetch data when component mounts
//     } else {
//       setError("Invalid feature ID");
//       setLoading(false);
//     }
//   }, [id]);

//   // Loading state
//   if (loading) return <div className="text-center">Loading...</div>;
//   // Error state
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   // Breadcrumb items
//   const breadcrumbItems = [
//     { label: "Home", path: "/" },
//     { label: "Feature", path: "/feature" },
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
//         <Link to={"/feature-module"}>
//           <button className="add-btn">
//             <TbArrowBackUp size={20} className="mr-2" />
//             Back
//           </button>
//         </Link>
//       </div>

//       {/* Display Feature Module Information */}
//       {featureDatas && (
//         <div className="w-full md:w-4/5 mt-5">
//           <table className="min-w-full border-collapse">
//             <tbody>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Code</td>
//                 <td className="border px-4 py-2">{featureDatas.code}</td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Name</td>
//                 <td className="border px-4 py-2">{featureDatas.name}</td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Status</td>
//                 <td className="border px-4 py-2">{featureDatas.status ? "Active" : "Inactive"}</td>
//               </tr>
//               {/* <tr>
//                 <td className="border px-4 py-2 font-semibold">Created By</td>
//                 <td className="border px-4 py-2">{featureDatas.createdBy}</td>
//               </tr> */}
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Is Default</td>
//                 <td className="border px-4 py-2">{featureDatas.isDefault ? "Yes" : "No"}</td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Created At</td>
//                 <td className="border px-4 py-2">
//                   {new Date(featureDatas.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-semibold">Updated At</td>
//                 <td className="border px-4 py-2">
//                   {new Date(featureDatas.updatedAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewFeature;
