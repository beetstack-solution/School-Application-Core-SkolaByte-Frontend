import { RiFileExcel2Line } from "react-icons/ri";
import { useState } from "react";

interface ExportExcelButtonProps {
  onExport: () => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
}

export default function ExportExcelButton({ 
  onExport, 
  isLoading = false,
  className = ""
}: ExportExcelButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [downloadClicked, setDownloadClicked] = useState(false);

  const handleConfirm = async () => {
    setDownloadClicked(true);
    try {
      await onExport();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setTimeout(() => {
        setShowDownloadConfirm(false);
        setDownloadClicked(false);
      }, 1000);
    }
  };

  const cancelDownload = () => {
    setShowDownloadConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDownloadConfirm(true)}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed right-4 top-[60%] -translate-y-1/2
          flex items-center justify-center gap-2 
          bg-green-600 hover:bg-green-700 text-white 
          p-3 rounded-full shadow-lg hover:shadow-xl
          transition-all duration-200 ease-in-out
          z-30
          ${isHovered ? 'md:pr-4 md:rounded-full' : 'md:rounded-full'}
          ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <RiFileExcel2Line className="text-lg" />
        {isHovered && (
          <span className="hidden md:inline text-sm font-medium">
            {isLoading ? 'Exporting...' : 'Export to Excel'}
          </span>
        )}
      </button>

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
                {downloadClicked ? 'Exporting...' : 'Confirm Export'}
              </h3>
              {!downloadClicked && (
                <p className="text-gray-600 mb-6">
                  Export student data to Excel file?
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
                  onClick={handleConfirm}
                >
                  Export Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}