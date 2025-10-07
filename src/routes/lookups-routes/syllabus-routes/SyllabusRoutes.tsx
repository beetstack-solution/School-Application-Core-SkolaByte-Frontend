import AddSyllabus from '@/core-modules/admin-module/lookups/syllabus/AddSyllabus'
import EditSyllabus from '@/core-modules/admin-module/lookups/syllabus/EditSyllabus'
import Syllabus from '@/core-modules/admin-module/lookups/syllabus/Syllabus'
import ViewSyllabus from '@/core-modules/admin-module/lookups/syllabus/ViewSyllabus'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const SyllabusRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Syllabus />} />
                <Route path="view/:id" element={<ViewSyllabus />} />
                <Route path="add" element={<AddSyllabus />} />
                <Route path="edit/:id" element={<EditSyllabus />} />
            </Routes>
        </>
    )
}

export default SyllabusRoutes