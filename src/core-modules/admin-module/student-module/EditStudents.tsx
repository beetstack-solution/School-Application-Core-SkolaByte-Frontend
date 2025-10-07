import React, { useEffect, useState } from "react";
import {
  updateStudentById,
  fetchStudentById,
  Student,
  Class,
  Division,
  AcademicYear,
  deleteStudent,
  Parent,
  Guardian,
} from "@/api/admin-api/student-management/students-api/studentsApi";
import {
  fetchClasses,
  fetchDivisionsDD,
  fetchAcademicYear,
  getAllStates,
  getAllDistricts
} from "@/api/common-api/commonDropDownApi";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { Gender } from "@/constants/enum";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import { MdDeleteOutline } from "react-icons/md";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { getStudentsByClassDivisionAcademicYear } from "@/api/common-api/commonDropDownApi";
import { toast } from "react-toastify";

interface FormData {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  age: string;
  houseName: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  class: string;
  division: string;
  academicYear: string;
  dob: string;
  gender: Gender;
  image?: File | string; // For the file upload
  imageUrl?: string;     // For the preview URL
  parentInfo: {
    fatherName: string;
    motherName: string;
    fatherContactNumber: string;
    motherContactNumber: string;
    fatherOccupation: string;
    motherOccupation: string;
    parentEmail: string;
    password: string;
  };
  guardian: {
    guardianName: string;
    contactNumber: string;
    relation: string;
    email: string;
    password: string;
  };
  status: boolean;
}

