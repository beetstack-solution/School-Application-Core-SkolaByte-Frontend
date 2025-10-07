import ProgressReport from '@/core-modules/admin-module/reports/progress/ProgressReport'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const ProgressReportRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<ProgressReport />} />

</Routes>
  )
}

export default ProgressReportRoutes