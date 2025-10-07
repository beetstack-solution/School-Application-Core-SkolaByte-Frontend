import AddPtaProfile from '@/core-modules/admin-module/lookups/pta-profile/AddPtaProfile'
import EditPtaProfile from '@/core-modules/admin-module/lookups/pta-profile/EditPtaProfile'
import PtaProfile from '@/core-modules/admin-module/lookups/pta-profile/PtaProfile'
import ViewPtaProfile from '@/core-modules/admin-module/lookups/pta-profile/ViewPtaProfile'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
const PtaProfileRoutes = () => {
  return (
     <Routes>
          <Route path="/" element={<PtaProfile />} />
          <Route path="add/" element={<AddPtaProfile />} />
          <Route path="view/:id" element={<ViewPtaProfile />} />
          <Route path="edit/:id" element={<EditPtaProfile />} />

      </Routes>
  )
}

export default PtaProfileRoutes