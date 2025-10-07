import { deleteFeeStructure, FeeStructureData, fetchFeeStructures, updateFeeStructureStatus } from '@/api/admin-api/lookups-api/feeStructureApi';
import Breadcrumb from '@/components/Breadcumb';
import ExportExcelButton from '@/components/ExcelExportButton';
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
import * as XLSX from 'xlsx';


function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState<FeeStructureData[]>([]);
  const [filteredFeeStructures, setFilteredFeeStructures] = useState<FeeStructureData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [sortState, setSortState] = useState({
    column: "code",
    order: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFeeStructureId, setSelectedId] = useState<string>("");
  const [selectedFeeStructureName, setSelectedFeeStructureName] = useState<string>("");
  const navigate = useNavigate();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (feeStructureId: string, feeStructureName: string) => {
    setSelectedId(feeStructureId);
    setSelectedFeeStructureName(feeStructureName);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };



  const getFeeStructures = async (page: number, limit: number) => {
    setLoading(true);

    try {
      const response: any = await fetchFeeStructures(page, limit);
      if (response.success) {
        setFilteredFeeStructures(response.data?.data);
        setTotalItems(response?.data?.total);
      } else {
        setError("Failed to fetch fee structures.");
      }
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    getFeeStructures(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // const handleReload = () => {
  //   getFeeStructures(page, limit);
  // };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
    );
    if (!isConfirmed) return;

    try {
      const response = await updateFeeStructureStatus(_id, newStatus);
      if (response?.success) {
        toast.success(
          response.message || `Fee structure status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        getFeeStructures(currentPage, itemsPerPage);
      } else {
        toast.error(response.message || "Failed to update fee structure status.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update fee structure status.");
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = filteredFeeStructures.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.feeName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFeeStructures(filtered);
    } else {
      getFeeStructures(currentPage, itemsPerPage);
    }
    setCurrentPage(1);
  };

  const changeSort = (column: keyof FeeStructureData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredFeeStructures].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredFeeStructures(sortedData);
  };

  const handleDelete = async (feeStructureId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee structure?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteFeeStructure(feeStructureId);
      if (response.success) {
        toast.success(response.message || "Fee structure deleted successfully!");
        getFeeStructures(currentPage, itemsPerPage);
      } else {
        toast.error(response.message || "Failed to delete fee structure.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete fee structure.");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const onReturn = () => {
    navigate("/lookups/fee-structures/add");
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Fee Structure", path: "" },
  ];




  const exportToExcel = async () => {
    const response: any = await fetchFeeStructures(0, Number.MAX_SAFE_INTEGER);
    const data = response.data?.data || [];

    if (data.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const dataToExport: any[] = [];
    let slNo = 1;

    data.forEach((item: any) => {
      dataToExport.push({
        "Sl No": slNo++,
        "Code": item.code,
        "Status": item.status ? "Active" : "Inactive",
        "Academic Year": item.academicYear?.name || "N/A",
        "Fee Name": item.feeName,
        "Class": item.class?.name || "N/A",
        "Fee Amount Split Details": item.feeAmountSplitup?.map((detail: any) =>
          `${detail.feeType?.name || 'N/A'} (${detail.amount})`
        ).join(", ") || "N/A",
        "Total Fee": item.totalFee,
        "Created At": formatDate(item.createdAt),
      });
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fee Structures");
    XLSX.writeFile(wb, `fee_structures_${new Date().toISOString()}.xlsx`);
  };

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
            <ExportExcelButton
              onExport={exportToExcel}
              isLoading={isLoading}
            />
            <h2 className="text-2xl font-bold text-gray-800">Fee Structure</h2>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Actions</th>
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
                      Code
                      {sortState.column === "code" &&
                        sortState.order === "ascending" && <AiFillCaretUp />}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => changeSort("feeName")}
                  >
                    <div className="flex items-center">
                      Fee Name
                      {sortState.column === "feeName" &&
                        sortState.order === "ascending" && <AiFillCaretUp />}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => changeSort("class")}
                  >
                    <div className="flex items-center">
                      Class
                      {sortState.column === "class" &&
                        sortState.order === "ascending" && <AiFillCaretUp />}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => changeSort("totalFee")}
                  >
                    <div className="flex items-center">
                      Total Fee
                      {sortState.column === "totalFee" &&
                        sortState.order === "ascending" && <AiFillCaretUp />}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={() => changeSort("academicYear")}
                  >
                    <div className="flex items-center">
                      Academic Year
                      {sortState.column === "academicYear" &&
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
                {filteredFeeStructures?.map((item, index) => (
                  <tr className="border" key={item._id}>
                    <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/lookups/fee-structures/view/${item._id}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                          <GrOverview size={20} title="View" />
                        </Link>
                        <Link to={`/lookups/fee-structures/edit/${item._id}`}>
                          <CiEdit
                            size={20}
                            title="Edit"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            onClick={() => handleEditShow(item._id, item.feeName)}
                          />
                        </Link>

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
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.feeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.class.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.totalFee}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item?.academicYear?.name}</td>
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
          <AddFeeStructure onClose={handleClose} onReload={handleReload} />
        </div>
      </div>
    )} */}

        {/* {showEdit && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <EditFeeStructure
            feeStructureId={selectedFeeStructureId}
            feeStructureName={selectedFeeStructureName}
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

export default FeeStructure