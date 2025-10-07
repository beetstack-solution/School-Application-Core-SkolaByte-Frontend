import AddStudent from '@/core-modules/admin-module/student-module/AddStudents'
import EditStudent from '@/core-modules/admin-module/student-module/EditStudents'
import Students from '@/core-modules/admin-module/student-module/Student'
import ViewStudent from '@/core-modules/admin-module/student-module/ViewStudents'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const StudentsRoutes:React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Students />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/view/:id" element={<ViewStudent />} />
        <Route path="/edit/:id" element={<EditStudent />} />
      </Routes>
    </div>
  )
}

export default StudentsRoutes
