import Subject from '@/core-modules/admin-module/lookups/subject/Subject'
import ViewSubject from '@/core-modules/admin-module/lookups/subject/ViewSubject'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const SubjectRoutes:React.FC = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Subject />} />
        <Route path="view/:id" element={<ViewSubject />} />
    </Routes>
    </>
  )
}

export default SubjectRoutes