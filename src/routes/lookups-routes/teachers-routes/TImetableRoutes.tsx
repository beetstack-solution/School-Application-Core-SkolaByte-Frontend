import ClassTimetable from '@/core-modules/admin-module/lookups/class-timetable/ClassTimetable'
import EditClassTimeTable from '@/core-modules/admin-module/lookups/class-timetable/EditClassTimeTable'
import AddTimeTable from '@/core-modules/admin-module/lookups/timeTables/AddTimeTable'
import EditTimeTable from '@/core-modules/admin-module/lookups/timeTables/EditTimeTable'
import TimeTableList from '@/core-modules/admin-module/lookups/timeTables/TimeTableList'
import ViewTimetable from '@/core-modules/admin-module/lookups/timeTables/ViewTimetable'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const TImetableRoutes: React.FC = () => {
  return (
    <>
            <Routes>
            <Route
                    path="/"
                    element={<TimeTableList />}
                />
                {/* <Route
                    path="/add"
                    element={<AddTimeTable />}
                /> */}
                <Route
                    path="/add"
                    element={<ClassTimetable />}
                />
                {/* <Route
                    path="/edit/:id"
                    element={<EditTimeTable />}
                /> */}
                <Route
                    path="/edit/:id"
                    element={<EditClassTimeTable />}
                />
                <Route
                    path="/view/:id"
                    element={<ViewTimetable />}
                />
                
            </Routes>
        </>
  )
}

export default TImetableRoutes