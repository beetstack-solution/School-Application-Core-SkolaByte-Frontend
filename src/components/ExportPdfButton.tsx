import { RiFilePdfLine } from "react-icons/ri";
import { useState } from "react";

interface ExportPdfButtonProps {
    fileName?: string;
    className?: string;
    onBeforeExport?: () => void;
    onAfterExport?: () => void;
    fetchPdf: () => Promise<Blob>; // Accept a function that returns a PDF blob
    disabled?: boolean;
    position?: 'fixed' | 'absolute' | 'relative';
}

export default function ExportPdfButton({
    fileName = 'document',
    className = "",
    onBeforeExport,
    onAfterExport,
    fetchPdf,
    disabled = false,
    position = 'fixed'
}: ExportPdfButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            onBeforeExport?.();

            // Use the provided fetchPdf function
            const pdfBlob = await fetchPdf();

            // Create a download link
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            onAfterExport?.();
        } catch (error) {
            console.error("PDF export failed:", error);
        } finally {
            setTimeout(() => {
                setIsExporting(false);
                setShowDownloadConfirm(false);
            }, 1000);
        }
    };

    const cancelExport = () => {
        setShowDownloadConfirm(false);
    };
    const positionStyles = {
        fixed: 'fixed right-4 top-1/2 -translate-y-1/2',
        absolute: 'absolute right-4 top-1/2 -translate-y-1/2',
        relative: 'relative'
    };
    return (
        <>
            <button
                onClick={() => setShowDownloadConfirm(true)}
                disabled={isExporting || disabled}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                      ${positionStyles[position]}
                    flex items-center justify-center gap-2 
                    bg-red-600 hover:bg-red-700 text-white 
                    p-3 rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-200 ease-in-out
                    ${isHovered ? 'md:pr-4 md:rounded-full' : 'md:rounded-full'}
                    ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${className}
                `}
            >
                <RiFilePdfLine className="text-lg" />
                {isHovered && (
                    <span className="hidden md:inline text-sm font-medium">
                        {isExporting ? 'Exporting...' : 'Export to PDF'}
                    </span>
                )}
            </button>

            {showDownloadConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 pt-12">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
                        <div className="flex flex-col items-center text-center">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                {isExporting ? (
                                    <img
                                        src='https://pub-7919446e36f4478fb63336bce154bb78.r2.dev/itsme/uploads/buckets/1745999502974-Animation%20-%201745998878638%20(1).gif'
                                        alt="Exporting"
                                        className="h-16 w-16 rounded-full"
                                    />
                                ) : (
                                    <RiFilePdfLine className="h-8 w-8 text-red-600" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {isExporting ? 'Exporting PDF...' : 'Confirm PDF Export'}
                            </h3>
                            {!isExporting && (
                                <p className="text-gray-600 mb-6">
                                    Export content to PDF file?
                                </p>
                            )}
                        </div>
                        {!isExporting && (
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:shadow-md"
                                    onClick={cancelExport}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r from-red-600 to-red-500"
                                    onClick={handleExport}
                                >
                                    Export PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}