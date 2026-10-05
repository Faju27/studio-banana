import React, { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GoPackage } from "react-icons/go";
import { MdDarkMode, MdDashboard, MdLogout, MdOutlineArrowBackIos, MdOutlineDashboard, MdOutlinePeople, MdOutlinePlaylistAdd, MdOutlineShoppingCart } from "react-icons/md";
import { FaMoon, FaShippingFast, FaUser, FaUsers } from "react-icons/fa";
import { IoMoonSharp, IoSettingsSharp } from "react-icons/io5";
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTag } from 'react-icons/fa6';
import { PiReceipt } from 'react-icons/pi';
import ConfirmModal from '../components/ConfirmModal';

const AdminLayout = () => {

    const { logout} = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [asideVisible, setAsideVisible] = useState(window.innerWidth >= 1280);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setAsideVisible(false);
            } else {
                setAsideVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);

        // This "cleanup" runs when the component is destroyed. to prevent memeory leak
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <Fragment> 
            {/* {asideVisible && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 sm:hidden"
                    onClick={() => setAsideVisible(false)}
                />
            )} */}
            <aside className={`h-lvh fixed flex flex-col transition-all duration-500 ease-in-out shadow-2xl z-20 bg-white w-18 ${asideVisible ? 'w-80 expanded' : ' sm:w-22 collapsed'}`}>
                <div className={`flex flex-row mt-4 py-3 sm:py-6 px-5 items-center ${asideVisible ? 'justify-between' : 'justify-center'}`} >
                    <h2 className='text-emerald-800 font-bold text-lg sm:text-xl overflow-hidden whitespace-nowrap scale-y-125' style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'6px',}}>{asideVisible ? 'STUDIO BANANA' : 'SB'} </h2>
                    <MdOutlineArrowBackIos size={24} onClick={() => setAsideVisible(!asideVisible)} className="toggle-btn" />
                </div>
                <div className='flex flex-col px-4'>
                    <div className={`flex ${asideVisible ? 'justify-between': 'justify-center'} font-mono p-2`}>{asideVisible ? "MARKETING" : 'M' }</div>

                    <NavLink to='/admin/dashboard' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`}>
                        <MdOutlineDashboard className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Dashboard</span>
                    </NavLink>
                    {/* <NavLink to='/admin/dashboard' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`}>
                        <MdDashboard className='min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7'/>
                        <span className={`
                            transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap
                            ${asideVisible ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                        `}>
                            Dashboard
                        </span>
                    </NavLink> */}
                    <NavLink to='/admin/products' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <GoPackage className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Products</span>
                        </NavLink>
                    <NavLink to='/admin/orders' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <PiReceipt className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Orders</span>
                    </NavLink>
                    <NavLink to='/admin/product-add' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <MdOutlinePlaylistAdd className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Add Products</span>
                    </NavLink>
                    <NavLink to='/admin/customers' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <MdOutlinePeople className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Customers</span>
                    </NavLink>
                    {/* <NavLink to='/admin/customers' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <FaUsers className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Customers</span>
                    </NavLink> */}
                    

                    <div className={`flex ${asideVisible ? 'justify-between': 'justify-center'} font-mono p-2`}>{asideVisible ? "SYSTEM" : 'S' }</div>
                    
                    <NavLink to='/admin/settings' className={({isActive}) => `nav-link ${isActive ? 'is-active' : ''}`} >
                        <IoSettingsSharp className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Settings</span>
                    </NavLink>
                    <div className='nav-link'>
                        <IoMoonSharp className='min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7'/>
                        <div className='toggle-container nav-text flex items-center w-100 justify-between' >
                            <span>Dark mode</span>
                            <input type="checkbox" id="darkmode-toggle" />
                            <label htmlFor="darkmode-toggle" className="slider"></label>
                        </div>
                    </div>
                    


                </div>
                <div className='px-4 mb-3' style={{marginTop:'auto'}}>
                    <div className='nav-link' style={{padding:'8px'}}>
                        <FaUser size={32} className='bg-white p-2 rounded-full min-w-8'/>
                        <h2 className='nav-text'>Admin</h2>
                    </div>
                    <NavLink onClick={() => setShowLogoutModal(true)} className='nav-link' >
                        <MdLogout className="min-w-6 sm:min-w-7 w-6 h-6 sm:w-7 sm:h-7" />
                        <span className='nav-text'>Log out</span>
                    </NavLink>
                    
                    {/* {showLogoutModal && ( */}
                        <ConfirmModal
                            isOpen={showLogoutModal}
                            title="Logout?"
                            message="Are you sure you want to logout?"
                            confirmText="Yes"
                            cancelText="No"
                            onConfirm={logout}
                            onCancel={() => setShowLogoutModal(false)}
                        />
                    {/* )} */}
                </div>



            </aside>



            {/* Dashboard, Products, Users, etc */}
            <main className={`transition-all duration-500 w-auto min-h-screen text-sm sm:text-base py-3 sm:py-5 px-4 bg-emerald-100/40 ml-18 ${asideVisible ? 'sm:ml-22 lg:ml-80' : 'sm:ml-22'}`}>
                <Outlet context={{asideVisible}} />
            </main>

        </Fragment>
    );
}

export default AdminLayout;
