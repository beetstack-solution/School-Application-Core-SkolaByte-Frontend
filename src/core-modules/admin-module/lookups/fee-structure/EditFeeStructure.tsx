import React, { useEffect, useState, useRef } from 'react'
import { FcCancel } from 'react-icons/fc';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchFeeStructureById, updateFeeStructureById } from '@/api/admin-api/lookups-api/feeStructureApi';
import { fetchAcademicYear, fetchClasses, fetchFeeTypes, fetchStudentsByClass } from '@/api/common-api/commonDropDownApi';
import Breadcrumb from '@/components/Breadcumb';
import { IoMdAddCircleOutline } from 'react-icons/io';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';

function EditFeeStructure() {
  const { id } = useParams<{ id: string }>();
  const [classes, setClasses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [feeTypes, setFeeTypes] = useState<any[]>([]);
  const [studentsOptions, setStudentsOptions] = useState<any[]>([]);
  const [feeStructureData, setFeeStructureData] = useState<any>({
    feeName: '',
    academicYear: '',
    class: '',
    students: [],
    feeAmountSplitup: [{ feeType: '', amount: '' }],
    totalFee: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classes, academicYears, feeTypes] = await Promise.all([
          fetchClasses(),
          fetchAcademicYear(),
          fetchFeeTypes(),
        ]);
        setClasses(classes.data);
        setAcademicYears(academicYears.data);
        setFeeTypes(feeTypes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dropdown data.");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (id) {
      const loadFeeStructure = async () => {
        try {
          const feeStructure: any = await fetchFeeStructureById(id);
          if (feeStructure.success) {
            setFeeStructureData({
              feeName: feeStructure.data?.feeName,
              academicYear: feeStructure.data?.academicYear?._id,
              class: feeStructure.data?.class?._id || feeStructure.data?.class || '',
              students: feeStructure.data?.students?.map((s: any) => s._id) || [],
              feeAmountSplitup: feeStructure.data?.feeAmountSplitup?.map((splitup: any) => ({
                feeType: splitup.feeType?._id || splitup.feeType,
                amount: splitup.amount,
              })) || [{ feeType: '', amount: '' }],
              totalFee: feeStructure.data?.totalFee || 0,
            });

            if (feeStructure.data?.class?._id) {
              const students = await fetchStudentsByClass(feeStructure.data.class._id, feeStructure.data.academicYear._id);
              setStudentsOptions(students.data);
            }
          }
        } catch (error) {
          console.error("Error fetching fee structure:", error);
        }
      };

      loadFeeStructure();
    }
  }, [id]);

  const loadStudents = async (selectedClass: string, selectedAcademicYear: string) => {
    try {
      const response = await fetchStudentsByClass(
        feeStructureData.class || selectedClass,
        feeStructureData.academicYear || selectedAcademicYear
      );
      setStudentsOptions(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  }

  useEffect(() => {
    if (feeStructureData.class && feeStructureData.academicYear) {
      loadStudents(feeStructureData.class, feeStructureData.academicYear);
    }
  }, [feeStructureData.class, feeStructureData.academicYear]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "class" || name === "academicYear") {
      setFeeStructureData((prev: any) => ({
        ...prev,
        [name]: value,
        students: []
      }));
    } else {
      setFeeStructureData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeeAmountChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFeeAmountSplitup = [...feeStructureData.feeAmountSplitup];
    newFeeAmountSplitup[index][name] = value;

    if (name === "amount") {
      const newTotalFee = newFeeAmountSplitup.reduce((sum: number, splitup: any) => {
        return sum + (parseFloat(splitup.amount) || 0);
      }, 0);

      setFeeStructureData({
        ...feeStructureData,
        feeAmountSplitup: newFeeAmountSplitup,
        totalFee: newTotalFee.toFixed(2)
      });
    } else {
      setFeeStructureData({
        ...feeStructureData,
        feeAmountSplitup: newFeeAmountSplitup
      });
    }
  };

  const addFeeAmountSplitup = () => {
    const hasDuplicateFeeTypes = feeStructureData.feeAmountSplitup.some((splitup: any, index: number) =>
      !isFeeTypeUnique(splitup.feeType, index)
    );

    if (hasDuplicateFeeTypes) {
      toast.error("Please fix duplicate fee types before adding a new fee.");
      return;
    }

    setFeeStructureData({
      ...feeStructureData,
      feeAmountSplitup: [...feeStructureData.feeAmountSplitup, { feeType: '', amount: '' }],
    });
  };

  const removeFeeAmountSplitup = (index: number) => {
    const newFeeAmountSplitup = [...feeStructureData.feeAmountSplitup];
    newFeeAmountSplitup.splice(index, 1);
    const newTotalFee = newFeeAmountSplitup.reduce((sum: number, splitup: any) => {
      return sum + (parseFloat(splitup.amount) || 0);
    }, 0);
    setFeeStructureData({
      ...feeStructureData,
      feeAmountSplitup: newFeeAmountSplitup,
      totalFee: newTotalFee.toFixed(2)
    });
  };

  const isFeeTypeUnique = (newFeeType: string, currentIndex: number) => {
    if (!newFeeType) return true;
    return !feeStructureData.feeAmountSplitup.some((splitup: any, index: number) =>
      splitup.feeType === newFeeType && index !== currentIndex
    );
  };

  const onReturn = () => {
    navigate("/lookups/fee-structures");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const feeTypes = feeStructureData.feeAmountSplitup.map((splitup: any) => splitup.feeType);
    const uniqueFeeTypes = new Set(feeTypes);
    if (feeTypes.length !== uniqueFeeTypes.size) {
      toast.error("Each fee type should be added only once. Please make sure all fee types are different.");
      return;
    }

    if (!feeStructureData.feeName || !feeStructureData.academicYear || !feeStructureData.class) {
      toast.error("Please fill all required fields.");
      return;
    }

    const incompleteSplitups = feeStructureData.feeAmountSplitup.some(
      (splitup: any) => !splitup.feeType || !splitup.amount
    );
    if (incompleteSplitups) {
      toast.error("Please complete all fee splitup fields.");
      return;
    }

    try {
      const payload: any = {
        feeName: feeStructureData.feeName,
        academicYear: feeStructureData.academicYear,
        class: feeStructureData.class,
        student: studentsOptions.map((student: any) => ({
          student: student._id
        })),
        feeAmountSplitup: feeStructureData.feeAmountSplitup.map((splitup: any) => ({
          feeType: splitup.feeType,
          amount: parseFloat(splitup.amount),
        })),
        totalFee: parseFloat(feeStructureData.totalFee),
      };

      const response: any = await updateFeeStructureById(id as string, payload);
      if (response.success) {
        toast.success(response.message || 'Fee structure updated successfully');
        navigate('/lookups/fee-structures');
      } else {
        toast.error(response.message || 'Failed to update fee structure');
      }
    } catch (error) {
      console.error('Error updating fee structure:', error);
      toast.error('An error occurred while updating the fee structure');
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Fee Structure", path: "/lookups/fee-structures" },
    { label: "Edit Fee Structure", path: "" },
  ];

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Edit Fee Structure</h3>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <button
          className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
          onClick={onReturn}
        >
          <TbArrowBackUp size={20} className="mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <AcademicYearDropdown
                value={feeStructureData.academicYear}
                onChange={(value) =>
                  setFeeStructureData((prev: any) => ({
                    ...prev,
                    academicYear: value
                  }))
                }
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={feeStructureData.class}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="feeName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={feeStructureData.feeName}
                onChange={handleChange}
                required
                placeholder="Enter fee name"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Fee Breakdown</h4>

            <div className="space-y-4">
              {feeStructureData.feeAmountSplitup.map((splitup: any, index: number) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="feeType"
                      value={splitup.feeType}
                      onChange={(e) => handleFeeAmountChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Fee Type</option>
                      {feeTypes.map((type: any) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={splitup.amount}
                        onChange={(e) => handleFeeAmountChange(index, e)}
                        placeholder="0.00"
                        className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  {feeStructureData.feeAmountSplitup.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeeAmountSplitup(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
                      title="Remove fee"
                    >
                      <MdOutlineCancel size={22} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addFeeAmountSplitup}
              className="mt-4 flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors duration-200"
            >
              <IoMdAddCircleOutline size={20} className="mr-2" />
              Add Another Fee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Fee <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="totalFee"
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={feeStructureData.totalFee}
                  readOnly
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onReturn}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FcCancel size={18} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <IoCheckmarkDoneCircleOutline size={18} className="mr-2" />
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFeeStructure;