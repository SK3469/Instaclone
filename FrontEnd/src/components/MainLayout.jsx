import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './Leftsidebar'

const MainLayout = () => {
  return (
    <div>
       <LeftSidebar/>
        <div>
        <Outlet/> {/*   use to rendring children in mainlayout sidebar  */}
        </div>
    </div>
  )
}

export default MainLayout