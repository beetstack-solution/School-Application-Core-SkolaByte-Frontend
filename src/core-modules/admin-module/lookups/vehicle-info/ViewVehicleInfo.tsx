import { fetchVehicleById } from '@/api/admin-api/lookups-api/vehicleInfoApi'
import React from 'react'
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    TbArrowBackUp,
    TbCalendar,
    TbCheck,
    TbX,
    TbUser,
    TbCar,
    TbLicense,
    TbMapPin,
    TbPhone,
    TbRoute,
    TbClock,
    TbUsers,
    TbCalendarTime
} from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { GrStatusGood } from 'react-icons/gr';

function ViewVehicleInfo() {
    const { id } = useParams<{ id: string }>();
    const [vehicleInfo, setVehicleInfo] = useState<any | null>(null);

    const getVehicleInfoById = async (paramId: string) => {
        try {
            const response = await fetchVehicleById(paramId);
            if (response.data) {
                setVehicleInfo(response.data);
            }
        } catch (error: any) {
            console.error(
                "Error fetching vehicle info by id",
                error.response?.data || error.message
            );
            throw new Error(
                error.response?.data?.message || "Failed to fetch vehicle info by id"
            );
        }
    };

    useEffect(() => {
        if (id) {
            getVehicleInfoById(id);
        }
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Vehicle Info", path: "/lookups/vehicle-info" },
        { label: "View Vehicle Info", path: "" },
    ];

    return (
        <div className="container mx-auto p-4 md:p-6 ">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TbCar className="text-blue-600" size={24} />
                        Vehicle Information
                    </h3>
                    <div className="mt-2">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <Link to={"/lookups/vehicle-info"}>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all shadow-sm hover:shadow">
                        <TbArrowBackUp size={18} className="mr-2" />
                        Back
                    </button>
                </Link>
            </div>

            {vehicleInfo ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Status Badge */}
                    {/* <div className={`px-6 py-3 border-b ${vehicleInfo.status ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center gap-2">
                            {vehicleInfo.status ? (
                                <TbCheck className="text-green-600" size={20} />
                            ) : (
                                <TbX className="text-red-600" size={20} />
                            )}
                            <span className={`font-medium ${vehicleInfo.status ? 'text-green-700' : 'text-red-700'}`}>
                                {vehicleInfo.status ? 'Active Vehicle' : 'Inactive Vehicle'}
                            </span>
                        </div>
                    </div> */}

                    <div className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                <TbCalendar className="text-blue-500" />
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <TbCalendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Academic Year</p>
                                        <p className="font-medium">{vehicleInfo.academicYear?.academicYear}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <TbUser size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created By</p>
                                        <p className="font-medium">{vehicleInfo.createdBy?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <TbCalendarTime size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="font-medium">
                                            {new Date(vehicleInfo.createdAt).toLocaleDateString()} at {new Date(vehicleInfo.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <GrStatusGood size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium">
                                            {vehicleInfo.status ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-600">Inactive</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        {vehicleInfo.vehicleInfo?.map((vehicle: any, index: number) => (
                            <div key={index} className="space-y-8">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                        <TbCar className="text-blue-500" />
                                        Vehicle Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbCar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Vehicle Number</p>
                                                <p className="font-medium">{vehicle.vehicleNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbUsers size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Vehicle Name</p>
                                                <p className="font-medium">{vehicle?.vehicleName || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Information */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <h5 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                        <TbUser className="text-blue-500" />
                                        Driver Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbUser size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">{vehicle.driver?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbPhone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Mobile Number</p>
                                                <p className="font-medium">{vehicle.driver?.mobileNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbMapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-medium">{vehicle.driver?.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbLicense size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">License Number</p>
                                                <p className="font-medium">{vehicle.driver?.licenseNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assistant Information */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <h5 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                        <TbUser className="text-blue-500" />
                                        Assistant Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbUser size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">{vehicle.assistant?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbPhone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Mobile Number</p>
                                                <p className="font-medium">{vehicle.assistant?.mobileNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Route Information */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <h5 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                        <TbRoute className="text-blue-500" />
                                        Route Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbRoute size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Route Name(From - To)</p>
                                                <p className="font-medium">{vehicle.route?.routeName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbClock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Start Timing</p>
                                                <p className="font-medium">{vehicle.route?.startTiming}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <TbClock size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">End Timing</p>
                                                <p className="font-medium">{vehicle.route?.exactEndTiming}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewVehicleInfo