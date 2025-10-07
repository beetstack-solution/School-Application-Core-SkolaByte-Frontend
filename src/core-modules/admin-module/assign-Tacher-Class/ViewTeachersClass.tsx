import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { getAssignedTeacherById } from '@/api/admin-api/lookups-api/assignTeachersClassApi';

function ViewTeachersClass() {
    const { id } = useParams();
    const [teacherClass, setTeacherClass] = useState<any>(null);
    const navigate = useNavigate();

    const fetchTeacherClass = async () => {
        if (!id) {
            console.error("No teacher ID provided.");
            return;
        }
        try {
            const response: any = await getAssignedTeacherById(id);
            setTeacherClass(response.data);
        } catch (error) {
            console.error("Error fetching teacher class:", error);
        }
    };

    useEffect(() => {
        fetchTeacherClass();
    }, []);

    if (!teacherClass) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Teachers Classes", path: "/lookups/assign-teacher-class" },
        { label: "View Teachers Classes", path: "" },
    ];

    return (
        <div className="container mx-auto px-4 py-8 ">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Teachers Classes</h1>
                    <div className="text-sm text-gray-600">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <button
                    className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition duration-200 shadow-md hover:shadow-lg"
                    onClick={() => navigate(-1)}
                >
                    <TbArrowBackUp size={18} className="mr-2" />
                    Back to List
                </button>
            </div>

            {/* Teacher Information Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Teacher Profile</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                            <p className="text-lg font-semibold text-gray-800">{teacherClass?.teacher?.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Teacher ID</p>
                            <p className="text-lg font-semibold text-gray-800">{teacherClass.teacher.code}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                            <p className="text-lg font-semibold text-gray-800 break-all">{teacherClass.teacher.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Contact Number</p>
                            <p className="text-lg font-semibold text-gray-800">{teacherClass.teacher.contactNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Gender</p>
                            <p className="text-lg font-semibold text-gray-800 capitalize">{teacherClass?.teacher.gender?.toLowerCase()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Class Teacher</p>
                            <p className={`text-lg font-semibold ${teacherClass?.isClassTeacher ? 'text-green-600' : 'text-gray-600'}`}>
                                {teacherClass?.isClassTeacher ? "Yes" : "No"}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Class Teacher Section (Conditional) */}
            {teacherClass?.isClassTeacher && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Class Teacher of</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm font-medium text-blue-600">Class</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {teacherClass.classTeacherOf.class?.name || 'Not assigned'}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm font-medium text-blue-600">Division</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {teacherClass.classTeacherOf.division?.name || 'Not assigned'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Academic Year Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Academic Year Details</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-600">Academic Year</p>
                            <p className="text-lg font-semibold text-purple-800">{teacherClass.academicYear.academicYear}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-600">Start Month</p>
                            <p className="text-lg font-semibold text-purple-800">
                                {new Date(0, teacherClass.academicYear.startMonth - 1).toLocaleString('default', { month: 'long' })}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-600">End Month</p>
                            <p className="text-lg font-semibold text-purple-800">
                                {new Date(0, teacherClass.academicYear.endMonth - 1).toLocaleString('default', { month: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Teaching Classes</h2>
                </div>
                <div className="p-6">
                    {teacherClass.assignments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No assignments found for this teacher</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {teacherClass.assignments.map((assignment: any, index: number) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <p className="text-sm font-medium text-gray-500">Class</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {assignment.classDetails[0]?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <p className="text-sm font-medium text-gray-500">Division</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {assignment.divisionDetails[0]?.name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-3">Subjects</h3>
                                        {assignment.subjectDetails.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No subjects assigned</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {assignment.subjectDetails.map((subject: any, subIndex: number) => (
                                                    <div
                                                        key={subIndex}
                                                        className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-400 hover:shadow-md transition duration-200"
                                                    >
                                                        <p className="font-medium text-gray-800">{subject.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Code: {subject.code}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewTeachersClass;