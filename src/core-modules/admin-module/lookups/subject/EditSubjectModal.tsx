import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  updateSubjectById,
  fetchSubjectById,
} from "@/api/admin-api/lookups-api/subjectApi";
import { AcademicYear, fetchAcademicYear } from "@/api/common-api/commonDropDownApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

interface EditSubjectModalProps {
  SubjectId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSubjectModal = ({
  SubjectId,
  onClose,
  onSuccess,
}: EditSubjectModalProps) => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
  });

  // Fetch academic years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetchAcademicYear();
        if (response.success) {
          setAcademicYears(response.data);
        }
      } catch (error) {
        toast.error("Error fetching academic years");
      }
    };
    fetchAcademicYears();
  }, []);

  // Fetch subject details
  useEffect(() => {
    const fetchSubjectData = async () => {
      if (SubjectId) {
        try {
          const subject = await fetchSubjectById(SubjectId);
          if (subject.success) {
            setFormData({
              name: subject.data.name || "",
              academicYear: subject.data.academicYear.id || "", // Ensure correct ID mapping
            });
          }
        } catch (error) {
          toast.error("Failed to load subject data");
          onClose();
        }
      }
    };
    fetchSubjectData();
  }, [SubjectId, onClose]);

  console.log(formData , "formData");
  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!SubjectId) return;
    try {
      const response = await updateSubjectById(SubjectId, formData);
      if (response.success) {
        toast.success("Subject updated successfully!");
        onSuccess();
        onClose();
      }
      else{
        toast.error(response.message || "Error updating subject");
      }
    } catch (error:any) {
      console.error("Error updating subject:", error);
      // toast.error(error.message || "Error updating subject");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Edit Subject</h2>
          <IoIosCloseCircleOutline
            className="text-3xl cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Academic Year  <span className="text-red-500">*</span>
            </label>
            {/* <select
              className="w-full p-2 border rounded"
              value={formData.academicYear}
              onChange={(e) =>
                setFormData({ ...formData, academicYear: e.target.value })
              }
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
              disabled={true}
            />



          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name  <span className="text-red-500">*</span>
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

export default EditSubjectModal;
