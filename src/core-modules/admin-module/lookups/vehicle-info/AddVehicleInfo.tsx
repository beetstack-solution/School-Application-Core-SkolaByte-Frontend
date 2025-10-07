import { createVehicle } from '@/api/admin-api/lookups-api/vehicleInfoApi';
import { fetchVehicleTypeDD } from '@/api/common-api/commonDropDownApi';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FormData {
    academicYear: string;
    vehicleInfo: {
        vehicleType: string;
        vehicleNumber: string;
        vehicleName: string;
    };
    driver: {
        name: string;
        mobileNumber: string;
        address: string;
        licenseNumber: string;
    };
    assistant: {
        name: string;
        mobileNumber: string;
    };
    route: {
        routeName: string;
        startTiming: string;
        exactEndTiming: string;
    };
}

interface FormErrors {
    vehicleInfo?: {
        vehicleType?: string;
        vehicleNumber?: string;
        vehicleName?: string;
    };
    driver?: {
        name?: string;
        mobileNumber?: string;
        address?: string;
        licenseNumber?: string;
    };
    assistant?: {
        name?: string;
        mobileNumber?: string;
    };
    route?: {
        routeName?: string;
        startTiming?: string;
        exactEndTiming?: string;
    };
}

function AddVehicleInfo() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<'vehicle' | 'driver' | 'assistant' | 'route'>('vehicle');
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormData>({
        academicYear: '',
        vehicleInfo: {
            vehicleType: '',
            vehicleNumber: '',
            vehicleName: '',
        },
        driver: {
            name: '',
            mobileNumber: '',
            address: '',
            licenseNumber: '',
        },
        assistant: {
            name: '',
            mobileNumber: '',
        },
        route: {
            routeName: '',
            startTiming: '',
            exactEndTiming: '',
        },
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Vehicle Info", path: "/lookups/vehicle-info" },
        { label: "Add Vehicle Info", path: "" },
    ];

    const fetchVehicleTypes = async () => {
        try {    
            const response = await fetchVehicleTypeDD();
            if (response.success) {
                setVehicleTypeOptions(response.data);
            } else {
                console.error(response.message || 'Failed to fetch vehicle types');
            }
        } catch (error:any) {
            console.error(error.message || 'Failed to fetch vehicle types');  
        }
    }
    useEffect(() => {
        fetchVehicleTypes();
    }, []);
    console.log('vehicleType', formData.vehicleInfo.vehicleType);
    const validateSection = (section: keyof FormErrors): boolean => {
        const newErrors: FormErrors = { ...errors };

        if (section === 'vehicleInfo') {
            newErrors.vehicleInfo = {};
            if (!formData.vehicleInfo.vehicleType.trim()) newErrors.vehicleInfo.vehicleType = 'Required';
            if (!formData.vehicleInfo.vehicleNumber.trim()) newErrors.vehicleInfo.vehicleNumber = 'Required';
            if (!formData.vehicleInfo.vehicleName.trim()) newErrors.vehicleInfo.vehicleName = 'Required';
            else if (formData.vehicleInfo.vehicleName.length < 3) newErrors.vehicleInfo.vehicleName = 'Name too short';
        }
        if (section === 'driver') {
            newErrors.driver = {};
            if (!formData.driver.name.trim()) newErrors.driver.name = 'Required';
            if (!formData.driver.mobileNumber.trim()) newErrors.driver.mobileNumber = 'Required';
            if (!/^\d{10}$/.test(formData.driver.mobileNumber)) newErrors.driver.mobileNumber = 'Invalid number';
            if (!formData.driver.address.trim()) newErrors.driver.address = 'Required';
            if (!formData.driver.licenseNumber.trim()) newErrors.driver.licenseNumber = 'Required';
        }

        if (section === 'assistant') {
            newErrors.assistant = {};
            if (!formData.assistant.name.trim()) newErrors.assistant.name = 'Required';
            if (!formData.assistant.mobileNumber.trim()) newErrors.assistant.mobileNumber = 'Required';
            if (!/^\d{10}$/.test(formData.assistant.mobileNumber)) newErrors.assistant.mobileNumber = 'Invalid number';
        }

        if (section === 'route') {
            newErrors.route = {};
            if (!formData.route.routeName.trim()) newErrors.route.routeName = 'Required';
            if (!formData.route.startTiming) newErrors.route.startTiming = 'Required';
            if (!formData.route.exactEndTiming) newErrors.route.exactEndTiming = 'Required';
        }

        setErrors(newErrors);
        return !Object.values(newErrors[section] || {}).some(Boolean);
    };

    const handleChange = (section: keyof FormData, field: string, value: string) => {
        setFormData((prev:any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value  
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all sections
        const isVehicleValid = validateSection('vehicleInfo');
        const isDriverValid = validateSection('driver');
        const isAssistantValid = validateSection('assistant');
        const isRouteValid = validateSection('route');

        if (!isVehicleValid || !isDriverValid || !isAssistantValid || !isRouteValid) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            const payload:any = {
                academicYear: formData.academicYear,
                vehicleInfo: [{
                    ...formData.vehicleInfo,
                    driver: formData.driver,
                    assistant: formData.assistant,
                    route: formData.route
                }]
            };

            const response = await createVehicle(payload);
            if (response.success) {
                toast.success('Vehicle created successfully!');
                navigate('/lookups/vehicle-info');
            } else {
                toast.error(response.message || 'Failed to create vehicle');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create vehicle');
        }
    };

    const renderVehicleSection = () => (
        <div className={`space-y-4 ${activeSection !== 'vehicle' && 'hidden'}`}>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <AcademicYearDropdown
                        value={formData.academicYear}
                        onChange={(value) => setFormData({ ...formData, academicYear: value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    {/* <input
                        type="text"
                        value={formData.vehicleInfo.vehicleType}
                        onChange={(e) => handleChange('vehicleInfo', 'vehicleType', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleInfo?.vehicleType ? 'border-red-500' : ''}`}
                    /> */}
                    <select
                        value={formData.vehicleInfo.vehicleType}
                        onChange={(e) => handleChange('vehicleInfo', 'vehicleType', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleInfo?.vehicleType ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select Vehicle Type</option>
                        {vehicleTypeOptions.map((option) => (
                            <option key={option._id} value={option._id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {errors.vehicleInfo?.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleInfo.vehicleType}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                    <input
                        type="text"
                        value={formData.vehicleInfo.vehicleNumber}
                        onChange={(e) => handleChange('vehicleInfo', 'vehicleNumber', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleInfo?.vehicleNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.vehicleInfo?.vehicleNumber && <p className="text-red-500 text-xs mt-1">{errors.vehicleInfo.vehicleNumber}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                    <input
                        type="text"

                        value={formData.vehicleInfo.vehicleName}
                        onChange={(e) => handleChange('vehicleInfo', 'vehicleName', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleInfo?.vehicleName ? 'border-red-500' : ''}`}
                    />
                    {errors.vehicleInfo?.vehicleName && <p className="text-red-500 text-xs mt-1">{errors.vehicleInfo.vehicleName}</p>}
                </div>
            </div>
        </div>
    );

    const renderDriverSection = () => (
        <div className={`space-y-4 ${activeSection !== 'driver' && 'hidden'}`}>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Driver Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                    <input
                        type="text"
                        value={formData.driver.name}
                        onChange={(e) => handleChange('driver', 'name', e.target.value)}
                        onKeyDown={(e) => {
                            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' ']; // Include space if needed

                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNext();
                                return;
                            }

                            // Block anything that isn't a letter or allowed key
                            if (!/^[a-zA-Z]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.driver?.name ? 'border-red-500' : ''}`}
                    />
                    {errors.driver?.name && <p className="text-red-500 text-xs mt-1">{errors.driver.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        type="tel"
                        pattern="[0-9]{10}"
                        value={formData.driver.mobileNumber}
                        onChange={(e) => handleChange('driver', 'mobileNumber', e.target.value)}
                        onKeyDown={(e) => {
                            // Allow: Backspace, Tab, Arrow keys, Delete, etc.
                            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

                            // Allow Enter for next action
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNext();
                                return;
                            }

                            // Block non-number keys (unless allowed)
                            if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        maxLength={10}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.driver?.mobileNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.driver?.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.driver.mobileNumber}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        value={formData.driver.address}
                        onChange={(e) => handleChange('driver', 'address', e.target.value)}
                        rows={3}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.driver?.address ? 'border-red-500' : ''}`}
                    />
                    {errors.driver?.address && <p className="text-red-500 text-xs mt-1">{errors.driver.address}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                        type="text"
                        value={formData.driver.licenseNumber}
                        onChange={(e) => handleChange('driver', 'licenseNumber', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.driver?.licenseNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.driver?.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.driver.licenseNumber}</p>}
                </div>
            </div>
        </div>
    );

    const renderAssistantSection = () => (
        <div className={`space-y-4 ${activeSection !== 'assistant' && 'hidden'}`}>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assistant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assistant Name</label>
                    <input
                        type="text"
                        value={formData.assistant.name}
                        onChange={(e) => handleChange('assistant', 'name', e.target.value)}
                        onKeyDown={(e) => {
                            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' ']; // Include space if needed

                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNext();
                                return;
                            }

                            // Block anything that isn't a letter or allowed key
                            if (!/^[a-zA-Z]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.assistant?.name ? 'border-red-500' : ''}`}
                    />
                    {errors.assistant?.name && <p className="text-red-500 text-xs mt-1">{errors.assistant.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        type="tel"
                        pattern="[0-9]{10}"
                        value={formData.assistant.mobileNumber}
                        onChange={(e) => handleChange('assistant', 'mobileNumber', e.target.value)}
                        onKeyDown={(e) => {
                            // Allow: Backspace, Tab, Arrow keys, Delete, etc.
                            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

                            // Allow Enter for next action
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNext();
                                return;
                            }

                            // Block non-number keys (unless allowed)
                            if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        maxLength={10}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.assistant?.mobileNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.assistant?.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.assistant.mobileNumber}</p>}
                </div>
            </div>
        </div>
    );

    const renderRouteSection = () => (
        <div className={`space-y-4 ${activeSection !== 'route' && 'hidden'}`}>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Route Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name (From - To)</label>
                    <input
                        type="text"
                        value={formData.route.routeName}
                        onChange={(e) => handleChange('route', 'routeName', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.route?.routeName ? 'border-red-500' : ''}`}
                    />
                    {errors.route?.routeName && <p className="text-red-500 text-xs mt-1">{errors.route.routeName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Timing</label>
                    <input
                        type="time"
                        value={formData.route.startTiming}
                        onChange={(e) => handleChange('route', 'startTiming', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.route?.startTiming ? 'border-red-500' : ''}`}
                    />
                    {errors.route?.startTiming && <p className="text-red-500 text-xs mt-1">{errors.route.startTiming}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Timing</label>
                    <input
                        type="time"
                        value={formData.route.exactEndTiming}
                        onChange={(e) => handleChange('route', 'exactEndTiming', e.target.value)}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.route?.exactEndTiming ? 'border-red-500' : ''}`}
                    />
                    {errors.route?.exactEndTiming && <p className="text-red-500 text-xs mt-1">{errors.route.exactEndTiming}</p>}
                </div>
            </div>
        </div>
    );

    const handleNext = () => {
        if (activeSection === 'vehicle' && validateSection('vehicleInfo')) {
            setActiveSection('driver');
        } else if (activeSection === 'driver' && validateSection('driver')) {
            setActiveSection('assistant');
        } else if (activeSection === 'assistant' && validateSection('assistant')) {
            setActiveSection('route');
        }
    };

    const handlePrevious = () => {
        if (activeSection === 'route') {
            setActiveSection('assistant');
        } else if (activeSection === 'assistant') {
            setActiveSection('driver');
        } else if (activeSection === 'driver') {
            setActiveSection('vehicle');
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Add Vehicle Info</h3>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    onClick={() => navigate(-1)}
                    type="button"
                >
                    <TbArrowBackUp size={20} className="mr-2" />
                    Back
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {['vehicle', 'driver', 'assistant', 'route'].map((section, index) => (
                        <div key={section} className="flex flex-col items-center">
                            <button
                                onClick={() => setActiveSection(section as any)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                {index + 1}
                            </button>
                            <span className="text-xs mt-2 capitalize">{section}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {renderVehicleSection()}
                    {renderDriverSection()}
                    {renderAssistantSection()}
                    {renderRouteSection()}

                    <div className="flex justify-between mt-8">
                        {activeSection !== 'vehicle' ? (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {activeSection !== 'route' ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Next
                            </button>
                        ) : (
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    <FcCancel size={18} className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <IoCheckmarkDoneCircleOutline size={18} className="mr-2" />
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVehicleInfo;