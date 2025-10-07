import CurrencyFormat from "@/core-modules/super-admin-module/currency-format/CurrencyFormat"
import ViewCurrencyFormat from "@/core-modules/super-admin-module/currency-format/ViewCurrencyFormat"
import { Route, Routes } from "react-router-dom"

const CurrencyFormatRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<CurrencyFormat />} />
        <Route path="view/:id/" element={<ViewCurrencyFormat />} />
    </Routes>
  )
}

export default CurrencyFormatRoutes