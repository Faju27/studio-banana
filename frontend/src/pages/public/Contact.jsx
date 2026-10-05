import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaInstagram, FaMapPin, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import FadeIn from '../../animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { MdPhone } from 'react-icons/md';
import { IoIosAlarm } from 'react-icons/io';
import { CgArrowRight } from 'react-icons/cg';

const Contact = () => {
    return (
        <Fragment>
            <div className='flex flex-col min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Contact Our Team</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Contact Us </p>
                    </FadeIn>
                </section>

                
                <section className='grow container place-self-center grid lg:grid-cols-5 text-sm md:text-base gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16 pb-6 sm:pb-9 lg:pb-12 pt-12 sm:pt-12 lg:pt-24 '>
                    <FadeIn delay={0.1} className='lg:col-span-3'>
                        <h2 className='text-xl md:text-2xl lg:text-3xl font-semibold mb-2'>Get in Touch</h2>
                        <p className='text-black mb-6'>Your email address will not be published. Required fields are marked*</p>

                        <div className='sm:flex gap-6'>
                            <div className='sm:w-1/2 flex flex-col mb-3'>
                                <label className='text-black font-semibold mb-1!'>Your Name *</label>
                                <input type='text' placeholder='Ex.John Doe' className='w-full border bg-white! p-4! border-gray-300! rounded-none!' />
                            </div>
                            <div className='sm:w-1/2 flex flex-col mb-3'>
                                <label className='text-black font-semibold mb-1!'>Email *</label>
                                <input type='text' placeholder='example@gmail.com' className='w-full border bg-white! p-4! border-gray-300! rounded-none!' />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3'>
                            <label className='text-black font-semibold mb-1'>Subject *</label>
                            <input type='text' placeholder='Enter Subject' className='w-full border bg-white! p-4! border-gray-300! rounded-none!' />
                        </div>
                        
                        <div className='flex flex-col mb-3'>
                            <label className='text-black font-semibold mb-1'>Your Message *</label>
                            <textarea rows={4} placeholder='Enter here...' className='w-full border bg-white! p-4! border-gray-300! rounded-none!' />
                        </div>

                        <button className='btn-primary rounded-none!'>Send Message</button>
                    </FadeIn>


                    <FadeIn delay={0.2} className='lg:col-span-2'>
                    <div className='h-full bg-[#f5f2eb]/80 p-6 sm:p-8'>

                        <StaggerContainer className='flex flex-col h-full justify-between'>
                            <StaggerItem>
                            <div>
                                <h2 className='text-base md:text-xl lg:text-2xl font-semibold mb-2'>Address</h2>
                                <p className='text-black mb-6'>3rd A Cross Rd, Sudhama Nagar, Bengaluru,<br /> Karnataka 560027</p>
                            </div>
                            </StaggerItem>

                            <StaggerItem>
                            <div>
                                <h2 className='text-base md:text-xl lg:text-2xl font-semibold mb-2'>Contact</h2>
                                <p className='text-black'>Phone: 7034843917</p>
                                <p className='text-black mb-6'>Email : support@studiobanana.com</p>
                            </div>
                            </StaggerItem>

                            <StaggerItem>
                            <div>
                                <h2 className='text-base md:text-xl lg:text-2xl font-semibold mb-2'>Open Time</h2>
                                <p className='text-black '>Monday-Saturday : 10:00 AM - 08:00 PM</p>
                                <p className='text-black mb-6'>Closed on Sunday</p>
                            </div>
                            </StaggerItem>

                            <StaggerItem>
                            <div>
                                <h2 className='text-base md:text-xl lg:text-2xl font-semibold mb-2'>Stay Connected</h2>
                                <div className='flex gap-6 md:gap-8'>
                                    <FaInstagram className='w-11 h-11 md:w-12 md:h-12 text-emerald-900 bg-[#94bb86] rounded-full p-3' />
                                    <FaXTwitter className='w-11 h-11 md:w-12 md:h-12 text-emerald-900 bg-[#94bb86] rounded-full p-3' />
                                    <FaYoutube className='w-11 h-11 md:w-12 md:h-12 text-emerald-900 bg-[#94bb86] rounded-full p-3' />
                                    <FaPinterestP className='w-11 h-11 md:w-12 md:h-12 text-emerald-900 bg-[#94bb86] rounded-full p-3' />
                                </div>
                            </div>
                            </StaggerItem>
                        </StaggerContainer>

                    </div>
                    </FadeIn>
                </section>


                <section className='px-4 sm:px-8 lg:px-16 pt-6 sm:pt-9 lg:pt-12 pb-12 sm:pb-12 lg:pb-24'>
                    <div className='w-max max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>

                        <div className="bg-[#F5F2EB] rounded-lg max-w-125 w-full lg:w-108 p-6 sm:p-8 flex flex-col border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800! tracking-tight mb-4">
                                Bangalore Commercial Hub
                            </h3>
                            
                            <div className="flex flex-col gap-4 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <span className="text-emerald-800 mt-0.5 font-semibold text-base"><FaMapPin /> </span>
                                    <p className="leading-relaxed">
                                        XH4Q+VM6, 3rd A Cross Rd, <br />
                                        Sudhama Nagar, Bengaluru, <br />
                                        Karnataka — 560027
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-800 font-semibold text-base"><MdPhone /></span>
                                    <p>+91 98765 43210</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-800 font-semibold text-base"><IoIosAlarm /></span>
                                    <p>Mon — Sat: 10:00 AM - 8:00 PM</p>
                                </div>
                            </div>

                            <a 
                                href="https://maps.app.goo.gl/aPocB2JRoxjdUv9m6" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-8 group inline-flex items-center gap-2  text-emerald-800 hover:text-emerald-900 brightness-100! transition-colors"
                            >
                                <span className='text-xs font-bold uppercase tracking-wider'>Get Directions</span> 
                                <CgArrowRight className='text-xl transform transition-transform duration-300 group-hover:translate-x-2' />
                            </a>
                        </div>

                        <div className="bg-[#F5F2EB] rounded-lg max-w-125 w-full lg:w-108 p-6 sm:p-8 flex flex-col border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800! tracking-tight mb-4">
                                Kozhikode Distribution Store
                            </h3>
                            
                            <div className="flex flex-col gap-4 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <span className="text-emerald-800 mt-0.5 font-semibold text-base"><FaMapPin /></span>
                                    <p className="leading-relaxed">
                                        Space Mall, First Floor, <br />
                                        Jaffer Khan Colony Road, Mavoor Road, <br />
                                        Kozhikode, Kerala — 673004
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-800 font-semibold text-base"><MdPhone /></span>
                                    <p>+91 98765 43211</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-800 font-semibold text-base"><IoIosAlarm /></span>
                                    <p>Mon — Sat: 10:00 AM - 8:00 PM</p>
                                </div>
                            </div>

                            <a 
                                href="https://maps.app.goo.gl/kGYDHqv73ai7Uti2A" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-8 group inline-flex items-center gap-2  text-emerald-800 hover:text-emerald-900 brightness-100! transition-colors"
                            >
                                <span className='text-xs font-bold uppercase tracking-wider'>Get Directions</span> 
                                <CgArrowRight className='text-xl transform transition-transform duration-300 group-hover:translate-x-2' />
                            </a>
                        </div>

                    </div>
                </section>
               
                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default Contact;
