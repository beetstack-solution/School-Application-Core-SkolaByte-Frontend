import React, { useState, useEffect } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { fetchClassById, updateClassById } from '@/api/admin-api/lookups-api/classApi';
import { fetchEventById, updateEventById } from '@/api/admin-api/lookups-api/eventApi';
import { fetchEventTypesById, updateEventTypeById } from '@/api/admin-api/lookups-api/eventTypeApi';

interface EditClassProps {
  eventId: string;
  onClose: () => void; 
  onReload: () => void; 
}

const EditEventType: React.FC<EditClassProps> = ({ eventId,
    //  className,
      onClose, onReload }) => {
  const [typeName, setTypeName] = useState<string>(''); 
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>(''); 

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response:any = await fetchEventTypesById(eventId);
        if (response.success) {
            setTypeName(response.data?.name);
            setDescription(response.data?.description || '');
        } else {
          toast.error(response.message || 'Failed to fetch class data.');
        }
      } catch (error) {
        console.error('Error fetching event Type data:', error);
        toast.error('Error fetching event Type data. Please try again.');
      } 
    };

    fetchClassData();
  }, [eventId]);
  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeName(e.target.value);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError(''); 

     // Validate input
     if (!typeName.trim() || !description.trim()) {
      setError('Please provide both  name and description.');
      return;
    }
    const updatedClassData = {
        name: typeName.trim(),
        description: description.trim(),
    };
    try {

      const response = await updateEventTypeById(eventId, updatedClassData);

      if (response.success) {
        toast.success(response.message || 'Event Type module updated successfully!');
        onReload(); 
        onClose(); 
      } else {
        console.error('Error in API response:', response.message);
        toast.error(response.message || 'Failed to update Event Type module.');
        setError(response.message || 'Failed to update Event Type modulee.');
      }
    } catch (error: any) {
      console.error('Error updating class module:', error);
      // toast.error(error.message ||'Failed to update class module. Please try again.');
      setError('Failed to update Event Type module. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Class Module</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class Name <span className="text-red-500">*</span>
            </label>
          <input
            value={typeName}
            onChange={handleClassNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter class name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
          <input
            value={description}
            onChange={handleDisplayNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn flex items-center"
            >
              <FcCancel size={20} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEventType;
