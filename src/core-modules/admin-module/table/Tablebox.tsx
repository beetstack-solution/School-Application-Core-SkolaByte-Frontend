// import { useState } from "react";
// import { AiFillCaretUp } from "react-icons/ai";
// import { CiEdit } from "react-icons/ci";
// import { GrOverview } from "react-icons/gr";
// import { MdDeleteOutline } from "react-icons/md";
// import { Link } from "react-router-dom";
// import Breadcrumb from "@/components/Breadcumb"; // Fixed the spelling here
// import { formatDate } from "@/helpers/helper";

// interface TableRow {
//   _id: number;
//   status: string;
//   code: string;
//   role: string;
//   createdBy: string;
//   createdAt: string; // Assuming createdAt is of type string, adjust if necessary
// }

// const Permission: React.FC = () => {
//   const [sortState, setSortState] = useState<{
//     column: keyof TableRow;
//     order: "ascending" | "descending";
//   }>({
//     column: "name", // Adjust this as necessary
//     order: "ascending",
//   });

//   // Dummy data for example purposes; replace this with your actual data fetching logic
//   const roles: TableRow[] = []; // Fetch your role data here
//   const sortedData = [...roles]; // Replace with your sorting logic based on sortState

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
//       <div className="flex flex-col md:flex-row justify-start items-center px-1">
//         <div className="page-header">
//           <h3>Permission</h3>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-start items-center px-1">
//         <div className="breadcrumb-section">
//           <Breadcrumb />
//         </div>
//       </div>
//       <div className="overflow-x-auto overflow-y-auto max-h-96">
//         <table className="min-w-full data_table">
//           <thead className="bg-gray-700 text-white">
//             <tr>
//               <th
//                 onClick={() =>
//                   setSortState((prev) => ({
//                     column: "_id",
//                     order:
//                       prev.order === "ascending" ? "descending" : "ascending",
//                   }))
//                 }
//                 style={{ cursor: "pointer" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   Sl No.
//                   {sortState.column === "_id" &&
//                     sortState.order === "ascending" && <AiFillCaretUp />}
//                 </div>
//               </th>
//               <th>Actions</th>
//               <th
//                 onClick={() =>
//                   setSortState((prev) => ({
//                     column: "status",
//                     order:
//                       prev.order === "ascending" ? "descending" : "ascending",
//                   }))
//                 }
//                 style={{ cursor: "pointer" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   Status
//                   {sortState.column === "status" &&
//                     sortState.order === "ascending" && <AiFillCaretUp />}
//                 </div>
//               </th>
//               <th
//                 onClick={() =>
//                   setSortState((prev) => ({
//                     column: "code",
//                     order:
//                       prev.order === "ascending" ? "descending" : "ascending",
//                   }))
//                 }
//                 style={{ cursor: "pointer" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   Code
//                   {sortState.column === "code" &&
//                     sortState.order === "ascending" && <AiFillCaretUp />}
//                 </div>
//               </th>
//               <th
//                 onClick={() =>
//                   setSortState((prev) => ({
//                     column: "createdBy",
//                     order:
//                       prev.order === "ascending" ? "descending" : "ascending",
//                   }))
//                 }
//                 style={{ cursor: "pointer" }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   Created By
//                   {sortState.column === "createdBy" &&
//                     sortState.order === "ascending" && <AiFillCaretUp />}
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             {sortedData.length > 0 ? (
//               sortedData.map((role, index) => (
//                 <tr key={role._id}>
//                   <td>{index + 1}</td>
//                   <td className="action-icons">
//                     <Link to={`/view-role/${role._id}`}>
//                       <GrOverview
//                         size={25}
//                         title="View"
//                         className="view-icon"
//                       />
//                     </Link>
//                     <CiEdit size={28} title="Edit" className="edit-icon" />
//                     <MdDeleteOutline
//                       size={28}
//                       title="Delete"
//                       className="delete-icon"
//                     />
//                   </td>
//                   <td>
//                     <button
//                       className={`rounded-full border-2 ${role.status
//                         ? "active-btn border-green-500 text-green-500"
//                         : "inactive-btn border-red-500 text-red-500"
//                         } bg-transparent hover:bg-opacity-10 focus:outline-none`}
//                     >
//                       {role.status ? "Active" : "Inactive"}
//                     </button>
//                   </td>
//                   <td>{role.code}</td>
//                   <td>{formatDate(role.createdAt)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5}>No roles found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Permission;
