import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { formatDate } from '@/helpers/helper';
import { fetchTemplateById } from "@/api/super-admin-api/notifications/notificationTemplateApi";

// Type definitions
interface User {
  id: string;
  name: string;
}

interface Module {
  id: string;
  name: string;
}

interface TriggerEvent {
  id: string;
  name: string;
}

interface NotificationTemplate {
  id: string;
  code: string;
  nameTemplate?: string;
  subjectTemplate?: string;
  module?: Module;
  triggerEvent?: TriggerEvent;
  messageTemplate?: string;
  emailTemplate?: string;
  notificationTemplate?: string;
  type: string;
  status: boolean;
  isDefault: boolean;
  createdBy?: User;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  notificationTemplate?: NotificationTemplate;
  message?: string;
}

// Type guard for ApiResponse
function isApiResponse(response: any): response is ApiResponse {
  return typeof response === 'object' && 
         response !== null &&
         'success' in response && 
         typeof response.success === 'boolean';
}

// Breadcrumb items
const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Notifications", link: "/notifications" },
  { label: "Notification Templates", link: "/notifications/notification-template" },
  { label: "View Template" },
];

// InfoRow component
const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  highlightValue?: boolean;
  highlightClass?: string;
}> = ({ label, value, highlight, highlightValue, highlightClass }) => (
  <div className={`${highlight ? "bg-gray-50" : ""}`}>
    <dt className={`text-sm font-medium text-gray-500`}>{label}</dt>
    <dd className={`mt-1 text-sm ${highlightValue ? highlightClass : "text-gray-900"}`}>
      {value || "N/A"}
    </dd>
  </div>
);

const ViewNotificationTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [notificationTemplate, setNotificationTemplate] = useState<NotificationTemplate | null>(null);

  const getNotificationTemplateById = async (id: string) => {
    try {
      const response = await fetchTemplateById(id);

      if (!isApiResponse(response)) {
        throw new Error("Invalid API response format");
      }

      if (response.success && response.notificationTemplate) {
        setNotificationTemplate(response.notificationTemplate);
      } else {
        toast.error(response.message || "Notification template not found.");
        navigate("/notifications/notification-template");
      }
    } catch (error) {
      console.error("Error fetching notification template:", error);
      toast.error(error instanceof Error ? error.message : "Error fetching notification template");
      navigate("/notifications/notification-template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      toast.error("Template ID is missing");
      navigate("/notifications/notification-template");
      return;
    }
    getNotificationTemplateById(id);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!notificationTemplate) {
    return <div className="flex justify-center items-center h-64">Template not found</div>;
  }

  return (
    <div className="container mx-auto p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800 truncate">
              View Notification Template:
              <span className="text-blue-600 ml-2">
                {notificationTemplate.nameTemplate || "N/A"}
              </span>
            </h1>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${notificationTemplate.status
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}>
              {notificationTemplate.status ? "Active" : "Inactive"}
            </span>
          </div>
          <nav className="mt-2" aria-label="Breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            className='add-btn'
            onClick={() => navigate("/notifications/notification-template")}
            aria-label="Return to student list"
          >
            <TbArrowBackUp size={20} aria-hidden="true" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Notification Template Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Notification Template Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Code" value={notificationTemplate.code} highlight />
            <InfoRow label="Name" value={notificationTemplate.nameTemplate} />
            <InfoRow label="Subject" value={notificationTemplate.subjectTemplate} />
            <InfoRow label="Module" value={notificationTemplate.module?.name} />
            <InfoRow label="Trigger Event" value={notificationTemplate.triggerEvent?.name} />
            <InfoRow label="Message Template" value={notificationTemplate.messageTemplate} />
            <InfoRow label="Email Template" value={notificationTemplate.emailTemplate} />
            <InfoRow label="Notification Template" value={notificationTemplate.notificationTemplate} />
            <InfoRow label="Type" value={notificationTemplate.type} />
            <InfoRow
              label="Status"
              value={notificationTemplate.status ? "Active" : "Inactive"}
              highlightValue
              highlightClass={notificationTemplate.status ? "text-green-600" : "text-red-600"}
            />
            <InfoRow
              label="Is Default"
              value={notificationTemplate.isDefault ? "Yes" : "No"}
            />
            <InfoRow
              label="Created By"
              value={notificationTemplate.createdBy?.name}
            />
            <InfoRow
              label="Created At"
              value={formatDate(notificationTemplate.createdAt)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationTemplate;