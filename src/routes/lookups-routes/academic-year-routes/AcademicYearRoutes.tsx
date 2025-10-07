import AcademicYear from '@/core-modules/admin-module/lookups/academic-year/AcademicYear'
import ViewAcademicYear from '@/core-modules/admin-module/lookups/academic-year/ViewAcademicYear'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AcademicYearRoutes:React.FC = () => {
  return (
   <Routes>
    <Route path="/" element={<AcademicYear />} />
    <Route path="view/:id" element={<ViewAcademicYear />} />
    

    
   </Routes>
  )
}

export default AcademicYearRoutes