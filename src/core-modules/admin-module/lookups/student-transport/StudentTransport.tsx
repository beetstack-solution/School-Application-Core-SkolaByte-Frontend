import React, { useEffect, useState } from 'react'
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
import { getAllStudentTransportInfo, deleteStudentTransportInfo ,getStudentTransportInfoStatus} from '@/api/admin-api/lookups-api/studenttransportInfoApi';
import * as XLSX from 'xlsx';
import ExportExcelButton from '@/components/ExcelExportButton';


function StudentTransport() {
    const [transports, setTransports] = useState<any[]>([]);
    const [filteredTransports, setFilteredTransports] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortState, setSortState] = useState({
        column: "busNumber",
        order: "ascending",
    });
console.log("filteredTransports",filteredTransports)
    const navigate = useNavigate();
    const itemsPerPage = 25;

    const fetchTransports = async (page: number, limit: number) => {
        try {
            const response = await getAllStudentTransportInfo(page, limit);
            if (response.success) {
                const transportData = response.data?.data || [];
                setTransports(transportData);
                setFilteredTransports(transportData);
                setTotalItems(response.data?.total || 0);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchTransports(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleEditShow = (id: string) => {
        navigate(`/lookups/students-transports/edit/${id}`);
    }

    const handleStatusUpdate = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const isConfirmed = window.confirm(
            `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this transport?`
        );

        if (!isConfirmed) return;

        try {
            const response = await getStudentTransportInfoStatus(id, newStatus);
            if (response.success) {
                toast.success(`Transport ${newStatus ? 'activated' : 'deactivated'} successfully`);

                // Update the local state to reflect the change
                setTransports(prevTransports =>
                    prevTransports.map(transport =>
                        transport._id === id ? { ...transport, status: newStatus } : transport
                    )
                );

                setFilteredTransports(prevTransports =>
                    prevTransports.map(transport =>
                        transport._id === id ? { ...transport, status: newStatus } : transport
                    )
                );
            } else {
                toast.error(response.message || "Failed to update transport status");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this transport?");
        if (!isConfirmed) return;
        try {
            const response = await deleteStudentTransportInfo(id);
            if (response.success) {
                toast.success(response.message || "Transport deleted successfully");
                fetchTransports(currentPage, itemsPerPage);
            } else {
                toast.error(response.message || "Failed to delete transport");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const changeSort = (column: string) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredTransports].sort((a: any, b: any) => {
            // Handle nested properties
            let valueA, valueB;

            if (column === 'busNumber') {
                valueA = a.busInfo.busNumber;
                valueB = b.busInfo.busNumber;
            } else if (column === 'driverName') {
                valueA = a.busInfo.driver.name;
                valueB = b.busInfo.driver.name;
            } else if (column === 'academicYear') {
                valueA = a.academicYear.academicYear;
                valueB = b.academicYear.academicYear;
            } else {
                valueA = a[column];
                valueB = b[column];
            }

            if (valueA < valueB) return order === "ascending" ? -1 : 1;
            if (valueA > valueB) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredTransports(sortedData);
    };

    const handleSearch = (query: string) => {
        if (query.trim()) {
            const filtered = transports.filter(
                (item) =>
                    item.class.toLowerCase().includes(query.toLowerCase()) ||
                    item.division.toLowerCase().includes(query.toLowerCase()) ||
                    item.studentTransportMapping.some((student: any) =>
                        student.firstName.toLowerCase().includes(query.toLowerCase()) ||
                        student.lastName.toLowerCase().includes(query.toLowerCase()) ||
                        student.place.toLowerCase().includes(query.toLowerCase()) ||
                        student.dropLocation.toLowerCase().includes(query.toLowerCase())
                    )
            );
            setFilteredTransports(filtered);
        } else {
            setFilteredTransports(transports);
        }
        setCurrentPage(1);
    };

    const onReturn = () => {
        navigate("/lookups/students-transports/add");
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Student Transports", path: "" },
    ];

    const exportToExcel = async() => {
        const response = await getAllStudentTransportInfo(0, Number.MAX_SAFE_INTEGER);

        const data = response.data?.data || [];
        if (data.length === 0) {
            toast.error("No data available to export");
            return;
        }
        const dataToExport:any[]=[];
        let slNo =1;

        data.forEach((item: any) => {
            const student = item.studentTransportMapping[0] || {};
            dataToExport.push({
                "Sl No": slNo++,
                "Class": item.class || "N/A",
                "Division": item.division || "N/A",
                "Student Name": `${student.firstName || ""} ${student.lastName || ""}`.trim() || "N/A",
                "Place": student.place || "N/A",
                "Drop Location": student.dropLocation || "N/A",
                "Status": item.status ? "Active" : "Inactive",
                "Created At": formatDate(item.createdAt) || "N/A"
            });
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transports");
        XLSX.writeFile(wb, "transports.xlsx");
    }

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
              <ExportExcelButton
                      onExport={exportToExcel}
                      isLoading={isLoading}
                    /> 
               
               
               
                <div>
                <h2 className="text-2xl font-bold text-gray-800">Student Transports</h2>
    
    
    <div className="mt-1">
      <Breadcrumb items={breadcrumbItems} />
    </div>
                </div>
   
         

          
            <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
    <Link to={'add'} className="w-full md:w-auto">
      <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
        <RiPlayListAddFill className="text-lg" />
        Add
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
                            <th className=" className={`px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">
                                Sl No
                            </th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">Actions</th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">Status</th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2"
                                onClick={() => changeSort("busNumber")}>
                                <div className="flex items-center">
                                    Class
                                    {sortState.column === "busNumber" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2"
                                onClick={() => changeSort("driverName")}>
                                <div className="flex items-center">
                                    Division
                                    {sortState.column === "driverName" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">
                                student Name
                            </th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2"
                                onClick={() => changeSort("academicYear")}>
                                <div className="flex items-center">
                                   Place
                                    {sortState.column === "academicYear" &&
                                        sortState.order === "ascending" && <AiFillCaretUp />}
                                </div>
                            </th>
                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">
                                Drop Location
                            </th>

                            <th className=" className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider me-2">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransports.map((item: any, index: number) => (
                            <tr className="border" key={item._id}>
                                <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                             
                                <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Link to={`/lookups/students-transports/view/${item._id}`}>
                                        <GrOverview size={20} title="View" className="text-gray-500 hover:text-blue-600 transition-colors" />
                                    </Link>
                                    <CiEdit
                                        size={22}
                                        title="Edit"
                                        className="text-gray-500 hover:text-green-600 transition-colors"
                                        onClick={() => handleEditShow(item._id)}
                                    />
                                    <MdDeleteOutline
                                        size={18}
                                        title="Delete"
                                         className="text-gray-500 hover:text-red-600 transition-colors"
                                        onClick={() => handleDelete(item._id)}
                                    />
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-red-100 text-red-800"
                                            } `}
                                        onClick={() => handleStatusUpdate(item._id, item.status)}
                                    >
                                        {item.status ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">{item.class || "N/A"}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.division || "N/A"}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.studentTransportMapping[0].firstName || "N/A"} {item.studentTransportMapping[0].lastName || "N/A"}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.studentTransportMapping[0].place || "N/A"}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.studentTransportMapping[0].dropLocation || "N/A"}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{formatDate(item?.createdAt || "N/A")}</td>
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

export default StudentTransport