import React, { useState } from 'react'
import { motion } from "framer-motion";
import { FcCancel } from 'react-icons/fc';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { createTimeSlot } from '@/api/admin-api/lookups-api/timeSlotApi';

interface AddTimeSlotProps {
  onClose: () => void;
  onReload: () => void;
}

const AddTimeSlot: React.FC<AddTimeSlotProps> = ({ onClose, onReload }) => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const timeSlotData:any = {
      startTime,
      endTime,
      isBreak
    };

    try {
      const response:any = await createTimeSlot(timeSlotData);
      if (response.success) {
        toast.success(response.message || 'Time slot created successfully!');
        onReload();
        onClose();
      } else {
        console.error('Error in API response:', response.message);
        toast.error(response.message || 'Failed to create time slot.');
        setError(response.message || 'Failed to create time slot.');
      }
    } catch (error: any) {
      console.error('Error creating time slot:', error);
      setError('Failed to create time slot. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Time Slot</h2>
        <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <motion.div 
      className="mb-4 flex items-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="flex items-center"
        initial={false}
        animate={{
          backgroundColor: isBreak ? "#3b82f6" : "#fff",
          borderColor: isBreak ? "#3b82f6" : "#d1d5db",
        }}
        transition={{ duration: 0.2 }}
        style={{
          padding: '0.5rem',
          borderRadius: '0.5rem',
          borderWidth: '1px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          type="checkbox"
          id="isBreak"
          checked={isBreak}
          onChange={(e) => setIsBreak(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded transition-colors"
          style={{
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        />
        <motion.label
          htmlFor="isBreak"
          className="block text-sm"
          animate={{
            color: isBreak ? "#fff" : "#374151",
          }}
          transition={{ duration: 0.2 }}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          Mark as Break Slot
        </motion.label>
      </motion.div>
    </motion.div>
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

export default AddTimeSlot;