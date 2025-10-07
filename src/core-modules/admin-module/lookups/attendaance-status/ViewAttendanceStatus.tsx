import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import {
  fetchAttendanceStatusById,
  SingleAttendanceStatusResponse,
  AttendanceStatusData,
} from "@/api/admin-api/lookups-api/attendanceStatusApi";

const ViewAttendanceStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [attendanceStatusData, setAttendanceStatusData] = useState<AttendanceStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Attendance Statuses", path: "/lookups/attendance-status" },
    { label: "View Attendance Status", path: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("Attendance Status ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response: SingleAttendanceStatusResponse = await fetchAttendanceStatusById(id);
        if (response.success) {
          setAttendanceStatusData(response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!attendanceStatusData) {
    return <div>Attendance Status not found</div>;
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const onReturn = () => {
    navigate("/lookups/attendance-status");
  };

  return (
    <div>
       <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
      <div>
        <h3 className="text-xl font-semibold mb-4">View Attendance status</h3>
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="header-btns flex gap-2 ">
        <div>
          <button className="add-btn" onClick={onReturn}>
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>
      </div>
    </div>

      <div className="w-full md:w-4/5 mt-5">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Name</td>
              <td className="border px-4 py-2">{attendanceStatusData.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Code</td>
              <td className="border px-4 py-2">{attendanceStatusData.code}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Description</td>
              <td className="border px-4 py-2">{attendanceStatusData.description}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Status</td>
              <td className="border px-4 py-2">
                {attendanceStatusData.status ? "Active" : "Inactive"}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Created By</td>
              <td className="border px-4 py-2">
                {attendanceStatusData.createdBy.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Created At</td>
              <td className="border px-4 py-2">
                {formatDate(attendanceStatusData.createdAt)}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Last Updated By
              </td>
              <td className="border px-4 py-2">
                {attendanceStatusData.updatedBy?.name || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">
                Last Updated Date
              </td>
              <td className="border px-4 py-2">
              {new Date(attendanceStatusData?.userUpdatedDate).toLocaleDateString()}

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendanceStatus;