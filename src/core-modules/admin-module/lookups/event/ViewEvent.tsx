import { fetchEventById } from '@/api/admin-api/lookups-api/eventApi';
import Breadcrumb from '@/components/Breadcumb';
import React, { useEffect, useState } from 'react'
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

const ViewEvent = () => {
    const { id } = useParams<{ id: string }>();
    const [eventData, setEventData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const Navigate = useNavigate();

    const getEventById = async (id: string) => {
        try {
            const responseData = await fetchEventById(id);
            if (responseData.success) {
                setEventData(responseData?.data);
            } else {
                setError(" event data not found");
            }
        } catch (error: any) {
            console.error("Error fetching class module data:", error);
            setError(
                error.response?.data?.message || "Error fetching event module data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getEventById(id);
        }
    }, [id]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    const onReturn = () => {
        Navigate("/lookups/event");
    };
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Event List", path: "/lookups/event" },
        { label: "View Event", path: "" },
    ];


    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
                <div>
                    <h3 className="text-xl font-semibold mb-4">View Event</h3>
                    <div className="breadcrumb-section">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="header-btns flex gap-2 ">
                    <div>
                        <button className="add-btn" onClick={onReturn}>
                            <TbArrowBackUp size={20} className="mr-2" />
                            Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Display Class Information */}
            {eventData && (
                <div className="w-full md:w-4/5 mt-5">
                    <table className="min-w-full border-collapse">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Title</td>
                                <td className="border px-4 py-2">{eventData?.title || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">description</td>
                                <td className="border px-4 py-2">{eventData?.description || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">date</td>
                                <td className="border px-4 py-2">{eventData.date ? new Date(eventData.date).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Start Time</td>
                                <td className="border px-4 py-2">{eventData?.startTime}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">End Time</td>
                                <td className="border px-4 py-2">{eventData?.endTime}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Status</td>
                                <td className="border px-4 py-2">
                                    {eventData.status ? "Active" : "Inactive"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Created By</td>
                                <td className="border px-4 py-2">
                                    {eventData?.createdBy?.name || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Created At</td>
                                <td className="border px-4 py-2">
                                    {eventData.userUpdatedDate 
    ? new Date(eventData.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'N/A'}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Updated At</td>
                                <td className="border px-4 py-2">
                                {eventData.userUpdatedDate 
    ? new Date(eventData.userUpdatedDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'N/A'}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Updated By</td>
                                <td className="border px-4 py-2">
                                    {eventData?.updatedBy?.name || "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ViewEvent