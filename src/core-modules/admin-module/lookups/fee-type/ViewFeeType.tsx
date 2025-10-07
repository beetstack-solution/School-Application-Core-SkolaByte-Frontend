import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { getFeeTypeById, FeeTypeData } from "@/api/admin-api/lookups-api/feeTypeApi";

function ViewFeeType() {
    const { id } = useParams<{ id: string }>();
    const [feeType, setFeeType] = useState<FeeTypeData | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeeTypeById = async (paramId: string) => {
        try {
            const responseData:any = await getFeeTypeById(paramId);
            if (responseData.success) {
                setFeeType(responseData.data);
            } else {
                setError("FeeTypeData not found.");
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

    if (loading) return <div className="text-center">Loading...</div>; // Loading state
    if (error) return <div className="text-center text-red-500">{error}</div>; // Error state
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: " Fee Type", path: "/lookups/fee-types" },
        { label: " View feeType", path: "" },
    ];
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">View Fee Type</h3>
            <div className="flex flex-col md:flex-row justify-start items-center px-1">
                <div className="breadcrumb-section">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>
            <div className="header-btns">
                <Link to={"/lookups/fee-types"}>
                    <button className="add-btn">
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </Link>
            </div>
            {feeType && (
                <div className="flex justify-between mt-4">
                    <div className="w-full md:w-4/5">
                        <table className="min-w-full border-collapse">
                            <tbody>
                                {/* Row 1 */}
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Code</td>
                                    <td className="border px-4 py-2">{feeType.code}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Name</td>
                                    <td className="border px-4 py-2">{feeType.name}</td>
                                </tr>

                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Status</td>
                                    <td className="border px-4 py-2">
                                        {feeType.status ? "Active" : "Inactive"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Created At</td>
                                    <td className="border px-4 py-2">{feeType.createdAt}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Created By</td>
                                    <td className="border px-4 py-2">
                                        {feeType.createdBy.name}
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

export default ViewFeeType;
