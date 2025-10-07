import ClassTimetable from '@/core-modules/admin-module/lookups/class-timetable/ClassTimetable'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function ClassTimetableRoutes() {
  return (
    <Routes>
    <Route path="/" element={<ClassTimetable />} />
   </Routes>
  )
}

export default ClassTimetableRoutes