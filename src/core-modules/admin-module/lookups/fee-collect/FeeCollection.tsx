import {
  getStudentsByClassAndDivision,
  UpdateFeeStructureDiscountById,
} from "@/api/admin-api/lookups-api/feeCollectionApi";
import { fetchFeeStructureById } from "@/api/admin-api/lookups-api/feeStructureApi";
import {
  fetchAcademicYear,
  fetchAllStudentsByClassDivisionAcademicYear,
  fetchFeeInstallmentTypeDD,
  fetchClasses,
  fetchDivisionsDD,
} from "@/api/common-api/commonDropDownApi";
import Breadcrumb from "@/components/Breadcumb";
import React, { useEffect, useState, useRef } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

interface FormData {
  discount: number;
  isDiscountApplicable: boolean;
  finalFeeAfterDiscountApplied: number;
  installments: Installment[];
}

interface Installment {
  feeInstallmentType: string;
  installmentName: string;
  noOfInstallments: number;
  name: string;
  feeAmount: number;
  discountAmount: number;
  payableAmount: number;
}

function FeeCollection() {
  const navigate = useNavigate();
  const [classOptions, setClassOptions] = useState<any>([]);
  const [divisionOptions, setDivisionOptions] = useState<any>([]);
  const [academicYearOptions, setAcademicYearOptions] = useState<any>([]);
  const [feeInstallmentTypes, setFeeInstallmentTypes] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [allStudents, setAllStudents] = useState<any>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentFeeStructure, setStudentFeeStructure] = useState<any>([]);
  const [feeStructureId, setFeeStructureId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    discount: 0,
    isDiscountApplicable: false,
    finalFeeAfterDiscountApplied: 0,
    installments: [
      {
        feeInstallmentType: "",
        installmentName: "",
        noOfInstallments: 1,
        name: "",
        feeAmount: 0,
        discountAmount: 0,
        payableAmount: 0,
      },
    ],
  });
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadDropdownOptions = async () => {
    try {
      const [classRes, divisionRes, yearRes] = await Promise.all([
        fetchClasses(),
        fetchDivisionsDD(),
        fetchAcademicYear(),
      ]);

      if (classRes.success) setClassOptions(classRes.data);
      if (divisionRes.success) setDivisionOptions(divisionRes.data);
      if (yearRes.success) setAcademicYearOptions(yearRes.data);
    } catch (error) {
      console.error("Error loading dropdown options:", error);
    }
  };

  useEffect(() => {
    loadDropdownOptions();
  }, []);

  const loadStudents = async () => {
    try {
      const students = await fetchAllStudentsByClassDivisionAcademicYear(
        selectedClass,
        selectedDivision,
        selectedAcademicYear
      );
      setAllStudents(students.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedDivision && selectedAcademicYear) {
      loadStudents();
    }
  }, [selectedClass, selectedDivision, selectedAcademicYear]);

  const loadStudentFeeStructure = async () => {
    try {
      const students = await getStudentsByClassAndDivision(
        selectedStudent,
        selectedAcademicYear
      );
      setStudentFeeStructure(students.data);
      setFeeStructureId(students.data.feeStructureId);

      const total =
        students.data?.feeAmountSplitup?.reduce(
          (sum: number, fee: any) => sum + fee.amount,
          0
        ) || 0;
      setTotalAmount(total);
      setFormData({
        discount: 0,
        isDiscountApplicable: false,
        finalFeeAfterDiscountApplied: total,
        installments: [
          {
            feeInstallmentType: "",
            installmentName: "",
            noOfInstallments: 1,
            name: "",
            feeAmount: total,
            discountAmount: 0,
            payableAmount: total,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      loadStudentFeeStructure();
    }
  }, [selectedStudent]);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    const finalAmount = Math.max(totalAmount - discount, 0);

    const selectedType = feeInstallmentTypes.find(
      (type) => type._id === formData.installments[0].feeInstallmentType
    );
    const calculation = selectedType
      ? calculateInstallmentAmount(selectedType.name, finalAmount)
      : { noOfInstallments: 1, amount: finalAmount };

    setFormData((prev) => ({
      ...prev,
      discount: discount,
      isDiscountApplicable: discount > 0,
      finalFeeAfterDiscountApplied: finalAmount,
      installments: [
        {
          ...prev.installments[0],
          feeAmount: finalAmount,
          payableAmount: calculation.amount,
          noOfInstallments: calculation.noOfInstallments,
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.installments[0].feeInstallmentType) {
      toast.error("Please select an installment type");
      return;
    }

    const confirmUpdate = window.confirm(
      `Are you sure you want to update the fee structure?\nFinal Amount: ₹${(
        formData.finalFeeAfterDiscountApplied /
        (formData.installments[0].noOfInstallments || 1)
      ).toFixed(2)}`
    );
    if (!confirmUpdate) return;

    try {
      const response = await UpdateFeeStructureDiscountById(
        selectedStudent,
        formData
      );
      navigate("/lookups/payments");

      if (response.success) {
        toast.success("Fee Structure updated successfully!");
        navigate("/lookups/payments");
      } else {
        toast.error(response.message || "Error updating fee structure");
      }
    } catch (error: any) {
      console.error("Error updating fee structure:", error);
      toast.error(error.message || "Error updating fee structure");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Fees Collection" },
  ];

  const resetSelection = () => {
    setSelectedStudent("");
    setSearchTerm("");
  };

  const filteredStudents = allStudents.filter((student: any) => {
    const searchString = `${student.firstName} ${student.lastName} ${
      student.rollNumber || ""
    }`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getSelectedStudentName = () => {
    if (!selectedStudent) return "Select Student";
    const student = allStudents.find((s: any) => s._id === selectedStudent);
    return student
      ? `${student.firstName} ${student.lastName}${
          student.rollNumber ? ` (Roll: ${student.rollNumber})` : ""
        }`
      : "Select Student";
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const getInstallmentTypes = async () => {
    try {
      const response = await fetchFeeInstallmentTypeDD();
      if (response.success) {
        setFeeInstallmentTypes(response.data);
      }
    } catch (error) {
      toast.error("Error fetching fee installment types");
    }
  };

  useEffect(() => {
    getInstallmentTypes();
  }, []);

  const calculateInstallmentAmount = (
    installmentTypeName: string,
    totalAmount: number
  ) => {
    switch (installmentTypeName) {
      case "Full Payment":
        return {
          noOfInstallments: 1,
          amount: totalAmount,
        };
      case "Half Year":
        return {
          noOfInstallments: 2,
          amount: totalAmount / 2,
        };
      case "Quarter":
        return {
          noOfInstallments: 4,
          amount: totalAmount / 4,
        };
      default:
        return {
          noOfInstallments: 1,
          amount: totalAmount,
        };
    }
  };
  const handleInstallmentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTypeId = e.target.value;
    const selectedType = feeInstallmentTypes.find(
      (type) => type._id === selectedTypeId
    );

    if (selectedType) {
      const calculation = calculateInstallmentAmount(
        selectedType.name,
        formData.finalFeeAfterDiscountApplied
      );

      setFormData((prev) => ({
        ...prev,
        installments: [
          {
            ...prev.installments[0],
            feeInstallmentType: selectedTypeId,
            name: selectedType.name,
            noOfInstallments: calculation.noOfInstallments,
            feeAmount: formData.finalFeeAfterDiscountApplied,
            payableAmount: calculation.amount,
            discountAmount: 0,
          },
        ],
      }));
    }
  };

  return (
   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
         <h2 className="text-2xl font-bold text-gray-800">Fee Collection</h2>
    <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <button className="add-btn" onClick={() => navigate("/")}>
          <TbArrowBackUp size={20} className="mr-2" />
          List
        </button>
      </div>

      {!selectedStudent ? (
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Filters Section */}
          <div>
            <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
              Student Filters
            </h4>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Academic Year
                </label>
                <AcademicYearDropdown
                  value={selectedAcademicYear}
                  onChange={setSelectedAcademicYear}
                  required={true}
                  disabled={false}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Class</option>
                  {classOptions.map((option: any) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Division</option>
                  {divisionOptions.map((option: any) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Selection (appears when filters are selected) */}
          {selectedClass && selectedDivision && selectedAcademicYear && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
              <div className="w-full px-2 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Student
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8 cursor-pointer flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="truncate">{getSelectedStudentName()}</span>
                    <svg
                      className={`h-4 w-4 ml-2 transition-transform ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 sticky top-0 bg-white border-b">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="py-1">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student: any) => (
                            <div
                              key={student._id}
                              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                selectedStudent === student._id
                                  ? "bg-blue-100"
                                  : ""
                              }`}
                              onClick={() => handleStudentSelect(student._id)}
                            >
                              {student.firstName} {student.lastName}
                              {student.rollNumber && (
                                <span className="text-gray-500 ml-2">
                                  (Roll: {student.rollNumber})
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No students found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex flex-col gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="text-lg font-semibold text-indigo-700">
                Student Selected
              </h4>
              <button
                onClick={resetSelection}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <TbArrowBackUp className="mr-1.5" />
                <span>Change Student</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Class
                </p>
                <p className="text-indigo-900 font-medium text-lg">
                  {studentFeeStructure?.class?.name || "N/A"}
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-400">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Academic Year
                </p>
                <p className="text-emerald-900 font-medium text-lg">
                  {studentFeeStructure?.academicYear?.name || "N/A"}
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Student Name
                </p>
                <p className="text-amber-900 font-medium text-lg">
                  {studentFeeStructure?.student?.firstName || "N/A"}{" "}
                  {studentFeeStructure?.student?.lastName || "N/A"}
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Roll Number
                </p>
                <p className="text-purple-900 font-medium text-lg">
                  {studentFeeStructure?.student?.rollNumber || "N/A"}
                </p>
              </div>

              <div className="bg-cyan-50 p-3 rounded border-l-4 border-cyan-400">
                <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                  Admission Number
                </p>
                <p className="text-cyan-900 font-medium text-lg">
                  {studentFeeStructure?.student?.admissionNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Fee Type</th>
                  <th className="border px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {studentFeeStructure?.feeAmountSplitup?.map((fee: any) => (
                  <tr key={fee.feeType._id}>
                    <td className="border px-4 py-2">{fee.feeType.name}</td>
                    <td className="border px-4 py-2 text-right">
                      ₹{fee.amount}
                    </td>
                  </tr>
                ))}

                <tr className="font-semibold bg-gray-50">
                  <td className="border px-4 py-2 text-right">Total</td>
                  <td className="border px-4 py-2 text-right">
                    ₹{totalAmount}
                  </td>
                </tr>

                <tr>
                  <td className="border px-4 py-2 text-right">Discount</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                      placeholder="Enter discount"
                      value={formData.discount}
                      min="0"
                      max={totalAmount}
                      onChange={handleDiscountChange}
                    />
                  </td>
                </tr>

                <tr className="font-semibold bg-green-50">
                  <td className="border px-4 py-2 text-right">Final Amount</td>
                  <td className="border px-4 py-2 text-right">
                    ₹
                    {(
                      formData.finalFeeAfterDiscountApplied /
                      (formData.installments[0].noOfInstallments || 1)
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Installment Type Selection */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-lg font-medium mb-4 text-gray-700">
                Payment Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Installment Type Dropdown */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Installment Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.installments[0].feeInstallmentType}
                    onChange={handleInstallmentTypeChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Installment Type</option>
                    {feeInstallmentTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Installments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of Installments
                  </label>
                  <div className="w-full p-2 border rounded-lg bg-gray-50 text-right">
                    {formData.installments[0].noOfInstallments}
                  </div>
                </div>

                {/* Amount per Installment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount per Installment
                  </label>
                  <div className="w-full p-2 border rounded-lg bg-gray-50 text-right">
                    ₹
                    {(
                      formData.finalFeeAfterDiscountApplied /
                      (formData.installments[0].noOfInstallments || 1)
                    ).toFixed(2)}
                  </div>
                </div>

                {/* Total Amounts Section */}
                <div className="md:col-span-3">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Total Payable Amount
                    </label>
                    <div className="w-full p-2 border rounded-lg bg-gray-50 font-semibold text-right">
                      {/* ₹{formData.finalFeeAfterDiscountApplied.toFixed(2)} */}
                      ₹
                      {(
                        formData.finalFeeAfterDiscountApplied /
                        (formData.installments[0].noOfInstallments || 1)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <FcCancel size={20} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-lg group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg hover:shadow-blue-500/50"
                  // disabled={!formData.installments[0].feeInstallmentType}
                >
                  <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeCollection;
