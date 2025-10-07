import PtaRole from '@/core-modules/admin-module/lookups/ptaRole/PtaRole'
import ViewPtaRole from '@/core-modules/admin-module/lookups/ptaRole/ViewPtaRole'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const PtaRolesRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<PtaRole />} />
          <Route path="view/:id" element={<ViewPtaRole />} />

      </Routes>
  )
}

export default PtaRolesRoutes