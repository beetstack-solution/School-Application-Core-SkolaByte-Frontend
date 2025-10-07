import AddFeeInstallment from '@/core-modules/admin-module/lookups/fee-installment/AddFeeInstallment'
import EditFeeInstallment from '@/core-modules/admin-module/lookups/fee-installment/EditFeeInstallment'
import FeeInstallment from '@/core-modules/admin-module/lookups/fee-installment/FeeInstallment'
import ViewFeeInstallment from '@/core-modules/admin-module/lookups/fee-installment/ViewFeeInstallment'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
const FeeInstallmentRoutes = () => {
  return (
      <div>
          <Routes>
              <Route path="/" element={<FeeInstallment />} />
              <Route path="add/" element={<AddFeeInstallment />} />
              <Route path="edit/:id" element={<EditFeeInstallment />} />
              <Route path="view/:id" element={<ViewFeeInstallment />} />
          </Routes>
      </div>
  )
}

export default FeeInstallmentRoutes