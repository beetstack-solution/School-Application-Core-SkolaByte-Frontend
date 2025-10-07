import { getFeeInstallmentById } from '@/api/admin-api/lookups-api/feeInstallmentApi'
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect, useState } from 'react'
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa6";
function InfoRow({ label, value, highlight = false }: { label: string, value?: string | number, highlight?: boolean }) {
    return (
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`mt-1 text-sm ${highlight ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
          {value || "N/A"}
        </p>
      </div>
    );
  }
function ViewFeeInstallment() {
    const { id } = useParams<{ id: string }>(); 
     const navigate = useNavigate();
    const [feeInstallmentData, setFeeInstallmentData] = useState<any | null>(null);
    const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
    const [downloadClicked, setDownloadClicked] = useState(false);
    const fetchFeeInstallmentById = async (id: string) => {
        try {
            const responseData:any = await getFeeInstallmentById(id);
            if (responseData.success) {
                setFeeInstallmentData(responseData?.data);
            } else {
                console.error("Fee installment data not found");
            }
        }
        catch (error: any) {
            console.error("Error fetching fee installment data:", error);
        }   
    }
useEffect(() => {
    if (id) {
        fetchFeeInstallmentById(id);
    }
}, [id]);
    const onReturn = () => {
        navigate("/lookups/fee-installments");
    };
    const handleDownloadClick = () => {
        setShowDownloadConfirm(true);
        setDownloadClicked(false);
      };
    
      const confirmDownload = () => {
        setDownloadClicked(true);
        console.log('Downloading application form...');
        setTimeout(() => {
          setShowDownloadConfirm(false);
          setDownloadClicked(false);
        }, 3000);
      };
    
      const cancelDownload = () => {
        setShowDownloadConfirm(false);
        setDownloadClicked(false);
      };
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Fee Installment", path: "/lookups/fee-installments" },
        { label: "View Fee Installments", path: "" },
    ];
    return (
        <div className="container mx-auto p-2">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
          {/* Student Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-800 truncate">
              View Fee Installments
              </h1>
              {feeInstallmentData?.status !== undefined && (
                <span 
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    feeInstallmentData.status === true || "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                  aria-live="polite"
                >
                  {feeInstallmentData.status === true || "active" ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <nav className="mt-2" aria-label="Breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </nav>
          </div>
  
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              className='add-btn'
              onClick={onReturn}
              aria-label="Return to student list"
            >
              <TbArrowBackUp size={20} aria-hidden="true" />
              <span>List</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={handleDownloadClick}
              aria-label="Download application form"
            >
              <FaFilePdf size={20} aria-hidden="true" />
              <span>Download</span>
            </button>
          </div>
        </div>
        
        {showDownloadConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 pt-12">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
              <div className="flex flex-col items-center text-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  {downloadClicked ? (
                    <img 
                      src='https://pub-7919446e36f4478fb63336bce154bb78.r2.dev/itsme/uploads/buckets/1745999502974-Animation%20-%201745998878638%20(1).gif' 
                      alt="Downloading"
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <svg 
                      className="h-8 w-8 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {downloadClicked ? 'Downloading...' : 'Confirm Download'}
                </h3>
                {!downloadClicked && (
                  <p className="text-gray-600 mb-6">
                    Download application form for <span className="font-medium text-gray-800"></span>?
                  </p>
                )}
              </div>
              {!downloadClicked && (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                    onClick={cancelDownload}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r from-blue-600 to-blue-500"
                    onClick={confirmDownload}
                  >
                    Download Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Student Information Card */}
        {feeInstallmentData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {/* Personal Information */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Information
                </h3>
                <div className="space-y-4">
                  <InfoRow label="Code" value={feeInstallmentData.code} highlight/>
                  <InfoRow label="Academic Year" value={feeInstallmentData?.academicYear?.academicYear || "N/A"} />
                  <InfoRow label="No Of Installment" value= {feeInstallmentData?.noOfInstallment || "N/A"} />
                  <InfoRow label="Installment" value= {feeInstallmentData?.installments?.length > 0 ? (
                              feeInstallmentData.installments.map((feeInstallmentItem: any, index: number) => (
                                  <span key={feeInstallmentItem._id}>
                                      {feeInstallmentItem?.name || "N/A"}
                                      {index < feeInstallmentData.installments.length - 1 ? ", " : ""}
                                  </span>
                              ))
                          ) : (
                              "N/A"
                          )}/>
                         <InfoRow label="No Of Installment" value= {feeInstallmentData?.feeType?.name || "N/A"} />
                         <InfoRow label="Fee Installment" value={feeInstallmentData?.feeInstallmentType?.name || "N/A"} />

                </div>
              </div>
            </div>
          
            {/* System Information */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow label="Created By" value={feeInstallmentData.createdBy?.name} />
                <InfoRow 
                  label="Created At" 
                  value={feeInstallmentData.createdAt ? new Date(feeInstallmentData.createdAt).toLocaleDateString() : "N/A"} 
                />
              
                {feeInstallmentData.updatedBy && (
                  <InfoRow label="Updated By" value={feeInstallmentData.updatedBy.name} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default ViewFeeInstallment