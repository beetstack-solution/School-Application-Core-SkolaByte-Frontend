import { useEffect, useState } from 'react';
import { createStudentTransport } from '@/api/admin-api/lookups-api/studentTransportApi';
import { fetchAcademicYear, fetchVehicleTypeDD, fetchAllStudentsByClassDivisionAcademicYear, fetchClasses, fetchDivisionsDD, fetchVehicledriveDD, fetchPlaceDD } from '@/api/common-api/commonDropDownApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { FcCancel } from 'react-icons/fc';
import Breadcrumb from '@/components/Breadcumb';
import { TbArrowBackUp } from 'react-icons/tb';
import AcademicYearDropdown from '@/components/AcademicYearDropdown'
import { createStudentTransportInfo } from '@/api/admin-api/lookups-api/studenttransportInfoApi';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import { MdDeleteOutline } from 'react-icons/md';

function AddStudentsTransport() {
    const [formData, setFormData] = useState<any>({
        class: '',
        division: '',
        academicYear: '',
        studentTransportMappings: [{
            studentId: '',
            place: '',
            dropLocation: '',
            vehicleId: '',
            vehicleInfoId: ''
        }]
    });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [classOptions, setClassOptions] = useState<any>([]);
    const [divisionOptions, setDivisionOptions] = useState<any>([]);
    const [studentOptions, setStudentOptions] = useState<any>([]);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState<any>([]);
    const [academicYearOptions, setAcademicYearOptions] = useState<any>([]);
    const [vehicleDriveOptions, setVehicleDriveOptions] = useState<any>([]);
    const navigate = useNavigate();

    const getVehicleTypes = async () => {
        try {
            const response = await fetchVehicleTypeDD();
            setVehicleTypeOptions(response.data);
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
        }
    };

    const getClasses = async () => {
        try {
            const response = await fetchClasses();
            setClassOptions(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const getDivisions = async () => {
        try {
            const response = await fetchDivisionsDD();
            setDivisionOptions(response.data);
        } catch (error) {
            console.error('Error fetching divisions:', error);
        }
    };

    const getAcademicYears = async () => {
        try {
            const response = await fetchAcademicYear();
            setAcademicYearOptions(response.data);
        } catch (error) {
            console.error('Error fetching academic years:', error);
        }
    };

    const getStudents = async () => {
        try {
            const response = await fetchAllStudentsByClassDivisionAcademicYear(
                formData.class,
                formData.division,
                formData.academicYear
            );
            setStudentOptions(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudentOptions([]);
        }
    };

    const getVehicleDriverDD = async (vehicleId: string) => {
        try {
            const response = await fetchVehicledriveDD(vehicleId);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle drivers:', error);
            return [];
        }
    };

    const getPlaceDD = async (studentId: string) => {
        try {
            const response = await fetchPlaceDD(studentId);
            return response.data;
        } catch (error) {
            console.error('Error fetching places:', error);
            return '';
        }
    }

    useEffect(() => {
        getClasses();
        getDivisions();
        getAcademicYears();
        getVehicleTypes();
    }, []);

    useEffect(() => {
        if (formData.class && formData.division && formData.academicYear) {
            getStudents();
        }
    }, [formData.class, formData.division, formData.academicYear]);

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.class) {
            newErrors.class = 'Class is required';
        }
        if (!formData.division) {
            newErrors.division = 'Division is required';
        }
        if (!formData.academicYear) {
            newErrors.academicYear = 'Academic Year is required';
        }

        // Validate each student transport mapping
        formData.studentTransportMappings.forEach((mapping: any, index: number) => {
            if (!mapping.studentId) {
                newErrors[`studentTransportMappings[${index}].studentId`] = 'Student is required';
            }
            if (!mapping.place) {
                newErrors[`studentTransportMappings[${index}].place`] = 'Place is required';
            }
            if (!mapping.dropLocation) {
                newErrors[`studentTransportMappings[${index}].dropLocation`] = 'Drop Location is required';
            }
            if (!mapping.vehicleId) {
                newErrors[`studentTransportMappings[${index}].vehicleId`] = 'Vehicle is required';
            }
            if (!mapping.vehicleInfoId) {
                newErrors[`studentTransportMappings[${index}].vehicleInfoId`] = 'Driver Info is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle basic fields
        if (['class', 'division', 'academicYear'].includes(name)) {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        } 
        // Clear error when field is changed
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const handleMappingChange = async (index: number, field: string, value: string) => {
        const updatedMappings = [...formData.studentTransportMappings];
        updatedMappings[index] = { ...updatedMappings[index], [field]: value };

        // If vehicleId changed, fetch drivers
        if (field === 'vehicleId') {
            const drivers = await getVehicleDriverDD(value);
            updatedMappings[index].vehicleInfoId = ''; // Reset driver when vehicle changes
            setVehicleDriveOptions((prev: any) => {
                const newDrivers = [...prev];
                newDrivers[index] = drivers;
                return newDrivers;
            });
        }

        // If studentId changed, fetch place
        if (field === 'studentId') {
            const place = await getPlaceDD(value);
            updatedMappings[index].place = place;
        }

        setFormData((prev: any) => ({
            ...prev,
            studentTransportMappings: updatedMappings
        }));

        // Clear error when field is changed
        const errorKey = `studentTransportMappings[${index}].${field}`;
        if (errors[errorKey]) {
            const newErrors = { ...errors };
            delete newErrors[errorKey];
            setErrors(newErrors);
        }
    };

    const addMapping = () => {
        setFormData((prev: any) => ({
            ...prev,
            studentTransportMappings: [
                ...prev.studentTransportMappings,
                {
                    studentId: '',
                    place: '',
                    dropLocation: '',
                    vehicleId: '',
                    vehicleInfoId: ''
                }
            ]
        }));
    };

    const removeMapping = (index: number) => {
        if (formData.studentTransportMappings.length <= 1) return;
        
        const updatedMappings = [...formData.studentTransportMappings];
        updatedMappings.splice(index, 1);
        
        setFormData((prev: any) => ({
            ...prev,
            studentTransportMappings: updatedMappings
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            // Format the data to match the API expectation
            const submissionData: any = {
                class: formData.class,
                division: formData.division,
                studentTransportMapping: formData.studentTransportMappings.map((mapping: any) => ({
                    academicYear: formData.academicYear,
                    studentId: mapping.studentId,
                    place: mapping.place,
                    dropLocation: mapping.dropLocation,
                    vehicleId: mapping.vehicleId,
                    vehicleInfoId: mapping.vehicleInfoId
                }))
            };

            const response = await createStudentTransportInfo(submissionData);
            if (response.success) {
                setSubmitSuccess(true);
                toast.success(response.message || 'Transport information submitted successfully!');
                navigate('/lookups/students-transports/');
            } else {
                toast.error(response.message || 'Failed to submit transport information');
            }
        } catch (error: any) {
            console.error('Error submitting transport data:', error);
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
        { label: "Student Transportation", path: "/lookups/students-transports" },
        { label: "Add Student Transportation", path: "" },
    ];

    return (
        <div className="mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Add Student Transportation</h3>
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
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Academic Year */}
                                <div>
                                    <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                                        Academic Year <span className="text-red-500">*</span>
                                    </label>
                                    <AcademicYearDropdown
                                        value={formData.academicYear}
                                        onChange={(value) => setFormData((prev: any) => ({ ...prev, academicYear: value }))}
                                    />
                                    {getError('academicYear')}
                                </div>

                                {/* Class */}
                                <div>
                                    <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                                        Class <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="class"
                                        name="class"
                                        value={formData.class}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select Class</option>
                                        {classOptions.map((option: any) => (
                                            <option key={option._id} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getError('class')}
                                </div>

                                {/* Division */}
                                <div>
                                    <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                                        Division <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="division"
                                        name="division"
                                        value={formData.division}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select Division</option>
                                        {divisionOptions.map((option: any) => (
                                            <option key={option._id} value={option._id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getError('division')}
                                </div>
                            </div>
                        </div>

                        {/* Student Transport Mappings */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Student Transport Details</h2>
                            
                            {formData.studentTransportMappings.map((mapping: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                                    {formData.studentTransportMappings.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMapping(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            title="Remove this student"
                                        >
                                            <TiDeleteOutline size={24} />
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Student */}
                                        <div>
                                            <label htmlFor={`studentId-${index}`} className="block text-sm font-medium text-gray-700">
                                                Student <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`studentId-${index}`}
                                                name={`studentId-${index}`}
                                                value={mapping.studentId}
                                                onChange={(e) => handleMappingChange(index, 'studentId', e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select Student</option>
                                                {studentOptions.map((student: any) => (
                                                    <option key={student._id} value={student._id}>
                                                        {student.firstName} {student.lastName} (Roll No : {student.rollNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            {getError(`studentTransportMappings[${index}].studentId`)}
                                        </div>

                                        {/* Place */}
                                        <div>
                                            <label htmlFor={`place-${index}`} className="block text-sm font-medium text-gray-700">
                                                Place <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id={`place-${index}`}
                                                name={`place-${index}`}
                                                value={mapping.place}
                                                readOnly
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                                            />
                                            {getError(`studentTransportMappings[${index}].place`)}
                                        </div>

                                        {/* Drop Location */}
                                        <div>
                                            <label htmlFor={`dropLocation-${index}`} className="block text-sm font-medium text-gray-700">
                                                Drop Location <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id={`dropLocation-${index}`}
                                                name={`dropLocation-${index}`}
                                                value={mapping.dropLocation}
                                                onChange={(e) => handleMappingChange(index, 'dropLocation', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                            {getError(`studentTransportMappings[${index}].dropLocation`)}
                                        </div>

                                        {/* Vehicle Type */}
                                        <div>
                                            <label htmlFor={`vehicleId-${index}`} className="block text-sm font-medium text-gray-700">
                                                Vehicle Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`vehicleId-${index}`}
                                                name={`vehicleId-${index}`}
                                                value={mapping.vehicleId}
                                                onChange={(e) => handleMappingChange(index, 'vehicleId', e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicleTypeOptions.map((vehicle: any) => (
                                                    <option key={vehicle._id} value={vehicle._id}>
                                                        {vehicle.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {getError(`studentTransportMappings[${index}].vehicleId`)}
                                        </div>

                                        {/* Driver Info */}
                                        <div>
                                            <label htmlFor={`vehicleInfoId-${index}`} className="block text-sm font-medium text-gray-700">
                                                Driver Info <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`vehicleInfoId-${index}`}
                                                name={`vehicleInfoId-${index}`}
                                                value={mapping.vehicleInfoId}
                                                onChange={(e) => handleMappingChange(index, 'vehicleInfoId', e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select Driver</option>
                                                {(vehicleDriveOptions[index] || []).map((vehicle: any) => (
                                                    <option key={vehicle._id} value={vehicle._id}>
                                                        {vehicle.driver?.name} (Vehicle No: {vehicle.vehicleNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            {getError(`studentTransportMappings[${index}].vehicleInfoId`)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addMapping}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FaPlus size={14} className="mr-2" />
                                Add Another Student
                            </button>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/lookups/students-transports/')}
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

export default AddStudentsTransport;