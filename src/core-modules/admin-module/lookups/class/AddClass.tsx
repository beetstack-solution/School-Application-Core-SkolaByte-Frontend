import { createClass } from '@/api/admin-api/lookups-api/classApi';
import React, { useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface AddClassProps {
    onClose: () => void; 
    onReload: () => void; 
  }
  
  const AddClass: React.FC<AddClassProps> = ({ onClose, onReload }) => {
    const [className, setClassName] = useState<string>(''); 
    const [displayName, setDisplayName] = useState<string>('');
    const [error, setError] = useState<string>(''); 
  
    // Handle input change for class name
    const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setClassName(e.target.value);
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayName(e.target.value);
    };
  
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(''); 
  
      // Validate input
      if (!className.trim() || !displayName.trim()) {
        setError('Please provide both class name and display name.');
        return;
      }
      const classModuleData = {
        name: className.trim(), 
        displayName: displayName.trim(),
      };
      try {
        const response = await createClass(classModuleData as any);
        if (response.success) {
          toast.success(response.message || 'Class module created successfully!');
          onReload(); 
          onClose(); 
        } else {

          console.error('Error in API response:', response.message);
          toast.error(response.message || 'Failed to create class module.');
          setError(response.message || 'Failed to create class module.');
        }
      } catch (error: any) {
        console.error('Error creating class module:', error);
        // toast.error('Failed to create class module. Please try again.');
        setError('Failed to create class module. Please try again.');
      }
    };
  
    return (
      <div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add Class Module</h2>
          <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
        </div>
        {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class Name <span className="text-red-500">*</span>
              </label>
            <input
              value={className}
              onChange={handleClassNameChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
          <input
            value={displayName}
            onChange={handleDisplayNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter display name"
            required
          />
        </div>
          <div className="flex justify-end space-x-4 items-center">
            <div className="flex space-x-2">
              <button type="submit" className="submit-btn flex items-center">
                <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                Submit
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
  
  export default AddClass;