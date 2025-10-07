import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import { fetchTeacherById } from '@/api/admin-api/lookups-api/teachersApi';
import Breadcrumb from '@/components/Breadcumb';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ViewTeacher() {
  const { id } = useParams<{ id: string }>();
  const [teacherData, setTeacherData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getTeacherById = async (id: string) => {
    try {
      const responseData = await fetchTeacherById(id);
      if (responseData.success) {
        setTeacherData(responseData?.data);
      } else {
        setError('Teacher data not found');
      }
    } catch (error: any) {
      console.error('Error fetching teacher data:', error);
      setError(error.response?.data?.message || 'Error fetching teacher data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getTeacherById(id);
    }
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto mt-8 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  const onReturn = () => {
    navigate('/lookups/teachers');
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Teachers', path: '/lookups/teachers' },
    { label: 'View Teacher', path: '' },
  ];

  return (
    <div className=" mx-auto p-4 md:p-6 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">Teacher Details</h3>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <button
          onClick={onReturn}
          className="add-btn"
        >
          <TbArrowBackUp size={20} className="mr-2" />
          Back
        </button>
      </div>

      {teacherData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with image and basic info */}
          <div className="flex flex-col md:flex-row border-b border-gray-200 p-4 bg-gray-50">
            {teacherData.imageUrl && (
              <div className="w-24 h-24 md:mr-4 mb-4 md:mb-0 flex-shrink-0">
                <img
                  src={`${teacherData.imageUrl}`}
                  alt={`${teacherData.name}'s profile`}
                  className="w-full h-full object-cover rounded-md"
                  
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{teacherData?.name || 'N/A'}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                  {teacherData?.code || "N/A"}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded ${teacherData.status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {teacherData.status ? 'Active' : 'Inactive'}
                </span>
                {teacherData?.isClassTeacher && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded">
                    Class Teacher
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main content as a list */}
          <div className="divide-y divide-gray-200">
            {/* Personal Information */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 lowercase">{teacherData?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800">{teacherData?.contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-800 capitalize">{teacherData?.gender || 'N/A'}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800 whitespace-pre-line">{teacherData?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="text-gray-800">
                    {teacherData?.academicYear?.academicYear || 'N/A'}
                  </p>
                </div>
               
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="text-gray-800 capitalize">
                        {teacherData?.class?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Division</p>
                      <p className="text-gray-800 capitalize">
                        {teacherData?.division?.name || 'N/A'}
                      </p>
                    </div>
                
              </div>
            </div>

            {/* System Information */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-gray-800">
                    {teacherData?.createdBy?.name || 'System'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-800">
                    {teacherData?.createdAt ? new Date(teacherData.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
                {teacherData?.updatedBy && (
                  <div>
                    <p className="text-sm text-gray-500">Updated By</p>
                    <p className="text-gray-800">
                      {teacherData.updatedBy.name}
                    </p>
                  </div>
                )}
                {teacherData?.userUpdatedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p className="text-gray-800">
                      {new Date(teacherData.userUpdatedDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTeacher;