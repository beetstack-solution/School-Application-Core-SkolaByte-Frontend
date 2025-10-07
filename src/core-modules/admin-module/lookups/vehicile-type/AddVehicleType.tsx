import React, { useState } from 'react'
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { createTransportVehicle } from '@/api/admin-api/lookups-api/vehicleTypeApi';

interface InstallmentField {
  installmentName: string;
  startDate: string;
  endDate: string;
}

interface AddFeeInstallmentTypeProps {
  onClose: () => void;
  onReload: () => void;
}

const AddVehicleType: React.FC<AddFeeInstallmentTypeProps> = ({ onClose, onReload }) => {
  const [type, setType] = useState<string>('');
  const [error, setError] = useState<string>('');





  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');



    const feeTypeData:any = {
      name: type,
      
    };

    try {
      const response:any = await createTransportVehicle(feeTypeData);
      if (response.success) {
        toast.success(response.message || 'Fee Installment Type created successfully!');
        onReload();
        onClose();
      } else {
        console.error('Error in API response:', response.message);
        toast.error(response.message || 'Failed to create fee installment type.');
        setError(response.message || 'Failed to create fee installment type.');
      }
    } catch (error: any) {
      console.error('Error creating fee installment type:', error);
      setError('Failed to create fee installment type. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-4">Add Transportation Type</h2>
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

export default AddVehicleType;