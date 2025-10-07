import Department from '@/core-modules/admin-module/lookups/department/Department'
import ViewDepartment from '@/core-modules/admin-module/lookups/department/ViewDepartment'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const DepartmentRoutes = () => {
  return (
    <div>
          <Routes>
                  <Route path="/" element={<Department />} />
                  <Route path="view/:id" element={<ViewDepartment />} />
        
              </Routes>
    </div>
  )
}

export default DepartmentRoutes