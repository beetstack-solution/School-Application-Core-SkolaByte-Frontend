import CurrencyDecimals from "@/core-modules/super-admin-module/currency-decimals/CurrencyDecimals";
import ViewCurrencyDecimals from "@/core-modules/super-admin-module/currency-decimals/ViewCurrencyDecimals";
import { Route, Routes } from "react-router-dom";

const CurrencyDecimalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CurrencyDecimals />} />
      <Route path="view/:id" element={<ViewCurrencyDecimals />} />
    </Routes>
  );
};

export default CurrencyDecimalRoutes;
