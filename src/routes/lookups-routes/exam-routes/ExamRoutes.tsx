import AddExam from '@/core-modules/admin-module/lookups/exam/AddExam'
import EditExam from '@/core-modules/admin-module/lookups/exam/EditExam'
import Exam from '@/core-modules/admin-module/lookups/exam/Exam'
import ViewExam from '@/core-modules/admin-module/lookups/exam/ViewExam'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const ExamRoutes = () => {
  return (
    <div>
      <Routes>
            <Route path="/" element={<Exam />} />   
            <Route path="view/:id" element={<ViewExam/>} />      
            <Route path="edit/:id" element={<EditExam/>} />     
            <Route path="add" element={<AddExam/>} />                                            
        </Routes>
    </div>
  )
}

export default ExamRoutes