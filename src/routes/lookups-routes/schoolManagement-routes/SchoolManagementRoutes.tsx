import AddSchoolManagement from '@/core-modules/admin-module/lookups/school-management/AddSchoolManagement'
import EditSchoolManagement from '@/core-modules/admin-module/lookups/school-management/EditSchoolManagement'
import SchoolManagement from '@/core-modules/admin-module/lookups/school-management/SchoolManagement'
import ViewSchoolManagement from '@/core-modules/admin-module/lookups/school-management/ViewSchoolManagement'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const SchoolManagementRoutes = () => {
  return (
       <Routes>
          <Route path="/" element={<SchoolManagement />} />
          <Route path="add/" element={<AddSchoolManagement />} />
          <Route path="view/:id" element={<ViewSchoolManagement />} />
          <Route path="edit/:id" element={<EditSchoolManagement />} />

      </Routes>
  )
}

export default SchoolManagementRoutes