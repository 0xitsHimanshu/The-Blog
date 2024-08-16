import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { UserContext } from '../App'

const SideNav = () => {
  
    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const new_notification_available = userAuth?.new_notification_available;

    const page = location.pathname.split("/")[2];

    const [pageState, setPageState] = useState(page.replace(/-/g, " ") );
    const [showSideNav, setShowSideNav] = useState(false);
    const activeTabLine = useRef();
    const sideBarIconTab = useRef();
    const pageStateTab = useRef();

    const changePageState = (e) => {
        const { offsetWidth, offsetLeft } = e.target;
        activeTabLine.current.style.width = offsetWidth+"px";
        activeTabLine.current.style.left = offsetLeft+"px";

        if(e.target == sideBarIconTab.current){
            setShowSideNav(true);
        }else{
            setShowSideNav(false);
        }
    }

    useEffect(() => {
        setShowSideNav(false);
        if(pageStateTab.current){
            pageStateTab.current.click();
        }
    }, [pageState])

    return (
        
        accessToken === null ? <Navigate to={"/signin"} /> :  

        <>
            <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                <div className='sticky top-[80px] z-30'>

                    <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto '>
                        <button ref={sideBarIconTab} className='p-5 capitalize' onClick={changePageState}>
                            <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
                        </button>
                        <button ref={pageStateTab} className='p-5 capitalize' onClick={changePageState}>
                            {pageState}
                        </button>

                        <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />

                    </div>
                    
                    
                    <div className={'min-w-[200px] h-[calc(100vh-80px-60px)] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md: border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 '+ (!showSideNav ? " max-md:opacity-0 max-md:pointer-events-none ": " opacity-100 pointer-events-auto")}>
                        
                        <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
                        <hr className='border-grey -ml-6 mb-8 mr-6' />
                        
                        <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-document'></i>
                            Blogs
                        </NavLink>

                        <NavLink to="/dashboard/notifications" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <div className='relative'>
                                <i className='fi fi-rr-bell'></i>
                                {
                                new_notification_available ? <span className='bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0'></span> : ""
                                }
                            </div>
                            Notification
                        </NavLink>

                        <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className={"sidebar-link"} >
                            <i className='fi fi-rr-file-edit'></i>
                            Write
                        </NavLink>

                        <h1 className='text-xl text-dark-grey mt-10 mb-3'>Settings</h1>
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

                <div className='max-md:-mt-8 mt-5 w-full'>
                    <Outlet />
                </div>

            </section>  
        </>
  )
}

export default SideNav