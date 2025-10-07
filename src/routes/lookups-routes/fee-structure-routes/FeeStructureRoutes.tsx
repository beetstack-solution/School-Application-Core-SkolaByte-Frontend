import FeeStructure from '@/core-modules/admin-module/lookups/fee-structure/FeeStructure'
// import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ViewFeeStructure from '../../../core-modules/admin-module/lookups/fee-structure/ViewFeeStructure'
import AddFeeStructure from '@/core-modules/admin-module/lookups/fee-structure/AddFeeStructure'
import EditFeeStructure from '@/core-modules/admin-module/lookups/fee-structure/EditFeeStructure'

const FeeStructureRoutes = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<FeeStructure />} />
      <Route path="add" element={<AddFeeStructure />} />
      <Route path="edit/:id" element={<EditFeeStructure />} />
      <Route path="view/:id" element={<ViewFeeStructure />} />
    </Routes>
    </div>
  )
}

export default FeeStructureRoutes
