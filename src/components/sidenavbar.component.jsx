import React from 'react'
import { Outlet } from 'react-router-dom'

const SideNav = () => {
  return (
    <>
        <div>this is sidenav from components</div>
        
        <Outlet />
    </>
  )
}

export default SideNav