import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createDivision,
  DivisionResponse,
} from "@/api/admin-api/lookups-api/divisionApi";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
interface AddDivisionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddDivisionModal = ({ onClose, onSuccess }: AddDivisionModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    try {
      const response = await createDivision(formData as any);
      if (response.success) {
        toast.success("Division created successfully!");
        onSuccess();
        navigate(`/lookups/divisions/`);
        onClose();
      }
      else{
        toast.error( response.message||"Error creating division");
      }
    } catch (error:any) {
      // toast.error( error.message||"Error creating division");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add Division</h2>
          <IoIosCloseCircleOutline
            className="text-3xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name  <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter the Division"
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
              Submit
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

export default AddDivisionModal;
