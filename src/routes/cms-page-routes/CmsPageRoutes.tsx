import AddCmsPage from '@/core-modules/admin-module/cms-page/AddCmsPage'
import CmsPage from '@/core-modules/admin-module/cms-page/CmsPage'
import EditCmsPage from '@/core-modules/admin-module/cms-page/EditCmsPage'
import ViewCmsPage from '@/core-modules/admin-module/cms-page/ViewCmsPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const CmsPageRoutes = () => {
  return (
    <Routes>
          <Route path="/" element={<CmsPage />} />
          <Route path="add/" element={<AddCmsPage />} />
          <Route path="edit/:id" element={<EditCmsPage />} />
          <Route path="view/:id" element={<ViewCmsPage />} />

      </Routes>
  )
}

export default CmsPageRoutes