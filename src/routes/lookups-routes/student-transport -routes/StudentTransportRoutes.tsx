import AddStudentsTransport from '@/core-modules/admin-module/lookups/student-transport/AddStudentsTransport'
import EditStudentsTransport from '@/core-modules/admin-module/lookups/student-transport/EditStudentsTransport'
import StudentTransport from '@/core-modules/admin-module/lookups/student-transport/StudentTransport'
import ViewStudentsTransport from '@/core-modules/admin-module/lookups/student-transport/ViewStudentsTransport'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const StudentTransportRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentTransport />} />
      <Route path="add/" element={<AddStudentsTransport />} />
      <Route path="edit/:id/" element={<EditStudentsTransport />} />
      <Route path="view/:id/" element={<ViewStudentsTransport />} />

    </Routes>
  )
}

export default StudentTransportRoutes