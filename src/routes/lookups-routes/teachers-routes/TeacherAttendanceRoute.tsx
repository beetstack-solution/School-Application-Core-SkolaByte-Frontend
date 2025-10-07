import EditTeacherAttendance from '@/core-modules/admin-module/lookups/teacher-attendance/EditTeacherAttendance'
import TeacherAbsentList from '@/core-modules/admin-module/lookups/teacher-attendance/TeacherAbsentList'
import TeacherAttendance from '@/core-modules/admin-module/lookups/teacher-attendance/TeacherAttendance'
import TeacherAttendanceMarking from '@/core-modules/admin-module/lookups/teacher-attendance/TeacherAttendanceMarking'
import AddTeacher from '@/core-modules/admin-module/lookups/teachers/AddTeachers'
import EditTeacher from '@/core-modules/admin-module/lookups/teachers/EditTeachers'
import Teachers from '@/core-modules/admin-module/lookups/teachers/Teachers'
import ViewTeacher from '@/core-modules/admin-module/lookups/teachers/ViewTeacher'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const TeacherAttendanceRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<TeacherAttendance/>}
                />
                <Route
                    path="/add"
                    element={<TeacherAttendanceMarking />}
                />
                <Route
                    path="/edit/:id"
                    element={<EditTeacherAttendance />}
                />
                <Route
                    path="/view/:id"
                    element={<ViewTeacher />}
                />
                <Route
                    path="/absent-list"
                    element={<TeacherAbsentList />}
                />
            </Routes>
        </>
    )
}

export default TeacherAttendanceRoute