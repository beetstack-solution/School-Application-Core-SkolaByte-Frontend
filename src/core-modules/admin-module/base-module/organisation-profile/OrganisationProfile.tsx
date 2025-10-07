import { useEffect, useState } from "react";
import {
  Organization,
  fetchOrganizations,
  updateStatus,
  deleteData,
} from "@/api/admin-api/base-api/organizationProfileApi";
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
import Pagination from "@/components/Pagination";

function OrganisationProfile() {
  const [organizationProfile, setOrganizationProfile] = useState<
    Organization[]
  >([]);
  const [filteredTaxSlab, setFilteredTaxSlab] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });
  const [showAddButton, setShowAddButton] = useState(true);

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

  const getOrganizationProfile = async () => {
    try {
      const data = await fetchOrganizations();
      // Correct field access
      if (data && Array.isArray(data.organizations)) {
        setOrganizationProfile(data.organizations);
        setFilteredTaxSlab(data.organizations);
      } else {
        setError("Failed to fetch Organization Profile");
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganizationProfile();
  }, []);

  // const hideButton=()=>{
  //   if (filteredTaxSlab.length > 0) {
  //     SetShowAddButton(false);
  //   } else {
  //     SetShowAddButton(true);
  //   }
  // }

  // useEffect(() => {
  //   hideButton
  // }, []);

  const hideButton = () => {
    if (filteredTaxSlab.length > 0) {
      setShowAddButton(false);
    } else {
      setShowAddButton(true);
    }
  };

  useEffect(() => {
    hideButton(); // Invoke the function
  }, [filteredTaxSlab]); // Include filteredTaxSlab in the dependency array

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
      const responseData = await updateStatus(_id, newStatus);

      // Log the full responseData response for debugging
      console.log("Updated Organization Profile:", responseData);

      // Check if responseData has the expected structure
      if (responseData?.success) {
        toast.success(responseData.message);

        getOrganizationProfile();
      } else {
        console.error(
          "Update failed, unexpected response structure:",
          responseData
        );
        toast.error(
          responseData.message ||
          "Failed to update Organization Profile status due to unexpected response."
        );
      }
    } catch (error: any) {
      console.error("Error in handleStatusUpdate:", error); // Log error details
      setError(error.message);
      toast.error(
        error.message || "Failed to update Organization Profile status."
      );
    }
  };

  // Handle search filtering
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = organizationProfile.filter(
        (item) =>
          item.code.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase()) || // Use || to combine conditions
          item.name.toString().includes(query.toLowerCase()) ||
          item.phoneNumber.includes(query.toLowerCase())
      );
      setFilteredTaxSlab(filtered);
    } else {
      setFilteredTaxSlab(organizationProfile);
    }
    setCurrentPage(1);
  };

  // Handle sorting
  const changeSort = (column: keyof Organization) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });

    const sortedData = [...filteredTaxSlab].sort((a: any, b: any) => {
      if (a[column] < b[column]) return order === "ascending" ? -1 : 1;
      if (a[column] > b[column]) return order === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredTaxSlab(sortedData);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTaxSlab.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTaxSlab.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (taxSlabId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Organization Profile?"
    );

    if (confirmDelete) {
      try {
        const response = await deleteData(taxSlabId);
        console.log("Delete response:", response);
        if (response.success == true) {
          // setOrganizationProfile((prevModules) =>
          //   prevModules.filter((format) => format._id !== taxSlabId)
          // );
          // setFilteredTaxSlab((prevFilteredModules) =>
          //   prevFilteredModules.filter((format) => format._id !== taxSlabId)
          // );
          toast.success(
            response.message || "Organization Profile  deleted successfully!"
          );
          getOrganizationProfile();
        } else {
          toast.error(
            response.message ||
            "Failed to delete Organization Profile. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error deleting Organization Profile:", error);
        toast.error(
          "An error occurred while deleting the Organization Profile. Please try again."
        );
      }
    }
  };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Organisation Profile", path: "" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="page-header">
          <h3>Organisation Profile</h3>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="md:mr-auto">
          {showAddButton && (
            <Link to={"/organisation-profile/add"}>
              <button className="add-btn" onClick={handleShow}>
                <RiPlayListAddFill className="mr-2" />
                Add
              </button>
            </Link>
          )}
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
                onClick={() => changeSort("id")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Sl No.
                  {sortState.column === "id" &&
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
                onClick={() => changeSort("name")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Name
                  {sortState.column === "name" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("phoneNumber")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Phone Number
                  {sortState.column === "phoneNumber" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("websiteUrl")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Website
                  {sortState.column === "websiteUrl" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("email")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Email
                  {sortState.column === "email" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((item, index) => (
              <tr className="border" key={item.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className="action-icons">
                  <Link to={`/organisation-profile/view/${item.id}`}>
                    <GrOverview size={25} title="View" className="view-icon" />
                  </Link>
                  <Link to={`/organisation-profile/edit/${item.id}`}>
                    <CiEdit size={28} title="Edit" className="edit-icon" />
                  </Link>
                  <MdDeleteOutline
                    size={28}
                    title="Delete"
                    className="delete-icon"
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
                <td>
                  <button
                    className={`rounded-full border-2 ${
                      item.status
                        ? "active-btn border-green-500 text-green-500"
                        : "inactive-btn border-red-500 text-red-500"
                    } bg-transparent hover:bg-opacity-10 focus:outline-none`}
                    onClick={() => handleStatusUpdate(item.id, item.status)}
                  >
                    {item.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.websiteUrl}</td>
                <td>{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span>Total Count: {filteredTaxSlab.length}</span>
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
            {/* <AddOrganizationProfile onClose={handleClose} /> */}
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            {/* <EditTaxSlab slabId={selectedId} onClose={handleCloseEdit} />{" "} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganisationProfile;
