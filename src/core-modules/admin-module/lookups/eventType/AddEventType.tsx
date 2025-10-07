import { createClass } from '@/api/admin-api/lookups-api/classApi';
import { createEventType } from '@/api/admin-api/lookups-api/eventTypeApi';
import React, { useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface AddEventTypeProps {
    onClose: () => void;
    onReload: () => void;
}

const AddEventType: React.FC<AddEventTypeProps> = ({ onClose, onReload }) => {
    const [typeName, setTypeName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Handle input change for class name
    const handletypeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTypeName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validate input
        if (!typeName.trim() || !description.trim()) {
            setError('Please provide both class name and display name.');
            return;
        }
        const eventTypeModuleData = {
            name: typeName.trim(),
            description: description.trim(),
        };
        try {
            const response = await createEventType(eventTypeModuleData as any);
            if (response.success) {
                toast.success(response.message || 'Class module created successfully!');
                onReload();
                onClose();
            } else {

                console.error('Error in API response:', response.message);
                toast.error(response.message || 'Failed to create event type module.');
                setError(response.message || 'Failed to create event type module.');
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
                <h2 className="text-xl font-bold mb-4">Add Event Type</h2>
                <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
            </div>
            {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={typeName}
                        onChange={handletypeNameChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Type Name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <input
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter description"
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

export default AddEventType;