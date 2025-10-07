import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { fetchSmartById, Notification } from "@/api/super-admin-api/notifications/notificationSmartTagsApi";
import Breadcrumb from "@/components/Breadcumb";

// Add the InfoRow component
const InfoRow = ({ 
  label, 
  value, 
  highlight = false, 
  highlightValue = false, 
  highlightClass = "" 
}: {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
  highlightValue?: boolean;
  highlightClass?: string;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
    <span className={`text-sm font-medium text-gray-500 min-w-[120px] ${highlight ? "font-semibold text-gray-700" : ""}`}>
      {label}
    </span>
    <span className={`text-sm text-gray-800 ${highlightValue ? "font-semibold" : ""} ${highlightClass}`}>
      {value || "N/A"}
    </span>
  </div>
);

function ViewNotificationSmartTag() {
    const { id } = useParams<{ id: string }>();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getNotificationById = async (paramId: string) => {
        try {
            const responseData = await fetchSmartById(paramId);
            if (responseData.success) {
                setNotification(responseData.notification);
            } else {
                setError("Notification not found.");
            }
        } catch (error) {
            console.error("Error fetching notification:", error);
            setError("Error fetching notification");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getNotificationById(id);
        }
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Notification Smart Tag", path: "/notifications/notification-smart-tags/" },
        { label: "View notification", path: "" },
    ];

    // Format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto p-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
                {/* Smart Tag Info Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-800 truncate">
                            View Smart Tag: 
                            <span className="text-blue-600 ml-2 capitalize">
                                {notification ? notification.name : "N/A"}
                            </span>
                        </h1>
                       {notification?.status !== undefined && (
  <span 
    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
      ['active', true].includes(notification.status as any)
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800"
    }`}
  >
    {['active', true].includes(notification.status as any) ? "Active" : "Inactive"}
  </span>
)}
                    </div>
                    <nav className="mt-2" aria-label="Breadcrumb">
                        <Breadcrumb items={breadcrumbItems} />
                    </nav>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                   
                                        <Link 
                        to={"/notifications/notification-smart-tags/"}> <button 
                       className='add-btn'
                         
                         aria-label="Return to student list"
                       >
                         <TbArrowBackUp size={20} aria-hidden="true" />
                         <span>Back</span>
                       </button>
                   
                   </Link>
                
                </div>
            </div>
            
            {/* Smart Tag Information Card */}
            {notification && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            Smart Tag Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow label="Code" value={notification.code} highlight />
                            <InfoRow label="Name" value={notification.name} highlight />
                            <InfoRow 
                                label="Status" 
                                value={notification.status ? "Active" : "Inactive"} 
                                highlightValue
                                highlightClass={notification.status ? "text-green-600" : "text-red-600"}
                            />
                            <InfoRow 
                                label="Created At" 
                                value={formatDate(notification.createdAt)} 
                            />
                            <InfoRow 
                                label="Created By" 
                                value={notification.createdBy?.name || "N/A"} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewNotificationSmartTag;