// src/components/CustomDropdown.tsx
import { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

interface CustomDropdownProps {
  options: { value: any; label: string }[]; // Changed to 'any' to accept various value types
  value: any; // Changed to 'any' to match original types
  onChange: (value: any) => void; // Changed to 'any'
  placeholder?: string;
  className?: string;
}

export const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg border ${
          isOpen ? "border-green-600" : "border-gray-300"
        } bg-white focus:outline-none focus:ring-2 focus:ring-green-100`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${value === "" ? "text-gray-400" : "text-gray-700"}`}>
          {selectedOption}
        </span>
        <FiChevronDown 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180 text-green-600" : "text-gray-400"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white border border-gray-200 max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.label} // Using label as key since values might not be unique
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-green-50 ${
                  value === option.value ? "bg-green-100 text-green-700" : "text-gray-700"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};