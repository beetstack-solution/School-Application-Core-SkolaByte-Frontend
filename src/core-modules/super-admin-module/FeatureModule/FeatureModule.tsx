import { useEffect, useState } from "react";
import {
  FeatureModuleData,
  fetchFeatureModule,
  updateFeatureModuleStatus,
  deleteFeature,
  
} from "@/api/super-admin-api/FeatureModuleApi"; // Adjusted to import FeatureApi
import { formatDate } from "@/helpers/helper";
import { Link } from "react-router-dom";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { RiPlayListAddFill } from "react-icons/ri";
import Breadcrumb from "@/components/Breadcumb";
import { AiFillCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";
import AddFeature from "./AddFeatureModule"; // Import the AddFeature modal
import Pagination from "@/components/Pagination";
import EditFeatureModule from "./EditFeatureModule";

function FeatureModule() {
  const [features, setFeatures] = useState<FeatureModuleData[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<FeatureModuleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortState, setSortState] = useState({
    column: "code",
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


  const getFeatures = async () => {
    try {
      const data = await fetchFeatureModule();
      if (data && Array.isArray(data.feature)) {
        setFeatures(data.feature);
        setFilteredFeatures(data.feature);
      } else {
        setError("Failed to fetch features.");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeatures();
  }, []);

  const handleReload = () => {
    getFeatures();
  };

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"}?`
    );
    if (!isConfirmed) return;

    try {
      const response = await updateFeatureModuleStatus(_id, newStatus);
      if (response?.success) {
        toast.success(
          response.message || `Feature status updated to ${newStatus ? "Active" : "Inactive"}.`
        );
        getFeatures();
      } else {
        toast.error(response.message || "Failed to update feature status.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update feature status.");
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = features.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFeatures(filtered);
    } else {
      setFilteredFeatures(features);
    }
    setCurrentPage(1);
  };

  const changeSort = (column: keyof FeatureModuleData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredFeatures].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredFeatures(sortedData);
  };

  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeatures.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (featureId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feature?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteFeature(featureId);
      if (response.success) {
        toast.success(response.message || "Feature deleted successfully!");
        getFeatures();
      } else {
        toast.error(response.message || "Failed to delete feature.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete feature.");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Feature Module", path: "" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Feature Module</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-end items-center px-1">
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
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("_id")}
              >
                <div className="flex items-center">
                  Sl No.
                  {sortState.column === "_id" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th>Actions</th>
              <th
                className="px-4 py-2 text-left ml-10 cursor-pointer"
                onClick={() => changeSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("code")}
              >
                <div className="flex items-center">
                  Code
                  {sortState.column === "code" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => changeSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortState.column === "name" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
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
            {currentItems.map((item, index) => (
              <tr className="border" key={item._id}>
                <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/feature-module/view/${item._id}`}>
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
                <td className="px-4 py-2">
                  <button
                    className={`rounded-full border-2 px-4 py-1 ${
                      item.status
                        ? "active-btn border-green-500 text-green-500"
                        : "inactive-btn border-red-500 text-red-500"
                    } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredFeatures.length}</span>
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
            <AddFeature onClose={handleClose} onReload={handleReload} />
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EditFeatureModule
              featureId={selectedId}
              onClose={handleCloseEdit}
              onReload={handleReload}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeatureModule;
