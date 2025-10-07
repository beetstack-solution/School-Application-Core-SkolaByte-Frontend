import AddGrade from '@/core-modules/admin-module/lookups/grade/AddGrade'
import EditGrade from '@/core-modules/admin-module/lookups/grade/EditGrade'
import Grade from '@/core-modules/admin-module/lookups/grade/Grade'
import ViewGrade from '@/core-modules/admin-module/lookups/grade/ViewGrade'
// import React from 'react'
import { Route, Routes } from 'react-router-dom'

const GradeRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Grade />} />
        <Route path="view/:id" element={<ViewGrade />} />
        <Route path="add" element={<AddGrade />} />
        <Route path="edit/:id" element={<EditGrade />} />
      </Routes>

    </div>
  )
}

export default GradeRoutes
