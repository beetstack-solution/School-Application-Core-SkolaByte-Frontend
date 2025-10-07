import React, { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/Breadcumb";
import {
  updateOrganizationById,
  fetchOrganizationById,
} from "@/api/admin-api/base-api/organizationProfileApi";
import {
  fetchFinancialYearDD,
  FinancialYear,
  fetchCurrencyFormatDD,
  CurrencyFormat,
  fetchCurrencyDecimailsDD,
  CurrencyDecimal,
  fetchCurrencyDD,
  Currency,
  fetchBranchDD,
  Branch,
  fetchDateFormatDD,
  DateFormatData,
} from "@/api/common-api/commonDropDownApi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";

function EditOrganisationProfile() {
  const { id } = useParams<{ id: any }>(); // Assuming the organization ID is in the route params
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState<any>({
    name: "",
    phoneNumber: "",
    email: "",
    websiteURL: "",
    gstin: "",
    file: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
    },
    paymentAddress: {
      street: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
    },
    headOffice: "",
    defaultCurrency: "",
    defaultDecimal: "",
    defaultFormat: "",
    defaultFinancialYear: "",
  });
  const [branchDD, setBranchDD] = useState<Branch[]>([]);
  const [currencyDD, setCurrencyDD] = useState<Currency[]>([]);
  const [currencyFormatDD, setCurrencyFormatDD] = useState<CurrencyFormat[]>(
    []
  );
  const [currencyDecimailDD, setCurrencyDecimailDD] = useState<
    CurrencyDecimal[]
  >([]);
  const [file, setFile] = useState(null);
  const [financialYearDD, setFinancialYearDD] = useState<FinancialYear[]>([]);
  const [dateFormatDD, setDateFormatDD] = useState<DateFormatData[]>([]);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          branches,
          currencies,
          currencyFormats,
          currencyDecimals,
          financialYears,
          dateFormats,
        ] = await Promise.all([
          fetchBranchDD(),
          fetchCurrencyDD(),
          fetchCurrencyFormatDD(),
          fetchCurrencyDecimailsDD(),
          fetchFinancialYearDD(),
          fetchDateFormatDD(),
        ]);

        setBranchDD(branches.data);
        setCurrencyDD(currencies.data);
        setCurrencyFormatDD(currencyFormats.data);
        setCurrencyDecimailDD(currencyDecimals.data);
        setFinancialYearDD(financialYears.data);
        setDateFormatDD(dateFormats.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load dropdown data.");
      }
    };

    loadData();
  }, []);

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleBranchChange = (selectedBranchId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      headOffice: selectedBranchId,
    }));
  };

  const handleCurrencyChange = (selectedCurrencyId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      defaultCurrency: selectedCurrencyId,
    }));
  };

  const handleDecimalChange = (selectedDecimalId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      defaultDecimal: selectedDecimalId,
    }));
  };

  const handleFormatChange = (selectedFormatId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      defaultFormat: selectedFormatId,
    }));
  };

  const handleFinancialYearChange = (selectedYearId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      defaultFinancialYear: selectedYearId,
    }));
  };

  const handleDateFormatChange = (selectedDateId: string) => {
    setOrganizationData((prevData: any) => ({
      ...prevData,
      defaultDateFormat: selectedDateId,
    }));
  };

  // Breadcrumb items for navigation
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Organisation Profile", path: "/organisation-profile" },
    { label: "Edit Organisation Profile", path: "" },
  ];

  // Fetch organization data by ID when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrganizationById(id);
        setOrganizationData(response.organization);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
    fetchData();
  }, [id]);

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setOrganizationData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle nested input change for addresses
  const handleNestedChange = (e: any, key: any, nestedKey: any) => {
    const { value } = e.target;
    setOrganizationData((prevData: any) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        [nestedKey]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (file) {
      formDataToSend.append("file", file);
    }

    try {
      await updateOrganizationById(id, organizationData);
      // navigate("/organisation-profile"); // Redirect to organization profile page
    } catch (error) {
      console.error("Error updating organization data:", error);
    }
  };

  const RequiredSymbol = () => <span className="text-red-500">*</span>;


  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Edit Organisation Profile</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns mt-2">
        <Link to={"/organisation-profile"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mt-5">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name <RequiredSymbol />
              </label>
              <input
                type="text"
                name="name"
                value={organizationData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number  <RequiredSymbol />
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={organizationData.phoneNumber}
                onChange={handleChange}
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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email <RequiredSymbol />
              </label>
              <input
                type="email"
                name="email"
                value={organizationData.email}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Website URL <RequiredSymbol />
              </label>
              <input
                type="text"
                name="websiteUrl"
                value={organizationData.websiteUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                GSTIN Number <RequiredSymbol />
              </label>
              <input
                type="text"
                name="paymentAddress.GSTINNumber"
                value={organizationData.paymentAddress.GSTINNumber}
                onChange={handleChange}
                placeholder="Enter GSTIN Number"
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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Logo <RequiredSymbol />
              </label>
              <input
                type="file"
                accept="image/*"
                name="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {organizationData.file && (
                <img
                  src={organizationData.file}
                  alt="Logo Preview"
                  className="mt-2 w-20 h-20 object-cover"
                />
              )}
            </div>
          </div>
          {/* Repeat similar input fields for email, websiteURL, gstin, logo */}
          {/* Address Section */}
          <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
            <legend className="text-lg font-bold text-gray-700 px-2">
              Address
            </legend>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Street <RequiredSymbol />
                </label>
                <input
                  type="text"
                  value={organizationData.address.street}
                  onChange={(e) => handleNestedChange(e, "address", "street")}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  City <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={organizationData.address.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Add remaining address fields (city, district, state, pinCode) similarly */}
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  District <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="address.district"
                  value={organizationData.address.district}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  State <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={organizationData.address.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pin Code <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={organizationData.address.zipCode}
                  onChange={handleChange}
                  placeholder="ZipCode"
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
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </fieldset>
          {/* Payment Address Section */}
          <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
            <legend className="text-lg font-bold text-gray-700 px-2">
              Payment Address
            </legend>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Street <RequiredSymbol />
                </label>
                <input
                  type="text"
                  value={organizationData.paymentAddress.streetName}
                  onChange={(e) =>
                    handleNestedChange(e, "paymentAddress", "street")
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  City <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="paymentAddress.city"
                  value={organizationData.paymentAddress.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Add remaining payment address fields (city, district, state, pinCode) similarly */}
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  District <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="paymentAddress.district"
                  value={organizationData.paymentAddress.district}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  State <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="paymentAddress.state"
                  value={organizationData.paymentAddress.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pin Code <RequiredSymbol />
                </label>
                <input
                  type="text"
                  name="paymentAddress.pincode"
                  value={organizationData.paymentAddress.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
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
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </fieldset>
          {/* Select fields for head office, currency, decimal, format, financial year */}
          <div className="mt-5">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Head Office <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // name="headOffice"

                  value={organizationData.headOffice} // Bind the select value to state
                  onChange={(e) => handleBranchChange(e.target.value)}
                >
                  <option value="">Select Head Office</option>
                  {branchDD.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Default Currency <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // name="defaultCurrency"

                  value={organizationData.defaultCurrency} // Bind the select value to state
                  onChange={(e) => handleCurrencyChange(e.target.value)} // Add a change handler
                >
                  <option value="">Select Currency</option>
                  {currencyDD.map((currency) => (
                    <option key={currency._id} value={currency._id}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Default Decimal <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // name="defaultDecimal"
                  value={organizationData.defaultDecimal} // Bind the select value to state
                  onChange={(e) => handleDecimalChange(e.target.value)} // Add a change handler
                >
                  <option value="">Select Decimal</option>
                  {currencyDecimailDD.map((decimal) => (
                    <option key={decimal._id} value={decimal._id}>
                      {decimal.displayValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Default Format <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // name="defaultFormat"

                  value={organizationData.defaultFormat} // Bind the select value to state
                  onChange={(e) => handleFormatChange(e.target.value)} // Add a change handler
                >
                  <option value="">Select Format</option>
                  {currencyFormatDD.map((format) => (
                    <option key={format._id} value={format._id}>
                      {format.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Default Financial Year <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={organizationData.defaultFinancialYear} // Bind the select value to state
                  onChange={(e) => handleFinancialYearChange(e.target.value)} // Add a change handler
                >
                  <option value="">Select Financial Year</option>
                  {financialYearDD.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.startMonth} - {year.endMonth}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Default Financial Year <RequiredSymbol />
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={organizationData.defaultDateFormat} // Bind the select value to state
                  onChange={(e) => handleDateFormatChange(e.target.value)} // Add a change handler
                >
                  <option value="">Select Date Format</option>
                  {dateFormatDD.map((date) => (
                    <option key={date._id} value={date._id}>
                      {date.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
            </button>
            <button type="button" className="cancel-btn">
              <FcCancel size={20} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditOrganisationProfile;
