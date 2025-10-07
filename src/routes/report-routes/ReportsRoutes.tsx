import React from "react";
import { Route, Routes } from "react-router-dom";
import AttendenceReportRoutes from "./attendence/AttendenceReportRoutes";
import ProgressReportRoutes from "./progress/ProgressReportRoutes";

const ReportsRoutes = () => {
  return (
    <Routes>
          <Route path="attendance-report/*" element={<AttendenceReportRoutes />} />
          <Route path="progress-report/*" element={<ProgressReportRoutes />} />

      </Routes>
  )
}

export default ReportsRoutes