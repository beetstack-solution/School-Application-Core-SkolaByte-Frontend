import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";


import Breadcrumb from "@/components/Breadcumb";
// import SearchBar from "@/components/SearchBar";
// import Pagination from "@/components/Pagination";
// import { formatDate } from '@/helpers/helper';
import { fetchAllNotificationModule } from "@/api/super-admin-api/notifications/notificationModuleApi";
import { createNotificationTemplateData } from "@/api/super-admin-api/notifications/notificationTemplateApi";
import {DdFunctionalityData,DdSmartTagsData, fetchDdAllNotificationFunctionality, fetchDdAllNotificationSmartTags, 
  // fetchDdAllNotificationTemplate 
} from "@/api/common-api/commonDropDownApi";
// AddNotificationTemplateInput
// DdModuleData

const AddNoficationTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [functionality, setFunctionality] = useState<DdFunctionalityData[]>([]);
  const [selectedFunctionality, setSelectedFunctionality] =
    useState<string>("");
    const [nameTemplate, setNameTemplate] = useState<string>("");
    const [subjectTemplate, setSubjectTemplate] = useState<string>("");
  const [smartTags, setSmartTags] = useState<DdSmartTagsData[]>([]);
  // const [selectedSmartTags, setSelectedSmartTags] = useState<string>("");
  const [messageTemplate, setMessageTemplate] = useState<string>("");
  const [emailTemplate, setEmailTemplate] = useState<string>("");
  const [notificationTemplate, setNotificationTemplate] = useState<string>("");
  // const [ddNotificationTemplate, setDDNotificationTemplate] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "Email" | "SMS" | "Notification"
  >("Email"); // Match backend enum values

  /**
   * Navigate to the notification template page when the cancel button is clicked.
   */
  const onReturn = () => {
    navigate("/notifications/notification-template");
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Notification Template", path: "/notifications/notification-template" },
    { label: "Add Notification Template", path: "" },
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
//   const getAllNotificationTemplateDD = async () => {
// try{
//   const data = await fetchDdAllNotificationTemplate();
//   if (data && Array.isArray(data.notificationTemplate)) {
//     if (data.notificationTemplate.length > 0) {
//       setDDNotificationTemplate(data.notificationTemplate);
//     } else {
//       toast.info("No notifications available");
//       setNotificationTemplate([]); 
//     }
//   } else {
//     toast.error("Failed to fetch dealer");
//   }
//   } catch (error: any) {
//     toast.error("Error loading notifications");
//   }

//   };

  useEffect(() => {
    getAllModules();
    getAllFunctionality();
    getAllSmartTags();
    // getAllNotificationTemplateDD();
  }, []);
// console.log("ddNotificationTemplate", ddNotificationTemplate);

  const handleModuleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModuleName(e.target.value);
  };

  const handleFunctionalityNameChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFunctionality(e.target.value);
  };

  // const handleSmartTagNameChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedSmartTags(e.target.value);
  // };

  const handleMessageTemplateChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageTemplate(e.target.value);
  };

  const handleEmailTemplateChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEmailTemplate(e.target.value);
  };
  console.log("emailTemplate", emailTemplate);

  const handleNotificationTemplateChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNotificationTemplate(e.target.value);
  };
  console.log("notificationTemplate", notificationTemplate);
  // const texthandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newValue = e.target.value;
  //   if (selectedType === "Email") {
  //     setEmailTemplate((prevTemplate) => `${prevTemplate} ${newValue.name}`);
  //   } else if (selectedType === "SMS") {
  //     setMessageTemplate((prevTemplate) => `${prevTemplate} ${newValue.name}`);
  //   } else if (selectedType === "Notification") {
  //     setNotificationTemplate((prevTemplate) => `${prevTemplate} ${newValue.smartTag.name}`);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!selectedModuleName.trim()) {
      toast.error("Please select a notification module.");
      return;
    }

    if (!selectedFunctionality.trim()) {
      toast.error("Please select a notification functionality.");
      return;
    }

    // if (!selectedSmartTags.trim()) {
    //   toast.error("Please select notification smart tags.");
    //   return;
    // }

    if (selectedType === "Email" && !emailTemplate.trim()) {
      toast.error("Please enter an email template.");
      return;
    }

    if (selectedType === "SMS" && !messageTemplate.trim()) {
      toast.error("Please enter a message template.");
      return;
    }
    if (selectedType === "Notification" && !notificationTemplate.trim()) {
      toast.error("Please enter a message template.");
      return;
    }

    // Construct the payload based on AddNotificationTemplateInput
    const addData: any = {
      module: selectedModuleName,
      triggerEvent: selectedFunctionality,
      nameTemplate: nameTemplate,
      subjectTemplate: subjectTemplate,
      // smartTags: selectedSmartTags,
      messageTemplate: selectedType === "SMS" ? messageTemplate : "",
      emailTemplate: selectedType === "Email" ? emailTemplate : "",
      notificationTemplate:
        selectedType === "Notification" ? notificationTemplate : "",
      type: selectedType, // Use the correct case-sensitive value
    };

    try {
      // Call the API with the constructed data
      const response = await createNotificationTemplateData(addData);

      if (response.success) {
        toast.success("Notification template created successfully!");
        navigate("/notifications/notification-template"); 
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
             Add Notification Template
            </h2>
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
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





    
   <form onSubmit={handleSubmit} className="mt-6 space-y-6 bg-white p-6 rounded-lg shadow-md">
  <div className="flex flex-wrap -mx-3">
    {/* Notification Module */}
    <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Notification Module <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedModuleName}
        onChange={handleModuleNameChange}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Notification Functionality <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedFunctionality}
        onChange={handleFunctionalityNameChange}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        required
      >
        <option value="">-- Select Functionality --</option>
        {functionality.map((func) => (
          <option key={func._id} value={func._id}>
            {func.name}
          </option>
        ))}
      </select>
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Template Name
      </label>
      <input
        type="text"
        value={nameTemplate}
        onChange={(e) => setNameTemplate(e.target.value)}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Enter template name"
      />
    </div>
  </div>

  <div className="flex flex-wrap -mx-3">

    
    <div className="w-full md:w-1/3 px-3 mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        Subject
      </label>
      <input
        type="text"
        value={subjectTemplate}
        onChange={(e) => setSubjectTemplate(e.target.value)}
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Enter subject"
      />
    </div>
  </div>

  <div className="px-3 mb-6">
    <label className="block text-gray-700 text-sm font-semibold mb-3">
      Notification Type <span className="text-red-500">*</span>
    </label>
    <div className="flex flex-wrap gap-4">
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="notificationType"
          value="Email"
          checked={selectedType === "Email"}
          onChange={() => setSelectedType("Email")}
          className="form-radio h-5 w-5 text-blue-600 transition-all"
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
          className="form-radio h-5 w-5 text-blue-600 transition-all"
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
          className="form-radio h-5 w-5 text-blue-600 transition-all"
        />
        <span className="text-gray-700">Notification</span>
      </label>
    </div>
  </div>

  <div className="px-3 mb-6">
    <label className="block text-gray-700 text-sm font-semibold mb-3">
      Smart Tags
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {smartTags.map((smartTag) => (
        <button
          type="button"
          key={smartTag._id}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
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

  <div className="px-3 mb-6">
    {selectedType === "SMS" && (
      <>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Message Template
        </label>
        <textarea
          value={messageTemplate}
          onChange={handleMessageTemplateChange}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your SMS message template..."
          rows={6}
        />
      </>
    )}

    {selectedType === "Email" && (
      <>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Email Template
        </label>
        <textarea
          value={emailTemplate}
          onChange={handleEmailTemplateChange}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your email template..."
          rows={6}
        />
      </>
    )}

    {selectedType === "Notification" && (
      <>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Notification Template
        </label>
        <textarea
          value={notificationTemplate}
          onChange={handleNotificationTemplateChange}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your notification template..."
          rows={6}
        />
      </>
    )}
  </div>

  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={onReturn}
      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
    >
      <span className="flex items-center">
        <FcCancel size={18} className="mr-2" />
        Cancel
      </span>
    </button>
    <button
      type="submit"
      className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
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

export default AddNoficationTemplate;
