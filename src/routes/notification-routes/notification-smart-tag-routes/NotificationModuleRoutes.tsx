import NotificationModule from '@/core-modules/admin-module/notification/notification-modules/NotificationModule'
import ViewNotificationModule from '@/core-modules/admin-module/notification/notification-modules/ViewNotificationModule'
import { Route, Routes } from 'react-router-dom'

const NotificationModuleRoutes = () => {
  return (
    <Routes>
          <Route path="/" element={<NotificationModule />} />
          <Route path="view/:id" element={<ViewNotificationModule />} />

      </Routes>
  )
}

export default NotificationModuleRoutes