import Class from '@/core-modules/admin-module/lookups/class/Class'
import ViewClass from '@/core-modules/admin-module/lookups/class/ViewClass'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function ClassRoutes() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Class />} />
      <Route path="view/:id" element={<ViewClass />} />
    </Routes>
  </div>

  )
}

export default ClassRoutes
