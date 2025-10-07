import Designation from '@/core-modules/admin-module/lookups/designation/Designation'
import ViewDesignation from '@/core-modules/admin-module/lookups/designation/ViewDesignation'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function DesignationRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Designation />} />
            <Route path="view/:id" element={<ViewDesignation />} />

        </Routes>
    )
}

export default DesignationRoutes