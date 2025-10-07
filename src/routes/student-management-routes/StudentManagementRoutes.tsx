import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StudentsRoutes from './students-routes/StudentsRoutes'
import StudentAttandance from '@/core-modules/admin-module/lookups/Studen-attendance/StudentAttandance'
import StudentsAttendanceMarking from '@/core-modules/admin-module/lookups/Studen-attendance/StudentsAttendanceMarking'
import EditStudentsAttendanceMarking from '@/core-modules/admin-module/lookups/Studen-attendance/EditStudentsAttendanceMarking'

const StudentManagementRoutes:React.FC = () => {
  return (
    <div>   
        <Routes>
            <Route path="students/*" element={<StudentsRoutes />}/>
            <Route path="students-attendance/*" element={<StudentAttandance />}/>
            <Route path="students-attendance-marking/*" element={<StudentsAttendanceMarking />}/>
        <Route path="students-attendance/edit/:id*" element={<EditStudentsAttendanceMarking />}/>
        </Routes>
    </div>
  )
}

export default StudentManagementRoutes
