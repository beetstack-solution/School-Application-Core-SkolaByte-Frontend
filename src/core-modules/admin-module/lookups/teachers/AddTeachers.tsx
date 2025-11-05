import React, { useEffect, useState } from "react";
import {
  createTeacher,
  bulkImportTeachers,
  Teacher,
} from "@/api/admin-api/lookups-api/teachersApi";
import {
  AcademicYear,
  Division,
  fetchAcademicYear,
  fetchClasses,
  fetchDivisionsDD,
  getAllCountry,
  getAllStates,
  getAllDistricts,
} from "@/api/common-api/commonDropDownApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { Gender } from "@/constants/enum";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FiUpload, FiDownload } from "react-icons/fi";
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

// Extended Teacher interface to include address fields
interface ExtendedTeacher extends Teacher {
  country?: string;
  countryId?: number;
  state?: string;
  stateId?: number;
  district?: string;
  districtId?: number;
  city?: string;
}

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

const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);

  const [formData, setFormData] = useState<Partial<ExtendedTeacher>>({
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
    country: "",
    countryId: undefined,
    state: "",
    stateId: undefined,
    district: "",
    districtId: undefined,
    city: "",
  });

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Teachers", path: "/lookups/teachers" },
    { label: "Add Teacher", path: "" },
  ];

  // Template and sample file URLs
  const templateFileUrl =
    "https://pub-c344308476ef469199ac8266ba9ad1f5.r2.dev/teacher_template.xlsx";
  const sampleFileUrl =
    "https://pub-c344308476ef469199ac8266ba9ad1f5.r2.dev/teacher_sample_data.xlsx";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [academicYearData, classesData, divisionsData, countriesData] =
          await Promise.all([
            fetchAcademicYear(),
            fetchClasses(),
            fetchDivisionsDD(),
            getAllCountry(),
          ]);

        setAcademicYears(academicYearData.data || []);
        setClasses(classesData.data || []);
        setDivisions(divisionsData.data || []);

        // Handle countries response structure
        let countriesList: CountryOption[] = [];
        if (countriesData && countriesData.success && countriesData.data) {
          const data: any = countriesData.data;
          if (Array.isArray(data)) {
            countriesList = data;
          } else if (data && typeof data === "object") {
            if (Array.isArray(data.country)) {
              countriesList = data.country;
            } else if (
              data.country &&
              typeof data.country === "object" &&
              Array.isArray((data.country as any).country)
            ) {
              countriesList = (data.country as any).country;
            }
          }
        }
        setCountries(countriesList);
      } catch (error) {
        console.error("Failed to load required data:", error);
        setMessage({
          text: "Failed to load required data",
          type: "error",
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.countryId) {
        try {
          setIsLoading(true);
          const statesData = await getAllStates(formData.countryId);

          let statesList: StateOption[] = [];
          if (statesData && statesData.success && statesData.data) {
            if (Array.isArray(statesData.data)) {
              statesList = (statesData.data as any[]).map((s) => ({
                countryID:
                  s.countryID ??
                  s.countryId ??
                  s.countrycode ??
                  s.countryCode ??
                  0,
                stateID: s.stateID ?? s.stateId ?? s.id ?? s.ID ?? 0,
                stateName:
                  s.stateName ?? s.name ?? s.state_name ?? s.state ?? "",
              }));
            }
          }
          setStates(statesList);

          setFormData((prev) => ({
            ...prev,
            state: "",
            stateId: undefined,
            district: "",
            districtId: undefined,
            city: "",
          }));
          setDistricts([]);
        } catch (error) {
          console.error("Failed to load states:", error);
          setMessage({
            text: "Failed to load states",
            type: "error",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setStates([]);
        setDistricts([]);
      }
    };

    fetchStates();
  }, [formData.countryId]);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.countryId && formData.stateId) {
        try {
          setIsLoading(true);
          const districtsData = await getAllDistricts(
            formData.countryId,
            formData.stateId
          );

          let districtsList: DistrictOption[] = [];
          if (districtsData && districtsData.success && districtsData.data) {
            if (Array.isArray(districtsData.data)) {
              districtsList = districtsData.data.map((d: any) => ({
                countryID:
                  d.countryID ?? d.countryId ?? formData.countryId ?? 0,
                stateID: d.stateID ?? d.stateId ?? formData.stateId ?? 0,
                cityID: d.cityID ?? d.cityId ?? d.id ?? 0,
                cityName: d.cityName ?? d.name ?? d.city_name ?? d.city ?? "",
              }));
            }
          }
          setDistricts(districtsList);

          setFormData((prev) => ({
            ...prev,
            district: "",
            districtId: undefined,
          }));
        } catch (error) {
          console.error("Failed to load districts:", error);
          setMessage({
            text: "Failed to load districts",
            type: "error",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [formData.countryId, formData.stateId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "countryId" || name === "stateId" || name === "districtId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryId = parseInt(e.target.value);
    const selectedCountry = countries.find(
      (country) => country.countrycode === selectedCountryId
    );

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry ? selectedCountry.countryname : "",
      countryId: selectedCountryId || undefined,
      state: "",
      stateId: undefined,
      district: "",
      districtId: undefined,
      city: "",
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
      stateId: selectedStateId || undefined,
      district: "",
      districtId: undefined,
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
      districtId: selectedDistrictId || undefined,
    }));
  };

  const validateForm = () => {
    if (
      !formData.academicYear ||
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return false;
    }

    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      setMessage({
        text: "Contact number should be 10 digits",
        type: "error",
      });
      return false;
    }

    if (
      !formData.countryId ||
      !formData.stateId ||
      !formData.districtId ||
      !formData.city
    ) {
      setMessage({
        text: "Please fill all address fields (Country, State, District, City)",
        type: "error",
      });
      return false;
    }

    if (formData.isClassTeacher && (!formData.class || !formData.division)) {
      setMessage({
        text: "Class and Division are required when teacher is a class teacher",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (
        !["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)
      ) {
        setMessage({
          text: "Only JPEG, PNG, or JPG files are allowed",
          type: "error",
        });
        return;
      }

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

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type for Excel files
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.oasis.opendocument.spreadsheet",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage({
          text: "Only Excel files (.xlsx, .xls, .ods) are allowed",
          type: "error",
        });
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          text: "File size should be less than 5MB",
          type: "error",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const processedData = {
        ...formData,
        isClassTeacher: !!formData.isClassTeacher,
        ...(formData.isClassTeacher
          ? {
              class: formData.class,
              division: formData.division,
            }
          : {
              class: undefined,
              division: undefined,
            }),
      };

      const response = await createTeacher(processedData, file || undefined);

      if (response.success) {
        setMessage({
          text: "Teacher created successfully",
          type: "success",
        });
        setTimeout(() => navigate("/lookups/teachers"), 1500);
      } else {
        setMessage({
          text: response.message || "Failed to create teacher",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An error occurred while creating teacher",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({
        text: "Please select a file to upload",
        type: "error",
      });
      return;
    }

    setIsBulkImporting(true);

    try {
      const response = await bulkImportTeachers(file);

      if (response.success) {
        const {
          total = 0,
          success = 0,
          failed = 0,
          errors = [],
        } = response.data || {};

        let messageText = `Import completed: ${success} successful, ${failed} failed out of ${total} total`;

        // If there are specific errors, you might want to show them
        if (errors.length > 0) {
          console.log("Import errors:", errors);
          // You could also set a more detailed message or show errors in a separate section
        }

        setMessage({
          text: messageText,
          type: failed === 0 ? "success" : "warning",
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          "bulk-file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setTimeout(() => navigate("/lookups/teachers"), 2000);
      } else {
        setMessage({
          text: response.message || "Failed to import teachers",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An error occurred while importing teachers",
        type: "error",
      });
    } finally {
      setIsBulkImporting(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      ...(!checked && { class: undefined, division: undefined }),
    }));
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    downloadFile(templateFileUrl, "teacher_template.xlsx");
  };

  const handleDownloadSample = () => {
    downloadFile(sampleFileUrl, "teacher_sample_data.xlsx");
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "single"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("single")}
              >
                Add Single Teacher
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "bulk"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("bulk")}
              >
                Bulk Import
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Single Teacher Form */}
            {activeTab === "single" && (
              <form onSubmit={handleSingleSubmit}>
                <div>
                  <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                    Teacher Information
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
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              JPEG, PNG, or JPG (Max. 5MB)
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
                        onChange={(value) =>
                          setFormData({ ...formData, academicYear: value })
                        }
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
                          if (
                            !/^[a-zA-Z\s]+$/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
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
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
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

                    {/* Address Fields */}
                    <div className="w-full md:w-1/2 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="countryId"
                        value={formData.countryId || ""}
                        onChange={handleCountryChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoadingData}
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
                      {isLoadingData && (
                        <p className="text-sm text-gray-500 mt-1">
                          Loading countries...
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-1/2 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="stateId"
                        value={formData.stateId || ""}
                        onChange={handleStateChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!formData.countryId || isLoading}
                      >
                        <option value="">Select State</option>
                        {Array.isArray(states) &&
                          states.map((state) => (
                            <option key={state.stateID} value={state.stateID}>
                              {state.stateName}
                            </option>
                          ))}
                      </select>
                      {isLoading && formData.countryId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Loading states...
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-1/2 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="districtId"
                        value={formData.districtId || ""}
                        onChange={handleDistrictChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!formData.stateId || isLoading}
                      >
                        <option value="">Select District</option>
                        {Array.isArray(districts) &&
                          districts.map((district) => (
                            <option
                              key={district.cityID}
                              value={district.cityID}
                            >
                              {district.cityName}
                            </option>
                          ))}
                      </select>
                      {isLoading && formData.stateId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Loading districts...
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-1/2 px-2 mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city name"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
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

                {/* Class Teacher Section */}
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
                    <label
                      htmlFor="isClassTeacherCheckbox"
                      className="ml-2 text-gray-700 cursor-pointer"
                    >
                      Is Class Teacher ?
                    </label>
                  </div>
                </div>

                {formData.isClassTeacher && (
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
                        {Array.isArray(classes) &&
                          classes.map((cls) => (
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
                        {Array.isArray(divisions) &&
                          divisions.map((division) => (
                            <option
                              key={division._id as any}
                              value={division._id}
                            >
                              {division.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}

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
            )}

            {/* Bulk Import Form */}
            {activeTab === "bulk" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Bulk Import Teachers
                </h2>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Import multiple teachers at once by uploading an Excel file
                  </h3>

                  <div className="space-y-4">
                    {/* Download Template */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <FiDownload className="text-green-600" size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Download Template
                          </h4>
                          <p className="text-sm text-gray-600">
                            Download the template to ensure your data is
                            formatted correctly.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadTemplate}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                      >
                        <FiDownload size={16} />
                        Download Template
                      </button>
                    </div>

                    {/* Download Sample File */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiDownload className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Download Sample File
                          </h4>
                          <p className="text-sm text-gray-600">
                            Download the sample to ensure your data is formatted
                            correctly.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadSample}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                      >
                        <FiDownload size={16} />
                        Download Sample
                      </button>
                    </div>

                    {/* Upload Section */}
                    {/* Upload Section */}
                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                          <FiUpload className="text-blue-500" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">
                            Upload Teacher Data
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Upload your Excel file with teacher data. Max file
                            size: 5MB
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="bulk-file-upload"
                          className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer transition-all duration-200"
                        >
                          <div className="text-center">
                            <p className="text-gray-600">
                              <span className="font-medium text-blue-600">
                                Click to browse
                              </span>{" "}
                              or drag and drop your file
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supports: .xlsx, .xls, .ods
                            </p>
                          </div>
                          <input
                            id="bulk-file-upload"
                            type="file"
                            accept=".xlsx,.xls,.ods"
                            onChange={handleBulkFileChange}
                            className="hidden"
                          />
                        </label>
                        {file && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <svg
                                className="w-5 h-5 text-green-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              <span className="font-medium text-green-800 text-sm">
                                {file.name}
                              </span>
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>
                      • Ensure all required fields are filled in the Excel file
                    </li>
                    <li>
                      • Follow the format exactly as shown in the sample file
                    </li>
                    <li>• File size should not exceed 5MB</li>
                    <li>• Only .xlsx, .xls, and .ods formats are supported</li>
                    <li>
                      • Email addresses must be unique across all teachers
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
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
                    onClick={handleBulkSubmit}
                    disabled={!file || isBulkImporting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70"
                  >
                    {isBulkImporting ? (
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
                        Importing...
                      </>
                    ) : (
                      <>
                        <FiUpload size={18} />
                        Import Teachers
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
