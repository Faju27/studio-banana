import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FadeIn from '../../animations/FadeIn';
import CreativeStudio from '../../assets/CreativeStudio.jpg'
import ProductionIntegrity from '../../assets/ProductionIntegrity.jpg'
import AboutStackOne from '../../assets/AboutStackOne.jpg'
import AboutStackTwo from '../../assets/AboutStackTwo.jpg'
import AboutStackThree from '../../assets/AboutStackThree.jpg'
import AboutStackFour from '../../assets/AboutStackFour.jpg'
import { motion } from "motion/react";
import { containerVariants, itemVariants } from '../../animations/variants';


const About = () => {
    return (
        <Fragment>
            <div className='flex flex-col min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>About Our Studio</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / About Us </p>
                    </FadeIn>
                </section>

                <section className="w-full bg-white px-4 sm:px-8 lg:px-16 py-12 sm:py-18 lg:py-24">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto text-center flex flex-col items-center"
                    >
                        <motion.h2 variants={itemVariants} className="uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1">OUR PHILOSOPHY</motion.h2>
                        <motion.h1 variants={itemVariants} className="text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight max-w-xl">
                            Redefining B2B apparel.
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-4 md:mt-6 text-sm md:text-base text-gray-600 max-w-xl">
                            Studio Banana was born out of a simple realization: wholesale clothing shouldn't feel anonymous, mass-produced, or generic. We believe that independent fashion retailers and modern boutiques deserve access to low, flexible minimum order quantities without ever having to compromise on high-end design, premium raw materials, or immaculate craftsmanship.
                        </motion.p>
                    </motion.div>
                </section>


                 <section className="w-full bg-[#F9F9F9] py-12 sm:py-18 lg:py-24 px-4 sm:px-8 lg:px-16">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px"}}
                        variants={containerVariants}
                        className="mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center">


                        <motion.div variants={itemVariants} className="flex flex-col text-left">
                            <h2 className="uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1">BENGALURU CREATIVE STUDIO</h2>
                            <h1 className="text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight">
                                Led by designers.<br />Sourced from scratch.
                            </h1>
                            <p className="mt-4 md:mt-6 text-sm sm:text-base leading-relaxed">
                                Our heart beats in Bengaluru, where our dedicated team of fashion designers and pattern makers transform creative concepts into retail-ready realities. We don't buy pre-made blank stock. Instead, we source premium raw textiles in bulk and curate every digital print, structural silhouette, and complex embroidery pattern completely in-house from our drawing boards.
                            </p>
                        </motion.div>
                        <div className='mt-8 md:mt-0 aspect overflow-hidden'>
                            <motion.img
                                initial={{ scale: 1.9 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut"}} 
                                src={CreativeStudio} alt="Bengaluru Creative Studio Design" className='max-h-100 aspect-square w-full object-cover'
                            />
                        </div>
                    </motion.div>
                </section>


                <section className="w-full bg-white pt-12 sm:pt-18 lg:pt-24 pb-6 sm:pb-9 lg:pb-12">
                    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center">
                        <div className="mt-8 md:mt-0 w-full overflow-hidden order-2 md:order-1">
                            <motion.img
                                initial={{ scale: 1.9 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut"}} 
                                src={ProductionIntegrity} 
                                alt="Boutique Manufacturing Control" className='max-h-100 md:max-h-full lg:max-h-100 w-full object-cover'
                            />
                        </div>
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="flex flex-col text-left order-1 md:order-2 px-4 sm:px-8 md:px-0 md:pr-8 lg:pr-16 "
                        >
                            <motion.h2 variants={itemVariants} className="uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1">PRODUCTION INTEGRITY</motion.h2>
                            <motion.h1 variants={itemVariants} className="text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight">
                                Meticulous stitching.<br />Strict quality control.
                            </motion.h1>
                            <motion.p variants={itemVariants} className="mt-4 md:mt-6 text-sm sm:text-base leading-relaxed">
                                Once our Bengaluru studio finalizes a collection design, the raw bulk fabrics are sent to our specialized local partner production facilities across India. By managing our manufacturing pipeline directly—from the initial fabric weave inspection to the final button stitch—we guarantee rigorous boutique-grade quality control on every single item that leaves our line.
                            </motion.p>
                        </motion.div>
                    </div>
                </section>


                <section className="w-full bg-white pb-12 sm:pb-18 lg:pb-24 pt-6 sm:pt-9 lg:pt-12 px-4 sm:px-8 lg:px-16">
                    <div className="mx-auto grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-fit overflow-hidden">
                        <div className="col-span-2 sm:col-span-1 h-50 sm:h-80 overflow-hidden">
                            <motion.img
                                initial={{ scale: 1.9 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut"}} 
                                src={AboutStackTwo} 
                                className='h-100 sm:h-full w-full sm:aspect-square object-cover object-bottom xs:object-center'
                            />
                        </div>
                        <div className='col-span-2 sm:col-span-1 flex flex-row sm:flex-col gap-4 sm:gap-6 lg:gap-8 h-50 sm:h-80'>
                            <div className="w-1/2 sm:w-full h-full sm:h-1/2 overflow-hidden">
                                <motion.img
                                    initial={{ scale: 1.9 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut"}} 
                                    src={AboutStackOne} 
                                    className='h-full w-full object-cover'
                                />
                            </div>
                            <div className="w-1/2 sm:w-full h-full sm:h-1/2 overflow-hidden">
                                <motion.img
                                    initial={{ scale: 1.9 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut"}} 
                                    src={AboutStackFour} 
                                    className='h-full w-full object-cover'
                                />
                            </div>
                        </div>

                    </div>
                </section>

                
                <section className="w-full bg-[#F9F9F9] py-12 sm:py-18 lg:py-24 px-4 sm:px-8 lg:px-16 border-t border-gray-100">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="max-w-4xl mx-auto flex flex-col items-center"
                    >
                        <div className="text-center">
                            <motion.h2 variants={itemVariants} className="uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1">OUR CREATIVE CORE</motion.h2>
                            <motion.h1 variants={itemVariants} className="text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight">
                            The hands behind Studio Banana.
                            </motion.h1>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full text-center mt-8 sm:mt-10 lg:mt-12">
                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-light text-emerald-800 tracking-tight">04</span>
                                <h3 className="text-xs uppercase font-bold tracking-wider mt-2 mb-1">Fashion Designers</h3>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-55 leading-relaxed">
                                    Curating exclusive, custom seasonal motifs and digital prints from our Bengaluru drafting boards.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-light text-emerald-800 tracking-tight">02</span>
                                <h3 className="text-xs uppercase font-bold tracking-wider mt-2 mb-1">Pattern Makers</h3>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-55 leading-relaxed">
                                    Sculpting our signature relaxed camp-collars and immaculate structural formal fits.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-light text-emerald-800 tracking-tight">100%</span>
                                <h3 className="text-xs uppercase font-bold tracking-wider mt-2 mb-1">Ethical Sourcing</h3>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-55 leading-relaxed">
                                    Partnering directly with expert local tailoring houses across India to manage our production pipeline.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>


                <section className="w-full bg-white py-12 sm:py-18 lg:py-24 px-4 sm:px-8 lg:px-16">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto text-center flex flex-col items-center"
                    >
                        <motion.h2 variants={itemVariants} className="uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1">REGIONAL PRESENCE</motion.h2>
                        <motion.h1 variants={itemVariants} className="text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight">
                            Bridging Karnataka and Kerala.
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-4 md:mt-6 text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
                            To best serve our retail partners, we operate physical wholesale showrooms and fulfillment warehouses across South India. By keeping deep physical inventories ready for rapid dispatch in both Bangalore and Kozhikode, we ensure fast regional shipping to keep your store shelves continuously stocked.
                        </motion.p>
                    </motion.div>
                </section>


                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default About;
