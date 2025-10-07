import React, { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'



const Layout : React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-100 p-4 h-screen overflow-y-auto overflow-x-auto">
      <Outlet/>
      </main>
    </div>
  </div>
  )
}

export default Layout