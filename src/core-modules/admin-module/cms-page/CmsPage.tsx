import { useEffect, useState } from "react";
import { RiPlayListAddFill } from "react-icons/ri";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { AiFillCaretUp } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllPages, updatePageStatus, deletePage } from "@/api/super-admin-api/cms-page-api/cmsPageApi";

interface PageData {
    _id: string;
    pageUrl: string;
    pageTitle: string;
    pageCode: string;
    name: string;
    shortDescription: string;
    status: boolean;
    createdAt: string;
    // Add other fields as needed
}

function CmsPage() {
    const navigator = useNavigate();
    const [pages, setPages] = useState<PageData[]>([]);
    const [filteredPages, setFilteredPages] = useState<PageData[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [sortState, setSortState] = useState({
        column: "pageTitle",
        order: "ascending",
    });

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleEditShow = (pageId: string) => {
        navigator(`/page/edit/${pageId}`);
    };
    const handleCloseEdit = () => setShowEditModal(false);

    const getAllPages = async (page: number = 1) => {
        try {
            setLoading(true);
            const response: any = await fetchAllPages();

            if (response.success && response.pages) {
                setPages(response.pages);
                setFilteredPages(response.pages);
                setTotalItems(response.pages.length);
            }
            setLoading(false);
        } catch (error: any) {
            console.error("Error fetching pages:", error);
            setError(error.response?.data?.message || "Failed to fetch data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPages(currentPage);
    }, [currentPage]);

    const handleSearch = (query: string) => {
        if (query) {
            const filtered = pages.filter(
                (page) =>
                    page.pageTitle.toLowerCase().includes(query.toLowerCase()) ||
                    page.pageCode.toLowerCase().includes(query.toLowerCase()) ||
                    page.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPages(filtered);
        } else {
            setFilteredPages(pages);
        }
        setCurrentPage(1);
    };

    const handleReload = () => {
        getAllPages(currentPage);
    };

    const changeSort = (column: keyof PageData) => {
        let order = "ascending";
        if (sortState.column === column && sortState.order === "ascending") {
            order = "descending";
        }
        setSortState({ column, order });

        const sortedData = [...filteredPages].sort((a: any, b: any) => {
            if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
            if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredPages(sortedData);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        const confirmUpdate = window.confirm(
            `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"}?`
        );

        if (!confirmUpdate) {
            return;
        }

        try {
            const responseData: any = await updatePageStatus(_id, newStatus);

            if (responseData?.success) {
                toast.success(
                    responseData.message ||
                    `Page status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                getAllPages(currentPage);
            } else {
                toast.error(
                    responseData.message ||
                    "Failed to update page status."
                );
            }
        } catch (error: any) {
            console.error("Error in handleStatusUpdate:", error);
            setError(error.message);
            toast.error(error.message || "Failed to update page status.");
        }
    };

    const handleDelete = async (pageId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this page?");
        if (!confirmDelete) return;

        try {
            // Optimistically update UI

            const response: any = await deletePage(pageId);

            if (response.success) {
                // Revert if API fails
                toast.success(response.message || "Failed to delete page.");
                getAllPages(currentPage); // Reload original data
            }
            else {
                toast.error(response.message || "Failed to delete page.");
            }
        } catch (error:any) {
            toast.error( error.message || "An error occurred while deleting the page.");
            getAllPages(currentPage); // Reload original data on error
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "CMS Page", path: "" },
    ];

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPages = filteredPages.slice(startIndex, endIndex);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">CMS Page</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                    <button
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md"
                        onClick={() => navigator("/page/add")}
                    >
                        <RiPlayListAddFill className="text-lg" />
                        Add CMS Page
                    </button>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th
                                    onClick={() => changeSort("_id")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Sl No.
                                        {sortState.column === "_id" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                                <th
                                    onClick={() => changeSort("status")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Status
                                        {sortState.column === "status" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                                <th
                                    onClick={() => changeSort("pageTitle")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Page Title
                                        {sortState.column === "pageTitle" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                                <th
                                    onClick={() => changeSort("pageCode")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Page Code
                                        {sortState.column === "pageCode" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                                <th
                                    onClick={() => changeSort("name")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Name
                                        {sortState.column === "name" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                                <th
                                    onClick={() => changeSort("createdAt")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                        Created At
                                        {sortState.column === "createdAt" && sortState.order === "ascending" && <AiFillCaretUp />}
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-red-500 font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                                        No pages found
                                    </td>
                                </tr>
                            ) : (
                                paginatedPages.map((page, index) => (
                                    <tr key={page._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigator(`/page/view/${page._id}`)}
                                                    
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <GrOverview size={20} title="View" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditShow(page._id)}
                                                    className="text-gray-500 hover:text-green-600 transition-colors"
                                                >
                                                    <CiEdit size={22} title="Edit" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(page._id)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <MdDeleteOutline size={18} title="Delete" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusUpdate(page._id, page.status)}
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${page.status
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {page.status ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {page.pageTitle}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {page.pageCode}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {page.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {page?.createdAt
                                                ? new Date(page.createdAt).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "numeric",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: true,
                                                })
                                                : "N/A"}
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
                    Showing {filteredPages.length > itemsPerPage ? itemsPerPage : filteredPages.length} of {filteredPages.length} entries
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            {/* {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <AddPage onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditPage
              pageId={selectedPageId}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />
          </div>
        </div>
      )} */}
        </div>
    );
}

export default CmsPage;