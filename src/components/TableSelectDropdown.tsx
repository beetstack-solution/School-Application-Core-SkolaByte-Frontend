import React, { useState, useRef, useEffect } from "react";
import { LuListFilter } from "react-icons/lu";

function TableSelectDropdown() {
  const [options] = useState(["Ledger 1", "Ledger 2", "Ledger 3", "Ledger 4"]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setInputValue(selectedOptions.join(", "));
  }, [selectedOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

   
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    );

    setIsDropdownOpen(true); 
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions(
      (prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((item) => item !== option) 
          : [...prevSelected, option] 
    );
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]); 
    } else {
      setSelectedOptions(options); 
    }
  };

  const handleDropdownMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDropdownOpen(false); 
    }
  };

  return (
    <div
      className="relative w-full sm:w-[250px]"
      onBlur={handleBlur}
      tabIndex={0} // Makes the div focusable to detect blur
    >
  <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Filter By Item Name"
        className="w-full p-2 pl-10 border rounded-lg outline-none"
        onFocus={() => setIsDropdownOpen(true)}
      />
      {/* Icon inside the input */}
      <LuListFilter className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-auto z-10"
          onMouseDown={handleDropdownMouseDown}
        >
          {/* Select All Option */}
          <div className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100">
            <input
              type="checkbox"
              checked={selectedOptions.length === options.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            Select All
          </div>

          {/* Individual Options */}
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TableSelectDropdown;
