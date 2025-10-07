import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSyllabousById } from '@/api/admin-api/lookups-api/syllabusApi';
import Breadcrumb from '@/components/Breadcumb';
import { TbArrowBackUp } from 'react-icons/tb';
import { FaFilePdf } from "react-icons/fa6";

function InfoRow({ label, value, highlight = false }: { label: string, value?: string | number, highlight?: boolean }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-sm ${highlight ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

const ViewSyllabus: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [syllabus, setSyllabus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Syllabus", path: "/lookups/syllabuses" },
    { label: "View Syllabus", path: "" },
  ];

  useEffect(() => {
    if (!id) {
      setError("Invalid syllabus ID");
      setLoading(false);
      return;
    }

    const fetchSyllabus = async () => {
      try {
        const response = await fetchSyllabousById(id);
        if (response.success) {
          setSyllabus(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch syllabus data");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [id]);

  const [downloadClicked, setDownloadClicked] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const handleDownloadClick = () => {
    setShowDownloadConfirm(true);
    setDownloadClicked(false);
  };

  const confirmDownload = () => {
    setDownloadClicked(true);
    console.log('Downloading syllabus...');
    // Add your actual download logic here
    setTimeout(() => {
      setShowDownloadConfirm(false);
      setDownloadClicked(false);
    }, 3000);
  };

  const cancelDownload = () => {
    setShowDownloadConfirm(false);
    setDownloadClicked(false);
  };

  const onReturn = () => navigate("/lookups/Syllabuses");

  if (loading) return <div className="flex justify-center items-center h-64">Loading syllabus details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  if (!syllabus) return <div className="container mx-auto p-4">No syllabus data found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-6 py-4 bg-white rounded-lg shadow">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800">
              Syllabus Details
              <span className="text-blue-600 ml-2">
                {syllabus.code}
              </span>
            </h1>
            {syllabus?.status !== undefined && (
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${syllabus.status === true || syllabus.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  }`}
              >
                {syllabus.status === true || syllabus.status === "active" ? "Active" : "Inactive"}
              </span>
            )}
          </div>
          <nav className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={onReturn}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <TbArrowBackUp size={20} />
            <span>Back to List</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleDownloadClick}
          >
            <FaFilePdf size={20} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Syllabus Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Basic Information
          </h3>
          <div className="space-y-4">
            <InfoRow label="Syllabus Code" value={syllabus.code} highlight />
            <InfoRow label="Academic Year" value={syllabus.academicYear?.academicYear} />
            <InfoRow label="Class" value={syllabus.class?.name} />
          </div>
        </div>

        {/* Academic Year Details */}
        {/* <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Academic Year Details
          </h3>
          <div className="space-y-4">
            <InfoRow label="Start Month" value={syllabus.academicYear?.startMonth} />
            <InfoRow label="End Month" value={syllabus.academicYear?.endMonth} />
          </div>
        </div> */}

        {/* System Information */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            System Information
          </h3>
          <div className="space-y-4">
            <InfoRow label="Created By" value={syllabus.createdBy?.name} />
            <InfoRow label="Created At" value={new Date(syllabus.createdAt).toLocaleString()} />
            {syllabus.updatedBy && Object.keys(syllabus.updatedBy).length > 0 && (
              <InfoRow label="Updated By" value={syllabus.updatedBy.name} />
            )}
          </div>
        </div>
      </div>

      {/* Subjects & Topics */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Subjects & Topics
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {syllabus.subjects.map((subject: any) => (
            <div key={subject.subject.id} className="p-6">
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800">
                  {subject.subject.name.name}
                  <span className="text-gray-500 font-normal ml-2">({subject.subject.name.code})</span>
                </h4>
              </div>

              {subject.topics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subject.topics.map((topic: any) => (
                        <tr key={topic._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.topicName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No topics added for this subject
                </div>
              )}
            </div>
          ))}
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
                  Download syllabus for <span className="font-medium text-gray-800">{syllabus.code}</span>?
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
    </div>
  );
};

export default ViewSyllabus;