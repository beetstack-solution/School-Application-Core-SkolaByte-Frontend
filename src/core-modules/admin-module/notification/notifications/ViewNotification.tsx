import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcumb";
import { TbArrowBackUp } from "react-icons/tb";
import { formatDate } from '@/helpers/helper';
import { fetchNotificationById } from "@/api/super-admin-api/notifications/notificationApi";

interface User {
  name: string;
}

interface Module {
  name: string;
}

interface TriggerEvent {
  name: string;
}

interface Notification {
  code: string;
  module?: Module;
  triggerEvent?: TriggerEvent;
  messageType: string;
  emailTemplate?: string;
  messageTemplate?: string;
  notificationTemplate?: string;
  notificationtPeriod?: string;
  days?: string;
  notificationtype?: string;
  laterNotificationTimeInHour?: string;
  sendTo?: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  createdBy: User;
}

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
  highlightValue?: boolean;
  highlightClass?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  highlight = false,
  highlightValue = false,
  highlightClass = ""
}) => (
  <div className="flex flex-col gap-1">
    <span className={`text-sm font-medium text-gray-500 ${highlight ? "font-semibold" : ""}`}>
      {label}
    </span>
    <span className={`text-base ${highlightValue ? highlightClass : "text-gray-800"}`}>
      {value || "N/A"}
    </span>
  </div>
);

const ViewNotification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  const getNotificationById = async (id: string) => {
    try {
      const responseData = await fetchNotificationById(id);
      if (responseData.success) {
        setNotification(responseData.notification ?? null);
      } else {
        toast.error("Notification not found.");
        navigate("/notifications/notification");
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
      toast.error("Error fetching notification");
      navigate("/notifications/notification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getNotificationById(id);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
        {/* Notification Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800 truncate">
              View Notification:
              <span className="text-blue-600 ml-2 capitalize">
                {notification ? notification.code : "N/A"}
              </span>
            </h1>
            {notification?.status !== undefined && (
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${notification.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  }`}
              >
                {notification.status ? "Active" : "Inactive"}
              </span>
            )}
          </div>
          <nav className="mt-2" aria-label="Breadcrumb">

          </nav>
        </div>

        {/* Action Buttons */}


        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

          <button
            className='add-btn'
            onClick={() => navigate("/notifications/notification")}
            aria-label="Return to student list"
          >
            <TbArrowBackUp size={20} aria-hidden="true" />
            <span>Back</span>
          </button>



        </div>






      </div>

      {/* Notification Information Card */}
      {notification && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Notification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Code" value={notification.code} highlight />
              <InfoRow label="Module" value={notification.module?.name} />
              <InfoRow label="Trigger Event" value={notification.triggerEvent?.name} />
              <InfoRow label="Type" value={notification.messageType} />
              <InfoRow label="Email Template" value={notification.emailTemplate} />
              <InfoRow label="Message Template" value={notification.messageTemplate} />
              <InfoRow label="Notification Template" value={notification.notificationTemplate} />
              <InfoRow label="Notification Period" value={notification.notificationtPeriod} />
              <InfoRow label="Day" value={notification.days} />
              <InfoRow label="Notification type" value={notification.notificationtype} />
              <InfoRow
                label="Later Notification Time In Hour"
                value={notification.laterNotificationTimeInHour}
              />
              <InfoRow label="Send To" value={notification.sendTo} />
              <InfoRow label="Created At" value={formatDate(notification.createdAt)} />
              <InfoRow label="Updated At" value={formatDate(notification.updatedAt)} />
              <InfoRow
                label="Status"
                value={notification.status ? "Active" : "Inactive"}
                highlightValue
                highlightClass={notification.status ? "text-green-600" : "text-red-600"}
              />
              <InfoRow label="Created By" value={notification.createdBy?.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNotification;