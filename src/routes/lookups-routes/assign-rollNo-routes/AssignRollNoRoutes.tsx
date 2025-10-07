import AssignRollNo from '@/core-modules/admin-module/assign-RollNo/AssignRollNo'
import { Route, Routes } from 'react-router-dom'

const AssignRollNoRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<AssignRollNo />} />



      </Routes>
  )
}

export default AssignRollNoRoutes