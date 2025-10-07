import { createEvent, EventData, fetchEventById, updateEventById } from '@/api/admin-api/lookups-api/eventApi';
import { EventTypeData, fetchEventTypeDataDD } from '@/api/common-api/commonDropDownApi';
import Breadcrumb from '@/components/Breadcumb';
import MessagePopup, { MessageType } from '@/components/MessagePopup';
import React, { useEffect, useState } from 'react';
import { FcCancel } from 'react-icons/fc';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { TbArrowBackUp } from 'react-icons/tb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const EditEvent: React.FC = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventType, setEventType] = useState<EventTypeData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{
        text: string;
        type: MessageType;
    } | null>(null);

    const [formData, setFormData] = useState<Omit<any, '_id' | 'status' | 'isDeleted' | 'createdBy' | 'createdAt' | 'updatedAt' | 'userUpdatedBy' | '__v'>>({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        eventType: ''
    });

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Event", path: "/lookups/event" },
        { label: "Add Event", path: "" },
    ];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [EventTypeData] = await Promise.all([
                    fetchEventTypeDataDD(),

                ]);
                setEventType(EventTypeData.data as any);

            } catch (error) {
                console.error("Failed to load required data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchEventData = async () => {
            if (!id) {
                setError("Invalid teacher ID");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetchEventById(id);
                if (response.success) {
                    const eventData = response.data;

                    setFormData({
                        title: eventData.title || "",
                        description: eventData.description || "",
                        venue: eventData.venue || "",
                        date: eventData.date || "",
                        startTime: eventData.startTime || "",
                        endTime: eventData.endTime || "",
                        eventType: eventData.eventType.id || "",
                    });
                } else {
                    setError(response.message || "Failed to fetch event data");
                }
            } catch (error: any) {
                console.error("Error fetching event:", error);
                setError(
                    error.message || "An error occurred while fetching event data"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.title || !formData.description || !formData.date ||
                !formData.startTime || !formData.endTime || !formData.venue) {
                throw new Error('Please fill in all required fields');
            }

            const response = await updateEventById(id as string, formData);

            if (response.success) {
                toast.success(response.message || "Teacher updated successfully");
                navigate("/lookups/event");
            } else {
                toast.error(response.message || "Failed to update event");
            }
        } catch (error: any) {
            console.error("Error updating event:", error);
            // toast.error(error.message || "An error occurred while updating teacher");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-2">
            {/* Message Popup */}
            {message && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={() => setMessage(null)}
                    duration={4000}
                />
            )}

            <div className="container mx-auto p-2">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
                        <div className="mt-2">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <button
                        className="add-btn"
                        onClick={() => navigate("/lookups/event")}
                    >
                        <TbArrowBackUp size={20} className="mr-2" />
                        List
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter Title"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="w-full px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    rows={2}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    placeholder="Enter Venue"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="w-full md:w-1/3 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Event Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Event Type</option>
                                    {eventType.map((eventTypes) => (
                                        <option key={eventTypes._id as any} value={eventTypes._id}>
                                            {eventTypes.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        <Link to="/lookups/event">
                            <button
                                type="button"
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <FcCancel size={18} />
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <IoCheckmarkDoneCircleOutline size={18} />
                                    Add Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;