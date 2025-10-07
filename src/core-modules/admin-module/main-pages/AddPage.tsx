import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import ReactDatePicker from "react-datepicker";
// import '../assets/css/datepickerStyles.css'
import "react-datepicker/dist/react-datepicker.css";
import '@/assets/css/popupStyles.css';

const AddPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  // popup
  const [isPopupOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isPopupOpen);
  };

  return (
    <>
      <div className="flex justify-between mt-4">
        <form className="w-full md:w-4/5 flex flex-col" onSubmit={handleSubmit}>
          {/* one row*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                First name
              </label>
            </div>

            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="lastName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Last name
              </label>
            </div>
          </div>

          {/* two row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Gender
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="male" className="mr-4 text-sm">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="female" className="text-sm">
                  Female
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Upload File
              </label>
              <input
                type="file"
                name="file"
                id="file"
                // onChange={handleFileChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              />
            </div>
          </div>

          {/* three row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                // value={formData.country}
                // onChange={handleChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              >
                <option value="">Select a country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
              </select>
            </div>

  
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Date
                </label>
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="block w-full py-2.5 px-3 text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
                  placeholderText="Select a date"
                  popperClassName="z-10" 
                />
              </div>
            </div>
  
          {/* two row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Gender
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="male" className="mr-4 text-sm">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="female" className="text-sm">
                  Female
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Upload File
              </label>
              <input
                type="file"
                name="file"
                id="file"
                // onChange={handleFileChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              />
            </div>
          </div>

          {/* three row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                // value={formData.country}
                // onChange={handleChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              >
                <option value="">Select a country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
              </select>
            </div>

  
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Date
                </label>
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="block w-full py-2.5 px-3 text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
                  placeholderText="Select a date"
                  popperClassName="z-10" 
                />
              </div>
            </div>
  
          {/* two row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Gender
              </label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="male" className="mr-4 text-sm">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="female" className="text-sm">
                  Female
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Upload File
              </label>
              <input
                type="file"
                name="file"
                id="file"
                // onChange={handleFileChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              />
            </div>
          </div>

          {/* three row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            
            <div className="relative z-0 mb-6 group">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                // value={formData.country}
                // onChange={handleChange}
                className="block py-2.5 px-3 w-full text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
              >
                <option value="">Select a country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
              </select>
            </div>

  
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Date
                </label>
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="block w-full py-2.5 px-3 text-sm bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-black-500 focus:outline-none focus:ring-0 focus:border-black-500"
                  placeholderText="Select a date"
                  popperClassName="z-10" 
                />
              </div>
            </div>
  

                {/* fourth row */}
   

          {/* Submit and Cancel Buttons Aligned Right */}
          <div className="flex flex-col sm:flex-row justify-end mt-4 gap-4">
            <button className="submit-btn" onClick={togglePopup}>
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
            </button>

            {isPopupOpen && (
            <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmation</h2>
            <p>Your submission was successful!</p>
           <div className="flex flex-col sm:flex-row justify-end"> <button className="cancel-btn" onClick={togglePopup}>Close</button></div>
            </div>
            </div>
            )}
            <button className="cancel-btn">
              <FcCancel size={20} className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPage;
