import React from "react";
import { Route, Routes } from "react-router-dom";
import AcademicYearRoutes from "./academic-year-routes/AcademicYearRoutes";
import ClassRoutes from "./Class-routes/ClassRoutes";
import DivisionRoutes from "./division-routes/DivisionRoutes";
import GradeRoutes from "./grade-routes/GradeRoutes";
import ExamTypeRoutes from "./exam-type-routes/ExamTypeRoutes";
import SubjectRoutes from "./subject-routes/SubjectRoutes";
import AttendanceStatusRoutes from "./attendance-status-routes/AttendanceStatusRoutes";
import FeeInstallmentTypeRoutes from "./fee-installment-type-routes/FeeInstallmentTypeRoutes";
import SyllabusRoutes from "./syllabus-routes/SyllabusRoutes";
import ExamRoutes from "./exam-routes/ExamRoutes";
import FeeStructureRoutes from "./fee-structure-routes/FeeStructureRoutes";
import TeachersRoutes from "./teachers-routes/TeachersRoutes";
import FeeInstallmentRoutes from "./fee-installment-routes/FeeInstallmentRoutes";
import TImetableRoutes from "./teachers-routes/TImetableRoutes";
import PaymentRoutes from "./payment-routes/PaymentRoutes";
import Event from "@/core-modules/admin-module/lookups/event/Event";
import EventRoute from "./event-routes/EventRoute";
import EventTypeRoute from "./eventTypeRoute/EventTypeRoute";
import FeeTypeRoutes from "./fee-type-routes/FeeTypeRoutes";
import FeeCollectedRoutes from "./fee-collected-routes/FeeCollectedRoutes";
import StudentTransportRoutes from "./student-transport -routes/StudentTransportRoutes";
import VehicileTypeRoutes from "./vehicle-type-routes/VehicileTypeRoutes";
import VehicleInfoRoutes from "./vehicle-info-routes/VehicleInfoRoutes";
import AssignRollNoRoutes from "./assign-rollNo-routes/AssignRollNoRoutes";
import PtaRolesRoutes from "./pta-role-routes/PtaRolesRoutes";
import DepartmentRoutes from "./department-routes/DepartmentRoutes";
import DesignationRoutes from "./designation-routes/DesignationRoutes";
import SchoolManagementRoutes from "./schoolManagement-routes/SchoolManagementRoutes";
import PtaProfileRoutes from "./pta-profile-routes/PtaProfileRoutes";
import AssignTeacherClassRoutes from "./assign-teacher-class-routes/AssignTeacherClassRoutes";
import ClassTimetable from "@/core-modules/admin-module/lookups/class-timetable/ClassTimetable";
import TeacherAttendanceRoute from "./teachers-routes/TeacherAttendanceRoute";
import TimeSlotRoutes from "./time-slot-routes/TimeSlotRoutes";
import SubstituteTeacherRoute from "./teachers-routes/SubstituteTeacherRoute";
import EditClassTimeTable from "@/core-modules/admin-module/lookups/class-timetable/EditClassTimeTable";

const LookupsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="academic-years/*" element={<AcademicYearRoutes />} />
      <Route path="classes/*" element={<ClassRoutes />} />
      <Route path="divisions/*" element={<DivisionRoutes />} />
      {/* <Route path="class-timetable/*" element={<ClassTimetable />} /> */}
      <Route path="edit-class-timetable/*" element={<EditClassTimeTable />} />
      <Route path="grades/*" element={<GradeRoutes />} />
      <Route path="exam-types/*" element={<ExamTypeRoutes />} />
      <Route path="exams/*" element={<ExamRoutes />} />
      <Route path="subjects/*" element={<SubjectRoutes />} />
      <Route path="attendance-status/*" element={<AttendanceStatusRoutes />} />
      <Route path="fee-installment-types/*" element={<FeeInstallmentTypeRoutes />} />
      <Route path="syllabuses/*" element={<SyllabusRoutes />} />
      <Route path="teachers/*" element={<TeachersRoutes />} />
      <Route path="time-tables/*" element={<TImetableRoutes />} />
      <Route path="substitute-teachers/*" element={<SubstituteTeacherRoute/>} />
      <Route path="teacher-attendance/*" element={<TeacherAttendanceRoute />} />
      <Route path="event/*" element={<EventRoute />} />
      <Route path="event-type/*" element={<EventTypeRoute />} />
      <Route path="fee-structures/*" element={<FeeStructureRoutes />} />
      <Route path="fee-installments/*" element={<FeeInstallmentRoutes />} />
      <Route path="fee-types/*" element={<FeeTypeRoutes />} />
      <Route path="payments/*" element={<PaymentRoutes />} />
      <Route path="fee-collected/*" element={<FeeCollectedRoutes />} />
      <Route path="students-transports/*" element={<StudentTransportRoutes />} />
      <Route path="vehicle-types/*" element={<VehicileTypeRoutes />} />
      <Route path="vehicle-info/*" element={<VehicleInfoRoutes />} />
      <Route path="assign-rollNo/*" element={<AssignRollNoRoutes />} />
      <Route path="pta-role/*" element={<PtaRolesRoutes />} />
      <Route path="department/*" element={<DepartmentRoutes />} />
      <Route path="designation/*" element={<DesignationRoutes />} />
      <Route path="school-management/*" element={<SchoolManagementRoutes />} />
      <Route path="pta-profile/*" element={<PtaProfileRoutes />} />
      <Route path="assign-teacher-class/*" element={<AssignTeacherClassRoutes />} />
      <Route path="time-slot/*" element={<TimeSlotRoutes />} />


    </Routes>
  );
};

export default LookupsRoutes;
