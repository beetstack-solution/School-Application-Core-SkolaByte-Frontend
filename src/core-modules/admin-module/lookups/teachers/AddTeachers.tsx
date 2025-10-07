import React, { useEffect, useState } from "react";
import {
  createTeacher,
  Teacher,
} from "@/api/admin-api/lookups-api/teachersApi";
import {
  AcademicYear,
  Division,
  fetchAcademicYear,
  fetchClasses,
  fetchDivisionsDD,
} from "@/api/common-api/commonDropDownApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { Gender } from "@/constants/enum";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    academicYear: "",
    name: "",
    contactNumber: "",
    address: "",
    gender: undefined,
    email: "",
    password: "",
    isClassTeacher: false,
    class: "",
    division: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Teachers", path: "/lookups/teachers" },
    { label: "Add Teacher", path: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearData, classesData, divisionsData,] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),
        ]);
        setAcademicYears(academicYearData.data);
        setClasses(classesData.data);
        setDivisions(divisionsData.data);
        // if (academicYearData.data?.length) {
        //   const currentYear = academicYearData.data.find((year) => {
        //     if (!year.academicYear) return false;
        //     return year.academicYear.includes(new Date().getFullYear().toString());
        //   });

        //   if (currentYear?._id) {
        //     setFormData(prev => ({
        //       ...prev,
        //       academicYear: currentYear._id
        //     }));
        //   }
        // }
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Basic required fields
    if (!formData.academicYear || !formData.name || !formData.email || !formData.password) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return false;
    }

    // Contact number validation
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      setMessage({
        text: "Contact number should be 10 digits",
        type: "error"
      });
      return false;
    }

    // Only validate class/division if isClassTeacher is true
    if (formData.isClassTeacher && (!formData.class || !formData.division)) {
      setMessage({
        text: "Class and Division are required when teacher is a class teacher",
        type: "error"
      });
      return false;
    }

    return true;
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        setMessage({
          text: "Only JPEG, PNG, or JPG files are allowed",
          type: "error"
        });
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          text: "File size should be less than 5MB",
          type: "error"
        });
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const processedData = {
        ...formData,
        isClassTeacher: !!formData.isClassTeacher,
        ...(formData.isClassTeacher ? {
          class: formData.class,
          division: formData.division
        } : {
          class: undefined,
          division: undefined
        })
      };
      // Ensure file is properly passed
      const response = await createTeacher(processedData, file || undefined);

      if (response.success) {
        setMessage({
          text: "Teacher created successfully",
          type: "success"
        });
        setTimeout(() => navigate("/lookups/teachers"), 1500);
      } else {
        setMessage({
          text: response.message || "Failed to create teacher",
          type: "error"
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An error occurred while creating teacher",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      ...(!checked && { class: undefined, division: undefined })
    }));
  };

  return (
    <div className="container mx-auto p-2">
      {/* Message Popup */}
      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          duration={4000}
        />
      )}

      <div className="container mx-auto p-2">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add Teacher</h2>
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
          <button
            className="add-btn"
            onClick={() => navigate("/lookups/teachers")}
          >
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div>
            <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
              Basic Information
            </h4>

            {/* Profile Image Upload */}
            <div className="w-full mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Teacher Photo
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <>
                      <FiUpload
                        size={20}
                        className="w-5 h-5 mb-2 text-gray-500"
                      />
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, or JPG (Max. 2MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <AcademicYearDropdown
                  value={formData.academicYear}
                  onChange={(value) => setFormData({ ...formData, academicYear: value })}
                  required={true}
                  disabled={false}
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name <span className="text-red-500">*</span> 
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (!/^[a-zA-Z\s]+$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight") {
                      e.preventDefault(); 
                    }
                  }}
                  placeholder="Enter teacher's full name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  maxLength={10}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>

              <div className="w-full px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="w-full px-2 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isClassTeacher"
                id="isClassTeacherCheckbox"
                checked={formData.isClassTeacher || false}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isClassTeacherCheckbox" className="ml-2 text-gray-700 cursor-pointer">
                Is Class Teacher ?
              </label>
            </div>
          </div>
          {
            formData.isClassTeacher && (
              <>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions.map((division) => (
                      <option key={division._id as any} value={division._id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>

            )
          }


          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <Link to="/lookups/teachers">
              <button
                type="button"
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FcCancel size={18} />
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <IoCheckmarkDoneCircleOutline size={18} />
                  Add Teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
