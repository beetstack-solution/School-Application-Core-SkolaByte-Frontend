import AttendanceStatus from "@/core-modules/admin-module/lookups/attendaance-status/AttendanceStatus";
import ViewAttendanceStatus from "@/core-modules/admin-module/lookups/attendaance-status/ViewAttendanceStatus";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AttendanceStatusRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AttendanceStatus />} />
        <Route path="/view/:id" element={<ViewAttendanceStatus />} />
      </Routes>
    </>
  );
};

export default AttendanceStatusRoutes;