import  { useEffect, useState } from 'react'
import type { FeeInstallment } from '@/api/admin-api/lookups-api/feeInstallmentApi';
import { deleteFeeInstallmentById, getFeeInstallments, UpdateFeeInstallmentStatus } from '@/api/admin-api/lookups-api/feeInstallmentApi';
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

function FeeInstallment() {
    // const [feeInstallments, setFeeInstallments] = useState<FeeInstallment[]>([]);
    const [filteredFeeInstallment, setFilteredFeeInstallment] = useState<FeeInstallment[]>([]);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortState, setSortState] = useState({
        column: "code",
        order: "ascending",
    });
    // console.log(feeInstallments, "feeInstallments")
    // console.log("filteredFeeInstallment", filteredFeeInstallment)
    const navigate = useNavigate();
    const itemsPerPage = 25;

    const fetchFeeInstallments = async (page: number, limit: number) => {
        try {
            const response = await getFeeInstallments(page, limit);
            if (response.success) {
                setFilteredFeeInstallment(response.data?.data);
                setTotalItems(response?.data?.total);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        fetchFeeInstallments(currentPage, itemsPerPage); 
    }, [currentPage, itemsPerPage]);

    const handleEditShow = (id: string) => {
        navigate(`/lookups/fee-installments/edit/${id}`);
    }
    const handleStatusUpdate = async (id: string, status: boolean) => {
        const newStatus = !status;
        const isConfirmed = window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this fee installment?`);
        if (!isConfirmed) return;
        try {
            const response = await UpdateFeeInstallmentStatus(id, newStatus);
            if (response.success) {
                toast.success(`Fee installment ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchFeeInstallments(currentPage, itemsPerPage); // Refresh the list after updating status
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }
    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this fee installment?");
        if (!isConfirmed) return;
        try {
            const response = await deleteFeeInstallmentById(id);
            if (response.success) {
                toast.success(response.message || "Fee installment deleted successfully");
                fetchFeeInstallments(currentPage, itemsPerPage); 
            }
            else{
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

        const sortedData = [...filteredFeeInstallment].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredFeeInstallment(sortedData);
    };
    const handleSearch = (query: string) => {
        if (query) {
            const filtered = filteredFeeInstallment.filter(
                (item) =>
                    item.code.toLowerCase().includes(query.toLowerCase()) ||
                    item.feeInstallmentType.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredFeeInstallment(filtered);
        } else {
            fetchFeeInstallments(currentPage, itemsPerPage);
        }
        setCurrentPage(1);
    };
    const onReturn = () => {
        navigate("/lookups/fee-installments/add");
    };
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Fee Installment", path: "" },
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
  <h2 className="text-2xl font-bold text-gray-800">Fee Installment</h2>
    <div className="mt-1">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  </div>
                
               
         

        
  <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
    <Link to={'add'} className="w-full md:w-auto">
      <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
        <RiPlayListAddFill className="text-lg" />
        Add Fee Installment
      </button>
    </Link>
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    Sl No
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("status")}>
                                <div className="flex items-center">
                                    Status
                                    {sortState.column === "status" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    Code
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    Academic Year
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    Fee Type
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    No Of Installments
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => changeSort("code")}>
                                <div className="flex items-center">
                                    Created At
                                    {sortState.column === "code" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredFeeInstallment.map((item: any, index: number) => (
                                <tr className="hover:bg-gray-50" key={item._id}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Link to={`/lookups/fee-installments/view/${item._id}`}>
                                            <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                        </Link>
                                            <CiEdit
                                                size={22}
                                                title="Edit"
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                            onClick={() => handleEditShow(item._id)}
                                            />

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
                                            {item?.status ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.code || "N/A"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.academicYear || "N/A"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.feeInstallmentType?.name || "N/A"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.noOfInstallment || "N/A"}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{formatDate(item?.createdAt || "N/A")}</td>
                                </tr>
                            ))
                        }
                    </tbody>

                </table>
            </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center px-1">
                <div className="total-count">
                    <span>Total: {totalItems}</span>
                    &nbsp;|&nbsp;
                    <span>Page Count: {itemsPerPage}</span>
                </div>
                <div className="pagination flex items-center gap-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
</div>
        </div>
    )
}

export default FeeInstallment