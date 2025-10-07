import AddNotification from '@/core-modules/admin-module/notification/notifications/AddNotification'
import EditNotification from '@/core-modules/admin-module/notification/notifications/EditNotification'
import Notifications from '@/core-modules/admin-module/notification/notifications/Notifications'
import ViewNotification from '@/core-modules/admin-module/notification/notifications/ViewNotification'
import { Route, Routes } from 'react-router-dom'

const NotificationsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Notifications />} />
            <Route path="add/" element={<AddNotification />} />
            <Route path="view/:id" element={<ViewNotification />} />
            <Route path="edit/:id" element={<EditNotification />} />

        </Routes>
    )
}

export default NotificationsRoutes