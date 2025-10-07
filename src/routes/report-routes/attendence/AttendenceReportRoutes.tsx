import AttendenceReport from "@/core-modules/admin-module/reports/attendance/AttendenceReport";
// import React from "react";
import { Route, Routes } from "react-router-dom";
const AttendenceReportRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<AttendenceReport />} />

</Routes>
  )
}

export default AttendenceReportRoutes