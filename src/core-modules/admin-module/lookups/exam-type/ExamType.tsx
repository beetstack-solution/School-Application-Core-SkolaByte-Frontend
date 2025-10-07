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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddExamType from './AddExamType';
import EditExamType from './EditExamType';
import { deleteExamType, ExamTypeData, fetchExamTypes, updateExamTypeStatus } from '@/api/admin-api/lookups-api/examTypeApi';

function ExamType() {
    const [examTypes, setExamTypes] = useState<ExamTypeData[]>([]);
    const [filteredExamTypes, setFilteredExamTypes] = useState<ExamTypeData[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
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
    const [selectedExamTypeId, setSelectedId] = useState<string>(''); 
    const [selectedExamTypeName, setSelectedExamTypeName] = useState<string>(''); 
  
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
  
    const handleEditShow = (examTypeId: string) => {
      setSelectedId(examTypeId);
      setShowEdit(true);
    };
  
    const handleCloseEdit = () => {
      setShowEdit(false);
    };
    const page = currentPage;
    const limit = itemsPerPage;
  
    const getExamTypes = async (page: number, limit: number) => {
        setLoading(true); 
        try {
            const response:any = await fetchExamTypes(page, limit);
            if (response.success) {
                setFilteredExamTypes(response.data?.data);
                setTotalItems(response.data?.total); 
            } else {
                setError('Failed to fetch exam types.');
            }
        } catch (error: any) {
            setError(error.message); 
        }
        setLoading(false);  
    };
  
    useEffect(() => {
        getExamTypes(page, limit);
    }, [page, limit]);
  
    const handleReload = () => {
        getExamTypes(page, limit);
    };
  
    const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const isConfirmed = window.confirm(
            `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
        );
        if (!isConfirmed) return;
  
        try {
            const response = await updateExamTypeStatus(_id, newStatus);
            if (response?.success) {
                toast.success(
                    response.message || `Exam type status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                getExamTypes(page, limit);
            } else {
                toast.error(response.message || "Failed to update exam type status.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update exam type status.");
        }
    };
  
    const handleSearch = (query: string) => {
        if (query) {
            const filtered = filteredExamTypes.filter(
                (item) =>
                    item?.code.toLowerCase().includes(query.toLowerCase()) ||
                    item.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredExamTypes(filtered);
        } else {
            setFilteredExamTypes(filteredExamTypes);
        }
        setCurrentPage(1);
    };
  
    const changeSort = (column: keyof ExamTypeData) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });
  
        const sortedData = [...filteredExamTypes].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredExamTypes(sortedData);
    };
  
    const handleDelete = async (examTypeId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this exam type?"
        );
        if (!confirmDelete) return;
  
        try {
            const response = await deleteExamType(examTypeId);
            if (response.success) {
                toast.success(response.message || "Exam type deleted successfully!");
                getExamTypes(page, limit);
            } else {
                toast.error(response.message || "Failed to delete exam type.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete exam type.");
        }
    };
  
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Corrected to use totalItems
  
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
  
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Exam Types", path: "" },
    ];
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Exam Types</h2>
      <div className="mt-1">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
      <button 
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
        onClick={handleShow}
      >
        <RiPlayListAddFill className="text-lg" />
        Add Exam Type
      </button>
      <SearchBar onSearch={handleSearch} />
    </div>
  </div>

  {/* Table Section */}
  <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col" 
  // style={{ minHeight: '400px' }}
  >
    <div className="flex-1 overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              onClick={() => changeSort("_id")}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                Sl No.
                {sortState.column === "_id" && sortState.order === "ascending" && <AiFillCaretUp />}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            <th
              onClick={() => changeSort("status")}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                Status
                {sortState.column === "status" && sortState.order === "ascending" && <AiFillCaretUp />}
              </div>
            </th>
            <th
              onClick={() => changeSort("code")}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                Code
                {sortState.column === "code" && sortState.order === "ascending" && <AiFillCaretUp />}
              </div>
            </th>
            <th
              onClick={() => changeSort("name")}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                Name
                {sortState.column === "name" && sortState.order === "ascending" && <AiFillCaretUp />}
              </div>
            </th>
            <th
              onClick={() => changeSort("createdAt")}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                Created At
                {sortState.column === "createdAt" && sortState.order === "ascending" && <AiFillCaretUp />}
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-red-500 font-medium">
                {error}
              </td>
            </tr>
          ) : filteredExamTypes?.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No exam types found
              </td>
            </tr>
          ) : (
            filteredExamTypes?.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">
                  {page + index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/lookups/exam-types/view/${item._id}`}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <GrOverview size={20} title="View" />
                    </Link>
                    <button
                      onClick={() => handleEditShow(item._id)}
                      className="text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <CiEdit size={22} title="Edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <MdDeleteOutline size={18} title="Delete" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {item.code}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Footer Section */}
  <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
    <div className="text-sm text-gray-600">
      Showing {filteredExamTypes?.length} of {totalItems} entries
    </div>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </div>

  {/* Modals */}
  {showModal && (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <AddExamType onClose={handleClose} onReload={handleReload} />
      </div>
    </div>
  )}

  {showEdit && (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <EditExamType
          examTypeId={selectedExamTypeId}
          examTypeName={selectedExamTypeName}
          onClose={handleCloseEdit}
          onReload={handleReload}
        />
      </div>
    </div>
  )}
</div>
  )
}

export default ExamType