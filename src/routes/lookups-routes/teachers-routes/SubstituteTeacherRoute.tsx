import ClassTimetable from '@/core-modules/admin-module/lookups/class-timetable/ClassTimetable'
import EditClassTimeTable from '@/core-modules/admin-module/lookups/class-timetable/EditClassTimeTable'
import FreeTeachers from '@/core-modules/admin-module/lookups/substitute-teacher/FreeTeachers'
import SubstituteTeacherAdd from '@/core-modules/admin-module/lookups/substitute-teacher/SubstituteTeacherAdd'
import AddTimeTable from '@/core-modules/admin-module/lookups/timeTables/AddTimeTable'
import EditTimeTable from '@/core-modules/admin-module/lookups/timeTables/EditTimeTable'
import TimeTableList from '@/core-modules/admin-module/lookups/timeTables/TimeTableList'
import ViewTimetable from '@/core-modules/admin-module/lookups/timeTables/ViewTimetable'
import SubstituteTeacherList from '@/core-modules/admin-module/lookups/substitute-teacher/SubstituteTeacherList'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const SubstituteTeacherRoute: React.FC = () => {
  return (
    <>
            <Routes>
            <Route
                    path="/free-teachers"
                    element={<FreeTeachers />}
                />  

                <Route
                    path="/add"
                    element={<SubstituteTeacherAdd />}
                />
                <Route
                    path="/"
                    element={<SubstituteTeacherList />}
                />
                {/* <Route
                    path="/edit/:id"
                    element={<EditTimeTable />}
                /> */}
                {/* <Route
                    path="/edit/:id"
                    element={<EditClassTimeTable />}
                /> */}
                {/* <Route
                    path="/view/:id"
                    element={<ViewTimetable />}
                /> */}
                
            </Routes>
        </>
  )
}

export default SubstituteTeacherRoute