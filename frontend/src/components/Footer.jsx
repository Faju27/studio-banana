import React, { Fragment } from 'react';
import { FaInstagram, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from "motion/react";

const Footer = () => {
    return (
        <Fragment>
            <motion.footer 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut"}} 
                className='p-4 md:p-8 lg:p-16 text-gray-400 mt-auto bg-emerald-950 rounded-t-2xl shadow-md'
            >
                <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 space-y-2 xl:space-y-0 text-sm md:text-base'>

                    <div className='col-span-1 sm:col-span-3 lg:col-span-2'>
                        <h2 className='uppercase font-semibold tracking-[6px] sm:tracking-[8px] text-lg sm:text-xl md:text-2xl mb-4' style={{fontFamily:'Rustic Printed, sans-serif',}}>
                            studio banana
                        </h2>
                        <p>Premium wholesale apparel designed in Bengaluru, <br /> servicing retail partners across Karnataka and Kerala.</p>
                        <div className='flex gap-4 md:gap-6 mt-4 md:mt-6'>
                            <a target='_blank' href='https://www.instagram.com/studiobanana__?igsh=MWR1cWViaXYzMXYybQ=='>
                                <FaInstagram className='w-10 h-10 md:w-11 md:h-11 text-white bg-white/20 rounded-full p-2' />
                            </a>
                            <FaXTwitter className='w-10 h-10 md:w-11 md:h-11 text-white bg-white/20 rounded-full p-2' />
                            <FaYoutube className='w-10 h-10 md:w-11 md:h-11 text-white bg-white/20 rounded-full p-2' />
                            <FaPinterestP className='w-10 h-10 md:w-11 md:h-11 text-white bg-white/20 rounded-full p-2' />
                        </div>

                    </div>
                    <div className='col-span-1'>
                        <h2 className='mb-4 text-base md:text-lg font-semibold'>SHOP</h2>
                        <div className='flex flex-col gap-2 xl:gap-4'>
                            <a href="/products?category=linen">Linen Shirts</a>
                            <a href="/products?category=denim">Denim & Twill</a>
                            <a href="/products?category=silk">Silk & Blends</a>
                            <a href="/products?category=casual">Casual Styles</a>
                            <a href="/products?category=formal">Formal Shirts</a>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <h2 className='mb-4 text-base md:text-lg font-semibold'>PARTNER PORTAL</h2>
                        <div className='flex flex-col gap-2 xl:gap-4'>
                            <a href="/auth?mode=register">Get Wholesale Access</a>
                            <a href="/auth?mode=login">Buyer Sign In</a>
                            <a href="/auth?mode=login">Track Bulk Order</a>
                            <a href="/faq">Wholesale FAQ</a>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <h2 className='mb-4 text-base md:text-lg font-semibold'>SUPPORT</h2>
                        <div className="flex flex-col gap-2 xl:gap-4 text-xs sm:text-sm ">
                            <div>
                                <p className="block text-[10px] uppercase font-semibold">Email Hub</p>
                                <a href="mailto:support@studiobanana.com" className="hover:underline font-medium">support@studiobanana.com</a>
                            </div>
                            <div>
                                <p className="block text-[10px] uppercase font-semibold">Bangalore Office</p>
                                <p className="font-medium">+91 98765 43210</p>
                            </div>
                            <div>
                                <p className="block text-[10px] uppercase font-semibold">Kozhikode Store</p>
                                <p className="font-medium">+91 98765 43211</p>
                            </div>
                            <div>
                                <p className="block text-[10px] uppercase font-semibold">Hours</p>
                                <p className="font-medium">Mon - Sat: 10:00 AM - 8:00 PM </p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='my-4'/>
                <div className='slide-top text-white'>
                    <span>© {new Date().getFullYear()} Studio Banana Apparel. All rights reserved. Designed for Independent Boutiques.</span> | <a>Privacy Policy</a> | <a>Terms & Conditions</a>
                </div>
            </motion.footer>
        </Fragment>
    );
}

export default Footer;
