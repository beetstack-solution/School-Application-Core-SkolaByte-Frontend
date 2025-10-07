import { useEffect, useState } from "react";
import {
  fetchCurrencyDecimal,
  CurrencyDecimal,
  updateCurrencyFormatStatus,
  deleteCurrencyDecimal,
} from "@/api/super-admin-api/currenctDecimalsApi";
import { formatDate } from "@/helpers/helper";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { RiPlayListAddFill } from "react-icons/ri";
import Breadcrumb from "@/components/Breadcumb";
import { AiFillCaretUp } from "react-icons/ai";
// import AddModule from "../module/AddModule";
import { toast } from "react-toastify";
import AddDecimals from "./AddDecimals";
import Pagination from "@/components/Pagination";
import EditCurrencyDecimals from "./EditCurrencyDecimals";

function CurrencyDecimals() {
  const [currencyDecimal, setCurrencyDecimal] = useState<CurrencyDecimal[]>([]);
  const [filteredCurrencyDecimal, setFilteredCurrencyDecimal] = useState<
    CurrencyDecimal[]
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

  const getCurrencyDecimals = async () => {
    try {
      const data = await fetchCurrencyDecimal();
      // Correct field access
      if (data && Array.isArray(data.currencyDecimals)) {
        setCurrencyDecimal(data.currencyDecimals);
        setFilteredCurrencyDecimal(data.currencyDecimals);
      } else {
        setError("Failed to fetch currency decimals");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrencyDecimals();
  }, []);

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
      const updatedModule = await updateCurrencyFormatStatus(_id, newStatus);

      // Log the full updatedModule response for debugging
      console.log("Updated Module:", updatedModule);

      // Check if updatedModule has the expected structure
      if (
        updatedModule &&
        updatedModule.success &&
        updatedModule.data &&
        updatedModule.data._id
      ) {
        // Extract the updated module from the data property
        // const moduleData = updatedModule.data;

        // setCurrencyDecimal((prevModules) =>
        //   prevModules.map((module) =>
        //     module._id === moduleData._id ? moduleData : module
        //   )
        // );

        // setFilteredCurrencyDecimal((prevFilteredModules) =>
        //   prevFilteredModules.map((module) =>
        //     module._id === moduleData._id ? moduleData : module
        //   )
        // );

        toast.success(
          updatedModule.message ||
          `Currency Decimals status updated to ${newStatus ? "Active" : "Inactive"
          }.`
        );
        getCurrencyDecimals();
      } else {
        console.error(
          "Updated Currency Decimals is undefined or missing _id",
          updatedModule
        );
        toast.error(
          updatedModule.message ||
          "Failed to update Currency Decimals status due to missing Currency Decimals data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      setError(error.message);
      toast.error(
        error.message || "Failed to update Currency Decimals status."
      );
    }
  };

  const handleDelete = async (currencyId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this currency Decimals?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteCurrencyDecimal(currencyId);
        console.log("Delete response:", response);
        if (response.success == true) {
          // setCurrencyDecimal((prevModules) =>
          //   prevModules.filter((format) => format._id !== currencyId)
          // );
          // setFilteredCurrencyDecimal((prevFilteredModules) =>
          //   prevFilteredModules.filter((format) => format._id !== currencyId)
          // );
          toast.success(
            response.message || "Currency decimals deleted successfully!"
          );
          getCurrencyDecimals();
        } else {
          toast.error(
            response.message ||
            "Failed to delete Currency decimals. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Currency decimals:", error);
        toast.error(
          "An error occurred while deleting the Currency decimals. Please try again."
        );
      }
    }
  };

  const handleReload = () => {
    getCurrencyDecimals(); // Function to fetch the updated data
  };
  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = currencyDecimal.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.displayValue
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          item.decimalValue.toString().includes(query)
      );
      setFilteredCurrencyDecimal(filtered);
    } else {
      setFilteredCurrencyDecimal(currencyDecimal);
    }
    setCurrentPage(1);
  };

  // Handle sorting
  const changeSort = (column: keyof CurrencyDecimal) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredCurrencyDecimal].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredCurrencyDecimal(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCurrencyDecimal.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCurrencyDecimal.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Currency Decimal", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Currency Decimal</h3>
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
                onClick={() => changeSort("displayValue")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Display Value
                  {sortState.column === "displayValue" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("decimalValue")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Decimal Value
                  {sortState.column === "decimalValue" &&
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
                  <Link to={`/currency-decimals/view/${item._id}`}>
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
                    className={`rounded-full border-2 ${
                      item.status
                        ? "active-btn border-green-500 text-green-500"
                        : "inactive-btn border-red-500 text-red-500"
                    } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{item.code}</td>
                <td>{item.displayValue}</td>
                <td>{item.decimalValue}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredCurrencyDecimal.length}</span>
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
            <AddDecimals onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}
      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditCurrencyDecimals
              slabId={selectedId}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />{" "}
            {/* Pass correct props */}
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrencyDecimals;
