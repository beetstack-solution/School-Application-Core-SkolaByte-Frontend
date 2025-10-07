import AddNoficationTemplate from '@/core-modules/admin-module/notification/notificationTemplate/AddNoficationTemplate'
import EditNotificationTemplate from '@/core-modules/admin-module/notification/notificationTemplate/EditNotificationTemplate'
import NotificationTemplate from '@/core-modules/admin-module/notification/notificationTemplate/NotificationTemplate'
import ViewNotificationTemplate from '@/core-modules/admin-module/notification/notificationTemplate/ViewNotificationTemplate'
import { Route, Routes } from 'react-router-dom'

const NotificationTemplateRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<NotificationTemplate />} />
            <Route path="add/" element={<AddNoficationTemplate />} />
            <Route path="view/:id" element={<ViewNotificationTemplate />} />
            <Route path="edit/:id" element={<EditNotificationTemplate />} />

        </Routes>
    )
}

export default NotificationTemplateRoutes