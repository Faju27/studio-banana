import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { CgArrowRight, CgArrowTopRight   } from "react-icons/cg";
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import FadeIn from '../../animations/FadeIn';
import { ProductCardSkeleton } from '../../components/skeletons';
import { MdOutlineContentCut, MdOutlineLayers, MdOutlineLocalShipping, MdOutlineTrendingUp, MdPhone, MdVerticalAlignTop } from 'react-icons/md';
import heroVideo from '../../assets/heroVideo.mp4'
import OurDesignStory from '../../assets/Our Design Story.jpg'
import CollectionCardOne from '../../assets/CollectionCardOne.jpg'
import CollectionCardTwo from '../../assets/CollectionCardTwo.jpg'
import CollectionCardThree from '../../assets/CollectionCardThree.jpg'
import CollectionCardFour from '../../assets/CollectionCardFour.jpg'
import CollectionCardFive from '../../assets/CollectionCardFive.jpg'
import CollectionCardSix from '../../assets/CollectionCardSix.jpg'
import {motion} from 'motion/react'
import { containerVariants, itemVariants } from "../../animations/variants";
import { FaMapPin, FaPhone } from 'react-icons/fa6';
import { IoIosAlarm } from 'react-icons/io';

const Home = () => {

    const { fetchProductList } = useProducts();

    const [newArrivals, setNewArrivals] = useState([]);
    const [isNewArrivalsLoading, setIsNewArrivalsLoading] = useState(true); 


    const navigate = useNavigate()

    useEffect(() => {

        const loadNewArrivals = async () => {

            const data = await fetchProductList(
                '/products/?is_new_arrival=true&page_size=4'
            );

            if (data) {
                const allItems = data.results || data;
                setNewArrivals(allItems);
            }
            setIsNewArrivalsLoading(false)
        };

        loadNewArrivals();

    }, []);

    const AnimatedText = ({ text, className }) => {
        return (
            <span className={className}>
                {text.split("").map((char, index) => (
                    <span
                    key={index}
                    className="letter text-black text-shadow-white text-shadow-xs"
                    // style={{ animationDelay: `${index * 0.05}s` }}
                    style={{ "--i": index }} 
                    >
                    {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
        );
    };

    // for to lock scrolling when the first animation(curtan), only for landing page
    useEffect(() => {
        // Add the lock class when the homepage mounts
        document.body.classList.add('lock-scroll');

        // Remove the class when the user leaves the page
        return () => {
            document.body.classList.remove('lock-scroll');
        };
    }, []);

    // for to force the page to scroll to the top immediately on refresh
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

     const collectionCard = [
        { id: 1, name: 'Linen Shirts', image: CollectionCardOne, link:'/products?category=linen', mobileOrder: "order-1", desktopOrder: "lg:order-2", },
        { id: 2, name: 'Silk & Blends', image: CollectionCardThree, link:'/products?category=silk', mobileOrder: "order-1", desktopOrder: "lg:order-3", },
        { id: 3, name: 'Denim Shirts', image: CollectionCardTwo, link:'/products?category=denim', mobileOrder: "order-1", desktopOrder: "lg:order-4", },
        { id: 4, name: 'Casual Styles', image: CollectionCardFive, link:'/products?category=casual', mobileOrder: "order-1", desktopOrder: "lg:order-2", },
        { id: 5, name: 'Formal Shirts', image: CollectionCardFour, link:'/products?category=formal', mobileOrder: "order-1", desktopOrder: "lg:order-3", },
        { id: 6, name: 'Signature Prints', image: CollectionCardSix, link:'/products?pattern=printed,embroidered', mobileOrder: "order-1", desktopOrder: "lg:order-4", },
            // name: 'Printed & Embroidered',
    ]


    const [activeId, setActiveId] = useState(1);
    const advantageCards = [
        {
            id: 1, icon: <MdOutlineLayers />, header: "LOW 10-PIECE MOQ",
            body: "Mix and match sizes and shirt styles freely to test your local market without tying up capital.",
            initialExpanded: true
        },
        {
            id: 2, icon: <MdOutlineTrendingUp />, header: "DIRECT-FACTORY MARGINS",
            body: "Sourced and manufactured directly through us to bypass middlemen and command comfortable 2x–3x markups.",
            initialExpanded: false
        },
        {
            id: 3, icon: <MdOutlineContentCut />, header: "IN-HOUSE BENGALURU DESIGN",
            body: "Stand out from competitors with exclusive prints, custom embroidery, and specialized wash finishes.",
            initialExpanded: false
        },
        {
            id: 4, icon: <MdOutlineLocalShipping />, header: "EXPRESS SOUTH INDIA SHIPPING",
            body: "Rapid dispatches straight from our commercial hubs in Bangalore and Kozhikode to keep your shelves stocked.",
            initialExpanded: false
        }
    ];

    //  Section Animations 
    // const containerVariants = {
    //     hidden: { opacity: 0 },
    //     visible: {
    //         opacity: 1,
    //         transition: { staggerChildren: 0.08, delayChildren: 0.4 }
    //     }
    // };
    // const itemVariants = {
    //     hidden: { opacity: 0, y: 15 },
    //     visible: {
    //         opacity: 1,
    //         y: 0,
    //         transition: { duration: 0.5, ease:  "easeOut" }
    //     }
    // };

   


    

    return (
        <Fragment>
            {/* Entrance Animation */}
            
            {/* <div className='place-items-center text-center content-center h-screen w-screen absolute z-50 slide-out-top '>
                <h2 className='text-5xl font-semibold uppercase' style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'8px',color:'black'}}>Studio banana</h2>
            </div> */}
            
            <div className='fixed inset-0 z-50 grid grid-cols-4 pointer-events-none  h-screen w-screen'>

                <div className="bg-white h-full animate-slide-out panel-1" />
                <div className="bg-white h-full animate-slide-out panel-2" />
                <div className="bg-white h-full animate-slide-out panel-3" />
                <div className="bg-white h-full animate-slide-out panel-4" />

                <h2 className='absolute inset-0 flex flex-col sm:flex-row justify-center items-center text-3xl sm:text-4xl md:text-5xl font-semibold uppercase text-emerald-800! animate-fade-out' style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'8px',}}>
                    <p className='flex mr-11 sm:mr-0'>
                        <span className='bg-emerald-800 text-white py-1 pl-2 pr-0 inline-block'>S</span> <span className='py-1 px-1'>tudio</span>
                    </p>
                    <p className='flex ml-11 sm:ml-0'>
                        <span className='bg-emerald-800 text-white py-1 pl-2'>b</span> <span className='py-1 px-1'>anana</span>
                    </p>
                </h2>
            </div>
            
            {/* 1. Hero section */}
            <section className='hero relative' id='top'>
                {/* <FadeIn delay={1}> */}
                <Header delay={1.5} />
                {/* </FadeIn> */}

                {/* for the white line behine png */}
                <svg className="lines absolute top-10 sm:top-[20vh] xl:top-0 left- w-full h-screen xl:h-auto" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    {/* <line x1="20" y1="14" x2="50" y2="28" />
                    <line x1="80" y1="14" x2="50" y2="28" /> */}
                    {/* <line x1="20" y1="21" x2="50" y2="35" />
                    <line x1="80" y1="21" x2="50" y2="35" />
                    <line x1="20" y1="28" x2="50" y2="42" />
                    <line x1="80" y1="28" x2="50" y2="42" />
                    <line x1="20" y1="35" x2="50" y2="49" />
                    <line x1="80" y1="35" x2="50" y2="49" /> */}

                    {/* Mobile */}
                    <g className="block lg:hidden">
                        <line x1="10" y1="19" x2="50" y2="38" />
                        <line x1="90" y1="19" x2="50" y2="38" />
                        <line x1="10" y1="29" x2="50" y2="48" />
                        <line x1="90" y1="29" x2="50" y2="48" />
                        <line x1="10" y1="39" x2="50" y2="58" />
                        <line x1="90" y1="39" x2="50" y2="58" />
                    </g>

                    {/* 💻 DESKTOP LINES */}
                    <g className="hidden lg:block">
                        <line x1="20" y1="21" x2="50" y2="35" />
                        <line x1="80" y1="21" x2="50" y2="35" />
                        <line x1="20" y1="28" x2="50" y2="42" />
                        <line x1="80" y1="28" x2="50" y2="42" />
                        <line x1="20" y1="35" x2="50" y2="49" />
                        <line x1="80" y1="35" x2="50" y2="49" />
                    </g>
                </svg>

                {/* <div style={{zIndex:2, position:'relative',height:'100%'}}> */}
                    <div className='py-4 md:py-8 px-4 sm:px-8 lg:px-16 absolute left-1/2 -translate-x-1/2 w-full mx-auto z-20 space-y-4'>
                        {/* <h2 className='text-6xl uppercase font-semibold font-serif text-center scale-in-bl'>Gear up every season <br /> Every <span style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'4px'}}>Workout!</span></h2> */}
                        <h2 className="text-[26px] xs:text-[28px] md:text-[34px] lg:text-[44px] xl:text-[56px] uppercase font-semibold font-serif text-center leading-none" style={{}}>
                            <AnimatedText text="Premium Custom Shirts" className={'hidden sm:block overflow-hidden'} />
                            <AnimatedText text="Crafted for Modern Boutiques" className={'hidden sm:block overflow-hidden'} />
                            
                            <AnimatedText text="Premium" className={'block sm:hidden overflow-hidden'} />
                            <AnimatedText text="Custom Shirts" className={'block sm:hidden overflow-hidden'} />
                            <AnimatedText text="Crafted for" className={'block sm:hidden overflow-hidden'} />                            
                            <AnimatedText text="Modern Boutiques" className={'block sm:hidden overflow-hidden'} />
                        </h2>
                        <div className='flex gap-4 justify-center slide-top'>
                            <button onClick={() => navigate('/auth?mode=register')} className='rounded-full! btn-primary'>Get Wholesale Access</button>
                            {/* <button className='rounded-full! border-0! btn-primary-outline'><a href="#new_arrival_section">NEW ARRIVAL</a></button> */}
                        </div>
                    </div>

                    <div className="place-items-center">
                        <div className="image-wrapper">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="slice" style={{ "--i": i }}></div>
                            ))}
                        </div>
                    </div>


                    <div className='absolute -bottom-1 lg:bottom-32 flex justify-center lg:justify-between items-center w-full h-60 bg-linear-to-b from-transparent from-5% to-50% to-white lg:bg-none lg:px-16 slide-top'>
                            {/* <p>Discover high-quality shirts at competitive wholesale prices. <br />
                            Designed for retailers and bulk buyers.
                            </p> */}
                        <div className='lg:w-72'>
                            <p className='text-center lg:text-left text-black text-lg md:text-xl'>Designer-grade fabrics,<br /> custom Indian manufacturing,<br /> and an industry-best 10-piece MOQ</p>
                        </div>

                        <div className='hidden lg:block w-72 h-40 overflow-hidden rounded-2xl'>
                            <video
                                src={heroVideo}
                                autoPlay
                                muted
                                loop
                                playsInline // for IPhone
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>


                {/* </div> */}
            </section>
            <a 
                href="#top" 
                className={`back-to-top fixed bottom-10 right-10 inline-flex justify-center items-center w-12 h-12 bg-emerald-800 text-white rounded-full shadow shadow-black z-20 transition-all hover:scale-110 hover:brightness-100! `}
                aria-label="Back to top"
            >
                <MdVerticalAlignTop size={24} />
            </a>

            {/* 3. New Arrivals */}  
            {/*Swipable   */}
            {}
            <section className='px-4 sm:px-8 lg:px-16 py-12 sm:py-18 lg:py-24'>
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px"}}
                    variants={containerVariants}
                    className='text-center'
                >
                    <motion.h2 variants={itemVariants} className='uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1 text-center'>New Arrivals</motion.h2>
                    <motion.h1 variants={itemVariants} className='text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight text-center'>Fresh off the design floor.</motion.h1>
                </motion.div>

                <div className='mt-8 sm:mt-10 lg:mt-12'>
                    {( isNewArrivalsLoading || newArrivals.length < 0) ? (
                        <div className='flex overflow-x-auto no-scrollbar '>
                            <div className='flex w-full xl:w-auto mx-auto justify-start space-y-1 md:space-y-0 gap-1 sm:gap-3 lg:gap-6'>
                            {Array.from({ length: 4 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                            ))}
                            </div>
                        </div>
                    ) : (
                        <StaggerContainer whileInView className='flex overflow-x-scroll py-2 no-scrollbar space-y-1 md:space-y-0 gap-1 sm:gap-3 lg:gap-6  w-full'>
                            <div className='flex w-full xl:w-auto mx-auto justify-start space-y-1 md:space-y-0 gap-1 sm:gap-3 lg:gap-6'>
                            {newArrivals
                                // .filter(p => p.is_new_arrival)
                                .map(product => (
                                    <StaggerItem key={product.id} className='w-1/2 shrink-0 max-w-56 sm:max-w-none sm:w-auto'>
                                        <ProductCard product={product} />
                                    </StaggerItem>
                                ))
                            }
                            </div>
                        </StaggerContainer>
                    )}

                    {/* shows all product in products page through navigate */}
                    { newArrivals.length > 0 && 
                        <div className='flex gap-1 justify-center mt-4 md:mt-8'>
                            {/* two ways filtering with useLocation and with window.location + URL Search params */}
                            <p onClick={() => navigate('/products?is_new_arrival=true')} className='py-2 px-4 my-auto text-sm sm:text-base text-emerald-800 bg-white shadow shadow-emerald-800 rounded-full'>View More</p>
                            <CgArrowTopRight 
                                onClick={() =>  navigate('/products', { state: { showNewArrivals: true } })}
                                className='text-white bg-emerald-800 shadow shadow-black h-9 sm:h-10 w-9 sm:w-10 p-2 rounded-full cursor-pointer'/>
                        </div>
                    }
                </div>
                
            </section>




            <section className='px-4 sm:px-8 lg:px-16 py-12 sm:py-18 lg:py-24 bg-[#f5f2eb]'>
                <div className='grid grid-cols-1 md:grid-cols-2 items-center md:gap-16'>
                    {/* left side */}
                    <motion.div  
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className=''
                    >
                        <motion.h2 variants={itemVariants} className='uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1'>Our Design Studio</motion.h2>

                        <motion.h1 variants={itemVariants} className='text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight'>In-house design.<br /> Ethical manufacturing.</motion.h1>
                        {/* <h1 className='text-[28px] sm:text-[40px] font-semibold'>From Raw Fabric To Retail Ready.</h1> */}
                        {/* <p className='text-base'>At Studio Banana, we don't believe in generic wholesale. We source premium bulk fabrics, curate distinct in-house prints and custom embroideries, and partner with expert local tailoring houses across India.
                            The result? Boutique-quality shirts that offer your customers high-end style and provide your business with exceptional retail margins.</p>
                        <p>"We buy premium textiles in bulk, create custom prints and embroideries in-house, and manufacture locally in India. By managing production directly from our Bangalore and Kozhikode hubs,
                            we guarantee boutique-grade quality control and sustainable profit margins for your retail business."</p> */}
                        <motion.p variants={itemVariants} className='mt-4 md:mt-6'>Led by our in-house fashion design team in Bengaluru, we curate distinct prints, premium textiles, and custom embroideries entirely from scratch. By managing our manufacturing pipeline directly and servicing retail clients through our commercial hubs in Bangalore and Kozhikode,
                            we guarantee impeccable boutique-grade quality control and exceptional retail margins for your storefront.</motion.p>
                    </motion.div>


                    {/* right side */}
                    <div className='mt-8 md:mt-0 overflow-hidden'>
                        <motion.img
                            initial={{ scale: 1.9 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut"}} 
                            src={OurDesignStory} alt="" className='max-h-120 w-full object-cover'
                        />                            
                    </div>
                </div>
            </section>

            {/* 2. Categories */}
            {/* on mobile column 2 , make it not arranged, semi transapernt backround blend under category text subtle gradient shade ,inside bottom of image .
             add arrow not button next to the text */}
            <section className='px-4 sm:px-8 lg:px-16 pt-12 sm:pt-18 lg:pt-24 pb-6 sm:pb-9 lg:pb-12 '>
                <h2 className='uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1 text-center'>Collections</h2>
                <div className='w-max max-w-full mx-auto grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12'>
                    {collectionCard.map(card => (
                        <div key={card.id}
                            onClick={() => navigate(card.link)}
                            className={`relative group cursor-pointer max-w-72 aspect-square bg-[#f5f2eb] overflow-hidden hover:brightness-90 ${card.mobileOrder} ${card.desktopOrder}`} >
                            <motion.img 
                                initial={{ scale: 1.5 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut"}}
                                src={card.image} alt={`Studio Banana ${card.name} wholesale`} 
                                className='w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-105' 
                            />
                            <div className='absolute bottom-0 flex items-center justify-center gap-1 xs:gap-2 sm:gap-4 h-1/3 text-white w-full bg-linear-to-t from-black from- to-80% to-transparent'>
                                <p className='text-center text-xs sm:text-sm uppercase font-semibold tracking-widest'>{card.name}</p>
                                <CgArrowRight className='text-xl sm:text-2xl transform transition-transform duration-300 ease-out group-hover:translate-x-1' />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            


            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px"}}
                variants={containerVariants}
                className='px-4 sm:px-8 lg:px-16 py-6 sm:py-9 lg:py-12'
            >
            {/* 4. Why choose Us */}
            {/* add click effect insted of hover but one visible at a time for mobile only  */}
            {/* on mobile column 1  */}
                <motion.h2 variants={itemVariants} className='uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1 text-center'>The Studio Banana Advantage</motion.h2>
                <motion.h1 variants={itemVariants} className='text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight text-center'>Engineered for independent retailers.</motion.h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12'>
                    {advantageCards.map((card) => {
                        const isExpanded = activeId === card.id
                        
                        return (
                            <motion.div variants={itemVariants} key={card.id} onClick={() => setActiveId(card.id)} 
                                className={`cursor-pointer md:h-50 p-4 md:p-6 bg-linear-to-r from-emerald-800 from-50% to-white to-50% bg-size-[200%_100%] transition-all duration-700 ease-in-out 
                                    ${isExpanded ? 'transform -translate-y-2 bg-position-[0%_0%] text-white ' : 'bg-position-[100%_0%] text-black'}`} 
                                    // className={`group cursor-pointer md:h-50 p-4 md:p-6 bg-linear-to-r from-emerald-800 from-50% to-white to-50% bg-size-[200%_100%] transition-all duration-700 ease-in-out 
                                    // ${isExpanded ? 'transform -translate-y-2 bg-position-[0%_0%] text-white lg:[@media(hover:hover)]:bg-position-[100%_0%] lg:[@media(hover:hover)]:text-black' : 'bg-position-[100%_0%] text-black'} 
                                    // lg:hover:bg-position-[0%_0%] lg:hover:text-white`} 
                                >
                                <div className='h-full flex flex-col justify-center md:items-center space-y-2 overflow-hidden'>
                                    <div className='flex md:contents gap-3 xs:gap-4 md:space-y-2'>
                                        <span className="text-2xl md:text-4xl">{card.icon}</span>

                                        <div className='flex flex-col items-center justify-center h-full space-y-4'>
                                            <h3 className={`font-semibold text-base text-center tracking-wide uppercase transition-all duration-700  
                                                ${isExpanded ? 'text-white!' : 'text-black '} `}
                                                // ${isExpanded ? 'text-white! lg:text-black! lg:group-hover:text-white!' : 'text-black '} lg:group-hover:text-white!`}>
                                            >
                                            {card.header}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={` transition-all duration-700 origin-left md:origin-bottom 
                                            ${isExpanded ? 'mt-3 max-h-30 opacity-100 scale-100 ' : 'max-h-0 opacity-0 scale-50 '}`}
                                            // className={` transition-all duration-700 origin-left md:origin-bottom 
                                            // ${isExpanded ? 'mt-3 max-h-30 opacity-100 scale-100 lg:mt-0 lg:max-h-0 lg:opacity-0 lg:scale-50' : 'max-h-0 opacity-0 scale-50 '}
                                            //  lg:group-hover:mt-3 lg:group-hover:max-h-30 lg:group-hover:opacity-100 lg:group-hover:scale-100`}
                                    >
                                        <p className='text-sm md:text-center text-white'>{card.body}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
                
            </motion.section>

            
            

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px"}}
                variants={containerVariants}
                className='px-4 sm:px-8 lg:px-16 py-6 sm:py-9 lg:py-12 '
            >
                <motion.h2 variants={itemVariants} className='uppercase tracking-wider text-sm sm:text-base text-emerald-800! mb-1 text-center'>Our Hubs</motion.h2>
                <motion.h1 variants={itemVariants} className='text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight text-center'>Experience the fabric in person.</motion.h1>
                <motion.p variants={itemVariants} className="mt-4 md:mt-6 text-sm md:text-base text-center max-w-xl mx-auto leading-relaxed">
                    Want to feel our premium textile weaves and inspect our custom stitching line quality before placing a bulk order? Retail buyers and boutique owners are always welcome to visit our commercial wholesale hubs.
                </motion.p>
                <div className='w-max max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12'>

                    <motion.div variants={itemVariants} className="bg-[#F5F2EB] rounded-lg max-w-125 w-full lg:w-108 p-6 sm:p-8 flex flex-col border border-gray-100 shadow-sm">
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
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#F5F2EB] rounded-lg max-w-125 w-full lg:w-108 p-6 sm:p-8 flex flex-col border border-gray-100 shadow-sm">
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
                    </motion.div>

                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px"}}
                variants={containerVariants} 
                className='lg:hidden px-4 sm:px-8 lg:px-16 py-6 sm:py-9 lg:py-12'
            >
                <motion.div variants={itemVariants} className="w-full xs:h-100 sm:h-125 md:h-140 aspect-3/4 rounded-lg overflow-hidden shadow-sm ">
                    <video
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline // for IPhone
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </motion.section>
            

            {/* bg-gradient like hero | primary rounded  */}
            <section className='px-4 sm:px-8 lg:px-16 pt-6 sm:pt-9 lg:pt-12 pb-12 sm:pb-18 lg:pb-24'>
            {/* 6. Call to Action */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px"}}
                    variants={containerVariants}
                    className='bg-linear-to-bl from-[#f5f2eb] from-10% to-[#94bb86] to-50% place-items-center rounded-2xl px-6 py-8'
                >
                    <motion.h1 variants={itemVariants} className='text-[28px] sm:text-[40px] font-semibold leading-tight tracking-tight text-center'>Ready to elevate your store's collection?</motion.h1>
                    <motion.p variants={itemVariants} className='text-sm sm:text-base text-center text-black max-w-xl mt-4 md:mt-6'> Open a verified wholesale buyer account today to unlock full catalog access, real-time inventory tracking, and volume discounts.</motion.p>

                    <motion.button variants={itemVariants} onClick={() => navigate('/auth?mode=register')} className='btn-primary mt-8'> Create Buyer Account</motion.button>
                </motion.div>
            </section>
            {/* <section className='p-4 sm:p-8 lg:p-16 py-12 sm:py-18 lg:py-24'>
                <div className='bg-emerald-700 place-items-center rounded-2xl p-16'>
                    <h1 className='text-[28px] sm:text-[40px] font-semibold text-white! text-center'>Ready to elevate your store's collection?</h1>
                    <p className='text-center text-white'> Open a verified wholesale buyer account today to unlock full catalog access, real-time inventory tracking, and volume discounts.</p>

                    <button onClick={() => navigate('/auth?mode=register')} className='btn-primary-outline mt-4'> Create Buyer Account</button>
                </div>
            </section> */}



            {/* Brand name goes slide out top or scale out vertical when first enter */}
            {/* Brand name with two color(white+ green) / outlined as Header */}
            {/* secondary text with different font */}
            {/* Premium Fashion, Priced for Retail Profit */}
            {/* Dress to impress fashion that speaks for you */}
            {/* Explore Collection / Shop Now primary button , New Arriavl/ register secondary button in hero section*/}
            {/* colored primary button and outlined secondary button */}
            {/* New collection section and All collection button right side of new arrrival head & under new collection*/}
            {/* products scale from bottom, zoom in/out animation  */}
            {/* all products is in behind of center product or images */}


            {/* 7. Footer */}
            <Footer />
            {/* Column 1: Brand Identity (Studio Banana logo, brief one-sentence bio, and social media links).Column 2: Shop (Linen, Denim, Silk, Casual, Formal, T-Shirts).
            Column 3: Company (About Us, Our Design Story, Manufacturing Process).Column 4: Support (Contact Us, FAQ, Terms of Service, Return Policy). */}

        </Fragment>
    );
}

export default Home;
