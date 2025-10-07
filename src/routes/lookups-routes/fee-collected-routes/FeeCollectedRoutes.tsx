import FeeCollection from "@/core-modules/admin-module/lookups/fee-collect/FeeCollection";
import { Route, Routes } from "react-router-dom";

const FeeCollectedRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<FeeCollection />} />

  </Routes>
  )
}

export default FeeCollectedRoutes