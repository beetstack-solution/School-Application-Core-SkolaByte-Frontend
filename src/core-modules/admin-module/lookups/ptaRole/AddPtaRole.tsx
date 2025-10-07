import React, { useState } from 'react'
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { createPtaRole } from '@/api/admin-api/lookups-api/ptaRolesApi';

interface AddFeeInstallmentTypeProps {
    onClose: () => void;
    onReload: () => void;
}

const AddPtaRole: React.FC<AddFeeInstallmentTypeProps> = ({ onClose, onReload }) => {
    const [type, setType] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const feeTypeData: any = {
            name: type,
        };

        try {
            const response: any = await createPtaRole(feeTypeData);
            if (response.success) {
                toast.success(response.message || 'PTA Role created successfully!');
                onReload();
                onClose();
            } else {
                console.error('Error in API response:', response.message);
                toast.error(response.message || 'Failed to create PTA Role.');
                setError(response.message || 'Failed to create PTA Role.');
            }
        } catch (error: any) {
            console.error('Error creating PTA Role:', error);
            setError('Failed to create PTA Role. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl  p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add PTA Role</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Close"
                >
                    <IoIosCloseCircleOutline className="text-2xl" />
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        PTA Role <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Enter PTA Role"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        <FcCancel className="mr-2" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !type.trim()}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <IoCheckmarkDoneCircleOutline className="mr-2" />
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPtaRole;