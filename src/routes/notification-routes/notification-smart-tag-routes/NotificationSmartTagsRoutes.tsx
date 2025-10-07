import NotificationSmartTag from '@/core-modules/admin-module/notification/notification-smart-tag/NotificationSmartTag'
import ViewNotificationSmartTag from '@/core-modules/admin-module/notification/notification-smart-tag/ViewNotificationSmartTag'
import { Route, Routes } from 'react-router-dom'
const NotificationSmartTagsRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<NotificationSmartTag />} />
          <Route path="view/:id" element={<ViewNotificationSmartTag />} />

      </Routes>
  )
}

export default NotificationSmartTagsRoutes