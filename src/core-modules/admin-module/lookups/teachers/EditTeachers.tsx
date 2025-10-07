import React, { useEffect, useState } from "react";
import {
  updateTeacherById,
  fetchTeacherById,
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { Gender } from "@/constants/enum";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { MessageType } from "@/components/MessagePopup";
import { FiUpload } from "react-icons/fi";

const EditTeacher: React.FC = () => {
  const navigate = useNavigate();
  const BaseURL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams<{ id: string }>();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    academicYear: "",
    name: "",
    contactNumber: "",
    address: "",
    gender: Gender.MALE,
    email: "",
    isClassTeacher: false,
    class: undefined,
    division: undefined

  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Teachers", path: "/lookups/teachers" },
    { label: "Edit Teacher", path: "" },
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
        if (academicYearData.data?.length) {
          const currentYear = academicYearData.data.find((year) => {
            if (!year.academicYear) return false;
            return year.academicYear.includes(new Date().getFullYear().toString());
          });

          if (currentYear?._id) {
            setFormData(prev => ({
              ...prev,
              academicYear: currentYear._id
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    }
    fetchData();
  }, []);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      // Reset class and division when unchecked
      ...(!checked && { class: undefined, division: undefined })
    }));
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!id) {
        setError("Invalid teacher ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchTeacherById(id);
        if (response.success) {
          const teacherData:any = response.data;
          setFormData({
            academicYear: teacherData.academicYear?.id || "",
            name: teacherData.name || "",
            email: teacherData.email || "",
            password: teacherData.password || "",
            contactNumber: teacherData.contactNumber || "",
            address: teacherData.address || "",
            gender: teacherData.gender || Gender.MALE,
            isClassTeacher: teacherData?.isClassTeacher || false,
            class: teacherData.class?.id || undefined,
            division: teacherData.division?.id || undefined

          });
          if (teacherData.imageUrl) {
            // Check if the URL already contains the base URL
            const fullImageUrl = teacherData.imageUrl.startsWith('http')
              ? teacherData.imageUrl
              : `${BaseURL}/${teacherData.imageUrl}`;
            setPreviewUrl(fullImageUrl);
          }
        } else {
          setError(response.message || "Failed to fetch teacher data");
        }
      } catch (error: any) {
        console.error("Error fetching teacher:", error);
        setError(
          error.message || "An error occurred while fetching teacher data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.academicYear || !formData.name) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      toast.error("Contact number should be 10 digits");
      return false;
    }

    return true;
  };
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          text:  "File size should be less than 5MB",
          type: "error"
        });
        toast.error("File size should be less than 5MB");
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

    if (!validateForm() || !id) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields to FormData
      formDataToSend.append('academicYear', formData.academicYear || '');
      formDataToSend.append('name', formData.name || '');
      formDataToSend.append('email', formData.email || '');
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      formDataToSend.append('contactNumber', formData.contactNumber || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('gender', formData.gender || Gender.MALE);
      formDataToSend.append('isClassTeacher', String(formData.isClassTeacher || false));

      if (formData.isClassTeacher) {
        formDataToSend.append('class', formData.class || '');
        formDataToSend.append('division', formData.division || '');
      }

      // Append the file if it exists
      if (file) {
        formDataToSend.append('file', file);
      }

      const response = await updateTeacherById(id, formDataToSend);

      if (response.success) {
        toast.success(response.message || "Teacher updated successfully");
        navigate("/lookups/teachers");
      } else {
        toast.error(response.message || "Failed to update teacher");
      }
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      // toast.error(error.message || "An error occurred while updating teacher");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Teachers</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="header-btns">
          <button
            className="add-btn"
            onClick={() => navigate("/lookups/teachers")}
          >
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap -mx-2 mb-6">
           <div className="w-full px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Profile Image
                      </label>
                      <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-24 w-24 object-cover rounded-full mb-2"
                              />
                            ) : (
                              <>
                                <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG (MAX. 5MB)
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
                    </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            {/* <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.academicYear}
                </option>
              ))}
            </select> */}
            <AcademicYearDropdown
              value={formData.academicYear}
              onChange={(value) => setFormData({ ...formData, academicYear: value })}
              required={true}
              disabled={true}
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
              onKeyDown={(e)=>{
                if(!/^[a-zA-Z\s]+$/.test(e.key) && 
                  e.key !== "Backspace" && 
                  e.key !== "ArrowLeft" && 
                  e.key !== "ArrowRight") {
                  e.preventDefault(); // Prevents non-alphabetic characters
                }
              }}
              placeholder="Enter teacher name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              // required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span style={{ fontSize: '10px', color: 'blueviolet' }}>Leave blank to keep existing password</span>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contact Number
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Enter contact number"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={10}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault(); // Prevents non-numeric characters
                }
              }}
            />
          </div>

          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Gender
              <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>

          {/* Is Class Teacher Checkbox */}
          <div className="w-full px-2 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isClassTeacher"
                checked={formData.isClassTeacher || false}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Is Class Teacher</span>
            </label>
          </div>

          {formData.isClassTeacher && (
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.isClassTeacher}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.isClassTeacher && formData.class && (
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                name="division"
                value={formData.division || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.isClassTeacher}
              >
                <option value="">Select Division</option>
                {divisions.map(div => (
                  <option key={div._id} value={div._id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>
          )}


        </div>

        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <Link to={"/lookups/teachers"}>
              <button type="button"   className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                <FcCancel size={20} className="mr-2" />
                Cancel
              </button>
            </Link>
              <button type="submit"  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTeacher;
