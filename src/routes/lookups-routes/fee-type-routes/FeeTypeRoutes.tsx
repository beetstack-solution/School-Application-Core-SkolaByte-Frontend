import FeeType from '@/core-modules/admin-module/lookups/fee-type/FeeType'
import ViewFeeType from '@/core-modules/admin-module/lookups/fee-type/ViewFeeType'
import { Route, Routes } from 'react-router-dom'

const FeeTypeRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<FeeType />} />
          <Route path="view/:id" element={<ViewFeeType />} />
      </Routes>
  )
}

export default FeeTypeRoutes