import AddTeacher from '@/core-modules/admin-module/lookups/teachers/AddTeachers'
import EditTeacher from '@/core-modules/admin-module/lookups/teachers/EditTeachers'
import Teachers from '@/core-modules/admin-module/lookups/teachers/Teachers'
import ViewTeacher from '@/core-modules/admin-module/lookups/teachers/ViewTeacher'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const TeachersRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Teachers />}
                />
                <Route
                    path="/add"
                    element={<AddTeacher />}
                />
                <Route
                    path="/edit/:id"
                    element={<EditTeacher />}
                />
                <Route
                    path="/view/:id"
                    element={<ViewTeacher />}
                />
            </Routes>
        </>
    )
}

export default TeachersRoutes