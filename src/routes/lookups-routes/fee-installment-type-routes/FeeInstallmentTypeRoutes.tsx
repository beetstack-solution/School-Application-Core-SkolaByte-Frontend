import FeeInstallmentType from '@/core-modules/admin-module/lookups/fee-intallment-type/FeeInstallmentType'
import ViewFeeInstallmentType from '@/core-modules/admin-module/lookups/fee-intallment-type/ViewFeeInstallmentType'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const FeeInstallmentTypeRoutes = () => {
  return (
    <div>
     <Routes>
      <Route path="/" element={<FeeInstallmentType />} />
      <Route path="view/:id" element={<ViewFeeInstallmentType />} />
    </Routes>
    </div>
  )
}

export default FeeInstallmentTypeRoutes
