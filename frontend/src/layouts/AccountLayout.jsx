import React, { Fragment, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import FadeIn from '../animations/FadeIn';

const AccountLayout = () => {

    const { logout } = useAuth();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    

    return (
        <Fragment>
            <div className='min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>My Account</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / My Account </p>
                    </FadeIn>
                </section>

                <section className='grow container place-self-center grid grid-cols-2 lg:grid-cols-3 gap-4 mt-16 pb-30'>
                    
                    <FadeIn className="col-span-1 hidden lg:flex flex-col gap-3">
                        
                        <NavLink to="" end className={({isActive}) => `border p-4 font-semibold brightness-100! ${isActive ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-gray-300 hover:bg-emerald-700 hover:text-white text-black'}`}>Business Profile</NavLink>
                        {/* <NavLink to="business-profile" className={({isActive}) => `border p-4 font-semibold brightness-100! ${isActive ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-gray-300 hover:bg-emerald-700 hover:text-white text-black'}`}>Business Profile</NavLink> */}
                        <NavLink to="my-orders" className={({isActive}) => `border p-4 font-semibold brightness-100! ${isActive ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-gray-300 hover:bg-emerald-700 hover:text-white text-black'}`}>My Orders</NavLink>
                        <NavLink to="manage-address" className={({isActive}) => `border p-4 font-semibold brightness-100! ${isActive ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-gray-300 hover:bg-emerald-700 hover:text-white text-black'}`}>Manage Address</NavLink>
                        <NavLink to="logout" className={({isActive}) => `border p-4 font-semibold brightness-100! ${isActive ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-gray-300 hover:bg-emerald-700 hover:text-white text-black'}`}>Logout</NavLink>
                        {/* <NavLink onClick={() => setShowLogoutModal(true)} className='border p-4 font-semibold brightness-100! border-gray-300 hover:bg-emerald-700 hover:text-white text-black'>Logout</NavLink> */}

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
                    </FadeIn>
                    
                    <main className="col-span-2">
                        <FadeIn>
                            <Outlet />
                        </FadeIn>
                    </main>
                </section>

                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export const LogoutModal = () => {
    const { logout } = useAuth();
    return(
        <div className='px-4 text-sm md:text-base'>
            <h2 className='text-2xl font-semibold'>Logout</h2>
            <p>Are you sure you want to log out? </p>
            <button onClick={logout} className='btn-primary rounded-none! mt-4'>Logout</button>
        </div>
    )
}

export default AccountLayout;
