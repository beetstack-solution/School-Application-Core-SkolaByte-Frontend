import React, { useState, useEffect } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { fetchExamTypeById, updateExamTypeById } from '@/api/admin-api/lookups-api/examTypeApi';

interface EditExamTypeProps {
  examTypeId: string;
  examTypeName: string;
  onClose: () => void;
  onReload: () => void;
}

const EditExamType: React.FC<EditExamTypeProps> = ({ examTypeId, examTypeName, onClose, onReload }) => {
  const [newExamTypeName, setNewExamTypeName] = useState<string>(examTypeName); 
  const [error, setError] = useState<string>(''); 

  useEffect(() => {
    const fetchExamTypeData = async () => {
      try {
        const response:any = await fetchExamTypeById(examTypeId);
        if (response.success) {
          setNewExamTypeName(response.data?.name); 
        } else {
          toast.error(response.message || 'Failed to fetch exam type data.');
        }
      } catch (error) {
        console.error('Error fetching exam type data:', error);
        toast.error('Error fetching exam type data. Please try again.');
      }
    };

    fetchExamTypeData();
  }, [examTypeId]);

  const handleExamTypeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExamTypeName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!newExamTypeName.trim()) {
      setError('Please provide a valid exam type name.');
      return;
    }
    const updatedExamTypeData = {
      name: newExamTypeName.trim(),
    };

    try {
      const response = await updateExamTypeById(examTypeId, updatedExamTypeData);

      if (response.success) {
        toast.success(response.message || 'Exam type updated successfully!');
        onReload(); 
        onClose(); 
      } else {
        console.error('Error in API response:', response.message);
        toast.error(response.message || 'Failed to update exam type.');
        setError(response.message || 'Failed to update exam type.');
      }
    } catch (error: any) {
      console.error('Error updating exam type:', error);
      // toast.error('Failed to update exam type. Please try again.');
      setError('Failed to update exam type. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Exam Type</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Exam Type Name <span className="text-red-500">*</span>
          </label>
          <input
            value={newExamTypeName}
            onChange={handleExamTypeNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter exam type name"
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

export default EditExamType;
