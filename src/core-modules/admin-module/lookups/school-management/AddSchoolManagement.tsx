import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { FcCancel } from 'react-icons/fc';
import Breadcrumb from '@/components/Breadcumb';
import { TbArrowBackUp } from 'react-icons/tb';
import { getDepartments } from '@/api/admin-api/lookups-api/departmentApi';
import { getDesignations } from '@/api/admin-api/lookups-api/designationApi';
import { createSchoolManagement } from '@/api/admin-api/lookups-api/schoolManagementApi';

function AddSchoolManagement() {
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        email: '',
        phone: '',
        joiningDate: '',
        department: '',
        qualification: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departmentOptions, setDepartmentOptions] = useState<any>([]);
    const [designationOptions, setDesignationOptions] = useState<any>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchDepartments = async () => {
        try {
            const response = await getDepartments(0, 0);
            setDepartmentOptions(response.data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };  

    useEffect(() => {
        fetchDepartments();
    }, []);
        
    const fetchDesignations = async () => {
        try {
            const response = await getDesignations(0, 0);
            setDesignationOptions(response.data.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };  

    useEffect(() => {
        fetchDesignations();
    }, []);
        
    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.designation) {
            newErrors.designation = 'Designation is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }
        if (!formData.joiningDate) {
            newErrors.joiningDate = 'Joining date is required';
        }
        if (!formData.department) {
            newErrors.department = 'Department is required';
        }
        if (!formData.qualification) {
            newErrors.qualification = 'Qualification is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
};
const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend:any = new FormData();
            
            // Append all form data
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            
            // Append file if exists
            if (file) {
                formDataToSend.append('file', file);
            }

            const response = await createSchoolManagement(formDataToSend);
            if (response.success) {
                toast.success(response.message || 'School management added successfully!');
                navigate('/lookups/school-management');
            } else {
                toast.error(response.message || 'Failed to add school management');
            }
        } catch (error: any) {
            console.error('Error submitting school management data:', error);
            toast.error(error.response?.data?.message || 'An error occurred while submitting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getError = (fieldName: string) => {
        return errors[fieldName] ? (
            <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
        ) : null;
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "School Management", path: "/lookups/school-management" },
        { label: "Add School Management", path: "" },
    ];

    return (
        <div className="mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Add School Management</h3>
                        <div className="breadcrumb-section">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <div className="header-btns">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            onClick={() => navigate(-1)}
                        >
                            <TbArrowBackUp size={20} className="mr-2" />
                            Back
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md" encType="multipart/form-data">
                    <div className="space-y-6">
                        <div className=" border-gray-200 pb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {getError('fullName')}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {getError('email')}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {getError('phone')}
                                </div>

                                {/* Joining Date */}
                                <div>
                                    <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
                                        Joining Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="joiningDate"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {getError('joiningDate')}
                                </div>

                                {/* Department */}
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select department</option>
                                        {departmentOptions.map((option: any) => (
                                            <option key={option._id} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getError('department')}
                                </div>

                                {/* Designation */}
                                <div>
                                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select designation</option>
                                        {designationOptions.map((option: any) => (
                                            <option key={option._id} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getError('designation')}
                                </div>

                                {/* Qualification */}
                                <div>
                                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                                        Qualification <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    {getError('qualification')}
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                        Profile Image
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                   {imagePreview && (
                                        <div className="mt-4">
                                            <div className="relative inline-block">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none"
                                                    title="Remove image"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6  border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/lookups/school-management')}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FcCancel size={18} className="mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <IoCheckmarkDoneCircleOutline size={18} className="mr-2" />
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSchoolManagement;