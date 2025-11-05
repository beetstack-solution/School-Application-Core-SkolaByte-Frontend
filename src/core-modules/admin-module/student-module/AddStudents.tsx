import React, { useEffect, useState } from "react";
import {
  createStudent,
  Student,
  Class,
  Division,
  AcademicYear,
  Parent,
  Guardian,
  bulkImportStudents,
} from "@/api/admin-api/student-management/students-api/studentsApi";
import {
  fetchClasses,
  fetchDivisionsDD,
  fetchAcademicYear,
  getAllStates,
  getAllDistricts,
  getAllCountry,
} from "@/api/common-api/commonDropDownApi";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { Gender } from "@/constants/enum";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { FaFileExcel } from "react-icons/fa";
import { getStudentsByClassDivisionAcademicYear } from "@/api/common-api/commonDropDownApi";

// Interface for dropdown options
interface CountryOption {
  countrycode: number;
  countryname: string;
  stdcode: number;
}

interface StateOption {
  countryID: number;
  stateID: number;
  stateName: string;
}

interface DistrictOption {
  countryID: number;
  stateID: number;
  cityID: number;
  cityName: string;
}

// Extended Student interface to include address fields
interface ExtendedStudent extends Student {
  country: string;
  countryId?: number;
  state: string;
  stateId?: number;
  district?: string;
  districtId?: number;
  city: string;
  // Remove these since they already exist in Student with different types
  // class?: string;     // Remove - conflicts with Student.class
  // division?: string;  // Remove - conflicts with Student.division
  // academicYear?: string; // Remove - conflicts with Student.academicYear
  admissionNumber?: string;
}

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [siblingsdropdown, setSiblingsDropdown] = useState<any>({
    academicYears: "",
    classes: "",
    divisions: "",
  });
  const [formData, setFormData] = useState<
    Partial<ExtendedStudent> & { parentInfo: Parent; guardian: Guardian }
  >({
    firstName: "",
    lastName: "",
    rollNumber: "",
    age: "",
    houseName: "",
    city: "",
    state: "",
    stateId: 0,
    country: "",
    countryId: 0,
    district: "",
    districtId: 0,
    zipCode: "",
    class: "",
    division: "",
    academicYear: "",
    dob: "",
    gender: Gender.MALE,
    sibling: false,
    admissionNumber: "",
    parentInfo: {
      fatherName: "",
      motherName: "",
      fatherContactNumber: "",
      motherContactNumber: "",
      fatherOccupation: "",
      motherOccupation: "",
      email: "",
      password: "",
    },
    guardian: {
      guardianName: "",
      contactNumber: "",
      relation: "",
      email: "",
      password: "",
    },
    status: true,
  });
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Students", path: "/student-managements/students" },
    { label: "Add Student", path: "" },
  ];

  console.log("formData", formData);
  console.log("sibling", formData.sibling);
  console.log("selectedStudents", selectedStudents);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearsData, classesData, divisionsData, countriesData] =
          await Promise.all([
            fetchAcademicYear(),
            fetchClasses(),
            fetchDivisionsDD(),
            getAllCountry(),
          ]);
        setAcademicYears(yearsData.data as any);
        setClasses(classesData.data as any);
        setDivisions(divisionsData.data as any);

        // Handle countries response structure
        let countriesList: CountryOption[] = [];
        if (countriesData && countriesData.success && countriesData.data) {
          const data: any = countriesData.data; // cast to any to inspect runtime shape safely
          if (Array.isArray(data)) {
            countriesList = data;
          } else if (data && typeof data === "object") {
            // common shape: { country: [...] }
            if (Array.isArray(data.country)) {
              countriesList = data.country;
            } else if (
              data.country &&
              typeof data.country === "object" &&
              Array.isArray((data.country as any).country)
            ) {
              // nested shape fallback: { country: { country: [...] } }
              countriesList = (data.country as any).country;
            }
          }
        }
        setCountries(countriesList);

        // Set default country to India if available
        const indiaCountry = countriesList.find(
          (country) => country.countryname.toLowerCase() === "india"
        );
        if (indiaCountry) {
          setFormData((prev) => ({
            ...prev,
            country: indiaCountry.countryname,
            countryId: indiaCountry.countrycode,
          }));
        }
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStatesData = async () => {
      if (formData.countryId) {
        try {
          const statesData: any = await getAllStates(formData.countryId);

          // Handle states response structure
          let statesList: StateOption[] = [];
          if (statesData && statesData.success && statesData.data) {
            if (Array.isArray(statesData.data)) {
              statesList = statesData.data;
            }
          }
          setStates(statesList);

          // Reset state and district when country changes
          setFormData((prev) => ({
            ...prev,
            state: "",
            stateId: 0,
            district: "",
            districtId: 0,
          }));
          setDistricts([]);
        } catch (error) {
          console.error("Failed to load states:", error);
        }
      } else {
        setStates([]);
        setDistricts([]);
      }
    };

    fetchStatesData();
  }, [formData.countryId]);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistrictsData = async () => {
      if (formData.countryId && formData.stateId) {
        try {
          const districtsData: any = await getAllDistricts(
            formData.countryId,
            formData.stateId
          );

          // Handle districts response structure
          let districtsList: DistrictOption[] = [];
          if (districtsData && districtsData.success && districtsData.data) {
            if (Array.isArray(districtsData.data)) {
              districtsList = districtsData.data;
            }
          }
          setDistricts(districtsList);

          // Reset district when state changes
          setFormData((prev) => ({
            ...prev,
            district: "",
            districtId: 0,
          }));
        } catch (error) {
          console.error("Failed to load districts:", error);
          setDistricts([]);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistrictsData();
  }, [formData.countryId, formData.stateId]);

  const handleSiblingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sibling: checked,
    }));
    if (!checked) {
      setSiblingsDropdown({
        academicYears: "",
        classes: "",
        divisions: "",
      });
      setStudentOptions([]);

      // Clear parent info if it was populated from sibling selection
      setFormData((prev) => ({
        ...prev,
        parentInfo: {
          fatherName: "",
          motherName: "",
          fatherContactNumber: "",
          motherContactNumber: "",
          fatherOccupation: "",
          motherOccupation: "",
          email: "",
          password: "",
        },
      }));
    }
  };

  const handleSiblingAcademicYearChange = (value: string) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      academicYears: value,
    }));
  };

  const handleSiblingClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      classes: e.target.value,
    }));
  };

  const handleSiblingDivisionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      divisions: e.target.value,
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryId = parseInt(e.target.value);
    const selectedCountry = countries.find(
      (country) => country.countrycode === selectedCountryId
    );

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry ? selectedCountry.countryname : "",
      countryId: selectedCountryId || 0,
      state: "",
      stateId: 0,
      district: "",
      districtId: 0,
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateId = parseInt(e.target.value);
    const selectedState = states.find(
      (state) => state.stateID === selectedStateId
    );

    setFormData((prev) => ({
      ...prev,
      state: selectedState ? selectedState.stateName : "",
      stateId: selectedStateId || 0,
      district: "",
      districtId: 0,
    }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrictId = parseInt(e.target.value);
    const selectedDistrict = districts.find(
      (district) => district.cityID === selectedDistrictId
    );

    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict ? selectedDistrict.cityName : "",
      districtId: selectedDistrictId || 0,
    }));
  };

  const fetchStudentsByClassDivisionAcademicYear = async () => {
    if (
      siblingsdropdown.academicYears &&
      siblingsdropdown.classes &&
      siblingsdropdown.divisions
    ) {
      try {
        const response: any = await getStudentsByClassDivisionAcademicYear(
          siblingsdropdown.classes,
          siblingsdropdown.divisions,
          siblingsdropdown.academicYears
        );
        if (response.success) {
          setStudentOptions(response.data);
        } else {
          setStudentOptions([]);
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudentOptions([]);
      }
    }
  };

  useEffect(() => {
    fetchStudentsByClassDivisionAcademicYear();
  }, [
    siblingsdropdown.academicYears,
    siblingsdropdown.classes,
    siblingsdropdown.divisions,
  ]);

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudentId = e.target.value;
    if (!selectedStudentId) return;

    // Find the selected student from studentOptions
    const selectedStudent: any = studentOptions.find(
      (student) => student._id === selectedStudentId
    );
    if (!selectedStudent) return;

    // Update the form data with the parent info from selected student
    setFormData((prev) => ({
      ...prev,
      parentInfo: {
        ...prev.parentInfo,
        fatherName: selectedStudent.parentInfo.fatherName || "",
        motherName: selectedStudent.parentInfo.motherName || "",
        fatherContactNumber:
          selectedStudent.parentInfo.fatherContactNumber || "",
        motherContactNumber:
          selectedStudent.parentInfo.motherContactNumber || "",
        fatherOccupation: selectedStudent.parentInfo.fatherOccupation || "",
        motherOccupation: selectedStudent.parentInfo.motherOccupation || "",
        email: selectedStudent.parentInfo.email || "",
        password: selectedStudent.parentInfo.plainPassword || "",
      },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.class ||
      !formData.division ||
      !formData.academicYear ||
      !formData.parentInfo?.fatherName ||
      !formData.parentInfo?.motherName ||
      !formData.parentInfo?.fatherContactNumber ||
      !formData.parentInfo?.motherContactNumber ||
      !formData.houseName ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.zipCode ||
      !formData.age
    ) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return false;
    }

    const contactFields = [
      {
        field: formData.parentInfo.fatherContactNumber,
        name: "Father's contact",
      },
      {
        field: formData.parentInfo.motherContactNumber,
        name: "Mother's contact",
      },
    ];

    for (const { field, name } of contactFields) {
      if (field && !/^\d{10}$/.test(field)) {
        setMessage({
          text: `${name} number should be 10 digits`,
          type: "error",
        });
        return false;
      }
    }

    if (
      formData.guardian.contactNumber &&
      !/^\d{10}$/.test(formData.guardian.contactNumber)
    ) {
      setMessage({
        text: "Guardian's contact number should be 10 digits",
        type: "error",
      });
      return false;
    }

    const emailFields = [
      { field: formData.parentInfo.email, name: "Parent's email" },
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const { field, name } of emailFields) {
      if (field && !emailRegex.test(field)) {
        setMessage({
          text: `${name} is not valid`,
          type: "error",
        });
        return false;
      }
    }

    if (formData.guardian.email && !emailRegex.test(formData.guardian.email)) {
      setMessage({
        text: "Guardian's email is not valid",
        type: "error",
      });
      return false;
    }

    if (!formData.parentInfo.password) {
      setMessage({
        text: "Parent's password is required",
        type: "error",
      });
      return false;
    }

    if (
      (formData.guardian.guardianName ||
        formData.guardian.contactNumber ||
        formData.guardian.relation ||
        formData.guardian.email) &&
      !formData.guardian.password
    ) {
      setMessage({
        text: "Guardian's password is required if guardian information is provided",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend: any = new FormData();
      console.log("formDataToSend", formDataToSend);

      // Append all student data
      formDataToSend.append(
        "firstName",
        formData.firstName
          ? formData.firstName.charAt(0).toUpperCase() +
              formData.firstName.slice(1)
          : ""
      );
      formDataToSend.append(
        "lastName",
        formData.lastName
          ? formData.lastName.charAt(0).toUpperCase() +
              formData.lastName.slice(1)
          : ""
      );
      formDataToSend.append("rollNumber", formData.rollNumber || "");
      formDataToSend.append("age", formData.age || "");
      formDataToSend.append("houseName", formData.houseName || "");
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("state", formData.state || "");
      formDataToSend.append("stateId", formData.stateId || 0);
      formDataToSend.append("district", formData.district || "");
      formDataToSend.append("districtId", formData.districtId || 0);
      formDataToSend.append("country", formData.country || "");
      formDataToSend.append("countryId", formData.countryId || 0);
      formDataToSend.append("zipCode", formData.zipCode || "");
      formDataToSend.append("class", formData.class || "");
      formDataToSend.append("division", formData.division || "");
      formDataToSend.append("academicYear", formData.academicYear || "");
      formDataToSend.append("dob", formData.dob || "");
      formDataToSend.append("gender", formData.gender || Gender.MALE);
      formDataToSend.append("admissionNumber", formData.admissionNumber || "");
      formDataToSend.append("status", formData.status);
      formDataToSend.append("sibling", String(formData.sibling || false));

      // Append parent info
      formDataToSend.append(
        "parentInfo[fatherName]",
        formData.parentInfo?.fatherName || ""
      );
      formDataToSend.append(
        "parentInfo[motherName]",
        formData.parentInfo?.motherName || ""
      );
      formDataToSend.append(
        "parentInfo[fatherContactNumber]",
        formData.parentInfo?.fatherContactNumber || ""
      );
      formDataToSend.append(
        "parentInfo[motherContactNumber]",
        formData.parentInfo?.motherContactNumber || ""
      );
      formDataToSend.append(
        "parentInfo[fatherOccupation]",
        formData.parentInfo?.fatherOccupation || ""
      );
      formDataToSend.append(
        "parentInfo[motherOccupation]",
        formData.parentInfo?.motherOccupation || ""
      );
      formDataToSend.append(
        "parentInfo[email]",
        formData.parentInfo?.email || ""
      );
      formDataToSend.append(
        "parentInfo[password]",
        formData.parentInfo?.password || ""
      );

      // Append guardian info if provided
      if (
        formData.guardian?.guardianName ||
        formData.guardian?.contactNumber ||
        formData.guardian?.relation ||
        formData.guardian?.email
      ) {
        formDataToSend.append(
          "guardian[guardianName]",
          formData.guardian?.guardianName || ""
        );
        formDataToSend.append(
          "guardian[contactNumber]",
          formData.guardian?.contactNumber || ""
        );
        formDataToSend.append(
          "guardian[relation]",
          formData.guardian?.relation || ""
        );
        formDataToSend.append(
          "guardian[email]",
          formData.guardian?.email || ""
        );
        formDataToSend.append(
          "guardian[password]",
          formData.guardian?.password || ""
        );
      }
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await createStudent(formDataToSend);

      if (response.success) {
        console.log("response", response);
        setMessage({
          text: response.message || "Student created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate("/student-managements/students");
        }, 2000);
      } else {
        console.log("response", response);
        setMessage({
          text: response.message || "Failed to create student",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An error occurred while creating student",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await bulkImportStudents(file);
      alert(
        `✅ Uploaded: ${result.data.success}, Total: ${result.data.total}, Failed: ${result.data.failed}`
      );
      console.log("Skipped Rows:", result.data.skippedRows);
    } catch (err: any) {
      alert("❌ Upload failed: " + err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          text: "File size should be less than 5MB",
          type: "error",
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

  const downloadTemplateFile = () => {
    const sampleFileUrl =
      "https://pub-c344308476ef469199ac8266ba9ad1f5.r2.dev/student_template.xlsx";
    const link = document.createElement("a");
    link.href = sampleFileUrl;
    link.download = "student-import-sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleFile = () => {
    const sampleFileUrl =
      "https://pub-c344308476ef469199ac8266ba9ad1f5.r2.dev/student_sample_data.xlsx";
    const link = document.createElement("a");
    link.href = sampleFileUrl;
    link.download = "student-import-sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  return (
    <div className="container mx-auto p-2">
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
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === "single"
                ? "Create Student"
                : "Bulk Import Students"}
            </h2>
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button
              className="add-btn"
              onClick={() => navigate("/student-managements/students")}
            >
              <TbArrowBackUp size={20} className="mr-2" />
              List
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "single"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("single")}
          >
            Add Single Student
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "bulk"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("bulk")}
          >
            Bulk Import
          </button>
        </div>

        {activeTab === "single" ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div>
              <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                Student Information
              </h4>
              <div className="w-full mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* File Upload - Left Side */}
                  <div className="w-full md:w-2/3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Student Photo
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
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
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
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter first name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter last name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value) {
                        const age = calculateAge(e.target.value);
                        setFormData((prev) => ({ ...prev, age }));
                      }
                    }}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    readOnly
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    required
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
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
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>
                </div>

                {/* Country Select */}
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="countryId"
                    value={formData.countryId || ""}
                    onChange={handleCountryChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Country</option>
                    {Array.isArray(countries) &&
                      countries.map((country) => (
                        <option
                          key={country.countrycode}
                          value={country.countrycode}
                        >
                          {country.countryname}
                        </option>
                      ))}
                  </select>
                  <input
                    type="hidden"
                    name="country"
                    value={formData.country}
                  />
                </div>

                {/* State Select */}
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stateId"
                    value={formData.stateId || ""}
                    onChange={handleStateChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.countryId}
                  >
                    <option value="">Select State</option>
                    {Array.isArray(states) &&
                      states.map((state) => (
                        <option key={state.stateID} value={state.stateID}>
                          {state.stateName}
                        </option>
                      ))}
                  </select>
                  <input type="hidden" name="state" value={formData.state} />
                </div>

                {/* District Select */}
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="districtId"
                    value={formData.districtId || ""}
                    onChange={handleDistrictChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.stateId}
                  >
                    <option value="">Select District</option>
                    {Array.isArray(districts) &&
                      districts.map((district) => (
                        <option key={district.cityID} value={district.cityID}>
                          {district.cityName}
                        </option>
                      ))}
                  </select>
                  <input
                    type="hidden"
                    name="district"
                    value={formData.district}
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter city"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ];
                      const isNumberKey = /^[0-9]$/.test(e.key);

                      if (!isNumberKey && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={6}
                    placeholder="Enter zip code"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    House Name/ No./ Building{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="houseName"
                    value={formData.houseName}
                    onChange={handleInputChange}
                    placeholder="Enter house name / No./ Building Name"
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="w-full px-2 mb-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isSibling"
                  checked={formData.sibling}
                  onChange={handleSiblingChange}
                  className="mr-2"
                />
                <label className="ml-2 text-gray-700 cursor-pointer">
                  Sibling
                </label>
              </div>
            </div>
            {formData.sibling && (
              <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="mb-4">
                  <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                    Sibling Information
                  </h4>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap -mx-2">
                    {/* Academic Year Dropdown */}
                    <div className="w-full md:w-1/2 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <AcademicYearDropdown
                        value={siblingsdropdown.academicYears}
                        onChange={handleSiblingAcademicYearChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-2">
                    {/* Class Dropdown */}
                    <div className="w-full md:w-1/3 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Class <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="classes"
                        value={siblingsdropdown.classes}
                        onChange={handleSiblingClassChange}
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

                    {/* Division Dropdown */}
                    <div className="w-full md:w-1/3 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Division <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="divisions"
                        value={siblingsdropdown.divisions}
                        onChange={handleSiblingDivisionChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Division</option>
                        {divisions.map((division) => (
                          <option key={division.id as any} value={division._id}>
                            {division.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Students Dropdown */}
                    <div className="w-full md:w-1/3 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Students <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="students"
                        onChange={handleStudentSelect}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Student</option>
                        {studentOptions.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                Academic Information
              </h4>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">
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
                     <option key={year.id as any} value={year._id}>
                       {year.academicYear}
                     </option>
                   ))}
                 </select> */}
                  <AcademicYearDropdown
                    value={formData.academicYear}
                    onChange={(value) => {
                      setFormData({ ...formData, academicYear: value });
                    }}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class"
                    value={formData.class?.toString() || ""}
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

                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="division"
                    value={
                      typeof formData.division === "string"
                        ? formData.division
                        : (formData.division as any)?._id || ""
                    }
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions.map((division) => (
                      <option key={division.id as any} value={division._id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Admission Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    // onKeyDown={(e) => {
                    //   const allowedKeys = [
                    //     'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
                    //   ];
                    //   const isNumberKey = /^[0-9]$/.test(e.key);

                    //   if (!isNumberKey && !allowedKeys.includes(e.key)) {
                    //     e.preventDefault();
                    //   }
                    // }}
                    placeholder="Enter admission number"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                Parent Information
              </h4>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentInfo.fatherName"
                    value={formData.parentInfo.fatherName}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter father's name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentInfo.motherName"
                    value={formData.parentInfo.motherName}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter mother's name"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Father's Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentInfo.fatherContactNumber"
                    value={formData.parentInfo.fatherContactNumber}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ];
                      const isNumberKey = /^[0-9]$/.test(e.key);

                      if (!isNumberKey && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                    placeholder="Enter father's contact number"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mother's Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentInfo.motherContactNumber"
                    value={formData.parentInfo.motherContactNumber}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ];
                      const isNumberKey = /^[0-9]$/.test(e.key);

                      if (!isNumberKey && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                    placeholder="Enter mother's contact number"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Father's Occupation
                  </label>
                  <input
                    type="text"
                    name="parentInfo.fatherOccupation"
                    value={formData.parentInfo.fatherOccupation}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter father's occupation"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mother's Occupation
                  </label>
                  <input
                    type="text"
                    name="parentInfo.motherOccupation"
                    value={formData.parentInfo.motherOccupation}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                        " ",
                      ];

                      if (!isLetter && !allowedKeys.includes(key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter mother's occupation"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Parent's Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="parentInfo.email"
                    value={formData.parentInfo.email}
                    onChange={handleInputChange}
                    placeholder="Enter parent's email"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Parent's Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="parentInfo.password"
                    value={formData.parentInfo.password}
                    onChange={handleInputChange}
                    placeholder="Enter parent's password"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {formData.sibling === false && (
              <div className="mb-4">
                <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                  Guardian Information (Optional)
                </h4>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      name="guardian.guardianName"
                      value={formData.guardian.guardianName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const key = e.key;
                        const isLetter = /^[a-zA-Z]$/.test(key);
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                          " ",
                        ];

                        if (!isLetter && !allowedKeys.includes(key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter guardian name"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian Contact
                    </label>
                    <input
                      type="text"
                      name="guardian.contactNumber"
                      value={formData.guardian.contactNumber}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                        ];
                        const isNumberKey = /^[0-9]$/.test(e.key);

                        if (!isNumberKey && !allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                      placeholder="Enter guardian contact"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Relation with Student
                    </label>
                    <input
                      type="text"
                      name="guardian.relation"
                      value={formData.guardian.relation}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        const key = e.key;
                        const isLetter = /^[a-zA-Z]$/.test(key);
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                          " ",
                        ];

                        if (!isLetter && !allowedKeys.includes(key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter relation"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian's Email
                    </label>
                    <input
                      type="email"
                      name="guardian.email"
                      value={formData.guardian.email}
                      onChange={handleInputChange}
                      placeholder="Enter guardian's email"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="w-full px-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian's Password
                      {(formData.guardian?.guardianName ||
                        formData.guardian?.contactNumber ||
                        formData.guardian?.relation ||
                        formData.guardian?.email) && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="password"
                      name="guardian.password"
                      value={formData.guardian.password}
                      onChange={handleInputChange}
                      placeholder="Enter guardian's password"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <Link to="/student-managements/students/">
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
                    Add Student
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          // Bulk Import Section (keep as is)
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Bulk Import Students</h3>
              <p className="text-gray-600 mb-4">
                Import multiple students at once by uploading an Excel file.
                Download the sample file to ensure correct formatting.
              </p>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/2">
                  <div className="border border-purple-100 bg-purple-50 rounded-lg p-4 transition-all hover:bg-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                      <FaFileExcel className="text-purple-600 text-xl" />
                      <label className="text-sm font-medium text-purple-800">
                        Download Template
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Download the template to ensure your data is formatted
                      correctly.
                    </p>
                    <button
                      type="button"
                      onClick={downloadTemplateFile}
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <FaFileExcel className="text-purple-600" />
                      Download Template
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="border border-blue-100 bg-blue-50 rounded-lg p-4 transition-all hover:bg-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <FaFileExcel className="text-blue-600 text-xl" />
                      <label className="text-sm font-medium text-blue-800">
                        Download Sample File
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Download the sample to ensure your data is formatted
                      correctly.
                    </p>
                    <button
                      type="button"
                      onClick={downloadSampleFile}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <FaFileExcel className="text-blue-600" />
                      Download Sample
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="border border-green-100 bg-green-50 rounded-lg p-4 transition-all hover:bg-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <FaFileExcel className="text-green-600 text-xl" />
                      <label className="text-sm font-medium text-green-800">
                        Upload Student Data
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload your Excel file with student data. Max file size:
                      5MB.
                    </p>
                    <label className="block w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-md transition-colors cursor-pointer text-center">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.ods"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <div className="flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-green-600"
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
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FiUpload />
                            Choose File
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notes
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Ensure all required fields are filled in the Excel
                          file
                        </li>
                        <li>
                          Follow the format exactly as shown in the sample file
                        </li>
                        <li>File size should not exceed 5MB</li>
                        <li>
                          Only .xlsx, .xls, and .ods formats are supported
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
