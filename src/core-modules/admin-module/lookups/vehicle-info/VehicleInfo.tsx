import { deleteVehicle, fetchVehicles, updateVehicleStatus } from '@/api/admin-api/lookups-api/vehicleInfoApi';
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
// import AddVehicleType from './AddVehicleType';
// import EditVehicileType from './EditVehicileType';
// import AddFeeType from './AddFeeType';
// import EditFeeType from './EditFeeType';

function VehicleInfo() {
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
        navigate(`/lookups/vehicle-info/edit/${feeStructureId}`);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
    };



    const getAllTransportVehicles = async (page: number, limit: number) => {
        setLoading(true);

        try {
            const response: any = await fetchVehicles(page, limit);
            if (response.success) {
                setFilteredTransportVehicles(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                setError("Failed to fetch Transport Vehicles.");
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        getAllTransportVehicles(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleReload = () => {
        getAllTransportVehicles(currentPage, itemsPerPage);
    };

    const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        const isConfirmed = window.confirm(
            `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
        );
        if (!isConfirmed) return;

        try {
            const response = await updateVehicleStatus(_id, newStatus);

            if (response?.success) {
                toast.success(
                    response.message || `Transport Vehicle status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                getAllTransportVehicles(currentPage, itemsPerPage);
            } else {
                toast.error(response?.message || "Failed to update Transport Vehicle status.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating the Transport Vehicle status.");
        }
    };
    

const handleSearch = (query: string) => {
    setLoading(true);
    
    try {
        if (query.trim()) {
            const filteredData = filteredTransportVehicles.filter((item) => {
                // Check if item exists and has necessary properties
                if (!item) return false;
                
                // Check academic year
                const academicYearMatch = item.academicYear?.academicYear?.toLowerCase().includes(query.toLowerCase());
                
                // Check vehicle details
                const vehicleTypeMatch = item.transportVehicleDetails?.name?.toLowerCase().includes(query.toLowerCase());
                
                // Check vehicle info (if exists)
                const vehicleInfoMatch = item.vehicleInfo?.some((v:any) => {
                    if (!v) return false;
                    return (
                        v.vehicleNumber?.toLowerCase().includes(query.toLowerCase()) ||
                        v.vehicleName?.toLowerCase().includes(query.toLowerCase()) ||
                        v.driver?.name?.toLowerCase().includes(query.toLowerCase()) ||
                        v.route?.routeName?.toLowerCase().includes(query.toLowerCase())
                    );
                });
                
                return academicYearMatch || vehicleTypeMatch || vehicleInfoMatch;
            });
            
            setFilteredTransportVehicles(filteredData);
            setTotalItems(filteredData.length);
        } else {
            // Reset to original data if query is empty
            getAllTransportVehicles(currentPage, itemsPerPage);
        }
    } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to perform search");
    } finally {
        setLoading(false);
    }
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
            "Are you sure you want to delete this Transport Vehicles?"
        );
        if (!confirmDelete) return;

        try {
            const response: any = await deleteVehicle(feeStructureId);
            if (response.success) {
                toast.success(response.message || "Transport Vehicles deleted successfully!");
                getAllTransportVehicles(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to delete Transport Vehicles.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete Transport Vehicles.");
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const onReturn = () => {
        navigate("/lookups/vehicle-info/add/");
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Transportation Type", path: "" },
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
                        <h2 className="text-2xl font-bold text-gray-800">Vehicle Information</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <button onClick={() => navigate("/lookups/vehicle-info/add/")} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
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
                                    {/* <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Code
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th> */}
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Academic Year
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Vehicle Type
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Vehicle Number
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Vehicle Name
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Driver Name
                                            {sortState.column === "code" &&
                                                sortState.order === "ascending" && <AiFillCaretUp />}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => changeSort("code")}
                                    >
                                        <div className="flex items-center">
                                            Route Name
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
                                                <Link to={`/lookups/vehicle-info/view/${item._id}`}>
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
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.academicYear?.academicYear || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.transportVehicleDetails?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.vehicleInfo?.length > 0
                                                ? item.vehicleInfo.map((v:any, idx:any) => (
                                                    <div key={idx} className="mb-1">
                                                        <div> {v?.vehicleNumber || "N/A"}</div>
                                                    </div>
                                                ))
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.vehicleInfo?.length > 0
                                                ? item.vehicleInfo.map((v:any, idx:any) => (
                                                    <div key={idx} className="mb-1">
                                                        <div> {v?.vehicleName || "N/A"}</div>
                                                    </div>
                                                ))
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.vehicleInfo?.length > 0
                                                ? item.vehicleInfo.map((v:any, idx:any) => (
                                                    <div key={idx} className="mb-1">
                                                        <div> {v?.driver?.name || "N/A"}</div>
                                                    </div>
                                                ))
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                            {item?.vehicleInfo?.length > 0
                                                ? item.vehicleInfo.map((v:any, idx:any) => (
                                                    <div key={idx} className="mb-1">
                                                        <div> {v?.route?.routeName || "N/A"}</div>
                                                    </div>
                                                ))
                                                : "N/A"}
                                        </td>
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
                            <AddVehicleType onClose={handleClose} onReload={handleReload} />
                        </div>
                    </div>
                )} */}
{/* 
                {showEdit && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <EditVehicileType
                                feeTypeId={selectedId}
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

export default VehicleInfo