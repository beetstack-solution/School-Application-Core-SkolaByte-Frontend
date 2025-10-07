// import AddTimeSlot from '@/core-modules/admin-module/lookups/timeSlot/AddTimeSlot'
// import EditTimeSlot from '@/core-modules/admin-module/lookups/timeSlot/EditTimeSlot'
import TimeSlot from '@/core-modules/admin-module/lookups/timeSlot/TimeSlot'
import ViewTimeSlot from '@/core-modules/admin-module/lookups/timeSlot/ViewTimeSlot'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const TimeSlotRoutes = () => {
  return (
    <Routes>
          <Route path="/" element={<TimeSlot />} />
          {/* <Route path="add/" element={<AddTimeSlot />} /> */}
          <Route path="view/:id" element={<ViewTimeSlot />} />
          {/* <Route path="edit/:id" element={<EditTimeSlot />} /> */}
    
    
        </Routes>
  )
}

export default TimeSlotRoutes