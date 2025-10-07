// import React from "react";
import { Route, Routes } from "react-router-dom";
import NotificationSmartTagsRoutes from "./notification-smart-tag-routes/NotificationSmartTagsRoutes";
import NotificationFunctionalityRoutes from "./notification-smart-tag-routes/NotificationFunctionalityRoutes";
import NotificationModuleRoutes from "./notification-smart-tag-routes/NotificationModuleRoutes";
import NotificationTemplateRoutes from "./notification-smart-tag-routes/NotificationTemplateRoutes";
import NotificationsRoutes from "./notification-smart-tag-routes/NotificationsRoutes";

const NotificationRoutes = () => {
  return (
      <Routes>
          <Route path="notification-smart-tags/*" element={<NotificationSmartTagsRoutes />} />
          <Route path="notification-functionality/*" element={<NotificationFunctionalityRoutes />} />
          <Route path="notification-module/*" element={<NotificationModuleRoutes />} />
          <Route path="notification-template/*" element={<NotificationTemplateRoutes />} />
          <Route path="notification/*" element={<NotificationsRoutes />} />

      </Routes>
  )
}

export default NotificationRoutes