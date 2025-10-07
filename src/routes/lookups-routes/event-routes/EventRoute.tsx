import EditEvent from '@/core-modules/admin-module/lookups/event/EditEvent'
import Event from '@/core-modules/admin-module/lookups/event/Event'
import EventAdd from '@/core-modules/admin-module/lookups/event/EventAdd'
import ViewEvent from '@/core-modules/admin-module/lookups/event/ViewEvent'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const EventRoute = () => {
  return (
    <div>
      <Routes>
            <Route path="/" element={<Event />} />   
            <Route path="/add" element={<EventAdd />} />                                             
            <Route path="/edit/:id" element={<EditEvent />} />                                             
            <Route path="/view/:id" element={<ViewEvent />} />                                             
        </Routes>
    </div>
  )
}

export default EventRoute