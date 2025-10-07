import VehicleType from '@/core-modules/admin-module/lookups/vehicile-type/VehicleType'
import ViewVehicleType from '@/core-modules/admin-module/lookups/vehicile-type/ViewVehicleType'
import { Route, Routes } from 'react-router-dom'

const VehicileTypeRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<VehicleType />} />
          <Route path="view/:id/" element={<ViewVehicleType />} />
          

      </Routes>
  )
}

export default VehicileTypeRoutes