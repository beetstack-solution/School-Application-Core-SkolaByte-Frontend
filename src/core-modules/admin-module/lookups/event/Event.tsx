import { deleteEvent, EventData, fetchEvents, updateEventStatusById } from '@/api/admin-api/lookups-api/eventApi';
import Breadcrumb from '@/components/Breadcumb';
import MessagePopup, { MessageType } from '@/components/MessagePopup';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { GrOverview } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { RiPlayListAddFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Event = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [totalItems, setTotalItems] = useState(0);
    const [eventList, seteventList] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [message, setMessage] = useState<{
        text: string;
        type: MessageType;
    } | null>(null);
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Event list", path: "" },
    ];

    const loadevents = async (search = "") => {
        setIsLoading(true);
        try {
            const { eventList: data, total } = await fetchEvents(
                currentPage - 1,
                itemsPerPage,
                search
            );
            if (data && data.length > 0) {
            }
            seteventList(data);
            setTotalItems(total);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch events");
            seteventList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadevents(searchTerm);
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };
    const geteventId = (event: any): string => {
        return event._id || event.id || "";
    };

    const handleStatusUpdate = async (event: EventData) => {
        const eventId = geteventId(event);
        if (!eventId) {
            toast.error("Cannot update status: Student ID is missing or invalid");
            return;
        }
        const newStatus = !event.status;
        const confirmUpdate = window.confirm(
            `Are you sure you want to change the status to ${newStatus ? "Active" : "Inactive"}?`
        );
        if (!confirmUpdate) {
            return;
        }
        try {
            const responseData = await updateEventStatusById(eventId, newStatus);

            if (responseData?.success) {
                setMessage({
                    text: `Student status updated to ${newStatus ? "Active" : "Inactive"}.`,
                    type: "success"
                });
                loadevents(searchTerm);
            } else {
                toast.error(
                    responseData?.message ||
                    "Failed to update event status."
                );
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update student status.");
        }
    };

    const handleDelete = async (event: EventData) => {
        const eventId = geteventId(event);
        if (!eventId) {
            toast.error("Cannot delete: Student ID is missing or invalid");
            return;
        }
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await deleteEvent(eventId);

            if (response && response.success === true) {
                toast.success(response.message || "event deleted successfully!");
                loadevents(searchTerm);
            } else {
                toast.error(
                    response?.message || "Failed to delete event. Please try again."
                );
            }
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error(
                error.message || "An error occurred while deleting the student. Please try again."
            );
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            {/* Message Popup */}
            {message && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage(null)}
                    duration={4000}
                />
            )}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Event List</h2>
                        <div className="mt-1">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center w-full md:w-auto gap-3">
                        <Link to={'add'} className="w-full md:w-auto">
                            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto shadow-sm hover:shadow-md">
                                <RiPlayListAddFill className="text-lg" />
                                Add Event
                            </button>
                        </Link>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                {/* Table Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                //  style={{ height: 'calc(100vh - 200px)' }}
                 >
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    {[
                                        { name: "Sl No.", width: "w-16" },
                                        { name: "Actions" },
                                        { name: "Status" },
                                        { name: "Titile" },
                                        { name: "Date" },
                                        { name: "Venue" },
                                        { name: "EventType" },
                                        // { name: "Created By", width: "w-32" },
                                        { name: "Created At" }
                                    ].map((header) => (
                                        <th
                                            key={header.name}
                                            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
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
                                        <td colSpan={11} className="px-4 py-4 text-center text-gray-500">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-4 text-center text-red-500 font-medium">
                                            {error}
                                        </td>
                                    </tr>
                                ) : eventList.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-4 text-center text-gray-500">
                                            No Event found
                                        </td>
                                    </tr>
                                ) : (
                                    eventList.map((event: any, index) => (
                                        <tr key={geteventId(event) || index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`view/${geteventId(event)}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                                                        <GrOverview size={20} title="View" />
                                                    </Link>
                                                    <Link to={`edit/${geteventId(event)}`} className="text-gray-500 hover:text-green-600 transition-colors">
                                                        <CiEdit size={22} title="Edit" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(event)}
                                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <MdDeleteOutline size={18} title="Delete" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(event)}
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {event.status ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {event.title}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                                {event.venue}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {event.eventType?.name || 'N/A'}
                                            </td>
                                            {/* <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
             {event.createdBy?.name || 'N/A'}
           </td> */}
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(event.createdAt).toLocaleDateString()}
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
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Event