import React, { useContext, useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { UserContext } from '../App'

const SideNav = () => {
  
    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const [page, setPageState] = useState();

    return (
        
        accessToken == null ? <Navigate to={"/signin"} /> :  

        <>
            <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                <div className='sticky top-[80px] z-30'>
                    <div className='min-w-[200px] h-cover md:sticky top-24 overflow-y auto p-6 md:pr-0'>
                        <h1 className='text-xl text-dark-grey mt-20 mb-3'>Dashboard</h1>
                        <hr className='border-grey -ml-6 mb-8 mr-6' />
                        
                        <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-document'></i>
                            Blogs
                        </NavLink>

                        <NavLink to="/dashboard/notification" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-bell'></i>
                            Notification
                        </NavLink>

                        <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-file-edit'></i>
                            Write
                        </NavLink>

                        <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
                        <hr className='border-grey -ml-6 mb-8 mr-6' />

                        <NavLink to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-user-pen'></i>
                            Edit Profile
                        </NavLink>

                        <NavLink to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-lock'></i>
                            Change Password
                        </NavLink>
                    </div>
                </div>
            </section>  
            
            <div className='max-md:-mt-8 mt-5 w-full'>
                <Outlet />
            </div>
        </>
  )
}

export default SideNav