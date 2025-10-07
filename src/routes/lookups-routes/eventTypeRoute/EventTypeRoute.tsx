import EventAdd from '@/core-modules/admin-module/lookups/event/EventAdd'
import EventType from '@/core-modules/admin-module/lookups/eventType/eventType'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

const EventTypeRoute = () => {
  return (
    <div>
      <Routes>
            <Route path="/" element={<EventType />} />                                               
        </Routes>
    </div>
  )
}

export default EventTypeRoute