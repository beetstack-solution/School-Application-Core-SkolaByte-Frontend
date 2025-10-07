import AddVehicleInfo from '@/core-modules/admin-module/lookups/vehicle-info/AddVehicleInfo'
import EditVehicleInfo from '@/core-modules/admin-module/lookups/vehicle-info/EditVehicleInfo'
import VehicleInfo from '@/core-modules/admin-module/lookups/vehicle-info/VehicleInfo'
import ViewVehicleInfo from '@/core-modules/admin-module/lookups/vehicle-info/ViewVehicleInfo'
import { Route, Routes } from 'react-router-dom'

const VehicleInfoRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VehicleInfo />} />
      {/* <Route path="add/" element={<AddVehicleInfo />} /> */}
      <Route path="view/:id" element={<ViewVehicleInfo />} />
      {/* <Route path="edit/:id" element={<EditVehicleInfo />} /> */}


    </Routes>
  )
}

export default VehicleInfoRoutes