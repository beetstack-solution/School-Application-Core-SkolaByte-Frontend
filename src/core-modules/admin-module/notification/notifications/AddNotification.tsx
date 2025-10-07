import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/Breadcumb";

import { fetchDdAllNotificationSmartTags, fetchDdAllNotificationTemplate } from "@/api/common-api/commonDropDownApi";
import { fetchAllNotificationModule } from "@/api/super-admin-api/notifications/notificationModuleApi";
import { fetchSmartTagsByModuleAndTriggerEvent, fetchTriggerEventsByModule,createNotificationTemplateData } from "@/api/super-admin-api/notifications/notificationApi";

import { TbArrowBackUp } from "react-icons/tb";
export enum NotificationType {
  EMAIL = "Email",
  SMS = "SMS",
}
export enum NotificationSendPeriod {
  INSTANT = "Instant",
  LATER = "Later",
  BEFORE = "Before",
}

const AddNotification: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  // const [selectedType, setSelectedType] = useState<NotificationType | "">("");
  const [selectedPeriod, setSelectedPeriod] = useState<
    NotificationSendPeriod | ""
  >("");
  const [notificationFunctionality, setNotificationFunctionality] =
    useState<string>("");
  const [notificationFunctionalityName, setNotificationFunctionalityName] =
    useState<string>("");
  const [smartTags, setSmartTags] = useState<any[]>([]);

  const [notificationTemplateContent, setNotificationTemplateContent] =
    useState<string>("");
  const [messageTemplate, setMessageTemplate] = useState<string>("");
  const [emailTemplate, setEmailTemplate] = useState<string>("");

  const [notificationTemplate, setNotificationTemplate] = useState<string>("");
  const [notificationContent, setNotificationContent] = useState<string>("");
  // const [notificationTemplateContent, setNotificationTemplatecontent] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "Email" | "SMS" | "Notification"
  >("Email");
  const [time, setTime] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [ddNotificationTemplate, setDDNotificationTemplate] = useState<any>(""); // [DDNotificationTemplate]
  const [sendToValue, setSendToValue] = useState<any>(""); // [DDNotificationTemplate]

  // textarea
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [textareaNotificationContent, setTextareaNotificationContent] = useState<string>("");


  const onReturn = () => {
    navigate("/notifications/notification");
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification", path: "/notifications/notification" },
    { label: "Add Notification ", path: "" },
  ];

  const getAllModules = async () => {
    try {
      const data = await fetchAllNotificationModule();
      if (data && Array.isArray(data.modules)) {
        if (data.modules.length > 0) {
          setModules(data.modules);
        } else {
          toast.info("No modules available");
          setModules([]);
        }
      } else {
        toast.error("Failed to fetch dealer");
      }
    } catch (error: any) {
      toast.error("Error loading modules");
    }
  };


  useEffect(() => {
    getAllModules();
  }, []);
  const getAllSmartTags = async () => {
    try {
      const data = await fetchDdAllNotificationSmartTags();
      if (data && Array.isArray(data.notifications)) {
        if (data.notifications.length > 0) {
          setSmartTags(data.notifications);
        } else {
          toast.info("No notifications available");
          setSmartTags([]);
        }
      } else {
        toast.error("Failed to fetch dealer");
      }
    } catch (error: any) {
      toast.error("Error loading notifications");
    }
  };
  useEffect(() => {
    getAllSmartTags();
  }, []);
  const getAllNotificationTemplateDD = async () => {
    try {
      const response: any = await fetchDdAllNotificationTemplate();
      if (response.success) {
        setDDNotificationTemplate(response.notificationTemplates);


      } else {
        toast.error("Failed to fetch dealer");
      }
    } catch (error: any) {
      toast.error("Error loading notifications");
    }
  };

  useEffect(() => {
    getAllNotificationTemplateDD();
  }, []);



  const handleNotificationDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedTemplateId(selectedValue);

    const selectedTemplate = ddNotificationTemplate.find(
      (template: any) => template._id === selectedValue
    );

    // Update state based on the selected template
    setTextareaNotificationContent(
      selectedTemplate ? selectedTemplate.notificationTemplate : ""
    );
    setEmailTemplate(selectedTemplate ? selectedTemplate.emailTemplate : "");
    setMessageTemplate(selectedTemplate ? selectedTemplate.messageTemplate : "");
  };


  const handleNotificationTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaNotificationContent(e.target.value);
  };

  const handleEmailTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEmailTemplate(e.target.value);
  };
  const handleMessageTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageTemplate(e.target.value);
  };


  const handleModuleNameChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;
    setSelectedModuleName(selectedId);
    if (selectedId) {
      try {
        const triggerEventResponse = await fetchTriggerEventsByModule(
          selectedId
        );
        if (
          triggerEventResponse.success &&
          triggerEventResponse.triggerEvents?.length
        ) {
          const selectedTriggerEvent = triggerEventResponse.triggerEvents[0];
          setNotificationFunctionality(selectedTriggerEvent._id); // Store the ObjectId
          setNotificationFunctionalityName(selectedTriggerEvent.name); // Store the name

        } else {
          setNotificationFunctionality("");
          setNotificationFunctionalityName(""); // Reset the name
          setNotificationTemplateContent("");
        }
      } catch (error: any) {
        console.error("Failed to fetch data:", error.message);
        setNotificationFunctionality("");
        setNotificationFunctionalityName(""); // Reset the name
        setNotificationTemplateContent("");
      }
    } else {
      setNotificationFunctionality("");
      setNotificationFunctionalityName(""); // Reset the name
      setNotificationTemplateContent("");
    }
  };

  const handleLaterTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPeriod !== NotificationSendPeriod.INSTANT) {
      setDays(e.target.value); // Allow typing only when the period is not "Instant"
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!selectedModuleName.trim()) {
      toast.error("Please select a notification module.");
      return;
    }

    if (!notificationFunctionality.trim()) {
      toast.error("Please select a notification functionality.");
      return;
    }



    if (!selectedType.trim()) {
      toast.error("Please select a notification type.");
      return;
    }

    // Construct the payload based on AddNotificationInput
    const addData: any = {
      module: selectedModuleName,
      triggerEvent: notificationFunctionality,
      templateName: selectedTemplateId,
      notificationtPeriod: selectedPeriod,
      days: selectedPeriod === "Instant" ? "0" : "1", // Instant or Later
      messageType: selectedType,
      laterNotificationTimeInHour: time, // For "Later" time period
      sendTo: sendToValue,

    };
    if (selectedType === "Email") {
      addData.emailTemplate = emailTemplate;
    } else if (selectedType === "SMS") {
      addData.messageTemplate = messageTemplate;
    } else if (selectedType === "Notification") {
      addData.notificationTemplate = textareaNotificationContent;
    }




    try {
      // Call the API with the constructed data
      const response = await createNotificationTemplateData(addData);

      if (response.success) {
        toast.success("Notification  created successfully!");
        navigate("/notifications/notification");
      } else {
        toast.error(
          response.message || "Failed to create notification template!"
        );
      }
    } catch (error: any) {
      console.error("Error creating notification template:", error);
      toast.error("Failed to create notification template. Please try again.");
    }
  };

  return (
      <div className="container mx-auto p-2">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
             Add Notification
            </h2>
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button
              className="add-btn"
              onClick={() => navigate("/notifications/notification")}
            >
              <TbArrowBackUp size={20} className="mr-2" />
              List
            </button>
          </div>
        </div>

   
   <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mt-4">
  {/* Form Header */}

  {/* Module and Functionality Row */}
  <div className="flex flex-wrap -mx-3">
      <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notification Module <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={selectedModuleName}
          onChange={handleModuleNameChange}
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all"
          required
        >
          <option value="">-- Select Module --</option>
          {modules.map((module) => (
            <option key={module._id} value={module._id}>
              {module.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

   <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notification Functionality
      </label>
      <div className="relative">
        <select className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all">
          <option value="">Select a value</option>
          {Array.from(
            new Set<string>(
              Array.isArray(ddNotificationTemplate)
                ? ddNotificationTemplate
                  .filter(
                    (module: any) =>
                      module.module?._id === selectedModuleName
                  )
                  .map((event: any) => event.triggerEvent?.name || "")
                : []
            )
          ).map((uniqueName: string, index: number) => (
            <option key={index} value={uniqueName}>
              {uniqueName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>


    <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notification Template Name
      </label>
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all"
          value={selectedTemplateId}
          onChange={handleNotificationDropdownChange}
        >
          <option value="">Select a Value</option>
          {ddNotificationTemplate === "" ? (
            <option disabled>Loading templates...</option>
          ) : (
            ddNotificationTemplate
              .filter((template: any) => template.type === selectedType)
              .map((template: any) => (
                <option
                  key={template._id}
                  value={template._id}
                >
                  {template.nameTemplate}
                </option>
              ))
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>








  </div>

  {/* Notification Type and Template Name */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notification Type
      </label>
      <div className="flex space-x-6">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="notificationType"
            value="Email"
            checked={selectedType === "Email"}
            onChange={() => setSelectedType("Email")}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="text-gray-700">Email</span>
        </label>
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="notificationType"
            value="SMS"
            checked={selectedType === "SMS"}
            onChange={() => setSelectedType("SMS")}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="text-gray-700">SMS</span>
        </label>
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="notificationType"
            value="Notification"
            checked={selectedType === "Notification"}
            onChange={() => setSelectedType("Notification")}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="text-gray-700">Notification</span>
        </label>
      </div>
    </div>

  
  </div>

  {/* Smart Tags */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      Notification Smart Tags
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {smartTags.map((smartTag) => (
        <button
          type="button"
          key={smartTag._id}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
          onClick={() => {
            if (selectedType === "Notification") {
              setTextareaNotificationContent(
                (prevTemplate) => `${prevTemplate} ${smartTag.name}`
              );
            } else if (selectedType === "Email") {
              setEmailTemplate(
                (prevTemplate) => `${prevTemplate} ${smartTag.name}`
              );
            } else if (selectedType === "SMS") {
              setMessageTemplate(
                (prevTemplate) => `${prevTemplate} ${smartTag.name}`
              );
            }
          }}
        >
          {smartTag.name}
        </button>
      ))}
    </div>
  </div>

  {/* Template Content */}
  <div className="mb-6">
    {selectedType === "SMS" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Template
        </label>
        <textarea
          value={messageTemplate}
          onChange={handleMessageTemplateContentChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter Message Template"
        />
      </div>
    )}

    {selectedType === "Email" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Template
        </label>
        <textarea
          value={emailTemplate}
          onChange={handleEmailTemplateContentChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter Email Template"
        />
      </div>
    )}

    {selectedType === "Notification" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notification Template
        </label>
        <textarea
          value={textareaNotificationContent}
          onChange={handleNotificationTemplateContentChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter Notification Template"
        />
      </div>
    )}
  </div>

  {/* Send To and Triggering Period */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Send to
      </label>
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all"
          value={sendToValue}
          onChange={(e) => setSendToValue(e.target.value)}
        >
          <option value="">Select a value</option>
          <option value="Teacher">Teacher</option>
          <option value="Parent">Parent</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Triggering Period
      </label>
      <div className="relative">
        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(e.target.value as NotificationSendPeriod | "")
          }
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all"
        >
          <option value="">-- Select Period --</option>
          <option value={NotificationSendPeriod.INSTANT}>
            {NotificationSendPeriod.INSTANT}
          </option>
          <option value={NotificationSendPeriod.LATER}>
            {NotificationSendPeriod.LATER}
          </option>
          <option value={NotificationSendPeriod.BEFORE}>
            {NotificationSendPeriod.BEFORE}
          </option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  {/* Days and Later Time */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Days
      </label>
      <input
        type="text"
        value={
          selectedPeriod === NotificationSendPeriod.INSTANT ? "0" : days
        }
        onChange={handleDaysChange}
        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder="Enter Days"
        disabled={selectedPeriod === NotificationSendPeriod.INSTANT}
      />
    </div>

    {selectedPeriod === "Later" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Later Notification Time
        </label>
        <input
          type="text"
          onChange={handleLaterTimeChange}
          value={time}
          className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter Later Notification Time"
        />
      </div>
    )}
  </div>

  {/* Form Actions */}
  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
    <button
      type="button"
      onClick={onReturn}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
    >
      <FcCancel className="mr-2" size={18} />
      Close
    </button>
    <button
      type="submit"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
    >
      <IoCheckmarkDoneCircleOutline className="mr-2" size={18} />
      Submit
    </button>
  </div>
</form>
    </div>
  );
};

export default AddNotification;
