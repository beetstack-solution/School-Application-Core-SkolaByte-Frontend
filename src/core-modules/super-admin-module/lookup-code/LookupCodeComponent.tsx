// import { useEffect, useState } from "react";
// import {
//   fetchLookupCodes,
//   fetchLookupCodeById,
//   createLookupCode,
//   updateLookupCodeById,
//   deleteLookupCode,
//   LookupCode,
//   LookupCodeResponse,
//   SingleLookupCodeResponse,
// } from "../../api/lookupCodeApi"; // Adjust the import path as needed
// import { formatDate } from "../../helpers/helpers";
// import { Link } from "react-router-dom";
// import { GrOverview } from "react-icons/gr";
// import { CiEdit } from "react-icons/ci";
// import { MdDeleteOutline } from "react-icons/md";
// import SearchBar from "../../component/SearchBar";
// import { RiPlayListAddFill } from "react-icons/ri";
// import Breadcrumb from "../../component/Breadcumb";
// import { AiFillCaretUp } from "react-icons/ai";
// import { toast } from "react-toastify";
// import AddLookupCode from "./addLookupCode";
// import Pagination from "../../component/Pagination";
// import EditLookupCode from "./editLookupCode";
// // import EditLookupCode from "./EditLookupCode";

// function LookupCode() {
//   const [lookupCodes, setLookupCodes] = useState<LookupCode[]>([]);
//   const [filteredLookupCodes, setFilteredLookupCodes] = useState<LookupCode[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [sortState, setSortState] = useState({
//     column: "code",
//     order: "ascending",
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [selectedId, setSelectedId] = useState<string>("");

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => setShowModal(false);

//   const handleEditShow = (lookupCodeId: string) => {
//     setSelectedId(lookupCodeId);
//     setShowEdit(true);
//   };

//   const handleCloseEdit = () => {
//     setShowEdit(false);
//   };

//   const getLookupCodes = async () => {
//     try {
//       const data = await fetchLookupCodes();
//       if (data && Array.isArray(data.lookupCodes)) {
//         setLookupCodes(data.lookupCodes);
//         setFilteredLookupCodes(data.lookupCodes);
//       } else {
//         setError("Failed to fetch lookup codes.");
//       }
//       setLoading(false);
//     } catch (error: any) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLookupCodes();
//   }, []);

//   const handleReload = () => {
//     getLookupCodes();
//   };

//   const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
//     const newStatus = !currentStatus;
//     const isConfirmed = window.confirm(
//       `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
//     );
//     if (!isConfirmed) return;

//     try {
//       const response = await updateLookupCodeById(_id, { status: newStatus });
//       if (response?.success) {
//         toast.success(
//           response.message || `Lookup code status updated to ${newStatus ? "Active" : "Inactive"}.`
//         );
//         getLookupCodes();
//       } else {
//         toast.error(response.message || "Failed to update lookup code status.");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update lookup code status.");
//     }
//   };

//   const handleSearch = (query: string) => {
//     if (query) {
//       const filtered = lookupCodes.filter(
//         (item) =>
//           item.code.toLowerCase().includes(query.toLowerCase()) ||
//           item.name.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredLookupCodes(filtered);
//     } else {
//       setFilteredLookupCodes(lookupCodes);
//     }
//     setCurrentPage(1);
//   };

//   const changeSort = (column: keyof LookupCode) => {
//     let order = "ascending";
//     if (sortState.column === column && sortState.order === "ascending") {
//       order = "descending";
//     }
//     setSortState({ column, order });

//     const sortedData = [...filteredLookupCodes].sort((a: any, b: any) => {
//       if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
//       if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
//       return 0;
//     });
//     setFilteredLookupCodes(sortedData);
//   };

//   const totalPages = Math.ceil(filteredLookupCodes.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredLookupCodes.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleDelete = async (lookupCodeId: string) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this lookup code?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await deleteLookupCode(lookupCodeId);
//       if (response.success) {
//         toast.success(response.message || "Lookup code deleted successfully!");
//         getLookupCodes();
//       } else {
//         toast.error(response.message || "Failed to delete lookup code.");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete lookup code.");
//     }
//   };

