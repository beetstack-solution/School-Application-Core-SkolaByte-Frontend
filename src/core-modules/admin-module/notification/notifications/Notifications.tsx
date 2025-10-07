import { useEffect, useState } from "react";
import { GrOverview } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { AiFillCaretUp } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcumb";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { fetchNotificationData, updateNotificationStatus, deleteNotificationTemplate, NotificationData } from "@/api/super-admin-api/notifications/notificationApi";

function Notifications() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });
  const [notificationData, setNotificationData] = useState<NotificationData[]>(
    []
  );
  const [filterednotification, setFilterednotification] = useState<
    NotificationData[]
  >([]);
  console.log("filterednotification", filterednotification)
  const handleViewShow = (id: any) => {
    navigate(`/notifications/notification/view/${id}`);
  };

  const handleEditShow = (id: any) => {
    navigate(`/notifications/notification/edit/${id}`);
  };

  const getNotificationData = async () => {
    try {
      const data = await fetchNotificationData();
      if (Array.isArray(data)) {
        setNotificationData(data);
        setFilterednotification(data);
      } else {
        setNotificationData([]);
        setFilterednotification([]);
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotificationData();
  }, []);

  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const responseData = await updateNotificationStatus(_id, newStatus);

      if (responseData?.success) {
        toast.success(
          responseData.message ||
          `Notification template status updated to ${newStatus ? "Active" : "Inactive"
          }.`
        );
        getNotificationData();
      } else {
        console.error(
          "Response missing success or Notification template:",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update Notification template status due to missing data."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error(
        error.message || "Failed to update Notification template status."
      );
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = notificationData.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.module.name.toLowerCase().includes(query.toLowerCase()) ||
          item.triggerEvent.name.toLowerCase().includes(query.toLowerCase()) ||
          item.messageType.toLowerCase().includes(query.toLowerCase())

      );
      setFilterednotification(filtered);
    } else {
      setFilterednotification(notificationData);
    }
    setCurrentPage(1);
  };

  // // Handle sorting
  const changeSort = (column: keyof NotificationData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filterednotification].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilterednotification(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(notificationData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterednotification.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (dealId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Notification?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteNotificationTemplate(dealId);
        if (response.success) {
          const updatedTraget = filterednotification.filter(
            (format) => format._id !== dealId
          );

          if (updatedTraget.length <= (currentPage - 1) * itemsPerPage) {
            setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
          }

          setFilterednotification(updatedTraget);

          toast.success(
            response.message || "Notification deleted successfully!"
          );
          getNotificationData();
        } else {
          toast.error(
            response.message ||
            "Failed to delete Notification. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Notification:", error);
        toast.error(
          "An error occurred while deleting the Notification. Please try again."
        );
      }
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification ", path: "" },
  ];

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notification</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
          <Link to={"/notifications/notification/add/"}>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
              <RiPlayListAddFill className="text-lg" />
              Add
            </button>
          </Link>

          {/* <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
        <FaFileImport  className="text-lg" />
       Bulk
      </button> */}
          <SearchBar onSearch={handleSearch} />
        </div>

      </div>



















      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { name: "Sl No.", width: "w-16", sortKey: "_id" },
                  { name: "Actions" },
                  { name: "Status", sortKey: "status" },
                  { name: "Code", sortKey: "code" },
                  { name: "Module Name", sortKey: "module" },
                  { name: "Functionality Name", sortKey: "triggerEvent" },
                  { name: "Message Type", sortKey: "messageType" },
                  { name: "Days", sortKey: "days" },
                  { name: "Notification Period", sortKey: "notificationtPeriod" },
                  { name: "Created At", sortKey: "createdAt" }
                ].map((header) => (
                  <th
                    key={header.name}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ""}`}
                    // onClick={() => header.sortKey && changeSort(header.sortKey)}
                    style={{ cursor: header.sortKey ? "pointer" : "default" }}
                  >
                    <div className="flex items-center gap-1">
                      {header.name}
                      {header.sortKey && sortState.column === header.sortKey && sortState.order === "ascending" && (
                        <AiFillCaretUp className="text-gray-400 text-xs" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterednotification.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr className="border" key={item._id}>
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">

                        <GrOverview
                          size={20}
                          title="View"
                         className="text-gray-500 hover:text-blue-600 transition-colors"
                          onClick={() => handleViewShow(item._id)}
                        />
                        <CiEdit
                          size={22}
                          title="Edit"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                          onClick={() => handleEditShow(item._id)}
                        />
                        <MdDeleteOutline
                          size={22}
                          title="Delete"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </td>
                    <td>
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
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.module?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.triggerEvent?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.messageType || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.days || "N/A"}</td>
                    {/* <td>{item.notificationtype || "N/A"}</td> */}
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.notificationtPeriod || "N/A"}</td>



                    {/* <td>{item.laterNotificationTimeInHour || "N/A"}</td> */}
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{new Date(item.createdAt).toLocaleDateString()}</td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filterednotification.length}</span>
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
  );
}

export default Notifications;
