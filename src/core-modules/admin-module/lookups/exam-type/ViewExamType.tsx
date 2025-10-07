import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from 'react-icons/tb';
import { fetchExamTypeById } from '@/api/admin-api/lookups-api/examTypeApi'; 
import Breadcrumb from '@/components/Breadcumb';

function ViewExamType() {
  const { id } = useParams<{ id: string }>(); 
  const [examTypeData, setExamTypeData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getExamTypeById = async (id: string) => {
    try {
      const responseData = await fetchExamTypeById(id); 
      if (responseData.success) {
        setExamTypeData(responseData?.data); 
      } else {
        setError('Exam type data not found');
      }
    } catch (error: any) {
      console.error('Error fetching exam type data:', error);
      setError(error.response?.data?.message || 'Error fetching exam type data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getExamTypeById(id); 
    }
  }, [id]);


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const onReturn = () => {
    navigate('/lookups/exam-types'); 
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Exam Types', path: '/lookups/exam-types' },
    { label: 'View Exam Type', path: '' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">View Exam Type</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="header-btns flex gap-2 ">
          <div>
            <button className="add-btn" onClick={onReturn}>
              <TbArrowBackUp size={20} className="mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Display Exam Type Information */}
      {examTypeData && (
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold">Code</td>
              <td className="border px-4 py-2">{examTypeData?.code || "N/A"}</td>
            </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{examTypeData?.name || 'N/A'}</td>
              </tr>
              {examTypeData.nameAlias && (
                <tr>
                  <td className="border px-4 py-2 font-semibold">Alias</td>
                  <td className="border px-4 py-2">{examTypeData?.nameAlias || 'N/A'}</td>
                </tr>
              )}
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {examTypeData.status ? 'Active' : 'Inactive'}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created By</td>
                <td className="border px-4 py-2">{examTypeData?.createdBy?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {new Date(examTypeData?.createdAt).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Updated At</td>
                <td className="border px-4 py-2">
                  {new Date(examTypeData?.userUpdatedDate).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Updated By</td>
                <td className="border px-4 py-2">{examTypeData?.updatedBy?.name || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewExamType;
