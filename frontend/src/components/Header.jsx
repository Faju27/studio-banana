import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi'
import { MdLogin, MdOutlineAccountCircle } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi'
import { useCart } from '../hooks/useCart';
import { AnimatePresence, motion } from "motion/react";
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../hooks/useAuth';

const Header = ({delay = 0}) => {

    const { logout , userType, accessToken  } = useAuth();
    const { cartItems, } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate()


    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
        // Show if scrolling up, hide if scrolling down
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            setVisible(false); // Scrolling down
        } else {
            setVisible(true);  // Scrolling up
        }
        setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);


    return (
        <Fragment>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{delay ,duration: 0.5, ease: "easeOut" }} 
                className='sticky top-0 h-16 sm:h-20 px-4 sm:px-8 lg:px-16 flex items-center justify-between uppercase bg-white/10 backdrop-blur-xs z-30 border-b border-gray-300'
            >



                {/* Mobile Menu Button */}
                <div 
                    className='xl:hidden text-black p-2 border border-gray-300 rounded-full cursor-pointer' 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </div>


                {/* Logo - Centered  */}
                <h2 
                    onClick={() => { navigate('/'); }} 
                    className='absolute left-1/2 -translate-x-1/2 text-black font-semibold cursor-pointer tracking-[6px] sm:tracking-[12px] md:tracking-[16px] text-lg sm:text-xl md:text-2xl whitespace-nowrap'
                    style={{ fontFamily: 'Rustic Printed, sans-serif' }}
                >
                    Studio banana
                </h2>




                {/* Desktop Navigation Links (Hidden on Mobile) */}
                <div className='hidden xl:flex gap-6 2xl:gap-8 font-bold'>
                    <NavLink to='/' className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'}`}>HOME</NavLink>
                    <NavLink to='/about' className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'}`}>About</NavLink>
                    <NavLink to='/products' className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'}`}>Collections</NavLink>
                    <NavLink to='/contact' className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'}`}>Contact</NavLink>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isOpen && (   
                        <>
                            <div className="h-lvh fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                            <motion.div 
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.3 }}
                                className='absolute top-16 sm:top-20 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-4 py-4 font-bold border-t border-gray-100 xl:hidden z-100'
                            >
                                
                                <NavLink to='/' onClick={() => setIsOpen(false)} className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'} w-full text-center`}>HOME</NavLink>
                                <NavLink to='/about' onClick={() => setIsOpen(false)} className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'} w-full text-center`}>About</NavLink>
                                <NavLink to='/products' onClick={() => setIsOpen(false)} className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'} w-full text-center`}>Collections</NavLink>
                                <NavLink to='/contact' onClick={() => setIsOpen(false)} className={({isActive}) => `${isActive ? 'text-emerald-800' : 'text-black'} w-full text-center`}>Contact</NavLink>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                
                
                
                
                
                {/* User Icons / Sign In */}
                <div className='ml-auto flex items-center gap-4'>
                    {(accessToken && userType === 'wholesaler') ? 
                        <div className='flex gap-2 lg:gap-4'>
                            <div className='hidden sm:block relative'>
                                <div className='text-black p-2 border border-gray-300 rounded-full cursor-pointer' onClick={() => navigate('/my-cart')}>
                                    <FiShoppingCart size={24} />
                                </div>
                                {/* <div className='absolute -top-1 right-0 px-1 bg-emerald-700 text-white rounded-full' style={{fontSize:'12px'}}>{cartItems.length}</div> */}
                                {cartItems.length > 0 && (
                                    <div className='absolute top-0 right-1 h-2.5 w-2.5 bg-emerald-700 rounded-full'/>
                                )}
                            </div>
                            
                            <div
                                className='hidden lg:block text-black p-2 border border-gray-300 rounded-full cursor-pointer'
                                onClick={() => navigate('/my-account')}
                            >
                                <FiUser size={24} />
                            </div>

                            <div className="relative inline-block lg:hidden text-sm sm:ml-2">
                                <div onClick={() => setDropDown(!dropDown)}
                                    className="text-black p-2 border border-gray-300 rounded-full"
                                >
                                    <FiUser size={24} />
                                </div>

                                {dropDown && (
                                    <>
                                        <div className="h-lvh fixed inset-0 z-10" onClick={() => setDropDown(false)} />
                                        
                                        <div className="absolute top-full right-0 flex flex-col mt-1 w-50 bg-white border border-gray-300 rounded shadow-lg overflow-hidden z-20">
                                            
                                            <NavLink to="/my-account" end onClick={() => setDropDown(false)} className={({isActive}) => `px-4 py-2.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-gray-700 hover:text-white hover:bg-emerald-900'}`}>Business Profile</NavLink>

                                            <NavLink to="/my-cart" onClick={() => setDropDown(false)} className={({isActive}) => `sm:hidden px-4 py-2.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-gray-700 hover:text-white hover:bg-emerald-900'}`}>My Cart</NavLink>
                                    
                                            <NavLink to="/my-account/my-orders" onClick={() => setDropDown(false)} className={({isActive}) => `px-4 py-2.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-gray-700 hover:text-white hover:bg-emerald-900'}`}>My Orders</NavLink>

                                            <NavLink to="/my-account/manage-address" onClick={() => setDropDown(false)} className={({isActive}) => `px-4 py-2.5 ${isActive ? 'bg-emerald-800 text-white' : 'text-gray-700 hover:text-white hover:bg-emerald-900'}`}>Manage Address</NavLink>
                                    
                                            <NavLink onClick={() => {setShowLogoutModal(true); setDropDown(false)} } className='px-4 py-2.5 text-gray-700 hover:text-white hover:bg-emerald-900'>Logout</NavLink>
                                            
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    : 
                        <button className='btn-primary px-2! sm:px-5! space-x-2' onClick={() => navigate('/auth?mode=login')}>
                            <MdLogin size={24} />
                            <span className='hidden md:block'>SIGN IN</span>
                        </button>
                    }
                </div>


                
            </motion.nav>


            <ConfirmModal
                isOpen={showLogoutModal}
                title="Logout?"
                message="Are you sure you want to logout?"
                confirmText="Yes"
                cancelText="No"
                onConfirm={() => {
                    logout();
                    setShowLogoutModal(false)
                }}
                onCancel={() => setShowLogoutModal(false)}
            />
        </Fragment>
    );
}

export default Header;
