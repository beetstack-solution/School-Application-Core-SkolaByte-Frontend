import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  updateAttendanceStatusById,
  fetchAttendanceStatusById,
} from "@/api/admin-api/lookups-api/attendanceStatusApi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface EditAttendanceStatusModalProps {
  attendanceStatusId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAttendanceStatusModal = ({
  attendanceStatusId,
  onClose,
  onSuccess,
}: EditAttendanceStatusModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchAttendanceStatusData = async () => {
      if (attendanceStatusId) {
        try {
          const attendanceStatus = await fetchAttendanceStatusById(attendanceStatusId);
          console.log(attendanceStatus, "attendanceStatus");

          setFormData({
            name: attendanceStatus.data.name,
            description: attendanceStatus.data.description || "",
          });
        } catch (error) {
          toast.error("Failed to load attendance status data");
          onClose();
        }
      }
    };
    fetchAttendanceStatusData();
  }, [attendanceStatusId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceStatusId) return;

    try {
      const response = await updateAttendanceStatusById(attendanceStatusId, formData as any);
      if (response.success) {
        toast.success(response.message || "Attendance status updated successfully!");
        onSuccess();
        onClose();
      }
      else{
        toast.error( response.message||"Error updating attendance status");
      }
    } catch (error:any) {
      // toast.error(error.message || "Error updating attendance status");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Edit Attendance Status</h2>
          <IoIosCloseCircleOutline
            className="text-3xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
       
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
          <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn flex items-center"
            >
              <FcCancel size={20} className="mr-2" />
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceStatusModal;