import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { TbArrowBackUp } from "react-icons/tb";
import { fetchTemplateById, updateTemplateById } from "@/api/super-admin-api/notifications/notificationTemplateApi";
import { fetchDdAllNotificationFunctionality, fetchDdAllNotificationModule, fetchDdAllNotificationSmartTags } from "@/api/common-api/commonDropDownApi";



const EditNotificationTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    toast.error("notification-template ID is missing");
    navigate("/notification-template");
    return;
  }

  const [templateData, setTemplateData] =
    useState<any | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [functionality, setFunctionality] = useState<any[]>([]);
  const [smartTags, setSmartTags] = useState<any[]>([]);
  const [messageTemplate, setMessageTemplate] = useState<string>("");
  const [emailTemplate, setEmailTemplate] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"Email" | "SMS" | "Notification">("Email"); // Match backend enum values
    const [nameTemplate, setNameTemplate] = useState<string>("");
    const [subjectTemplate, setSubjectTemplate] = useState<string>("");
  const [notificationTemplate, setNotificationTemplate] = useState<string>("");

  const onReturn = () => {
    navigate("/notifications/notification-template");
  };

  const getAllModules = async () => {
    try {
      const data = await fetchDdAllNotificationModule();
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

  const getAllFunctionality = async () => {
    try {
      const data = await fetchDdAllNotificationFunctionality();
      if (data && Array.isArray(data.notifications)) {
        if (data.notifications.length > 0) {
          setFunctionality(data.notifications);
        } else {
          toast.info("No notifications available");
          setFunctionality([]);
        }
      } else {
        toast.error("Failed to fetch dealer");
      }
    } catch (error: any) {
      toast.error("Error loading notifications");
    }
  };

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
    getAllModules();
    getAllFunctionality();
    getAllSmartTags();
  }, []);

  useEffect(() => {
    if (!id) {
      toast.error("Notification template ID is missing");
      navigate("/notification-template");
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await fetchTemplateById(id);
        if (response.success && response.notificationTemplate) {
          const data :any = response.notificationTemplate;
          setTemplateData(data);
          setSelectedType(data.type as "Email" | "SMS");
          setMessageTemplate(data.messageTemplate || "");
          setEmailTemplate(data.emailTemplate || "");
          setNameTemplate(data.nameTemplate || "");
          setSubjectTemplate(data.subjectTemplate || "");
          setNotificationTemplate(data.notificationTemplate || "");
        } else {
          toast.error(response.message || "Failed to fetch template");
        }
      } catch (error) {
        toast.error("Error fetching template");
      }
    };

    fetchTemplate();
  }, [id, navigate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Ensure we handle each case for different fields like module, triggerEvent, smartTags
    setTemplateData((prevState:any) =>
      prevState
        ? {
            ...prevState,
            [name]: { _id: value }, // Set the selected value as an object with _id for consistency
          }
        : prevState
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (
      !templateData?.module._id ||
      !templateData?.triggerEvent._id ||
      !selectedType
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Prepare the payload for the API request
    const payload = {
      code: templateData?.code || "",
      module: templateData?.module._id,
      triggerEvent: templateData?.triggerEvent._id,
      smartTags: templateData?.smartTags?._id || null,
      type: selectedType,
      nameTemplate:nameTemplate,
      notificationTemplate:notificationTemplate,
      subjectTemplate:subjectTemplate,
      messageTemplate: selectedType === "SMS" ? messageTemplate : "",
      emailTemplate: selectedType === "Email" ? emailTemplate : "",
      status: templateData?.status || true,
      isDefault: templateData?.isDefault || false,
    };

    try {
      // Call the API to update the notification template
      const response = await updateTemplateById(id!, payload); // `id!` assumes `id` is defined

      if (response.success) {
        toast.success("Notification template updated successfully!");
        navigate("/notifications/notification-template");
      } else {
        toast.error(
          response.message || "Failed to update notification template."
        );
      }
    } catch (error: any) {
      console.error("Error updating notification template:", error);
      toast.error("Failed to update notification template.");
    }
  };

  return (
   <div className="container mx-auto p-2">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
           Edit Notification Template
            </h2>
            <div className="mt-2">
              {/* <Breadcrumb items={breadcrumbItems} /> */}
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button
              className="add-btn"
              onClick={() => navigate("/notifications/notification-template")}
            >
              <TbArrowBackUp size={20} className="mr-2" />
              List
            </button>
          </div>
        </div>
      {/* <h2 className="text-xl font-bold mb-4">Edit Notification Template</h2> */}
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mt-4">
  {/* Form Header */}
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notification Template</h2>

  {/* Module and Functionality Row */}
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Notification Module <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name="module"
          value={templateData?.module._id || ""}
          onChange={handleSelectChange}
          className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        >
          <option value="">-- Select Module --</option>
          {modules.map((module) => (
            <option key={module._id} value={module._id}>
              {module.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>

    <div className="w-full md:w-1/3 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Notification Functionality <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name="triggerEvent"
          value={templateData?.triggerEvent._id || ""}
          onChange={handleSelectChange}
          className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        >
          <option value="">-- Select Functionality --</option>
          {functionality.map((func) => (
            <option key={func._id} value={func._id}>
              {func.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
  
      </div>
      
    </div>
           <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Template Name
      </label>
      <input
        type="text"
        value={nameTemplate}
        onChange={(e) => setNameTemplate(e.target.value)}
        className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder="Enter template name"
      />
    </div>
  </div>

  {/* Name and Subject Row */}
  <div className="flex flex-wrap -mx-3 mb-6">
   

    <div className="w-full md:w-1/3 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        Subject
      </label>
      <input
        type="text"
        value={subjectTemplate}
        onChange={(e) => setSubjectTemplate(e.target.value)}
        className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder="Enter subject"
      />
    </div>
  </div>

  {/* Notification Type */}
  <div className="mb-6 px-3">
    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-3">
      Notification Type <span className="text-red-500">*</span>
    </label>
    <div className="flex flex-wrap gap-6">
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="notificationType"
          value="Email"
          checked={selectedType === "Email"}
          onChange={() => setSelectedType("Email")}
          className="form-radio h-5 w-5 text-blue-600 transition-colors"
        />
        <span className="text-gray-700 font-medium">Email</span>
      </label>
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="notificationType"
          value="SMS"
          checked={selectedType === "SMS"}
          onChange={() => setSelectedType("SMS")}
          className="form-radio h-5 w-5 text-blue-600 transition-colors"
        />
        <span className="text-gray-700 font-medium">SMS</span>
      </label>
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="notificationType"
          value="Notification"
          checked={selectedType === "Notification"}
          onChange={() => setSelectedType("Notification")}
          className="form-radio h-5 w-5 text-blue-600 transition-colors"
        />
        <span className="text-gray-700 font-medium">Notification</span>
      </label>
    </div>
  </div>

  {/* Smart Tags */}
  <div className="mb-6 px-3">
    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-3">
      Smart Tags
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {smartTags.map((smartTag) => (
        <button
          type="button"
          key={smartTag._id}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
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

  {/* Template Content */}
  <div className="mb-6 px-3">
    {selectedType === "SMS" && (
      <>
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Message Template
        </label>
        <textarea
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter your message template..."
        />
      </>
    )}

    {selectedType === "Email" && (
      <>
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Email Template
        </label>
        <textarea
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
          className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter your email template..."
        />
      </>
    )}

    {selectedType === "Notification" && (
      <>
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Notification Template
        </label>
        <textarea
          value={notificationTemplate}
          onChange={(e) => setNotificationTemplate(e.target.value)}
          className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-48"
          placeholder="Enter your notification template..."
        />
      </>
    )}
  </div>

  {/* Form Actions */}
  <div className="flex justify-start space-x-4 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={onReturn}
      className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
    >
      <TbArrowBackUp className="mr-2" />
      Back
    </button>
    <button
      type="submit"
      className="flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
    >
      <IoCheckmarkDoneCircleOutline className="mr-2" />
      Submit
    </button>
  </div>
</form>
    </div>
  );
};

export default EditNotificationTemplate;
