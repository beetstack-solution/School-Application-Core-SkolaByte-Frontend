import { getPaymentById } from "@/api/admin-api/lookups-api/paymentApi";
import Breadcrumb from "@/components/Breadcumb";
import React, { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
function ViewPayment() {
  const { id } = useParams<{ id: string }>();
  const [paymentData, setPaymentData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const [downloadClicked, setDownloadClicked] = useState(false);
  const navigate = useNavigate();
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const fetchPaymentById = async (id: string) => {
    try {
      const responseData = await getPaymentById(id);
      if (responseData.success) {
        setPaymentData(responseData?.data);
      } else {
        setError("Payment data not found");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching payment data");
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadClick = () => {
    setShowDownloadConfirm(true);
    setDownloadClicked(false);
  };
  const confirmDownload = () => {
    setDownloadClicked(true);
    setTimeout(() => {
      setShowDownloadConfirm(false);
      setDownloadClicked(false);
    }, 3000);
  };

  const cancelDownload = () => {
    setShowDownloadConfirm(false);
    setDownloadClicked(false);
  };
  useEffect(() => {
    if (id) {
      fetchPaymentById(id);
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 my-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );

  const onReturn = () => {
    navigate("/lookups/payments");
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Payments", path: "/lookups/payments" },
    { label: "View Payments", path: "" },
  ];

  // Reusable DetailRow component for consistent styling
function DetailRow({ label, value, capitalize = false }: { label: string, value: string, capitalize?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className={`text-gray-800 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}

  return (
<div className="container mx-auto p-4">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-6 py-4 bg-white rounded-lg shadow-sm">
    <div>
      <h3 className="text-2xl font-bold text-gray-800">View Payment Details</h3>
      <div className="mt-2">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>

    <div className="flex gap-3">
      <button
        className="add-btn"
     onClick={onReturn}
      >
        <TbArrowBackUp size={20} className="mr-2" />
        Back
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        onClick={handleDownloadClick}
      >
        <FaFilePdf size={20} />
        Download Pay Slip
      </button>
    </div>
  </div>

  {/* Download Confirmation Modal */}
  {showDownloadConfirm && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 pt-12">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            {downloadClicked ? (
              <img
                src="https://pub-7919446e36f4478fb63336bce154bb78.r2.dev/itsme/uploads/buckets/1745999502974-Animation%20-%201745998878638%20(1).gif"
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
            {downloadClicked ? "Downloading..." : "Confirm Download"}
          </h3>
          {!downloadClicked && (
            <p className="text-gray-600 mb-6">Download Pay Slip?</p>
          )}
        </div>
        {!downloadClicked && (
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={cancelDownload}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={confirmDownload}
            >
              Download Now
            </button>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Payment Details Card */}
  {paymentData && (
    <div className="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
      {/* Payment Information Section */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Payment Information</h4>
        <div className="space-y-4">
          <DetailRow label="Payment Status" value={paymentData?.paymentStatus || "N/A"} capitalize />
          <DetailRow label="Fee Name" value={paymentData?.feeStructure.name || "N/A"} capitalize />
          <DetailRow label="Payment Date" value={new Date(paymentData.paymentDate).toLocaleDateString() || "N/A"} />
          <DetailRow label="Total Fee Amount" value={paymentData?.amountPaid ? `₹${paymentData.amountPaid.toLocaleString()}` : "N/A"} />
        </div>
      </div>

      {/* Student Details Section */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Student Details</h4>
        <div className="space-y-4">
          <DetailRow label="Student Name" value={paymentData?.student.name || "N/A"} />
          <DetailRow label="Roll Number" value={paymentData?.student.rollNumber || "N/A"} />
        </div>
      </div>

      {/* Installment Details Section */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Installment Details</h4>
        <div className="space-y-4">
          <DetailRow label="Installment Type" value={paymentData?.installmentName || "N/A"} />
          <DetailRow label="Mode of Payment" value={paymentData?.modeOfPayment || "N/A"} />
          <DetailRow label="Amount Paid" value={paymentData?.amountPaid || "N/A"} />
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default ViewPayment;
