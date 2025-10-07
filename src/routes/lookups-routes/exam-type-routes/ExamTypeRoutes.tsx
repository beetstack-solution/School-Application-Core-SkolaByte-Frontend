import ExamType from '@/core-modules/admin-module/lookups/exam-type/ExamType'
import ViewExamType from '@/core-modules/admin-module/lookups/exam-type/ViewExamType'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const ExamTypeRoutes = () => {
  return (
    <div>
      <Routes>
            <Route path="/" element={<ExamType />} />   
            <Route path="view/:id" element={<ViewExamType />} />                                             
        </Routes>
    </div>
  )
}

export default ExamTypeRoutes