//   const breadcrumbItems = [
//     { label: "Home", path: "/" },
//     { label: "Lookup Code", path: "" },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
//       <div className="flex flex-col md:flex-row justify-start items-center px-1">
//         <div className="page-header">
//           <h3>Lookup Code</h3>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-start items-center px-1">
//         <div className="breadcrumb-section">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-end items-center px-1">
//         <div className="md:mr-auto">
//           <button className="add-btn" onClick={handleShow}>
//             <RiPlayListAddFill className="mr-2" />
//             Add
//           </button>
//         </div>
//         <div className="flex items-center space-x-4">
//           <SearchBar onSearch={handleSearch} />
//         </div>
//       </div>
//       <div className="overflow-x-auto overflow-y-auto max-h-96">
//         <table className="min-w-full data_table">
//           <thead className="bg-gray-700 text-white">
//             <tr>
//               <th
//                 className="px-4 py-2 text-left cursor-pointer"
//                 onClick={() => changeSort("_id")}
//               >
//                 <div className="flex items-center">
//                   Sl No.
//                   {sortState.column === "_id" && sortState.order === "ascending" && (
//                     <AiFillCaretUp />
//                   )}
//                 </div>
//               </th>
//               <th>Actions</th>
//               <th
//                 className="px-4 py-2 text-left ml-10 cursor-pointer"
//                 onClick={() => changeSort("status")}
//               >
//                 <div className="flex items-center">
//                   Status
//                   {sortState.column === "status" && sortState.order === "ascending" && (
//                     <AiFillCaretUp />
//                   )}
//                 </div>
//               </th>
//               <th
//                 className="px-4 py-2 text-left cursor-pointer"
//                 onClick={() => changeSort("code")}
//               >
//                 <div className="flex items-center">
//                   Code
//                   {sortState.column === "code" && sortState.order === "ascending" && (
//                     <AiFillCaretUp />
//                   )}
//                 </div>
//               </th>
//               <th
//                 className="px-4 py-2 text-left cursor-pointer"
//                 onClick={() => changeSort("name")}
//               >
//                 <div className="flex items-center">
//                   Name
//                   {sortState.column === "name" && sortState.order === "ascending" && (
//                     <AiFillCaretUp />
//                   )}
//                 </div>
//               </th>
//               <th
//                 className="px-4 py-2 text-left cursor-pointer"
//                 onClick={() => changeSort("createdAt")}
//               >
//                 <div className="flex items-center">
//                   Created At
//                   {sortState.column === "createdAt" && sortState.order === "ascending" && (
//                     <AiFillCaretUp />
//                   )}
//                 </div>
//               </th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700">
//             {currentItems.map((item, index) => (
//               <tr className="border" key={item._id}>
//                 <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
//                 <td className="action-icons">
//                   <Link to={`/view-lookup-code/${item._id}`}>
//                     <GrOverview size={25} title="View" className="view-icon" />
//                   </Link>
//                   <CiEdit
//                     size={28}
//                     title="Edit"
//                     className="edit-icon"
//                     onClick={() => handleEditShow(item._id)}
//                   />
//                   <MdDeleteOutline
//                     size={28}
//                     title="Delete"
//                     className="delete-icon"
//                     onClick={() => handleDelete(item._id)}
//                   />
//                 </td>
//                 <td className="px-4 py-2">
//                   <button
//                     className={`rounded-full border-2 px-4 py-1 ${
//                       item.status
//                         ? "active-btn border-green-500 text-green-500"
//                         : "inactive-btn border-red-500 text-red-500"
//                     } bg-transparent hover:bg-opacity-10 focus:outline-none`}
//                     onClick={() => handleStatusUpdate(item._id, item.status)}
//                   >
//                     {item.status ? "Active" : "Inactive"}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2">{item.code}</td>
//                 <td className="px-4 py-2">{item.name}</td>
//                 <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex flex-col md:flex-row justify-between items-center px-1">
//         <div className="total-count">
//           <span>Total Count: {filteredLookupCodes.length}</span>
//         </div>
//         <div className="pagination flex items-center gap-2">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
//             <AddLookupCode onClose={handleClose} onReload={handleReload} />
//           </div>
//         </div>
//       )}
//       {showEdit && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
//             <EditLookupCode lookupCodeId={selectedId} onClose={handleCloseEdit} onReload={handleReload} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LookupCode;

import { useEffect, useState } from "react";
import {
  fetchLookupCodes,
  updateLookupCodeById,
  deleteLookupCode,
  LookupCode,
} from "@/api/super-admin-api/authority-setting-api/lookupCodeApi";
import { formatDate } from "@/helpers/helper";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { RiPlayListAddFill } from "react-icons/ri";
import Breadcrumb from "@/components/Breadcumb";
import { AiFillCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";
import AddLookupCode from "./AddLookupCode";
import Pagination from "@/components/Pagination";
import EditLookupCode from "./EditLookupCode";

function LookupCodeComponent() {
  const [lookupCodes, setLookupCodes] = useState<LookupCode[]>([]);
  const [filteredLookupCodes, setFilteredLookupCodes] = useState<LookupCode[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortState, setSortState] = useState({
    column: "code",
    order: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (lookupCodeId: string) => {
    setSelectedId(lookupCodeId);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const getLookupCodes = async () => {
    try {
      const data = await fetchLookupCodes();
      if (data && Array.isArray(data.lookupCodes)) {
        setLookupCodes(data.lookupCodes);
        setFilteredLookupCodes(data.lookupCodes);
      } else {
        setError("Failed to fetch lookup codes.");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLookupCodes();
  }, []);

  const handleReload = () => {
    getLookupCodes();
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus:any = !currentStatus;
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${
        newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) return;

    try {
      const response:any = await updateLookupCodeById(_id, { status: newStatus });
      if (response?.success) {
        toast.success(
          response.message ||
            `Lookup code status updated to ${
              newStatus ? "Active" : "Inactive"
            }.`
        );
        getLookupCodes();
      } else {
        toast.error(response.message || "Failed to update lookup code status.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update lookup code status.");
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = lookupCodes.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLookupCodes(filtered);
    } else {
      setFilteredLookupCodes(lookupCodes);
    }
    setCurrentPage(1);
  };

  const changeSort = (column: keyof LookupCode) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredLookupCodes].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredLookupCodes(sortedData);
  };

  const totalPages = Math.ceil(filteredLookupCodes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems:any = filteredLookupCodes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (lookupCodeId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lookup code?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteLookupCode(lookupCodeId);
      if (response.success) {
        toast.success(response.message || "Lookup code deleted successfully!");
        getLookupCodes();
      } else {
        toast.error(response.message || "Failed to delete lookup code.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lookup code.");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Lookup Code", path: "" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Lookup Code</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-end items-center px-1">
        <div className="md:mr-auto">
          <button className="add-btn" onClick={handleShow}>
            <RiPlayListAddFill className="mr-2" />
            Add
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full data_table">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("_id")}
              >
                <div className="flex items-center">
                  Sl No.
                  {sortState.column === "_id" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th>Actions</th>
              <th
                className="px-4 py-2 text-left ml-10 cursor-pointer"
                onClick={() => changeSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("code")}
              >
                <div className="flex items-center">
                  Code
                  {sortState.column === "code" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortState.column === "name" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("createdAt")}
              >
                <div className="flex items-center">
                  Created At
                  {sortState.column === "createdAt" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((item:any, index:any) => (
              <tr className="border" key={item._id}>
                <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/lookup-code/view/${item._id}`}>
                    <GrOverview size={25} title="View" className="view-icon" />
                  </Link>
                  <CiEdit
                    size={28}
                    title="Edit"
                    className="edit-icon"
                    onClick={() => handleEditShow(item._id)}
                  />
                  <MdDeleteOutline
                    size={28}
                    title="Delete"
                    className="delete-icon"
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    className={`rounded-full border-2 px-4 py-1 ${
                      item.status
                        ? "active-btn border-green-500 text-green-500"
                        : "inactive-btn border-red-500 text-red-500"
                    } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredLookupCodes.length}</span>
        </div>
        <div className="pagination flex items-center gap-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <AddLookupCode onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditLookupCode
              lookupCodeId={selectedId}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LookupCodeComponent;
