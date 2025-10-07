import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcumb";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import {
  createOrganisation,
  Organization,
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
import { toast } from "react-toastify";

const AddOrganizationProfile: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    phoneNumber: "",
    email: "",
    websiteUrl: "",
    logo: null,
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      zipCode: "",
    },
    paymentAddress: {
      streetName: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      GSTINNumber: "",
    },
    defaultDateFormat: "",
    defaultFinancialYear: "",
    defaultFormat: "",
    defaultDecimal: "",
    defaultCurrency: "",
    headOffice: "",
  });
  const [branchDD, setBranchDD] = useState<Branch[]>([]);
  const [currencyDD, setCurrencyDD] = useState<Currency[]>([]);
  const [currencyFormatDD, setCurrencyFormatDD] = useState<CurrencyFormat[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currencyDecimailDD, setCurrencyDecimailDD] = useState<
    CurrencyDecimal[]
  >([]);
  const [financialYearDD, setFinancialYearDD] = useState<FinancialYear[]>([]);
  const [dateFormatDD, setDateFormatDD] = useState<DateFormatData[]>([]);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Organisation Profile", path: "/organisation-profile" },
    { label: " Add Organisation Profile", path: "" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData: any) => {
      const [field, subField] = name.split(".");

      return subField
        ? {
            ...prevData,
            [field]: {
              ...(prevData[field as keyof Organization] as Record<string, any>), // Cast prevData[field] to avoid TypeScript error
              [subField]: value,
            },
          }
        : {
            ...prevData,
            [name]: value,
          };
    });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleBranchChange = (selectedBranchId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      headOffice: selectedBranchId,
    }));
  };

  const handleCurrencyChange = (selectedCurrencyId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      defaultCurrency: selectedCurrencyId,
    }));
  };

  const handleDecimalChange = (selectedDecimalId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      defaultDecimal: selectedDecimalId,
    }));
  };

  const handleFormatChange = (selectedFormatId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      defaultFormat: selectedFormatId,
    }));
  };

  const handleFinancialYearChange = (selectedYearId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      defaultFinancialYear: selectedYearId,
    }));
  };

  const handleDateFormatChange = (selectedDateId: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      defaultDateFormat: selectedDateId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend: any = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("websiteUrl", formData.websiteUrl);
    formDataToSend.append("logo", formData.logo);
    formDataToSend.append("address[street]", formData.address.street);
    formDataToSend.append("address[city]", formData.address.city);
    formDataToSend.append("address[district]", formData.address.district);
    formDataToSend.append("address[state]", formData.address.state);
    formDataToSend.append("address[zipCode]", formData.address.zipCode);
    formDataToSend.append(
      "paymentAddress[streetName]",
      formData.paymentAddress.streetName
    );
    formDataToSend.append("paymentAddress[city]", formData.paymentAddress.city);
    formDataToSend.append(
      "paymentAddress[district]",
      formData.paymentAddress.district
    );
    formDataToSend.append(
      "paymentAddress[state]",
      formData.paymentAddress.state
    );
    formDataToSend.append(
      "paymentAddress[pincode]",
      formData.paymentAddress.pincode
    );
    formDataToSend.append(
      "paymentAddress[GSTINNumber]",
      formData.paymentAddress.GSTINNumber
    );
    formDataToSend.append("defaultDateFormat", formData.defaultDateFormat);
    formDataToSend.append(
      "defaultFinancialYear",
      formData.defaultFinancialYear
    );
    formDataToSend.append("defaultFormat", formData.defaultFormat);
    formDataToSend.append("defaultDecimal", formData.defaultDecimal);
    formDataToSend.append("defaultCurrency", formData.defaultCurrency);
    formDataToSend.append("headOffice", formData.headOffice);

    if (file) {
      formDataToSend.append("file", file);
    }

    try {
      setLoading(true);
      console.log("Submitting organization data", formDataToSend);
      const result = await createOrganisation(formDataToSend);
      if (!result.success) {
        console.error("API error:", result.message);
        toast.error(result.message || "Failed to create organization profile.");
      } else {
        toast.success(result.message || "Organization profile created successfully.");
        // Reset form
        resetForm();
        navigate("/organisation-profile");
      }
    } catch (error) {
      console.error("Error creating organization profile:", error);
      toast.error("Failed to create organization profile.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      websiteUrl: "",
      logo: "",
      address: {
        street: "",
        city: "",
        district: "",
        state: "",
        zipCode: "",
      },
      paymentAddress: {
        streetName: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        GSTINNumber: "",
      },
      defaultDateFormat: "",
      defaultFinancialYear: "",
      defaultFormat: "",
      defaultDecimal: "",
      defaultCurrency: "",
      headOffice: "",
    });
  };

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

  const RequiredSymbol = () => <span className="text-red-500">*</span>;


  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Add Organisation Profile</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns  mt-2">
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
                value={formData.name}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number <RequiredSymbol />
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter Phone Number"
                onChange={(e) => handleChange(e)}
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
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email <RequiredSymbol />
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
                value={formData.websiteUrl}
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
                maxLength={15}
                type="text"
                name="paymentAddress.GSTINNumber"
                value={formData.paymentAddress.GSTINNumber}
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
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {file && (
                <img
                  src={file}
                  alt="Logo Preview"
                  className="mt-2 w-20 h-20 object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
          {" "}
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
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City <RequiredSymbol />
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                District <RequiredSymbol />
              </label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
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
                name="address.state"
                value={formData.address.state}
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
                name="address.zipCode"
                value={formData.address.zipCode}
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
                required
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
          {" "}
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
                name="paymentAddress.streetName"
                value={formData.paymentAddress.streetName}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City <RequiredSymbol />
              </label>
              <input
                type="text"
                name="paymentAddress.city"
                value={formData.paymentAddress.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                District <RequiredSymbol />
              </label>
              <input
                type="text"
                name="paymentAddress.district"
                value={formData.paymentAddress.district}
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
                value={formData.paymentAddress.state}
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
                value={formData.paymentAddress.pincode}
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

        <div className="mt-5">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Head Office <RequiredSymbol />
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                // name="headOffice"

                value={formData.headOffice} // Bind the select value to state
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

                value={formData.defaultCurrency} // Bind the select value to state
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
                value={formData.defaultDecimal} // Bind the select value to state
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

                value={formData.defaultFormat} // Bind the select value to state
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
                value={formData.defaultFinancialYear} // Bind the select value to state
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
                value={formData.defaultDateFormat} // Bind the select value to state
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
};

export default AddOrganizationProfile;