const EditStudent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [siblingsdropdown, setSiblingsDropdown] = useState<any>({
    academicYears: "",
    classes: "",
    divisions: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  useEffect(() => {
    const locationState = location.state as { showMessage?: { text: string; type: MessageType } };
    if (locationState?.showMessage) {
      setMessage(locationState.showMessage);
      // Clear the state to avoid showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  const [formData, setFormData] = useState<any>({
    admissionNumber: "",
    firstName: "",
    lastName: "",
    rollNumber: "",
    age: "",
    houseName: "",
    city: "",
    state: "",
    stateId: 0,
    country: "",
    district: "",
    districtId: 0,
    zipCode: "",
    class: "",
    division: "",
    academicYear: "",
    dob: "",
    gender: Gender.MALE,
    sibling: false,
    parentInfo: {
      fatherName: "",
      motherName: "",
      fatherContactNumber: "",
      motherContactNumber: "",
      fatherOccupation: "",
      motherOccupation: "",
      parentEmail: "",
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


  console.log("formData in edit students", formData)

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Students", path: "/student-managements/students" },
    { label: "Edit Student", path: "" },
  ];

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [yearsData, classesData, divisionsData] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),
        ]);
        setAcademicYears(yearsData.data);
        setClasses(classesData.data);
        setDivisions(divisionsData.data);
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev: any) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file) // Create a preview URL
      }));
    }
  };
  const fetchStates = async () => {
    try {
      const statesData: any = await getAllStates();
      setStates(statesData.data);
    } catch (error) {
      console.error("Failed to load states:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStudentsByClassDivisionAcademicYear = async () => {
    if (siblingsdropdown.academicYears && siblingsdropdown.classes && siblingsdropdown.divisions) {
      try {
        const response: any = await getStudentsByClassDivisionAcademicYear(
          siblingsdropdown.classes,
          siblingsdropdown.divisions,
          siblingsdropdown.academicYears,
        );
        if (response.success) {
          setStudentOptions(response.data)
        }
        else {
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
  }, [siblingsdropdown.academicYears, siblingsdropdown.classes, siblingsdropdown.divisions]);

  const handleSiblingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev: any) => ({
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
      setFormData((prev: any) => ({
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
        }
      }));
    }
  };


  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError("Invalid student ID");
        setIsLoading(false);
        return;
      }

      try {
        const response: any = await fetchStudentById(id);
        if (response.success) {
          const studentData: any = response.data;
          setImagePreview(response.data.imageUrl);
          // Format the date to YYYY-MM-DD for input field
          const formattedDob = new Date(studentData.dob)
            .toISOString()
            .split("T")[0];

          setFormData({
            admissionNumber: studentData.admissionNumber || "",
            firstName: studentData.firstName || "",
            lastName: studentData.lastName || "",
            rollNumber: studentData.rollNumber || "",
            age: studentData.age || "",
            houseName: studentData.houseName || "",
            city: studentData.city || "",
            state: studentData.state || "",
            stateId: studentData.stateId || 0,
            country: studentData.country || "",
            district: studentData.district || "",
            districtId: studentData.districtId || 0,
            zipCode: studentData.zipCode || "",
            class: studentData.class?.id || "",
            division: studentData.division?.id || "",
            academicYear: studentData.academicYear?.id || "",
            dob: formattedDob,
            gender:
              studentData.gender === "Male"
                ? Gender.MALE
                : studentData.gender === "Female"
                  ? Gender.FEMALE
                  : Gender.OTHER,
            parentInfo: {
              fatherName: studentData.parent?.fatherName || "",
              motherName: studentData.parent?.motherName || "",
              fatherContactNumber:
                studentData.parent?.fatherContactNumber || "",
              motherContactNumber:
                studentData.parent?.motherContactNumber || "",
              fatherOccupation: studentData.parent?.fatherOccupation || "",
              motherOccupation: studentData.parent?.motherOccupation || "",
              parentEmail: studentData.parent?.parentEmail || "",
              password: "",
            },
            guardian: {
              guardianName: studentData.guardian?.guardianName || "",
              contactNumber: studentData.guardian?.contactNumber || "",
              relation: studentData.guardian?.relation || "",
              email: studentData.guardian?.email || "",
              password: "", // Password won't be returned in the get request
            },
            status:
              studentData.status !== undefined ? studentData.status : true,
          });
        } else {
          setError(response.message || "Failed to fetch student data");
        }
      } catch (error: any) {
        console.error("Error fetching student:", error);
        setError(
          error.message || "An error occurred while fetching student data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleDeleteStudent = async () => {
    if (!id) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteStudent(id);

      if (response.success) {
        setMessage({
          text: "Student deleted successfully",
          type: "success",
        });

        setTimeout(() => {
          navigate("/student-managements/students", {
            state: {
              showMessage: {
                text: "Student deleted successfully",
                type: "success"
              }
            },
            replace: true
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error deleting student:", error);

      if (error.message.includes("Academic Year Mapping with ID") && error.message.includes("not found")) {
        setTimeout(() => {
          navigate("/student-managements/students", { replace: false });
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // Check required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      // !formData.rollNumber ||
      !formData.dob ||
      !formData.class ||
      !formData.division ||
      !formData.academicYear ||
      !formData.parentInfo.fatherName ||
      !formData.parentInfo.motherName ||
      !formData.parentInfo.fatherContactNumber ||
      !formData.parentInfo.motherContactNumber ||
      !formData.parentInfo.parentEmail ||
      !formData.houseName ||
      !formData.age
    ) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return false;
    }

    // Validate contact numbers
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
          text: `${name} Number should be 10 digits`,
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

    // Validate email formats if provided (only when email is not empty)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      formData.parentInfo.parentEmail &&
      !emailRegex.test(formData.parentInfo.parentEmail)
    ) {
      setMessage({
        text: "Parent's email is not valid",
        type: "error",
      });
      return false;
    }

    if (formData.guardian.email && !emailRegex.test(formData.guardian.email)) {
      setMessage({
        text: "Guardian's email is not valid",
        type: "error",
      });
      return false;
    }

    if (
      formData.parentInfo.password &&
      formData.parentInfo.password.length < 6
    ) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return false;
    }

    if (formData.guardian.password && formData.guardian.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return false;
    }

    return true;
  };
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  };


  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateId = Number(e.target.value);
    const selectedState: any = states.find((state: any) => state.id === selectedStateId);

    setFormData((prev:any) => ({
      ...prev,
      state: selectedState?.name || "",
      stateId: selectedStateId,
      district: "",
      districtId: 0
    }));

    if (selectedStateId) {
      fetchDistricts(selectedStateId);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrictId = Number(e.target.value);
    const selectedDistrict: any = districts.find((district: any) => district.id === selectedDistrictId);

    setFormData((prev: any) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      districtId: selectedDistrictId
    }));
  };


  const handleSiblingAcademicYearChange = (value: string) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      academicYears: value
    }));
  };

  const handleSiblingClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      classes: e.target.value
    }));
  };
  const handleSiblingDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiblingsDropdown((prev: any) => ({
      ...prev,
      divisions: e.target.value
    }));
  };


  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudentId = e.target.value;
    if (!selectedStudentId) return;


    // Find the selected student from studentOptions
    const selectedStudent: any = studentOptions.find(student => student._id === selectedStudentId);
    if (!selectedStudent) return;


    // Update the form data with the parent info from selected student
    setFormData((prev: any) => ({
      ...prev,
      parentInfo: {
        ...prev.parentInfo,
        fatherName: selectedStudent.parentInfo.fatherName || "",
        motherName: selectedStudent.parentInfo.motherName || "",
        fatherContactNumber: selectedStudent.parentInfo.fatherContactNumber || "",
        motherContactNumber: selectedStudent.parentInfo.motherContactNumber || "",
        fatherOccupation: selectedStudent.parentInfo.fatherOccupation || "",
        motherOccupation: selectedStudent.parentInfo.motherOccupation || "",
        email: selectedStudent.parentInfo.email || "",
        password: selectedStudent.parentInfo.plainPassword || "", // Don't copy password as it's hashed and shouldn't be exposed
        // Don't copy password as it's hashed and shouldn't be exposed
      }
    }));
  };

  const fetchDistricts = async (stateId: number) => {
    try {
      console.log("Fetching districts for state ID:", stateId); // Debug log
      const districtsData: any = await getAllDistricts(stateId);
      console.log("Districts API response:", districtsData); // Debug log

      if (districtsData.result) {
        setDistricts(districtsData.result);
        console.log("Districts set in state:", districtsData.result); // Debug log
      } else {
        console.error("Unexpected districts data format:", districtsData);
        setDistricts([]);
      }
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDistricts([]);
    }
  };
  useEffect(() => {
    fetchStates();

  }, []);
  useEffect(() => {
    if (formData.stateId) {
      fetchDistricts(formData.stateId);
    } else {
      setDistricts([]);
    }
  }, [formData.stateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append student basic information
      formDataToSend.append("firstName",
        formData.firstName
          ? formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1)
          : ""
      );
      formDataToSend.append("lastName", formData.lastName ? formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1) : "");
      formDataToSend.append('rollNumber', formData.rollNumber);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('houseName', formData.houseName);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('stateId', (formData.stateId));
      formDataToSend.append('district', formData.district);
      formDataToSend.append('districtId', (formData.districtId));
      formDataToSend.append('country', formData.country);
      formDataToSend.append('zipCode', formData.zipCode);
      formDataToSend.append('class', formData.class);
      formDataToSend.append('division', formData.division);
      formDataToSend.append('academicYear', formData.academicYear);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('status', String(formData.status));

      // Append parent information
      formDataToSend.append('parentInfo[fatherName]', formData.parentInfo.fatherName);
      formDataToSend.append('parentInfo[motherName]', formData.parentInfo.motherName);
      formDataToSend.append('parentInfo[fatherContactNumber]', formData.parentInfo.fatherContactNumber);
      formDataToSend.append('parentInfo[motherContactNumber]', formData.parentInfo.motherContactNumber);
      formDataToSend.append('parentInfo[fatherOccupation]', formData.parentInfo.fatherOccupation);
      formDataToSend.append('parentInfo[motherOccupation]', formData.parentInfo.motherOccupation);
      formDataToSend.append('parentInfo[email]', formData.parentInfo.parentEmail);

      if (formData.parentInfo.password) {
        formDataToSend.append('parentInfo[password]', formData.parentInfo.password);
      }

      // Append guardian information if provided
      if (formData.guardian.guardianName ||
        formData.guardian.contactNumber ||
        formData.guardian.relation) {
        formDataToSend.append('guardian[guardianName]', formData.guardian.guardianName);
        formDataToSend.append('guardian[contactNumber]', formData.guardian.contactNumber);
        formDataToSend.append('guardian[relation]', formData.guardian.relation);

        if (formData.guardian.email) {
          formDataToSend.append('guardian[email]', formData.guardian.email);
        }
        if (formData.guardian.password) {
          formDataToSend.append('guardian[password]', formData.guardian.password);
        }
      }

      // Append the image file if it exists
      if (formData.image && typeof formData.image !== 'string') {
        formDataToSend.append('file', formData.image);
      }

      const response = await updateStudentById(id, formDataToSend);
      if (response.success) {
        setMessage({
          text: response.message || "Student updated successfully",
          type: "success"
        });
        setTimeout(() => {
          navigate("/student-managements/students");
        }, 2000);
      } else {
        setMessage({
          text: response.message || "Failed to update student",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An error occurred while updating student",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return <div className="text-center p-6">Loading student data...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Student:
            <span className="text-blue-600 ml-2 capitalize text-lg">
              {formData.firstName}
            </span>
          </h2>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <button
          className="add-btn"
          onClick={() => navigate("/student-managements/students")}
        >
          <TbArrowBackUp size={20} className="mr-2" />
          List
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">

            Student Information
          </h3>
          <div>
            <div className="p-3">
              <div className="flex flex-col md:flex-row items-center gap-5">
                {/* Image Preview */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.imageUrl || `${imagePreview}`}
                    alt="Student"
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // prevents infinite loop if default image also fails
                      target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?uid=R175445859&ga=GA1.1.662587032.1739548584&semt=ais_hybrid&w=740';
                    }}
                  />
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Student Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}

                    className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG, or JPG (Max. 2MB)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission Number
                  </label>
                  <input

                    value={formData.admissionNumber}
                    disabled

                    className="w-full p-2 border border-gray-300  text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                  />

                </div>

              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter first name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter last name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                placeholder="Enter roll number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div> */}
            <div className="w-full  px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={(e) => {
                  handleInputChange(e); // Call the original handler
                  if (e.target.value) {
                    const age = calculateAge(e.target.value);
                    setFormData((prev:any) => ({ ...prev, age }));
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full  px-2 mb-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;
                  const isLetter = /^[a-zA-Z]$/.test(key);
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter country"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              {/* <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;
                  const isLetter = /^[a-zA-Z]$/.test(key);
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter state"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              /> */}
              <select
                name="state"
                value={formData.stateId}
                onChange={handleStateChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select State</option>
                {states.map((state:any) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>



            {/* District Select */}
            <div >
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
                {districts.length > 0 ? (
                  districts.map((district: any) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))
                ) : (
                  formData.stateId && <option value="" disabled>No districts found</option>
                )}
              </select>
              <input
                type="hidden"
                name="district"
                value={formData.district || ""}
              />
            </div>

            <div >
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter city"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
                  ];
                  const isNumberKey = /^[0-9]$/.test(e.key);

                  if (!isNumberKey && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter zip code"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House Name/ No./ Building <span className="text-red-500">*</span>
              </label>
              <textarea
                name="houseName"
                value={formData.houseName}
                onChange={handleInputChange}
                placeholder="Enter houseName"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

          </div>
        </div>





        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
            Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              {/* <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(value) => {
                  setFormData({ ...formData, academicYear: value });
                }}
                disabled={true}
              />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division._id} value={division._id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
            Parent Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter father's name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter mother's name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="parentInfo.fatherContactNumber"
                value={formData.parentInfo.fatherContactNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  const isNumberKey = /^[0-9]$/.test(e.key);

                  if (!isNumberKey && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                maxLength={10}
                placeholder="Enter father's contact"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="parentInfo.motherContactNumber"
                value={formData.parentInfo.motherContactNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  const isNumberKey = /^[0-9]$/.test(e.key);

                  if (!isNumberKey && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                maxLength={10}
                placeholder="Enter mother's contact"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter father's occupation"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter mother's occupation"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent's Email {/* Removed required indicator */}
              </label>
              <input
                type="email"
                name="parentInfo.email"
                value={formData.parentInfo.parentEmail}
                onChange={handleInputChange}
                placeholder="Enter parent's email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              // Removed required attribute
              />
            </div>
            {/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Parent's Password
  </label>
  <input
    type="password"
    name="parentInfo.password"
    value={formData.parentInfo.password}
    onChange={handleInputChange}
    placeholder="Enter Password"
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
  <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing password</p>
</div> */}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
            Guardian Information (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];

                  if (!isLetter && !allowedKeys.includes(key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter guardian name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian Contact
              </label>
              <input
                type="text"
                name="guardian.contactNumber"
                value={formData.guardian.contactNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  const isNumberKey = /^[0-9]$/.test(e.key);

                  if (!isNumberKey && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                maxLength={10}
                placeholder="Enter guardian contact"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relation with Student
              </label>
              <input
                type="text"
                name="guardian.relation"
                value={formData.guardian.relation}
                onChange={handleInputChange}
                placeholder="Enter relation"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian's Email
              </label>
              <input
                type="email"
                name="guardian.email"
                value={formData.guardian.email}
                onChange={handleInputChange}
                placeholder="Enter guardian's email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing email</p> */}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian's Password
              </label>
              <input
                type="password"
                name="guardian.password"
                value={formData.guardian.password}
                onChange={handleInputChange}
                placeholder="Enter guardian's password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing password</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            type="button"
            onClick={handleDeleteStudent}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70"
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
                Deleting...
              </>
            ) : (
              <>
                <MdDeleteOutline size={18} />
                Delete Student
              </>
            )}
          </button>
        </div>

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
                Update Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;