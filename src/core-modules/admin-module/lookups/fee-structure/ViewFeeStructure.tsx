import { fetchFeeStructureById } from '@/api/admin-api/lookups-api/feeStructureApi';
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect, useState } from 'react';
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSchoolOutline } from 'react-icons/io5';
import { FaRegCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsListCheck } from 'react-icons/bs';

function ViewFeeStructure() {
  const { id } = useParams<{ id: string }>();
  const [feeStructureData, setFeeStructureData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
 
  const getFeeStructureById = async (id: string) => {
    try {
      const responseData = await fetchFeeStructureById(id);
      if (responseData.success) {
        setFeeStructureData(responseData?.data);
      } else {
        setError("Fee structure data not found");
      }
    } catch (error: any) {
      console.error("Error fetching fee structure data:", error);
      setError(error.response?.data?.message || "Error fetching fee structure data");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (id) {
      getFeeStructureById(id);
    }
  }, [id]);
 
  const onReturn = () => {
    navigate("/lookups/fee-structures");
  };
 
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Fee Structures", path: "/lookups/fee-structures" },
    { label: "View Fee Structure", path: "" },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
 
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-4 my-6 rounded shadow">
      <div className="flex items-center">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
    </div>
  );
 
  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-1 mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">View Fee Structure</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="header-btns mt-3 md:mt-0">
          <button
            className="add-btn flex items-center"
            onClick={onReturn}
          >
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>
      </div>
 
      {/* Fee Structure Details */}
      {feeStructureData && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-3  shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h4 className="text-2xl font-bold text-white flex items-center gap-2">
              {feeStructureData?.feeName || "Fee Structure Details"}
            </h4>
            <div className="text-sm text-blue-100 flex flex-wrap gap-4">
              <span>
                <span className="font-medium text-white">Code:</span> {feeStructureData?.code || "N/A"}
              </span>
             
            </div>
          </div>
 
 
 
          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaRegCalendarAlt className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Academic Year</h5>
                      <p className="text-lg font-semibold text-gray-800">
                        {feeStructureData?.academicYear?.name || "N/A"}
                      </p>
                    </div>
                  </div>
 
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <IoSchoolOutline className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Class</h5>
                      <p className="text-lg font-semibold text-gray-800">
                        {feeStructureData?.class?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <FaUserGraduate className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Total Students</h5>
                      <p className="text-lg font-semibold text-gray-800">
                        {feeStructureData?.students?.length || 0} students
                      </p>
                    </div>
                  </div>
 
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <HiOutlineCurrencyRupee className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Total Fee</h5>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{feeStructureData?.totalFee?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Fee Breakdown Section */}
            <div className="mb-8">
              <h5 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center">
                <BsListCheck className="mr-2 text-blue-600" />
                Fee Breakdown
              </h5>
              <div className="space-y-2">
                {feeStructureData?.feeAmountSplitup?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-12 bg-gray-100 px-4 py-2 rounded-t-lg text-gray-600 font-medium">
                      <div className="col-span-7">Fee Type</div>
                      <div className="col-span-5 text-right">Amount</div>
                    </div>
                    {feeStructureData.feeAmountSplitup.map((splitup: any, index: number) => (
                      <div
                        key={index}
                        className={`grid grid-cols-12 px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b`}
                      >
                        <div className="col-span-7 text-gray-700 font-medium">
                          {splitup.feeType?.name || "Fee Type"}
                        </div>
                        <div className="col-span-5 text-right text-gray-800 font-semibold">
                          ₹{splitup.amount?.toLocaleString() || "0"}
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-12 bg-blue-50 px-4 py-3 rounded-b-lg border-t-2 border-blue-200">
                      <div className="col-span-7 text-blue-700 font-bold">Total</div>
                      <div className="col-span-5 text-right text-blue-700 font-bold">
                        ₹{feeStructureData?.totalFee?.toLocaleString() || "0"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500 italic">No fee breakdown available</p>
                  </div>
                )}
              </div>
            </div>
 
            {/* Students Section */}
            {/* <div>
              <h5 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center">
                <FaUserGraduate className="mr-2 text-purple-600" />
                Students Included ({feeStructureData?.students?.length || 0})
              </h5>
 
              {feeStructureData?.students?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {feeStructureData.students.map((student: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <FaUserGraduate className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {student.firstName} {student.lastName}
                          </p>
 
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 italic">No students included in this fee structure</p>
                </div>
              )}
            </div> */}
          </div>
 
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-sm text-gray-500 flex justify-between items-center">
              <span>Last updated: {new Date(feeStructureData?.userUpdatedDate || feeStructureData?.createdAt).toLocaleString()}</span>
              <span>Created At: {feeStructureData?.createdAt
                ? new Date(feeStructureData.createdAt).toLocaleDateString()
                : "N/A"}
              </span>
              <span>Updated by: {feeStructureData?.updatedBy?.name || feeStructureData?.createdBy?.name || "System"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default ViewFeeStructure;