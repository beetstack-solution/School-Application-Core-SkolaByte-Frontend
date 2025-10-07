import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcumb";
import { fetchAllNotificationModule } from "@/api/super-admin-api/notifications/notificationModuleApi";
import { fetchSmartTagsByModuleAndTriggerEvent, fetchTriggerEventsByModule,updateNotificationById,fetchNotificationById } from "@/api/super-admin-api/notifications/notificationApi";
import { fetchDdAllNotificationSmartTags, fetchDdAllNotificationTemplate } from "@/api/common-api/commonDropDownApi";
import { TbArrowBackUp } from "react-icons/tb";
export enum NotificationType {
  EMAIL = "Email",
  SMS = "SMS",
  NOTIFICATION = "Notification",
}
export enum NotificationSendPeriod {
  INSTANT = "Instant",
  LATER = "Later",
  BEFORE = "Before",
}

const EditNotification: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModuleName, setSelectedModuleName] = useState<any>("");
  const [selectedType, setSelectedType] = useState<
    "Email" | "SMS" | "Notification"
  >("Email");
  const [selectedPeriod, setSelectedPeriod] = useState<
    NotificationSendPeriod | ""
  >("");
  const [notificationFunctionality, setNotificationFunctionality] =
    useState<string>("");
  const [notificationFunctionalityName, setNotificationFunctionalityName] =
    useState<string>("");

  const [notificationTemplateContent, setNotificationTemplateContent] =
    useState<string>("");
  const [time, setTime] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [smartTags, setSmartTags] = useState<any[]>([]);
  const [ddNotificationTemplate, setDDNotificationTemplate] = useState<any>(""); // [DDNotificationTemplate]
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [textareaNotificationContent, setTextareaNotificationContent] =
    useState<string>("");
   
  const [messageTemplate, setMessageTemplate] = useState<string>("");
  const [emailTemplate, setEmailTemplate] = useState<string>("");
  const [notificationTemplate, setNotificationTemplate] = useState<string>("");
  const [sendToValue, setSendToValue] = useState<any>("");
const [filterfunctiondd, setFilterFunctionDD] = useState<any>("");



  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification", path: "/notifications/notification" },
    { label: "Edit Notification", path: "" },
  ];
  const onReturn = () => {
    navigate("/notifications/notification");
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

          // const smartTagsResponse = await fetchSmartTagsByModuleAndTriggerEvent(
          //   selectedId,
          //   selectedTriggerEvent._id
          // );
          // if (
          //   smartTagsResponse.success &&
          //   smartTagsResponse.smartTags?.length
          // ) {
          //   setNotificationTemplateContent(
          //     smartTagsResponse.smartTags[0].messageTemplate
          //   );
          // } else {
          //   setNotificationTemplateContent("");
          // }
        } else {
          setNotificationFunctionality("");
          setNotificationFunctionalityName("");
          setNotificationTemplateContent("");
        }

      } catch (error: any) {
        console.error("Failed to fetch data:", error.message);
        setNotificationFunctionality("");
        setNotificationFunctionalityName("");
        setNotificationTemplateContent("");
      }
    } else {
      setNotificationFunctionality("");
      setNotificationFunctionalityName("");
      setNotificationTemplateContent("");
    }
  };
// const handleModuleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedModule = e.target.value;
//   setSelectedModuleName(selectedModule);

//   const filteredFunctionalities = ddNotificationTemplate
//     .filter((event: any) => event.module.name === selectedModule) // Match the module name
//     .map((event: any) => event.triggerEvent?.name || ""); // Extract triggerEvent.name, default to ''

//   setNotificationFunctionalityName(""); // Reset selected functionality
// };
// const fetchNotificationFunctionality=async()=>{
//   try {
//     const response = await fetchTriggerEventsByModule(selectedModuleName);
//     if (response.success) {
//       setNotificationFunctionDD(response.triggerEvents);
//     } else {
//       toast.error("Failed to fetch notification functionality");
//     }
//   } catch (error: any) {
//     toast.error("Error loading notification functionality");
//   }
// }
// useEffect(() => {
//   fetchNotificationFunctionality();
// }, [selectedModuleName]);
  const handleNotificationTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotificationTemplate(e.target.value);
  };
  const handleMessageTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageTemplate(e.target.value);
  };
  const handleEmailTemplateContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
   
    setEmailTemplate(e.target.value);
  };
  const handleLaterTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPeriod !== NotificationSendPeriod.INSTANT) {
      setDays(e.target.value); // Allow typing only when the period is not "Instant"
    }
  };

  const getAllModules = async () => {
    try {
      const data = await fetchAllNotificationModule();
      if (data && Array.isArray(data.modules)) {
        setModules(data.modules);
      } else {
        toast.error("Failed to fetch modules");
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
  useEffect(() => {
    const fetchNotification = async () => {
      if (id) {
        try {
          const response = await fetchNotificationById(id);
          if (response.success && response.notification) {
            const {
              module,
              triggerEvent,
              // notificationTemplateContent,
              // notificationtype,
              days,
              laterNotificationTimeInHour,
              messageType,
              sendTo,
              emailTemplate,
              messageTemplate,
              notificationTemplate,
              notificationtPeriod,
              templateName,
            } = response.notification;

            // setSetlectedTemplateId(messageType || "");
            // setSelectedType(messageType || "");
            setNotificationTemplate(notificationTemplate || "");
            setEmailTemplate(emailTemplate || "");
            setMessageTemplate(messageTemplate || "");
            setSendToValue(sendTo || "");
            // setSelectedPeriod(notificationtPeriod);
            setSelectedTemplateId(templateName._id || "");
            setSelectedType(messageType);
            setSelectedModuleName(module._id || "");
            setNotificationFunctionality(triggerEvent?._id || "");
            setNotificationFunctionalityName(triggerEvent?.name || "");
            // setNotificationTemplateContent(notificationTemplateContent || "");

            // Validate notificationtype against the NotificationSendPeriod enum
            setSelectedPeriod(
              Object.values(NotificationSendPeriod).includes(
                notificationtPeriod as NotificationSendPeriod
              )
                ? (notificationtPeriod as NotificationSendPeriod)
                : ""
            );

            // Validate messageType against the NotificationType enum
            // setSelectedType(
            //   Object.values(NotificationType).includes(
            //     messageType as NotificationType
            //   )
            //     ? (messageType as NotificationType)
            //     : ""
            // );

            setDays(String(days || ""));
            setTime(String(laterNotificationTimeInHour || ""));
          } else {
            toast.error(response.message || "Notification not found.");
          }
        } catch (error) {
          toast.error("Error fetching notification data.");
        }
      }
    };
    fetchNotification();
  }, [id]);

  const handleNotificationDropdownChange =  (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedTemplateId(selectedValue);
    setSelectedTemplateId(event.target.value);

  const selectedTemplate = ddNotificationTemplate.find(
    (template: any) => template.nameTemplate === selectedValue
  );

  // Update state based on the selected template
  setNotificationTemplate(
    selectedTemplate ? selectedTemplate.notificationTemplate : ""
  );
  setEmailTemplate(selectedTemplate ? selectedTemplate.emailTemplate : "");
  setMessageTemplate(selectedTemplate ? selectedTemplate.messageTemplate : "");


  };
  useEffect(() => {

    if (ddNotificationTemplate.length > 0) {
      setSelectedTemplateId(ddNotificationTemplate.nameTemplate);
      setNotificationTemplate(ddNotificationTemplate.notificationTemplate);
      setEmailTemplate(ddNotificationTemplate.emailTemplate);
      setMessageTemplate(ddNotificationTemplate.messageTemplate);
    }
  }, [ddNotificationTemplate]);


const handleFunctionChange =(e: React.ChangeEvent<HTMLSelectElement>)=>{

setSelectedModuleName(selectedModuleName)
const filterFunction = ddNotificationTemplate.find(
  (event: any) => event.triggerEvent._id === selectedModuleName
);

// setNotificationTemplate(filterFunction ? filterFunction.notificationTemplate : "");
setNotificationFunctionalityName(filterFunction ? filterFunction.triggerEvent.name : "");
setNotificationFunctionalityName((e.target.value));
}
useEffect(() => {
  if (ddNotificationTemplate.length > 0) {
    setSelectedModuleName(ddNotificationTemplate.module);
    setFilterFunctionDD(ddNotificationTemplate.triggerEvent);
    setNotificationFunctionalityName(ddNotificationTemplate.triggerEvent.name);
  }
}, []);





const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!id) {
    toast.error("Invalid Notification ID.");
    return;
  }

  try {
    const payload: any = {
      // module: {
      //   _id: selectedModuleName,
      //   name: modules.find((mod) => mod._id === selectedModuleName)?.name || "",
      // },
      // triggerEvent: {
      //   _id: notificationFunctionality,
      //   name: notificationFunctionalityName,
      // },
      // notificationTemplateContent,
      // notificationtype: selectedPeriod,
      // messageType: selectedType,
      // templateName: selectedTemplateId,
      // sendTo: sendToValue,
      // notificationtPeriod: selectedPeriod,
      // days: selectedPeriod === NotificationSendPeriod.INSTANT ? "0" : days,
      // laterNotificationTimeInHour:
      //   selectedPeriod === NotificationSendPeriod.LATER ? time : "",
      module: selectedModuleName,
      triggerEvent: notificationFunctionality,
      templateName: selectedTemplateId,
      notificationtPeriod: selectedPeriod,
      days: selectedPeriod === NotificationSendPeriod.INSTANT ? "0" : days,
      messageType: selectedType,
      laterNotificationTimeInHour: time,
      sendTo: sendToValue,
    };

    // Add templates conditionally based on selectedType
    if (selectedType === NotificationType.EMAIL) {
      payload.emailTemplate = emailTemplate;
      payload.messageTemplate = "";
      payload.notificationTemplate = "";
    } else if (selectedType === NotificationType.SMS) {
      payload.messageTemplate = messageTemplate;
      payload.emailTemplate = "";
      payload.notificationTemplate = "";
    
    } else if (selectedType === NotificationType.NOTIFICATION) {
      payload.notificationTemplate = notificationTemplate;
      payload.messageTemplate = "";
      payload.emailTemplate = "";
    }

    const response = await updateNotificationById(id, payload);
    if (response.success) {
      toast.success("Notification updated successfully!");
      navigate("/notifications/notification");
    } else {
      toast.error(response.message || "Failed to update notification.");
    }
  } catch (error: any) {
    toast.error(error.message || "An error occurred while updating.");
  }
};

  return (
     <div className="container mx-auto p-2">



         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
        Edit Notification
            </h2>
            <div className="mt-2">
              {/* <Breadcrumb items={breadcrumbItems} /> */}
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











      <h2 className="text-xl font-bold mb-4">Edit Notification</h2>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
   <form className="bg-white rounded-xl shadow-md p-6 mt-4"onSubmit={handleSubmit}>
  {/* Module and Functionality Row */}
  <div className="flex flex-wrap -mx-3">
    {/* Notification Module */}
      <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notification Module
      </label>
      <select
        value={selectedModuleName}
        onChange={handleModuleNameChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">-- Select Module --</option>
        {modules.map((module) => (
          <option key={module._id} value={module._id}>
            {module.name}
          </option>
        ))}
      </select>
    </div>

    {/* Notification Functionality */}
         <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notification Functionality
      </label>
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        value={notificationFunctionalityName}
        onChange={handleFunctionChange}
      >
        <option value="">-- Select Functionality --</option>
        {Array.from(
          new Set<string>(
            Array.isArray(ddNotificationTemplate)
              ? ddNotificationTemplate
                  .filter(
                    (event: any) => event.module?._id === selectedModuleName
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
    </div>

     <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notification Template Name
      </label>
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        value={selectedTemplateId}
        onChange={handleNotificationDropdownChange}
      >
        <option value="">Select a Template</option>
        {ddNotificationTemplate === "" ? (
          <option disabled>Loading templates...</option>
        ) : (
          ddNotificationTemplate
            .filter((template: any) => template.type === selectedType)
            .map((template: any) => (
              <option key={template._id} value={template._id}>
                {template.nameTemplate}
              </option>
            ))
        )}
      </select>
    </div>







  </div>

  {/* Notification Type and Template Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Notification Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Notification Type
      </label>
      <div className="flex space-x-6">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="notificationType"
            value="Email"
            checked={selectedType === "Email"}
            onChange={(e) => setSelectedType("Email")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">Email</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="notificationType"
            value="SMS"
            checked={selectedType === "SMS"}
            onChange={(e) => setSelectedType("SMS")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">SMS</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="notificationType"
            value="Notification"
            checked={selectedType === "Notification"}
            onChange={(e) => setSelectedType("Notification")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-gray-700">Notification</span>
        </label>
      </div>
    </div>

    {/* Notification Template Name */}
   
  </div>

  {/* Smart Tags Section */}
  <div className="space-y-2 mt-4">
    <label className="block text-sm font-medium text-gray-700">
      Notification Smart Tags
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {smartTags.map((smartTag) => (
        <button
          type="button"
          key={smartTag._id}
          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
          onClick={() => {
            if (selectedType === "Notification") {
              setNotificationTemplate(
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

  {/* Template Content Area */}
  <div className="space-y-2 mt-4">
    {selectedType === "SMS" && (
      <> 
        <label className="block text-sm font-medium text-gray-700">
          Message Template
        </label>
        <textarea
          value={messageTemplate}
          onChange={handleMessageTemplateContentChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Message Template"
          rows={6}
        />
      </>
    )}

    {selectedType === "Email" && (
      <>
        <label className="block text-sm font-medium text-gray-700">
          Email Template
        </label>
        <textarea
          value={emailTemplate}
          onChange={handleEmailTemplateContentChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Email Template"
          rows={6}
        />
      </>
    )}

    {selectedType === "Notification" && (
      <>
        <label className="block text-sm font-medium text-gray-700">
          Notification Template
        </label>
        <textarea
          value={notificationTemplate}
          onChange={handleNotificationTemplateContentChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Notification Template"
          rows={6}
        />
      </>
    )}
  </div>

  {/* Recipient and Timing Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Send To */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Send to
      </label>
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        value={sendToValue}
        onChange={(e) => setSendToValue(e.target.value)}
      >
        <option value="">Select recipient</option>
        <option value="Teacher">Teacher</option>
        <option value="Parent">Parent</option>
      </select>
    </div>

    {/* Triggering Period */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Triggering Period
      </label>
      <select
        value={selectedPeriod}
        onChange={(e) =>
          setSelectedPeriod(e.target.value as NotificationSendPeriod | "")
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
    </div>
  </div>

  {/* Days Input */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Days
      </label>
      <input
        type="text"
        value={
          selectedPeriod === NotificationSendPeriod.INSTANT ? "0" : days
        }
        onChange={handleDaysChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        placeholder="Enter Days"
        disabled={selectedPeriod === NotificationSendPeriod.INSTANT}
      />
    </div>

    {/* Later Time Input (conditionally shown) */}
    {selectedPeriod === "Later" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Later Notification Time
        </label>
        <input
          type="text"
          onChange={handleLaterTimeChange}
          value={time}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter time (e.g., 14:30)"
        />
      </div>
    )}
  </div>

  {/* Form Actions */}
  <div className="flex justify-end space-x-4 pt-4">
    <button
      type="button"
      onClick={onReturn}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className="flex items-center">
        <FcCancel size={18} className="mr-2" />
        Close
      </span>
    </button>
    <button
      type="submit"
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className="flex items-center">
        <IoCheckmarkDoneCircleOutline size={18} className="mr-2" />
        Submit
      </span>
    </button>
  </div>
</form>
    </div>
  );
};

export default EditNotification;
