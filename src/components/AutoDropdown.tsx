import React, { useState } from "react";

function AutoDropdown() {
    const [options] = useState(["Ledger 1", "Ledger 2", "Ledger 3", "Ledger 4"]);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleInputChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setInputValue(value);
    
        // Filter options based on input
        setFilteredOptions(
          options.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          )
        );
    
        setIsDropdownOpen(true); // Open dropdown on input change
      };
    
      const handleOptionSelect = (option: React.SetStateAction<string>) => {
        setInputValue(option); // Set the selected value
        setIsDropdownOpen(false); // Close the dropdown
      };
    
  return (
    <div className="w-full sm:w-[250px]">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Select"
        className="p-1 border rounded-lg outline-none"
        onFocus={() => setIsDropdownOpen(true)}
      />

      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute sm:w-[250px] bg-white border rounded-lg shadow-lg max-h-40 overflow-auto z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* Close dropdown if no options match */}
      {isDropdownOpen && filteredOptions.length === 0 && (
        <p className="absolute w-full bg-white border rounded-lg shadow-lg text-center py-2 text-gray-500">
          No options found
        </p>
      )}
    </div>
  )
}

export default AutoDropdown