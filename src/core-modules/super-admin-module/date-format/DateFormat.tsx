import { useEffect, useState } from "react";
import {
  DateFormatData,
  fetchDateFormats,
  updateStatus,
  deleteData,
} from "@/api/super-admin-api/dateFormatApi";
import { formatDate, formatDateOnly } from "@/helpers/helper";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { RiPlayListAddFill } from "react-icons/ri";
import Breadcrumb from "@/components/Breadcumb";
import { AiFillCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";
import AddDateFormat from "./AddDateFormat";
import EditDateFormat from "./EditDateFormat";
import Pagination from "@/components/Pagination";

function DateFormat() {
  const [dateFormat, setDateFormat] = useState<DateFormatData[]>([]);
  const [filteredDateFormat, setFilteredDateFormat] = useState<
    DateFormatData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditShow = (taxId: any) => {
    setSelectedId(taxId);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const getDateFormat = async () => {
    try {
      const data = await fetchDateFormats();
      // Correct field access
      if (data && Array.isArray(data.dateFormats)) {
        setDateFormat(data.dateFormats);
        setFilteredDateFormat(data.dateFormats);
      } else {
        setError("Failed to fetch Date Format");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDateFormat();
  }, []);

  // Status update with confirmation
  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    try {
      const updatedModule = await updateStatus(_id, newStatus);

      // Log the full updatedModule response for debugging
      console.log("Updated Date Format:", updatedModule);

      // Simplified success check
      if (updatedModule?.success) {
        toast.success(
          updatedModule.message || "Date Format status updated successfully!"
        );
        getDateFormat(); // Refresh the date formats list
      } else {
        toast.error(
          updatedModule.message ||
          "Failed to update Date Format status due to unexpected response."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      toast.error(error.message || "Failed to update Date Format status.");
    }
  };

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = dateFormat.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.dateFormat.toLowerCase().includes(query.toLowerCase()) // Use || to combine conditions
        //   item.endMonth.toLowerCase().includes(query.toLowerCase()) // Use || to combine conditions
      );
      setFilteredDateFormat(filtered);
    } else {
      setFilteredDateFormat(dateFormat);
    }
    setCurrentPage(1);
  };

  // Handle sorting
  const changeSort = (column: keyof DateFormatData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredDateFormat].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredDateFormat(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredDateFormat.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDateFormat.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleReload = () => {
    getDateFormat(); // Function to fetch the updated data
  };

  const handleDelete = async (currencyId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Date Format?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteData(currencyId);
        console.log("Delete response:", response.message);
        if (response.success == true) {
          // setDateFormat((prevModules) =>
          //   prevModules.filter((format) => format._id !== currencyId)
          // );
          // setFilteredDateFormat((prevFilteredModules) =>
          //   prevFilteredModules.filter((format) => format._id !== currencyId)
          // );
          toast.success(
            response.message || "Date Format  deleted successfully!"
          );
          getDateFormat();
        } else {
          toast.error(
            response.message ||
            "Failed to delete Date Format. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Date Format:", error);
        toast.error(
          "An error occurred while deleting the Date Format. Please try again."
        );
      }
    }
  };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Date Format", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Date Format</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
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
                onClick={() => changeSort("_id")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Sl No.
                  {sortState.column === "slno" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th>Actions</th>
              <th
                onClick={() => changeSort("status")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("code")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Code
                  {sortState.column === "code" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("dateFormat")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Date
                  {sortState.column === "startMonth" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>

              <th
                onClick={() => changeSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Created At
                  {sortState.column === "createdAt" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((item, index) => (
              <tr className="border" key={item._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/date-format/view/${item._id}`}>
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
                <td>
                  <button
                    className={`rounded-full border-2 ${item.status
                      ? "active-btn border-green-500 text-green-500"
                      : "inactive-btn border-red-500 text-red-500"
                      } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{item.code}</td>
                <td>{formatDateOnly(item.dateFormat)}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredDateFormat.length}</span>
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
            <AddDateFormat onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditDateFormat
              yearId={selectedId}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default DateFormat;
