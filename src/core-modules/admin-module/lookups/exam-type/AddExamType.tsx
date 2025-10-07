import React, { useState } from 'react';
import { createExamType } from '@/api/admin-api/lookups-api/examTypeApi'; 
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface AddExamTypeProps {
    onClose: () => void; 
    onReload: () => void; 
}

const AddExamType: React.FC<AddExamTypeProps> = ({ onClose, onReload }) => {
    const [examTypeName, setExamTypeName] = useState<string>(''); 
    const [error, setError] = useState<string>('');

    // Handle input change for exam type name
    const handleExamTypeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExamTypeName(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); 

        // Validate input
        if (!examTypeName.trim()) {
            setError('Please provide an exam type name.');
            return;
        }

        const examTypeData = {
            name: examTypeName.trim(), 
        };

        try {
            const response = await createExamType(examTypeData as any); 
            if (response.success) {
                toast.success(response.message || 'Exam type created successfully!');
                onReload(); 
                onClose(); 
            } else {
                console.error('Error in API response:', response.message);
                toast.error(response.message || 'Failed to create exam type.');
                setError(response.message || 'Failed to create exam type.');
            }
        } catch (error: any) {
            console.error('Error creating exam type:', error);
            // toast.error('Failed to create exam type. Please try again.');
            setError('Failed to create exam type. Please try again.');
        }
    };

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Add Exam Type</h2>
                <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
            </div>
            {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Exam Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={examTypeName}
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

export default AddExamType;
