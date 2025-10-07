import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { createSubject } from "@/api/admin-api/lookups-api/subjectApi";
import { fetchAcademicYear } from "@/api/common-api/commonDropDownApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

interface AddSubjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AcademicYear {
  academicYear: string;
  _id: string;
  year: string;
}

const AddSubjectModal = ({ onClose, onSuccess }: AddSubjectModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "", // Add academicYear to form state
  });
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]); // Store fetched academic years

  // Fetch academic years on component mount
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response: any = await fetchAcademicYear();
        if (response.success) {
          setAcademicYears(response.data);
        }
      } catch (error) {
        toast.error("Error fetching academic years");
      }
    };
    fetchAcademicYears();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await createSubject(formData);
      if (response.success) {
        toast.success("Subject created successfully!");
        onSuccess();
        navigate(`/lookups/subjects/`);
        onClose();
      } else {
        toast.error(response.message || "Failed to create subject");
      }
    } catch (error:any) {
      console.error("Error creating subject:", error);
      // toast.error(error.message || "Error creating subject");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add Subject</h2>
          <IoIosCloseCircleOutline
            className="text-3xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            {/* <select
              className="w-full p-2 border rounded"
              value={formData.academicYear}
              onChange={(e) =>
                setFormData({ ...formData, academicYear: e.target.value })
              }
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((ay) => (
                <option key={ay._id} value={ay._id}>
                  {ay.academicYear}
                </option>
              ))}
            </select> */}
            <AcademicYearDropdown
              value={formData.academicYear}
              onChange={(value) =>
                setFormData({ ...formData, academicYear: value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter subject name"
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

export default AddSubjectModal;
