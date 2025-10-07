import NotificationFunctionality from '@/core-modules/admin-module/notification/notificationFunctionality/NotificationFunctionality'
import ViewNotificationFunctionality from '@/core-modules/admin-module/notification/notificationFunctionality/ViewNotificationFunctionality'
// import React from 'react'
import { Route, Routes } from 'react-router-dom'

const NotificationFunctionalityRoutes = () => {
  return (
          <Routes>
          <Route path="/" element={<NotificationFunctionality />} />
          <Route path="view/:id" element={<ViewNotificationFunctionality />} />
    
          </Routes>
  )
}

export default NotificationFunctionalityRoutes