import AddAssignTeachersClass from '@/core-modules/admin-module/assign-Tacher-Class/AddAssignTeachersClass'
import AssignTeachersClass from '@/core-modules/admin-module/assign-Tacher-Class/AssignTeachersClass'
import EditAssignTeachersClass from '@/core-modules/admin-module/assign-Tacher-Class/EditAssignTeachersClass'
import ViewTeachersClass from '@/core-modules/admin-module/assign-Tacher-Class/ViewTeachersClass'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
const AssignTeacherClassRoutes = () => {
  return (
    <Routes>
          <Route path="/" element={<AssignTeachersClass />} />
          <Route path="add/" element={<AddAssignTeachersClass />} />
          <Route path="view/:id" element={<ViewTeachersClass />} />
          <Route path="edit/:id" element={<EditAssignTeachersClass />} />



      </Routes>
  )
}

export default AssignTeacherClassRoutes