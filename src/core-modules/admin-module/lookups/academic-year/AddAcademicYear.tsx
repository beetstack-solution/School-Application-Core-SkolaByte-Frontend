import { createAcademicYear } from '@/api/admin-api/lookups-api/academicYearApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

// Define the Month enum in the frontend
enum Month {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12,
}

// Map enum values to user-friendly labels
const monthOptions = [
  { value: Month.JANUARY, label: 'January' },
  { value: Month.FEBRUARY, label: 'February' },
  { value: Month.MARCH, label: 'March' },
  { value: Month.APRIL, label: 'April' },
  { value: Month.MAY, label: 'May' },
  { value: Month.JUNE, label: 'June' },
  { value: Month.JULY, label: 'July' },
  { value: Month.AUGUST, label: 'August' },
  { value: Month.SEPTEMBER, label: 'September' },
  { value: Month.OCTOBER, label: 'October' },
  { value: Month.NOVEMBER, label: 'November' },
  { value: Month.DECEMBER, label: 'December' },
];

interface AddAcademicYearProps {
  onClose: () => void;
  onReload: () => void;
}

const AddAcademicYear: React.FC<AddAcademicYearProps> = ({ onClose, onReload }) => {
  const [academicYear, setAcademicYear] = useState<string>('');
  const [startMonth, setStartMonth] = useState<Month | ''>('');
  const [endMonth, setEndMonth] = useState<Month | ''>('');
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate(); 

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
  };

  const handleMonthChange = (setter: React.Dispatch<React.SetStateAction<Month | ''>>) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setter(Number(e.target.value) as Month);
  };


  const isValidAcademicYear = (year: string) => /^\d{4}-\d{4}$/.test(year);
  const isValidMonth = (month: string) => /^[A-Za-z]+$/.test(month);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!academicYear.trim() || !startMonth || !endMonth) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidAcademicYear(academicYear)) {
      setError('Academic Year must be in YYYY-YYYY format.');
      return;
    }

    const academicYearData = {
      code: academicYear.trim(),
      academicYear: academicYear.trim(),
      startMonth: startMonth,
      endMonth: endMonth,
    };

    try {
      const response = await createAcademicYear(academicYearData as any);
      if (response.success) {
        toast.success('Academic Year created successfully!');
     
        navigate('/lookups/academic-years'); 
        onReload();
        onClose();
      } else {
        toast.error(response.message || 'Failed to create Academic Year.');
        setError(response.message || 'Failed to create Academic Year.');
      }
    } catch (error: any) {
      setError('Failed to create Academic Year. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Academic Year</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {/* {error && <div className="mb-4 text-red-500">{error}</div>} */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Academic Year <span className="text-red-500">*</span>
            </label>
          <input
            value={academicYear}
            onChange={handleInputChange(setAcademicYear)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="YYYY-YYYY"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Month <span className="text-red-500">*</span>
            </label>
          <select
            value={startMonth}
            onChange={handleMonthChange(setStartMonth)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Start Month</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Month <span className="text-red-500">*</span>
            </label>
          <select
            value={endMonth}
            onChange={handleMonthChange(setEndMonth)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select End Month</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
            </button>
            <button type="button" onClick={onClose} className="cancel-btn flex items-center">
              <FcCancel size={20} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAcademicYear;
