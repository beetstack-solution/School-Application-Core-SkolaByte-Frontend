import { getStudentTransportInfoById } from '@/api/admin-api/lookups-api/studenttransportInfoApi';
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect, useState } from 'react'
import {
    TbArrowBackUp,
    TbBus,
    TbCalendar,
    TbClock,
    TbRoute,
    TbUser,
    TbLicense,
    TbPhone,
    TbMapPin,
    TbUsers,
    TbSchool,
    TbId,
    TbPoint,
    TbUserCircle,
    TbFileInfo,
    TbHistory,
    TbBike,
    TbDownload,
    TbChevronRight,
    TbAlertCircle,
    TbChevronDown,
    TbChevronUp,
    TbBuilding
} from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ViewStudentsTransport() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [studentTransport, setStudentTransport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedAssignments, setExpandedAssignments] = useState<Record<string, boolean>>({});

    const fetchStudentTransport = async () => {
        if (!id) {
            toast.error("Invalid transport ID");
            return;
        }
        try {
            setLoading(true);
            const response: any = await getStudentTransportInfoById(id);
            if (response.success) {
                setStudentTransport(response.data);
                // Initialize all assignments as collapsed by default
                const initialExpandedState: Record<string, boolean> = {};
                response.data.studentTransportMapping.forEach((mapping: any, index: number) => {
                    initialExpandedState[index] = false;
                });
                setExpandedAssignments(initialExpandedState);
            } else {
                toast.error(response.message || "Failed to fetch student transport data");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentTransport();
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Students Transport", path: "/lookups/students-transports" },
        { label: "View Transport", path: "" },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const onReturn = () => {
        navigate('/lookups/students-transports');
    };

    const toggleAssignment = (index: number) => {
        setExpandedAssignments(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="container mx-auto p-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-800 truncate">
                            Transport Details
                        </h1>
                        {studentTransport?.status !== undefined && (
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${studentTransport.status === true
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                                aria-live="polite"
                            >
                                {studentTransport.status === true ? "Active" : "Inactive"}
                            </span>
                        )}
                    </div>
                    <nav className="mt-2" aria-label="Breadcrumb">
                        <Breadcrumb items={breadcrumbItems} />
                    </nav>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onReturn}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="Return to transport list"
                    >
                        <TbArrowBackUp size={18} aria-hidden="true" />
                        <span>Back to List</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-8 bg-blue-200 rounded-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ) : studentTransport ? (
                <div className="space-y-6">
                    {/* Class Information Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <TbSchool className="mr-2 text-blue-600" />
                                Class Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <TbSchool className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Class</p>
                                        <p className="font-medium text-gray-800">
                                            {studentTransport.class?.name || "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <TbUsers className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Division</p>
                                        <p className="font-medium text-gray-800">
                                            {studentTransport.division?.name || "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transport Assignments */}
                    {studentTransport.studentTransportMapping.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <TbBus className="mr-2 text-purple-600" />
                                        Students Transport List 
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {studentTransport.studentTransportMapping.length} assignments found
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sl No
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Student
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Academic Year
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Vehicle
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Driver
                                                </th>
                                               
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {studentTransport.studentTransportMapping.map((mapping: any, index: number) => (
                                                <React.Fragment key={index}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">{index + 1}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">
                                                                {mapping.firstName} {mapping.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Roll: {mapping.rollNumber}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                                {mapping.academicYear?.academicYear || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <TbBus className="flex-shrink-0 mr-2 text-gray-500" />
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {mapping.vehicleId?.name || "N/A"}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {mapping.vehicleInfo?.vehicleNumber?.join(", ") || "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {mapping.vehicleInfo?.driver?.[0]?.name ? (
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {mapping.vehicleInfo.driver[0].name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {mapping.vehicleInfo.driver[0].mobileNumber || "N/A"}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500">Not assigned</span>
                                                            )}
                                                        </td>
                                                        
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => toggleAssignment(index)}
                                                                className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                                                                aria-expanded={expandedAssignments[index]}
                                                            >
                                                                {expandedAssignments[index] ? (
                                                                    <>
                                                                        <span>Hide Details</span>
                                                                        <TbChevronUp className="ml-1" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Show Details</span>
                                                                        <TbChevronDown className="ml-1" />
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedAssignments[index] && (
                                                        <tr>
                                                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    {/* Vehicle Details */}
                                                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                                                        <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                                                            <TbBus className="mr-2 text-gray-500 flex-shrink-0" />
                                                                            <span className="truncate">Vehicle Information</span>
                                                                        </h3>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                            {/* Route Information */}
                                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                                <div className="flex items-start">
                                                                                    <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                        <TbRoute className="text-green-600" size={16} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Route</p>
                                                                                        <p className="font-medium text-gray-800 break-words">
                                                                                            {mapping.vehicleInfo?.route?.[0]?.routeName || (
                                                                                                <span className="text-gray-400">Not specified</span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Timing Information */}
                                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                                <div className="flex items-start">
                                                                                    <div className="bg-orange-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                        <TbClock className="text-green-600" size={16} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Timing</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {mapping.vehicleInfo?.route?.[0]?.startTiming ? (
                                                                                                <>
                                                                                                    <span className="block sm:inline">{mapping.vehicleInfo.route[0].startTiming}</span>
                                                                                                    <span className="hidden sm:inline mx-1">-</span>
                                                                                                    <span className="block sm:inline">{mapping.vehicleInfo.route[0].exactEndTiming}</span>
                                                                                                </>
                                                                                            ) : (
                                                                                                <span className="text-gray-400">Not specified</span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Driver Details */}
                                                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                                                        <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                                                                            <div className="mr-2 text-gray-500 flex-shrink-0">
                                                                                <TbUser className="truncate" size={16} />
                                                                            </div>
                                                                            <span>Driver Details</span>
                                                                        </h3>

                                                                        {mapping.vehicleInfo?.driver?.[0]?.name ? (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {/* License Information */}
                                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                                    <div className="flex items-start">
                                                                                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                            <TbLicense className="text-blue-600" size={16} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">License</p>
                                                                                            <p className="font-medium text-gray-800 break-words">
                                                                                                {mapping.vehicleInfo.driver[0].licenseNumber || (
                                                                                                    <span className="text-gray-400">Not specified</span>
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Address Information */}
                                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                                    <div className="flex items-start">
                                                                                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                            <TbMapPin className="text-blue-600" size={16} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</p>
                                                                                            <p className="font-medium text-gray-800 break-words">
                                                                                                {mapping.vehicleInfo.driver[0].address || (
                                                                                                    <span className="text-gray-400">Not specified</span>
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Optional: Add more driver details in this grid format */}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center justify-center py-6 text-gray-500">
                                                                                <TbUser className="mr-2 text-gray-400" size={20} />
                                                                                <span>No driver assigned</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Assistant Details */}
                                                                    {mapping.vehicleInfo?.assistant?.length > 0 && (
                                                                        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                                                            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                                                                                <div className="mr-2 text-gray-500 flex-shrink-0">
                                                                                    <TbUsers className="truncate" size={18} />
                                                                                </div>
                                                                                <span>Assistant Details</span>
                                                                            </h3>

                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {/* Name Information */}
                                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                                    <div className="flex items-start">
                                                                                        <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                            <TbUser className="text-purple-600" size={16} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Name</p>
                                                                                            <p className="font-medium text-gray-800">
                                                                                                {mapping.vehicleInfo.assistant[0].name || (
                                                                                                    <span className="text-gray-400">Not specified</span>
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Contact Information */}
                                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                                    <div className="flex items-start">
                                                                                        <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                            <TbPhone className="text-purple-600" size={16} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contact</p>
                                                                                            <p className="font-medium text-gray-800">
                                                                                                {mapping.vehicleInfo.assistant[0].mobileNumber ? (
                                                                                                    <a
                                                                                                        href={`tel:${mapping.vehicleInfo.assistant[0].mobileNumber}`}
                                                                                                        className="hover:text-purple-600 transition-colors"
                                                                                                    >
                                                                                                        {mapping.vehicleInfo.assistant[0].mobileNumber}
                                                                                                    </a>
                                                                                                ) : (
                                                                                                    <span className="text-gray-400">Not specified</span>
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                     </div>
                                                                    )}

                                                                    {/* Student Details */}
                                                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                                                        <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                                                                            <div className="mr-2 text-gray-500 flex-shrink-0">
                                                                                <TbUserCircle className="truncate" size={18} />
                                                                            </div>
                                                                            <span>Student Details</span>
                                                                        </h3>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {/* Drop Location Information */}
                                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                                <div className="flex items-start">
                                                                                    <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                        <TbMapPin className="text-orange-600" size={16} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Drop Location</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {mapping.dropLocation || (
                                                                                                <span className="text-gray-400">Not specified</span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Place Information */}
                                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                                <div className="flex items-start">
                                                                                    <div className="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                                                                                        <TbBuilding className="text-orange-600" size={16} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Place</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {mapping.place || (
                                                                                                <span className="text-gray-400">Not specified</span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="flex flex-col items-center">
                                <TbAlertCircle className="text-yellow-500 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No Transport Assignments</h3>
                                <p className="text-gray-600">This class doesn't have any transport assignments yet.</p>
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                System Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center text-gray-600">
                                <TbClock className="mr-2 text-gray-400" />
                                <span className="font-medium mr-2">Created:</span>
                                {formatDate(studentTransport.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="flex flex-col items-center">
                        <TbAlertCircle className="text-red-500 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Transport Not Found</h3>
                        <p className="text-gray-600">The requested transport information could not be loaded.</p>
                        <button
                            onClick={onReturn}
                            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Transport List
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewStudentsTransport