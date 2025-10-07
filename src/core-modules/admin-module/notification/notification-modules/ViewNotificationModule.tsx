import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { fetchModuleById, Module } from "@/api/super-admin-api/notifications/notificationModuleApi";

// Add InfoRow component interface
interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  highlight?: boolean;
  highlightValue?: boolean;
  highlightClass?: string;
}

// Add InfoRow component implementation
const InfoRow = ({ label, value, highlight, highlightValue, highlightClass }: InfoRowProps) => (
  <div className={`${highlight ? 'bg-gray-50' : ''} p-3 rounded`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className={`mt-1 text-sm ${highlightValue ? (highlightClass || 'font-semibold text-gray-900') : 'text-gray-700'}`}>
      {value}
    </dd>
  </div>
);

function ViewNotificationModule() {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<Module | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getNotificationById = async (paramId: string) => {
    try {
      const responseData = await fetchModuleById(paramId);
      if (responseData.success) {
        setNotification(responseData.module);
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification Module", path: "/notifications/notification-module" },
    { label: "View notification", path: "" },
  ];

  // Helper function to format status display
  const getStatusDisplay = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? "Active" : "Inactive";
    }
    return status === 'active' ? "Active" : "Inactive";
  };

  return (
    <div className="container mx-auto p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
        {/* Notification Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800 truncate">
              View Module: 
              <span className="text-blue-600 ml-2 capitalize">
                {notification ? notification.name : "N/A"}
              </span>
            </h1>
            {notification?.status !== undefined && (
              <span 
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  notification.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {getStatusDisplay(notification.status)}
              </span>
            )}
          </div>
          <nav className="mt-2" aria-label="Breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </nav>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link to={"/notifications/notification-module"}>
            <button className="add-btn" aria-label="Return to notification module">
              <TbArrowBackUp size={20} aria-hidden="true" />
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Notification Information Card */}
      {notification && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Module Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Code" value={notification.code} highlight />
              <InfoRow label="Name" value={notification.name} highlight />
              <InfoRow 
                label="Status" 
                value={getStatusDisplay(notification.status)} 
                highlightValue
                highlightClass={notification.status ? "text-green-600" : "text-red-600"}
              />
              <InfoRow 
                label="Created At" 
                value={notification.createdAt} 
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

export default ViewNotificationModule;