import React, { useEffect, useState } from 'react'
import type { FeeInstallment } from '@/api/admin-api/lookups-api/feeInstallmentApi';
import Breadcrumb from '@/components/Breadcumb';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { formatDate } from '@/helpers/helper';
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deletePayment, FeePayment, geAllPayments, updatePaymentStatus } from '@/api/admin-api/lookups-api/paymentApi';
import { TbDeviceMobileUp } from 'react-icons/tb';
import { FaHandHolding } from 'react-icons/fa';
import { getPaymentHistory } from '@/api/admin-api/lookups-api/paymentHistoryApi';
import * as XLSX from 'xlsx';
import ExportExcelButton from '@/components/ExcelExportButton';


function Payment() {

    const [payments, setPayments] = useState<FeePayment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<FeePayment[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [sortState, setSortState] = useState({
        column: "code",
        order: "ascending",
    });
    const navigate = useNavigate();
    const itemsPerPage = 25;


    // Then use debouncedSearch in your SearchBar component
    const fetchPayments = async (page: number, limit: number) => {
        try {
            const response: any = await getPaymentHistory(page, limit);
            if (response.success) {
                setPayments(response.data?.data); // Add this line
                setFilteredPayments(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchPayments(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleEditShow = (id: string) => {
        navigate(`/lookups/payments/edit/${id}`);
    }
    const handleStatusUpdate = async (id: string, status: boolean) => {
        const newStatus = !status;
        const isConfirmed = window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this fee installment?`);
        if (!isConfirmed) return;
        try {
            const response = await updatePaymentStatus(id, newStatus);
            if (response.success) {
                toast.success(`Fee installment ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchPayments(currentPage, itemsPerPage); // Refresh the list after updating status
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }
    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this fee installment?");
        if (!isConfirmed) return;
        try {
            const response = await deletePayment(id);
            if (response.success) {
                toast.success(response.message || "Fee installment deleted successfully");
                fetchPayments(currentPage, itemsPerPage);
            }
            else {
                toast.error(response.message || "Failed to delete fee installment");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const changeSort = (column: keyof FeeInstallment) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredPayments].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredPayments(sortedData);
    };
    const handleSearch = (query: string) => {
        if (query) {
            const filtered = payments.filter(
                (item: any) =>
                    item.student?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.student?.rollNumber?.toLowerCase().includes(query.toLowerCase()) ||
                    item.paymentStatus?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPayments(filtered);
        } else {
            setFilteredPayments(payments); // Reset to original data when search is cleared
        }
        setCurrentPage(1);
    };
    const onReturn = () => {
        navigate("/lookups/payments/add");
    };
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Payments", path: "" },
    ];

    const exportToExcel = async ()  => {
    const response = await getPaymentHistory(0, Number.MAX_SAFE_INTEGER);
    const data = response.data?.data || [];
    if (data.length === 0) {
        toast.error("No data available to export");
        return;
    }

    const datatoExport:any[]= [];
    let slNo=1;

    data.forEach((item: any) => {
        datatoExport.push({
            "Sl No.": slNo++,
            "Student Name": item.student?.name || "N/A",
            "Roll Number": item.student?.rollNumber || "N/A",
            "Fee Name": item.feeStructure?.name || "N/A",
            "Payment Status": item.paymentStatus || "N/A",
            "Mode of Payment": item.modeOfPayment || "N/A",
            "Amount Paid": item.amountPaid || "N/A",
            "Payment Date": formatDate(item.paymentDate) || "N/A"
        });
    });

    const ws = XLSX.utils.json_to_sheet(datatoExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");

}

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* {message && (
          <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          duration={4000}
        />
      )} */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4r">

                    <ExportExcelButton
                        onExport={exportToExcel}
                        isLoading={isLoading}
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Payments List</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <Link to={'/lookups/fee-collected'} className="w-full md:w-auto">
                            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                                <RiPlayListAddFill className="text-lg" />
                                Add
                            </button>
                        </Link>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'all' ? 'text-white bg-blue-600 rounded-t-md' : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Payments
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'online'
                                ? 'text-white bg-blue-600 rounded-t-md'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('online')}
                    >
                        <TbDeviceMobileUp className="text-lg" />
                        <span>Online</span>
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'offline' ? 'text-white bg-blue-600 rounded-t-md' : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('offline')}
                    >
                        <FaHandHolding /> Offline
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    {[
                                        { name: "Sl No.", width: "w-16" },
                                        { name: "Actions" },
                                        // { name: "Status"},
                                        // { name: "Code"},
                                        { name: "Student Name" },
                                        { name: "Roll Number" },
                                        { name: "Fee Name" },
                                        { name: "Payment Status" },
                                        { name: "Mode of Payment" },
                                        { name: "Amount Paid" },
                                        { name: "Payment Date" }
                                    ].map((header) => (
                                        <th key={header.name} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}>
                                            <div className="flex items-center gap-1">
                                                {header.name}
                                                <AiFillCaretUp className="text-gray-400 text-xs" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayments.map((item: any, index: number) => (
                                    <tr className="hover:bg-gray-50" key={item._id}>
                                        <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/lookups/payments/view/${item._id}`}>
                                                    <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                                </Link>
                                                {/* <CiEdit
                                                size={22}
                                                title="Edit"
                                                className="text-gray-500 hover:text-green-600 transition-colors"
                                                onClick={() => handleEditShow(item._id)}
                                            /> */}

                                                {/* <MdDeleteOutline
                                                size={20}
                                                title="Delete"
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                onClick={() => handleDelete(item._id)}
                                            /> */}
                                            </div>
                                        </td>
                                        {/* <td className="px-4 py-3">
                                            <button
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium  ${item.status
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-red-100 text-red-800"
                                                    } `}
                                                onClick={() => handleStatusUpdate(item._id, item.status)}
                                            >
                                                {item?.status ? "Active" : "Inactive"}
                                            </button>
                                        </td> */}
                                        <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs capitalize">{item?.student.name || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.student?.rollNumber || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.feeStructure?.name || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.paymentStatus || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.modeOfPayment || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.amountPaid || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item?.paymentDate || "N/A")}</td>
                                    </tr>
                                ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            </div>
        </div>

    )
}

export default Payment