// src/App.tsx

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@/assets/css/index.css"; // Import the consolidated CSS file

// Lazy load route components
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
// const StaticRoutes = lazy(() => import("./routes/StaticRoutes"));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense>
        <Routes>
          {/* Admin Routes */}
          <Route path="/*" element={<AdminRoutes />} />
          {/* Static Routes */}
          {/* <Route path="static/*" element={<StaticRoutes />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
