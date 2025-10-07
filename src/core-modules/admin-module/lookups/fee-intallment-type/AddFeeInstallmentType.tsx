import React, { useState } from 'react'
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { createFeeInstallmentType } from '@/api/admin-api/lookups-api/feeInstallmentTypeApi';

interface InstallmentField {
  installmentName: string;
  startDate: string;
  endDate: string;
}

interface AddFeeInstallmentTypeProps {
  onClose: () => void;
  onReload: () => void;
}

const AddFeeInstallmentType: React.FC<AddFeeInstallmentTypeProps> = ({ onClose, onReload }) => {
  const [type, setType] = useState<string>('');
  const [noOfFeeInstallments, setNoOfFeeInstallments] = useState<number>(0);
  const [installmentFields, setInstallmentFields] = useState<InstallmentField[]>([]);
  const [error, setError] = useState<string>('');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setError('');

    let fields: InstallmentField[] = [];
    let installments = 0;

    switch (selectedType) {
      case 'Quarter':
        installments = 3;
        fields = Array(3).fill({ installmentName: '', startDate: '', endDate: '' });
        break;
      case 'Half Year':
        installments = 2;
        fields = Array(2).fill({ installmentName: '', startDate: '', endDate: '' });
        break;
      case 'Full Payment':
        installments = 1;
        fields = Array(1).fill({ installmentName: '', startDate: '', endDate: '' });
        break;
      default:
        installments = 0;
    }

    setNoOfFeeInstallments(installments);
    setInstallmentFields(fields);
  };

  const handleFieldChange = (index: number, field: keyof InstallmentField, value: string) => {
    const updatedFields = [...installmentFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    setInstallmentFields(updatedFields);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!type) {
      setError('Please select a fee installment type.');
      return;
    }

    // Validate all fields are filled
    const hasEmptyFields = installmentFields.some(field =>
      !field.installmentName.trim() || !field.startDate || !field.endDate
    );

    if (hasEmptyFields) {
      setError('Please fill all installment fields.');
      return;
    }

    const feeInstallmentTypeData:any = {
      name: type,
      noOfFeeInstallments,
      date: installmentFields
    };

    try {
      const response = await createFeeInstallmentType(feeInstallmentTypeData);
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
        <h2 className="text-xl font-bold mb-4">Add Fee Installment Type</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fee Installment Type <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Type</option>
            <option value="Quarter">Quarter</option>
            <option value="Half Year">Half Year</option>
            <option value="Full Payment">Full Payment</option>
          </select>
        </div>

        {type && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Number of Installments: {noOfFeeInstallments}
            </label>
          </div>
        )}

        {installmentFields.map((field, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg">
            <h3 className="font-bold mb-3">Installment {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Installment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={field.installmentName}
                  onChange={(e) => handleFieldChange(index, 'installmentName', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., First Installment"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={field.startDate}
                  onChange={(e) => handleFieldChange(index, 'startDate', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={field.endDate}
                  onChange={(e) => handleFieldChange(index, 'endDate', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}

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

export default AddFeeInstallmentType;