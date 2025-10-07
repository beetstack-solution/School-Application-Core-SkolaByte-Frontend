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
// import { formatDate } from '@/helpers/helper';
import {deleteNotificationTemplate, fetchNotificationTemplateData, updateNotificationTemplateStatus, NotificationTemplateData } from "@/api/super-admin-api/notifications/notificationTemplateApi";

function NotificationTemplate() {
  const navigate = useNavigate();

  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });
  const [notificationTemplateData, setNotificationTemplateData] = useState<
    NotificationTemplateData[]
  >([]);
  const [filterednotificationTemplates, setFilterednotificationTemplates] =
    useState<NotificationTemplateData[]>([]);

  const handleViewShow = (id: any) => {
    navigate(`/notifications/notification-template/view/${id}`);
  };

  const handleEditShow = (id: any) => {
    navigate(`/notifications/notification-template/edit/${id}`);
  };

  // const getNotificationTemplateData = async () => {
  //   try {
  //     const data = await fetchNotificationTemplateData();
  //     if (Array.isArray(data)) {
  //       setNotificationTemplateData(data);
  //       setFilterednotificationTemplates(data);
  //     } else {
  //       setError("Failed to fetch targets");
  //     }
  //     setLoading(false);
  //   } catch (error: any) {
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // };
  const getNotificationTemplateData = async () => {
    try {
      const response = await fetchNotificationTemplateData();
      console.log("API Response:", response); // Debugging the response

      if (response.success) {
       setNotificationTemplateData(response.notificationTemplates);
       console.log(
         "Updated notificationTemplateData:",
         response.notificationTemplates
       );

       setFilterednotificationTemplates(response.notificationTemplates);
       console.log(
         "Updated filterednotificationTemplates:",
         response.notificationTemplates
       );

      } else {
        toast.error("Failed to fetch notification templates");
      }
    } catch (error: any) {
      console.error("Error in getNotificationTemplateData:", error);
      // setError("An unexpected error occurred");
    }
  };

  useEffect(() => {
    getNotificationTemplateData();
  }, []);
  console.log("notificationTemplateData", notificationTemplateData);
  const handleStatusUpdate = async (_id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    const isConfirmed = window.confirm(
      `Are you sure you want to set the status to ${
        newStatus ? "Active" : "Inactive"
      }?`
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const responseData = await updateNotificationTemplateStatus(
        _id,
        newStatus
      );

      if (responseData?.success) {
        toast.success(
          responseData.message ||
            `Notification template status updated to ${
              newStatus ? "Active" : "Inactive"
            }.`
        );
        getNotificationTemplateData();
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
      const filtered = notificationTemplateData.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.module.name.toLowerCase().includes(query.toLowerCase()) ||
          item.triggerEvent.name.toLowerCase().includes(query.toLowerCase()) ||
          // item.smartTags.name.toLowerCase().includes(query.toLowerCase()) ||
          item.messageTemplate.toLowerCase().includes(query.toLowerCase()) ||
          item.emailTemplate.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilterednotificationTemplates(filtered);
    } else {
      setFilterednotificationTemplates(notificationTemplateData);
    }
    setCurrentPage(1);
  };

  // // Handle sorting
  const changeSort = (column: keyof NotificationTemplateData) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filterednotificationTemplates].sort(
      (a: any, b: any) => {
        if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
        if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
        return 0;
      }
    );
    setFilterednotificationTemplates(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(notificationTemplateData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterednotificationTemplates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (dealId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Notification Template?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteNotificationTemplate(dealId);
        if (response.success) {
          const updatedTraget = filterednotificationTemplates.filter(
            (format) => format._id !== dealId
          );

          if (updatedTraget.length <= (currentPage - 1) * itemsPerPage) {
            setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
          }

          setFilterednotificationTemplates(updatedTraget);

          toast.success(
            response.message || "Notification Template deleted successfully!"
          );
          getNotificationTemplateData();
        } else {
          toast.error(
            response.message ||
              "Failed to delete Notification Template. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Notification Template:", error);
        toast.error(
          "An error occurred while deleting the Notification Template. Please try again."
        );
      }
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification Template", path: "" },
  ];

  // if (loading) return <div className="text-center">Loading...</div>;
  // if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">





      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Notification Templates</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
      <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
               <Link to={"/notifications/notification-template/add/"}>
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
    { name: "Message Type", sortKey: "type" },
    { name: "Message Template", sortKey: "messageTemplate" },
    { name: "Email Template", sortKey: "emailTemplate" },
    { name: "Created At", sortKey: "createdAt" }
  ].map((header) => (
    <th
      key={header.name}
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ""}`}

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

            {filterednotificationTemplates.length > 0 ? (
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
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status
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
                  {/* <td>{item.smartTags?.name || "N/A"}</td> */}
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.messageTemplate || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.emailTemplate || "N/A"}</td>
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
          <span>Total Count: {filterednotificationTemplates.length}</span>
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

export default NotificationTemplate;
