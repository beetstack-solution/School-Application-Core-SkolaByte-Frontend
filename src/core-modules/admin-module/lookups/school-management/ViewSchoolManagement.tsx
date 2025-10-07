import { getSchoolManagementById } from '@/api/admin-api/lookups-api/schoolManagementApi'
import Breadcrumb from '@/components/Breadcumb';
import React from 'react'
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

function ViewSchoolManagement() {
  const BaseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [schoolManagement, setSchoolManagement] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSchoolManagement = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error("No ID provided for fetching School Management");
                }
                const response = await getSchoolManagementById(id);
                setSchoolManagement(response.data);
            } catch (error) {
                console.error('Error fetching School Management:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolManagement();
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "School Management", path: "/lookups/school-management" },
        { label: "View School Management", path: "" },
    ];

    if (loading) {
        return (
            <div className="mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!schoolManagement) {
        return (
            <div className="mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No school management data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mx-auto"> 
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">View School Management</h3>
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

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center mb-6">
                                {schoolManagement.imageUrl ? (
                                    <img
                                        src={`${schoolManagement.imageUrl}` || ''}
                                        alt={`${schoolManagement.name}'s profile`}
                                        className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="border-b pb-4">
                                <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{schoolManagement.fullName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{schoolManagement.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900">{schoolManagement.phone}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Qualification</label>
                                    <p className="mt-1 text-sm text-gray-900">{schoolManagement.qualification}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <h4 className="text-lg font-medium text-gray-900">Professional Information</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Designation</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {schoolManagement.designation?.name} ({schoolManagement.designation?.code})
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Department</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {schoolManagement.department?.name} ({schoolManagement.department?.code})
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Joining Date</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(schoolManagement.joiningDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {schoolManagement.status ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-lg font-medium text-gray-900">System Information</h4>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Created By</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {schoolManagement.createdBy?.name} ({schoolManagement.createdBy?.email})
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(schoolManagement.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewSchoolManagement;