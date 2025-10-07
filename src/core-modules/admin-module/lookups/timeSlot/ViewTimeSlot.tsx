import { getTimeSlotById } from '@/api/admin-api/lookups-api/timeSlotApi';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FcClock } from 'react-icons/fc';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function ViewTimeSlot() {
  const { id } = useParams<{ id: string }>();
  const [timeSlot, setTimeSlot] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const fetchTimeSlotById = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await getTimeSlotById(id);
      if (response.success) {
        setTimeSlot(response.data);
        setError('');
      } else {
        console.error('Error in API response:', response.message);
        setError(response.message || 'Failed to fetch time slot');
        setTimeSlot(null);
      }
    } catch (error: any) {
      console.error('Error fetching time slot:', error);
      setError('Failed to fetch time slot. Please try again.');
      setTimeSlot(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTimeSlotById(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!timeSlot) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice: </strong>
        <span className="block sm:inline">No time slot data found.</span>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 bg-white rounded-lg shadow-md">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <IoIosArrowBack className="mr-1" /> Back
      </button>

      <div className="flex items-center mb-6">
        <FcClock className="text-4xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Time Slot Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Time Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-medium">{timeSlot.startTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-medium">{timeSlot.endTime}</p>
            </div>
           
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Metadata</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {format(new Date(timeSlot.createdAt), 'PPpp')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">
                {timeSlot.createdBy.name} ({timeSlot.createdBy.email})
              </p>
            </div>
            {/* {timeSlot.updatedBy && (
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(timeSlot.userUpdatedDate), 'PPpp')}
                </p>
                <p className="text-sm text-gray-500">Updated By</p>
                <p className="font-medium">
                  {timeSlot.updatedBy.name} ({timeSlot.updatedBy.email})
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate duration between two times


export default ViewTimeSlot;