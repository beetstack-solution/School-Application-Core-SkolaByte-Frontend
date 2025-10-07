import DateFormat from "@/core-modules/super-admin-module/date-format/DateFormat"
import ViewDateFormat from "@/core-modules/super-admin-module/date-format/ViewDateFormat"
import { Route, Routes } from "react-router-dom"

const DateFormatRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<DateFormat />} />
        <Route path="view/:id" element={<ViewDateFormat />} />
    </Routes>
  )
}

export default DateFormatRoutes