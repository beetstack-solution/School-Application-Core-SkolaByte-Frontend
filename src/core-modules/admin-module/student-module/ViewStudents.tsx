import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import { fetchStudentById, downloadStudentAdmissionSlip  } from '@/api/admin-api/student-management/students-api/studentsApi'; 
import Breadcrumb from '@/components/Breadcumb';
import { FaFilePdf } from "react-icons/fa6";
import { FiEdit } from 'react-icons/fi';
import { FaUserGraduate, FaUserFriends, FaInfoCircle } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reusable InfoRow component moved outside of main component
function InfoRow({ label, value, highlight = false }: { label: string, value?: string | number, highlight?: boolean }) {
  return (
    <div>
      <p className="text-base font-bold text-gray-700">{label}</p>
      <p className={`mt-1 text-sm ${highlight ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

function ViewStudent() {
  const { id } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = API_BASE_URL;

  const getStudentById = async (id: string) => {
    try {
      const responseData = await fetchStudentById(id);
      if (responseData.success) {
        setStudentData(responseData.data);
      } else {
        setError('Student data not found');
      }
    } catch (error: any) {
      console.error('Error fetching student data:', error);
      setError(error.response?.data?.message || 'Error fetching student data');
    } finally {
      setLoading(false);
    }
  };

  const onReturn = () => {
    navigate('/student-managements/students'); 
  };
  const returnToEdit = () => {
    navigate(`/student-managements/students/edit/${id}`);
  }
  const [downloadClicked, setDownloadClicked] = useState(false);
  const handleDownloadClick = () => {
    setShowDownloadConfirm(true);
    setDownloadClicked(false);
  };

const confirmDownload = async () => {
  if (!id) return;

  try {
    setDownloadClicked(true);

    const blob = await downloadStudentAdmissionSlip(id);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `admission-slip-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      setShowDownloadConfirm(false);
      setDownloadClicked(false);
    }, 2000);
  } catch (error: any) {
    console.error('Download error:', error);
    alert(error.message || 'Something went wrong while downloading.');
    setDownloadClicked(false);
  }
};

  const cancelDownload = () => {
    setShowDownloadConfirm(false);
    setDownloadClicked(false);
  };

  useEffect(() => {
    if (id) {
      getStudentById(id);
    }
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Students', path: '/student-managements/students' },
    { label: 'View Student', path: '' },
  ];

  return (
    <div className="container mx-auto p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
  {/* Student Info Section */}
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-3 flex-wrap">
      <h1 className="text-2xl font-bold text-gray-800 truncate">
        View Student: 
        <span className="text-blue-600 ml-2 capitalize">
        {studentData ? `${studentData.firstName} ${studentData.lastName}` : (
            <span className="animate-pulse">Loading...</span>
          )}
        </span>
      </h1>
      {studentData?.status !== undefined && (
        <span 
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
            studentData.status === true || studentData.status === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}
          aria-live="polite"
        >
          {studentData.status === true || studentData.status === "active" ? "Active" : "Inactive"}
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
      <span>Back</span>
    </button>

    <button 
      className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={returnToEdit}
      aria-label="Download application form"
    >
      <FiEdit size={20} aria-hidden="true" />
      <span>Edit</span>
    </button>
    
    <button 
      className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={handleDownloadClick}
      aria-label="Download application form"
    >
      <FaFilePdf size={20} aria-hidden="true" />
      <span>Application Form</span>
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
                  Download application form for <span className="font-medium text-gray-800">{studentData.firstName} {studentData.lastName}</span>?
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
      {studentData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {/* Personal Information */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <img 
                  src={`${studentData.imageUrl}`} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?uid=R175445859&ga=GA1.1.662587032.1739548584&semt=ais_hybrid&w=740";
                  }}
                />
                <InfoRow
                  label="Full Name"
                  value={`${studentData.firstName?.charAt(0).toUpperCase() + studentData.firstName?.slice(1)} ${studentData.lastName?.charAt(0).toUpperCase() + studentData.lastName?.slice(1)}`}
                  highlight
                />
                <InfoRow label="Roll Number" value={studentData.rollNumber} />
                <InfoRow label="Admission Number" value={studentData.admissionNumber} highlight />
                <InfoRow label="Age" value={studentData.age} />
                <InfoRow label="Date of Birth" value={studentData.dob ? new Date(studentData.dob).toLocaleDateString() : "N/A"} />
                <InfoRow label="Gender" value={studentData.gender} />
                <InfoRow label="Country" value={studentData.country} />
                <InfoRow label="State" value={studentData.state} />
                <InfoRow label="District" value={studentData.district} />
                <InfoRow label="City" value={studentData.city} />
                <InfoRow label="Zip Code" value={studentData.zipCode} />
                <InfoRow label="Address" value={studentData.houseName} />
              </div>
            </div>
        
            {/* Parent/Guardian Information */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <FaUserFriends className="text-purple-500" />
                Parent/Guardian Information
              </h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoRow label="Father's Name" value={studentData.parent?.fatherName} />
                <InfoRow label="Father's Contact" value={studentData.parent?.fatherContactNumber} />
                <div className="md:col-span-2">
                  <InfoRow label="Father's Occupation" value={studentData.parent?.fatherOccupation} />
                </div>
                <InfoRow label="Mother's Name" value={studentData.parent?.motherName} />
                <InfoRow label="Mother's Contact" value={studentData.parent?.motherContactNumber} />
                <div className="md:col-span-2">
                <InfoRow label="Mother's Occupation" value={studentData.parent?.motherOccupation} />
                </div>
                <div className="md:col-span-2">
                <InfoRow label="Parent's Email" value={studentData.parent?.parentEmail}  />
                </div>
                <div className="md:col-span-2">
                <hr />
                </div>
                {studentData.sibling === false && (
                  <>
                    <InfoRow label="Guardian's Name" value={studentData.guardian.guardianName} />
                    <InfoRow label="Guardian's Contact" value={studentData.guardian.contactNumber} />
                    <InfoRow label="Guardian's Relation" value={studentData.guardian.relation} />
                    <InfoRow label="Guardian's Email" value={studentData.guardian.email} />
                  </>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-6 border-b md:border-b-0 lg:border-r border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <FaUserGraduate className="text-green-600" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                <InfoRow
                  label="Academic Year"
                  //  (${studentData.academicYear.startMonth}-${studentData.academicYear.endMonth})
                  value={studentData.academicYear ? `${studentData.academicYear.academicYear}` :
                    "N/A"}
                />
                </div>
                <InfoRow label="Class" value={studentData.class?.name} />
                <InfoRow label="Division" value={studentData.division?.name} />
                
              </div>
            </div>
        
           

          </div>
        
          {/* System Information */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoRow label="Created By" value={studentData.createdBy?.name} />
              <InfoRow 
                label="Created At" 
                value={studentData.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : "N/A"} 
              />
              {studentData.updatedBy && (
                <InfoRow label="Updated By" value={studentData.updatedBy.name} />
              )}
              {studentData.updatedAt && (
                <InfoRow 
                  label="Updated At" 
                  value={new Date(studentData.updatedAt).toLocaleDateString()} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewStudent;