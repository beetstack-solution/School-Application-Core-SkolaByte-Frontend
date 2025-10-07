import ModuleType from '@/core-modules/super-admin-module/authority-settings/moduleTypes/ModuleType'
import ViewModuleType from '@/core-modules/super-admin-module/authority-settings/moduleTypes/ViewModuleType'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function ModuleTypeRoutes() {
  return (
    <Routes>
        <Route path="/" element={<ModuleType />} />
        <Route path="view/:id" element={<ViewModuleType />} />

    </Routes>
  )
}

export default ModuleTypeRoutes