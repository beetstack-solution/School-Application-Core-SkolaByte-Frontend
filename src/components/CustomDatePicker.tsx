import React, { useState } from 'react';
import '@/assets/css/datepickerStyles.css';

interface DateRangePickerProps {
  label: string;
  handleFromDateChanges: any;
  handleToDateChanges: any;
  handleFilterWithDate:any
}

const CustomDatePicker: React.FC<DateRangePickerProps> = ({
  label,
  handleFromDateChanges,
  handleToDateChanges,
  handleFilterWithDate,
}) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFromDate(date);
    handleFromDateChanges(date ? new Date(date) : null);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setToDate(date);
    handleToDateChanges(date ? new Date(date) : null);
  };

  return (
    <>
      <div className="custom-date-range-picker border border-gray-600 p-2 rounded">
        <label className="custom-date-range-label">Period</label>
        <div className="date-range-inputs">
          {/* From Date */}
          <div className="date-input-container">
            <label htmlFor="" className="text-xs text-gray-200">
              From
            </label>
            <input
              type="text"
              className={`custom-date-input ${!fromDate ? "empty" : ""}`}
              placeholder="From"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>

          {/* To Date */}
          <div className="date-input-container">
            <label htmlFor="" className="text-xs text-gray-200">
              To
            </label>
            <input
              type="text"
              className={`custom-date-input ${!toDate ? "empty" : ""}`}
              placeholder="To"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={toDate}
              onChange={handleToDateChange}
            />
          </div>
        </div>
        <button onClick={()=>{
          handleFilterWithDate()
        }} className="ms-auto small-btn">
          OK
        </button>
      </div>
    </>
  );
};

export default CustomDatePicker;
