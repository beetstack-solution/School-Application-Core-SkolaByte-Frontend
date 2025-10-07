import { deleteTimeTable, fetchTimeTable, Timetable, updateTimeTableStatusById } from "@/api/admin-api/lookups-api/timeTableApi";
import { Class } from "@/api/admin-api/student-management/students-api/studentsApi";
import {
    Division,
    fetchClasses,
    fetchDivisionsDD,
} from "@/api/common-api/commonDropDownApi";
import Breadcrumb from "@/components/Breadcumb";
import React, { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TimeTableList: React.FC = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [timeTableList, setTimeTableList] = useState<any[]>([]);
    const [formData, setFormData] = useState({ class: "",
         division: "",
         academicYear: "",
         teacher: "",
        day:"",
        });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Time Table", path: "" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, divisionsData] = await Promise.all([
                    fetchClasses(),
                    fetchDivisionsDD(),
                ]);
                setClasses(classesData.data);
                setDivisions(divisionsData.data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        

        fetchData();
    }, []);

    const handleFilter = async () => {
        if (!formData.class || !formData.division) {
            toast.warn("Please select both class and division");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchTimeTable(formData.class, formData.division,formData.academicYear,formData.teacher,"");
            const timetableData = response.data?.data || [];
            setTimeTableList(timetableData);
            console.log("Timetable data:", timetableData);
        } catch (err: any) {
            console.error("Failed to fetch timetable", err);
            setError(err.message || "Failed to fetch timetable");
            setTimeTableList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getTimeTableId = (timetable: any): string => {
        return timetable._id || timetable.id || "";
    };

    const handleStatusUpdate = async (timetable: Timetable) => {
        const timeTableId = getTimeTableId(timetable);
        // Check if ID is valid
        if (!timeTableId) {
            toast.error("Cannot update status: timetable ID is missing or invalid");
            return;
        }

        const newStatus = !timetable.status;

        const confirmUpdate = window.confirm(
            `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"
            }?`
        );

        if (!confirmUpdate) {
            return;
        }

        try {
            const responseData = await updateTimeTableStatusById(timeTableId, newStatus);

            if (responseData?.success) {
                toast.success(
                    responseData.message ||
                    `Teacher status updated to ${newStatus ? "Active" : "Inactive"}.`
                );
                await handleFilter();
            } else {
                toast.error(
                    responseData?.message || "Failed to update teacher status."
                );
            }
        } catch (error: any) {
            console.error("Error in handleStatusUpdate:", error);
            toast.error(error.message || "Failed to update teacher status.");
        }
    };
    const handleDelete = async (timetable: Timetable) => {
        const timeTableId = getTimeTableId(timetable);

        if (!timeTableId) {
            toast.error("Cannot delete: Timetable ID is missing or invalid");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Timetable?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await deleteTimeTable(timeTableId);

            if (response && response.success === true) {
                toast.success(response.message || "TimeTable deleted successfully!");
                await handleFilter();
            } else {
                toast.error(
                    response?.message || "Failed to delete teacher. Please try again."
                );
            }
        } catch (error: any) {
            console.error("Error deleting teacher:", error);
            toast.error(
                error.message || "An error occurred while deleting the teacher. Please try again."
            );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Time Table List</h2>
                    <div className="mt-1">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                    <Link to={'add/'} className="w-full md:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                            <RiPlayListAddFill className="text-lg" />
                            Add Time Table
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="class"
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Division <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="division"
                            value={formData.division}
                            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Division</option>
                            {divisions.map((division) => (
                                <option key={division._id} value={division._id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            className="h-[42px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md"
                            onClick={handleFilter}
                        >
                            Go
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col" >
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {[
                                    { name: "Sl No.", width: "w-16" },
                                    { name: "Actions" },
                                    { name: "Status" },
                                    { name: "Code" },
                                    { name: "Class" },
                                    { name: "Division" },
                                    { name: "Academic Year" },
                                    { name: "Created At" }
                                ].map((header) => (
                                    <th
                                        key={header.name}
                                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            {header.name}
                                            <AiFillCaretUp className="text-gray-400 text-xs" />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-4 text-center text-red-500 font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : timeTableList.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
  {isLoading ? (
    <div className="flex justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </div>
  ) : (
    formData.class && formData.division ? 'No Time Tables found' : 'Please select a class and a division'
  )}
</td>
                                </tr>
                            ) : (
                                timeTableList.map((timeTable, index) => (
                                    <tr key={getTimeTableId(timeTable) || index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => navigate(`view/${getTimeTableId(timeTable)}`)} className="text-gray-500 hover:text-blue-600 transition-colors">
                                                    <GrOverview size={20} title="View" />       
                                                </button>
                                                {/* <Link to={`edit/${getTimeTableId(timeTable)}`} className="text-gray-500 hover:text-green-600 transition-colors">
                                                    <CiEdit size={22} title="Edit" />
                                                </Link> */}
                                                <Link to={`edit/${getTimeTableId(timeTable)}`} className="text-gray-500 hover:text-green-600 transition-colors">
                                                    <CiEdit size={22} title="Edit" />
                                                </Link>
                                                {/* <button
                                                    onClick={() => handleDelete(timeTable)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <MdDeleteOutline size={18} title="Delete" />
                                                </button> */}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusUpdate(timeTable)}
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${timeTable.status
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {timeTable.status ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {timeTable.code}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {timeTable.class?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {timeTable.division?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {timeTable.academicYear?.academicYear || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(timeTable.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-gray-600">
                    Showing {timeTableList.length} of {timeTableList.length} entries
                </div>
            </div>
        </div>
    );
};

export default TimeTableList;
