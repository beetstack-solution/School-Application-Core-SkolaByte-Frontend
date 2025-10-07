import { getPTAProfileById } from '@/api/admin-api/lookups-api/ptaProfileApi'
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect } from 'react'
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

function ViewPtaProfile() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const BaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [ptaProfile, setPtaProfile] = React.useState<any>(null);

    const fetchPtaProfile = async () => {
        try {
            if (!id) {
                throw new Error("No ID provided for fetching PTA Profile");
            }
            const response:any = await getPTAProfileById(id);
            setPtaProfile(response.data);
        } catch (error) {
            console.error('Error fetching PTA Profile:', error);    
        }
    }

    useEffect(() => {
        fetchPtaProfile();
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "PTA Profile", path: "/lookups/pta-profile" },
        { label: "View PTA Profile", path: "" },
    ];

    return (
        <div className="mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">View PTA Profile</h3>
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

                {/* Profile Details Section */}
                {ptaProfile ? (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Section */}
                            <div className="w-full md:w-1/3">
                                <div className="border rounded-lg overflow-hidden">
                                    <img 
                                        src={`${ptaProfile.imageUrl}`} 
                                        alt={`${ptaProfile.fullName}'s profile`}
                                        className="w-50 h-auto object-cover "
                                    />
                                </div>
                            </div>
                            
                            {/* Details Section */}
                            <div className="w-full md:w-2/3">
                                <h2 className="text-2xl font-bold mb-4">{ptaProfile.fullName}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">PTA Role</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ptaProfile.ptaRole?.name || 'N/A'}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ptaProfile.email || 'N/A'}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ptaProfile.status ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(ptaProfile.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ptaProfile.createdBy?.name} ({ptaProfile.createdBy?.email})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p>Loading profile data...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewPtaProfile