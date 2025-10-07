import { RiCloseLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import {
  fetchClasses,
  fetchDivisionsDD,
  fetchAcademicYear,
} from "@/api/common-api/commonDropDownApi";

interface FilterationTabProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    academicYear?: string;
    class?: string;
    division?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onClear: () => void;
  initialFilters?: {
    academicYear?: string;
    class?: string;
    division?: string;
    startDate?: string;
    endDate?: string;
  };
    showDateFilters?: boolean;
    showDivisionFilter?: boolean;
}


export default function FilterationTab({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialFilters = {
    academicYear: "",
    class: "",
    division: "",
    startDate: "",
    endDate: "",
  },
   showDateFilters = true,
  showDivisionFilter = true,
}: FilterationTabProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(initialFilters);
  const [academicYearOptions, setAcademicYearOptions] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);

  const fetchOptions = async () => {
    try {
      const [academicYearResponse, classResponse, divisionResponse] = await Promise.all([
        fetchAcademicYear(),
        fetchClasses(),
        fetchDivisionsDD()
      ]);
      setAcademicYearOptions(academicYearResponse.data);
      setClassOptions(classResponse.data);
      setDivisionOptions(divisionResponse.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    setFormData(initialFilters);
  }, [initialFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(formData);
    onClose();
  };

  const handleClear = () => {
    setFormData({
      academicYear: "",
      class: "",
      division: "",
      startDate: "",
      endDate: "",
    });
    onClear();
    onClose();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={panelRef}
      className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-4 overflow-y-auto
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <RiCloseLine size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year
          </label>
          <select
            name="academicYear"
            value={formData.academicYear}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Academic Year</option>
            {academicYearOptions.map((option: any) => (
              <option key={option._id} value={option._id}>
                {option.academicYear}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Name
          </label>
          <select
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class Name</option>
            {classOptions.map((option: any) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        
       {showDivisionFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Division</option>
              {divisionOptions.map((option: any) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select> 
          </div>
        )}
        
         {showDateFilters && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button
          onClick={handleApply}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-md transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}