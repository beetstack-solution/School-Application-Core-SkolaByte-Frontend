import React, { useEffect, useState } from 'react'
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { fetchTransportVehiclesById, updateTransportVehicle } from '@/api/admin-api/lookups-api/vehicleTypeApi';



interface EditFeeTypeProps {
    onClose: () => void;
    onReload: () => void;
    feeTypeId?: any; // Optional prop to pass the fee type ID    
}

const EditVehicileType: React.FC<EditFeeTypeProps> = ({ onClose, onReload, feeTypeId }) => {
    const [type, setType] = useState<any>('');
    const [error, setError] = useState<string>('');



    const fetchFeeTypeById = async (id: string) => {
        try {
            const response: any = await fetchTransportVehiclesById(id);
            if (response.success) {
                setType(response.data.name);
            } else {
                console.error('Error in API response:', response.message);
                toast.error(response.message || 'Failed to fetch Transportation type.');
                setError(response.message || 'Failed to fetch Transportation type.');
            }
        } catch (error: any) {
            console.error('Error fetching Transportation type:', error);
            setError('Failed to fetch Transportation type. Please try again.');
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');



        const feeTypeData: any = {
            name: type,

        };

        try {

            const response: any = await updateTransportVehicle(feeTypeId, feeTypeData);
            if (response.success) {
                toast.success(response.message || 'Transportation Type created successfully!');
                onReload();
                onClose();
            } else {
                console.error('Error in API response:', response.message);
                toast.error(response.message || 'Failed to create Transportation type.');
                setError(response.message || 'Failed to create Transportation type.');
            }
        } catch (error: any) {
            console.error('Error creating Transportation type:', error);
            setError('Failed to create Transportation type. Please try again.');
        }
    };
    useEffect(() => {
        if (feeTypeId) {
            fetchFeeTypeById(feeTypeId);
        }
    }, [feeTypeId]);
    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Edit Transportation  Type</h2>
                <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
            </div>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Transportation  Type <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Enter Transportation Type"
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

export default EditVehicileType;