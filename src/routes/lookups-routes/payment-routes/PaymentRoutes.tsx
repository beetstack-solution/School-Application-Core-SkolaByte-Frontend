import AddPayment from '@/core-modules/admin-module/lookups/payment/AddPayment'
import EditPayment from '@/core-modules/admin-module/lookups/payment/EditPayment'
import Payment from '@/core-modules/admin-module/lookups/payment/Payment'
import ViewPayment from '@/core-modules/admin-module/lookups/payment/ViewPayment'
// import React from 'react'
import { Route, Routes } from 'react-router-dom'
const PaymentRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Payment />} />
        <Route path="add/" element={<AddPayment />} />
        <Route path="view/:id" element={<ViewPayment />} />
        <Route path="edit/:id" element={<EditPayment />} />

      </Routes>
    </div>
  )
}

export default PaymentRoutes
