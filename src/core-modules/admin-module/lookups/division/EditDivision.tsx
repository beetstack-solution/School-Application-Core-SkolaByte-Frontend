import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  updateDivisionById,
  fetchDivisionById,
} from "@/api/admin-api/lookups-api/divisionApi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface EditDivisionModalProps {
  divisionId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDivisionModal = ({
  divisionId,
  onClose,
  onSuccess,
}: EditDivisionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchDivisionData = async () => {
      if (divisionId) {
        try {
          const division:any = await fetchDivisionById(divisionId);
          console.log(division, "division");

          setFormData({ name: division.data.name });
        } catch (error) {
          toast.error("Failed to load division data");
          onClose();
        }
      }
    };
    fetchDivisionData();
  }, [divisionId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionId) return;

    try {
      const response = await updateDivisionById(divisionId, formData as any);
      if (response.success) {
        toast.success("Division updated successfully!");
        onSuccess();
        onClose();
      }
      else{
        toast.error( response.message||"Error updating division");
      }
    } catch (error:any) {
      toast.error(error.message || "Error updating division");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Edit Division</h2>
          <IoIosCloseCircleOutline
            className="text-3xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
              </label>
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
          <div className="flex justify-end gap-2">
          <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Update
            </button>{" "}
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

export default EditDivisionModal;
