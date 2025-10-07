import { updateDesignationStatus } from '@/api/admin-api/lookups-api/designationApi';
import { deleteSchoolManagement, getSchoolManagement, updateSchoolManagementStatus } from '@/api/admin-api/lookups-api/schoolManagementApi';
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper';
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import AddDesignation from './AddDesignation';
// import EditDesignation from './EditDesignation';
// import AddPtaRole from './AddPtaRole';
// import EditPtaRole from './EditPtaRole';
// import AddVehicleType from './AddVehicleType';
// import EditVehicileType from './EditVehicileType';
// import AddFeeType from './AddFeeType';
// import EditFeeType from './EditFeeType';

function SchoolManagement() {
    const [filteredTransportVehicles, setFilteredTransportVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [totalItems, setTotalItems] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [sortState, setSortState] = useState({
        column: "code",
        order: "ascending",
    });
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedFeeStructureName, setSelectedFeeStructureName] = useState<string>("");
    const navigate = useNavigate();
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleEditShow = (feeStructureId: string) => {
        // setSelectedId(feeStructureId);
        // setShowEdit(true);
        navigate(`/lookups/school-management/edit/${feeStructureId}`);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
    };

   
    const getAllPtaRoles = async (page: number, limit: number) => {
        setLoading(true);

        try {
            const response: any = await getSchoolManagement(page, limit);
            if (response.success) {
                setFilteredTransportVehicles(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                setError("Failed to fetch SchoolManagement.");
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        getAllPtaRoles(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleReload = () => {
        getAllPtaRoles(currentPage, itemsPerPage);
    };

    const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
        const newStatus: any = !currentStatus;
        const isConfirmed = window.confirm(
            `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
        );
        if (!isConfirmed) return;

        try {
            const response: any = await updateSchoolManagementStatus(_id, newStatus);
            if (response?.success) {
                toast.success(
                    response.message || `SchoolManagement status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                getAllPtaRoles(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to update SchoolManagement status.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update SchoolManagement status.");
        }
    };
console.log("filteredTransportVehicles",filteredTransportVehicles)
    const handleSearch = (query: string) => {
        if (query) {
            const filtered = filteredTransportVehicles.filter((item) => 
                    item.designation.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.department?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.fullName?.toLowerCase().includes(query.toLowerCase()) 
                );

          

            setFilteredTransportVehicles(filtered);
        } else {
            getAllPtaRoles(currentPage, itemsPerPage);
        }

        setCurrentPage(1);
    };

    const changeSort = (column: any) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredTransportVehicles].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredTransportVehicles(sortedData);
    };

    const handleDelete = async (feeStructureId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this SchoolManagement?"
        );
        if (!confirmDelete) return;

        try {
            const response: any = await deleteSchoolManagement(feeStructureId);
            if (response.success) {
                toast.success(response.message || "SchoolManagement deleted successfully!");
                getAllPtaRoles(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to delete SchoolManagement.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete SchoolManagement.");
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // const onReturn = () => {
    //     navigate("/lookups/pta-roles/add/");
    // };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "School Management", path: "" },
    ];
    return (


        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* Message Popup */}
            {/* {message && (
       <MessagePopup
         message={message.text}
         type={message.type}
         onClose={() => setMessage(null)}
         duration={4000}
       />
     )} */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">School Management</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <button onClick={() => navigate("/lookups/school-management/add")} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                            <RiPlayListAddFill className="text-lg" />
                            Add
                        </button>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>




                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                //  style={{ height: 'calc(100vh - 200px)' }}
                >
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Sl No
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("status")}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            {sortState.column === "status" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Designation
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Department
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    


                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                {filteredTransportVehicles?.map((item, index) => (
                                    <tr className="hover:bg-gray-50" key={item._id} >
                                        <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/lookups/school-management/view/${item._id}`}>
                                                    <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                                </Link>
                                                {/* <Link to={`/lookups/fee-structures/edit/${item._id}`}> */}
                                                <CiEdit
                                                    size={20}
                                                    title="Edit"
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={() => handleEditShow(item._id)}
                                                />
                                                {/* </Link> */}

                                                <MdDeleteOutline
                                                    size={18}
                                                    title="Delete"
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={() => handleDelete(item._id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium  ${item.status
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    } `}
                                                onClick={() => handleStatusUpdate(item._id, item.status)}
                                            >
                                                {item.status ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.fullName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.designation?.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.department?.name}</td>
                                       
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{formatDate(item.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center px-1">
                    <div className="total-count">
                        <span>Total: {totalItems}</span>
                        &nbsp;|&nbsp;
                        <span>Page Count: {rowsPerPage}</span>
                    </div>
                    <div className="pagination flex items-center gap-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                {/* {showModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <AddDesignation onClose={handleClose} onReload={handleReload} />
                        </div>
                    </div>
                )} */}
                
                {/* {showEdit && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <EditDesignation
                                ptaRoleId={selectedId}
                                onClose={handleCloseEdit}
                                onReload={handleReload}
                            />
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    )
}

export default SchoolManagement