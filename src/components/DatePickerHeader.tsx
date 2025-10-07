import React, { useState } from 'react';

interface DatePickerHeaderProps {
  onDateChange?: (date: Date) => void;
}

function DatePickerHeader({ onDateChange }: DatePickerHeaderProps) {
  // Initialize with today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate:any = e.target.value;
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className="flex items-center px-2">
      <label className="block text-sm font-bold">Date:</label>
      <input
        type="date"
        name="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="w-full sm:w-[250px] p-2 me-2 border rounded-lg outline-none"
      />
    </div>
  );
}

export default DatePickerHeader;
