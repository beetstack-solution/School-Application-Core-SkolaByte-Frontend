import React, { useEffect, useState } from 'react';
import { TbArrowBackUp, TbSchool, TbUser, TbCalendar, TbChartBar, TbAward, TbFileDescription } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcumb';
import { fetchGradeById } from '@/api/admin-api/lookups-api/gradeApi';

function ViewGrade() {
    const { id } = useParams<{ id: string }>();
    const [gradeData, setGradeData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const getGradeById = async (id: string) => {
        try {
            const responseData = await fetchGradeById(id);
            if (responseData.success) {
                setGradeData(responseData?.data);
            } else {
                setError("Grade data not found");
            }
        } catch (error: any) {
            console.error("Error fetching grade data:", error);
            setError(error.response?.data?.message || "Error fetching grade data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getGradeById(id);
        }
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
    );

    const onReturn = () => {
        navigate("/lookups/grades");
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Grades", path: "/lookups/grades" },
        { label: "View Grade", path: "" },
    ];

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Grade Details</h3>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <button 
                    onClick={onReturn}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <TbArrowBackUp className="mr-2" />
                    Back to Grades
                </button>
            </div>

            {gradeData && gradeData.grades && gradeData.grades.length > 0 && (
                <div className="space-y-6">
                    {/* Academic Info Section */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <TbSchool className="mr-2 text-blue-600" />
                            Academic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Academic Year</p>
                                <p className="font-medium">{gradeData?.academicYear?.academicYear || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-medium">{gradeData?.class?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Division</p>
                                <p className="font-medium">{gradeData?.division?.name || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Grade Cards */}
                    {gradeData.grades.map((studentGrade: any, index: number) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {studentGrade?.student?.firstName} {studentGrade?.student?.lastName}
                                        </h2>
                                        <p className="text-blue-100">Roll No: {studentGrade?.student?.rollNumber || "N/A"}</p>
                                    </div>
                                    <div className="bg-white text-blue-800 px-4 py-2 rounded-lg font-bold">
                                        Grade: {studentGrade?.grade || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Student Info */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <TbUser className="text-blue-600 mr-2" size={20} />
                                            <h3 className="font-semibold text-gray-700">Student Details</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <p><span className="text-gray-500">Admission No:</span> {studentGrade?.student?.admissionNumber || "N/A"}</p>
                                            <p><span className="text-gray-500">Date of Birth:</span> {studentGrade?.student?.dob ? new Date(studentGrade.student.dob).toLocaleDateString() : "N/A"}</p>
                                            <p><span className="text-gray-500">Gender:</span> {studentGrade?.student?.gender || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <TbChartBar className="text-blue-600 mr-2" size={20} />
                                            <h3 className="font-semibold text-gray-700">Performance Summary</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <p><span className="text-gray-500">Total Marks:</span> {studentGrade?.totalMarksObtained || "N/A"}</p>
                                            <p><span className="text-gray-500">Percentage:</span> {studentGrade?.totalPercentage ? `${studentGrade.totalPercentage.toFixed(2)}%` : "N/A"}</p>
                                            <p><span className="text-gray-500">Final Grade:</span> <span className="font-bold">{studentGrade?.grade || "N/A"}</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <TbAward className="text-blue-600 mr-2" size={20} />
                                            <h3 className="font-semibold text-gray-700">Exam Summary</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <p><span className="text-gray-500">Exams Taken:</span> {studentGrade?.exams?.length || "0"}</p>
                                            <p><span className="text-gray-500">Best Subject:</span> {studentGrade?.exams?.reduce((max: any, exam: any) => 
                                                (exam.marksObtained / exam.totalMarks) > (max.marksObtained / max.totalMarks) ? exam : max, 
                                                studentGrade.exams[0])?.subject?.name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Exams Section */}
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <TbAward className="mr-2 text-blue-600" />
                                    Exam Results
                                </h3>
                                
                                <div className="space-y-4">
                                    {studentGrade.exams.map((exam: any, examIndex: number) => (
                                        <div key={examIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                                <h4 className="font-medium text-gray-800">
                                                    {exam.exam?.name || "Exam"} - {exam.subject?.name || "Subject"}
                                                </h4>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Exam Type</p>
                                                        <p className="font-medium">{exam.examType?.name || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Marks Obtained</p>
                                                        <p className="font-medium">
                                                            {exam.marksObtained || "0"} / {exam.totalMarks || "N/A"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Percentage</p>
                                                        <p className="font-medium">
                                                            {exam.totalMarks ? `${((exam.marksObtained / exam.totalMarks) * 100).toFixed(2)}%` : "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {exam.remarks && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            <TbFileDescription className="mr-1" />
                                                            Remarks
                                                        </p>
                                                        <p className="bg-yellow-50 p-2 rounded">{exam.remarks}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-md p-4 text-sm text-gray-500">
                        <div className="flex flex-wrap justify-between">
                            <p>Created: {new Date(gradeData?.createdAt).toLocaleString()}</p>
                            {gradeData?.updatedAt && (
                                <p>Last Updated: {new Date(gradeData.updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewGrade;