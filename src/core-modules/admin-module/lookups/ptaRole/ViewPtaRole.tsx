import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { getPtaRoleById } from "@/api/admin-api/lookups-api/ptaRolesApi";

function ViewPtaRole() {
    const { id } = useParams<{ id: string }>();
    const [feeType, setFeeType] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeeTypeById = async (paramId: string) => {
        try {
            const responseData: any = await getPtaRoleById(paramId);
            if (responseData.success) {
                setFeeType(responseData.data);
            } else {
                setError("PTA role not found.");
            }
        } catch (error) {
            console.error("Error fetching feeType:", error);
            setError("Error fetching feeType");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchFeeTypeById(id);
        }
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "PTA  Roles", path: "/lookups/pta-role" },
        { label: "View PTA  Role", path: "" },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">View PTA Role</h2>
                    <div className="mt-2">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <Link
                    to="/lookups/pta-role"
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <TbArrowBackUp className="mr-2" />
                    Back to List
                </Link>
            </div>

            {feeType && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Code</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feeType.code || "N/A"}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Name</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feeType.name}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Status</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${feeType.status
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                            {feeType.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Created At</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(feeType.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Created By</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {feeType.createdBy?.name || "N/A"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewPtaRole;