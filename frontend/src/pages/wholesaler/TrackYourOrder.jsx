import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaBoxOpen, FaClipboardCheck, FaTruck } from 'react-icons/fa';
import { FaTruckFast } from 'react-icons/fa6';
import { FiBox, FiCheck} from 'react-icons/fi';
import { MdOutlineAssignment, MdOutlineAssignmentTurnedIn } from 'react-icons/md';
import { TbTruck, TbTruckDelivery } from "react-icons/tb";
import { useOrder } from '../../hooks/useOrder';
import FadeIn from '../../animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';

const TrackYourOrder = () => {
    const { orderId } = useParams()
    const { order, fetchOrder } = useOrder();

    useEffect(() => {
        fetchOrder(orderId);
    }, [orderId]);

    
    const statuses = ['accepted', 'processing', 'shipped', 'delivered'];
  
    const currentStatusIndex = statuses.indexOf(order?.status);

    const fillPercentage = (currentStatusIndex / (statuses.length - 1)) * 100;

    const isStepActive = (stepNumber) => {
        if (stepNumber === 1) return currentStatusIndex >= 0; // Placed & Accepted
        if (stepNumber === 2) return currentStatusIndex >= 1; // In progress (accepted or processing)
        if (stepNumber === 3) return currentStatusIndex >= 2; // On the Way (shipped)
        if (stepNumber === 4) return currentStatusIndex >= 3; // Delivered
        return false;
    };
    
    return (
        <Fragment>
            <div className='min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Track Your Order</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Track Your Order </p>
                    </FadeIn>
                </section>

                <section className='grow container place-self-center gap-8 pb-30 px-4'>
                    <FadeIn delay={0.1}>
                    <div className='space-y-6 mt-16'>
                        <div className='space-y-1'>
                            <h2 className='text-lg lg:text-xl font-semibold'>Order Status</h2>
                            <h2 className='text-base lg:text-lg'>Order ID : #{ order?.order_number }</h2>
                        </div>
                        
                        <FadeIn delay={0.2}>
                        <main className='space-y-6 border border-gray-300 p-4 md:p-8'>
                            <div className='flex justify-between md:mx-8 text-xs sm:text-sm md:text-base'>
                                <div className={`place-items-center relative min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(1) ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    <div className={`absolute top-3 md:top-4 right-5 md:right-6 -z-10 bg-emerald-700 w-4 h-4 md:w-7 md:h-7 rounded-full opacity-90 ${isStepActive(1) ? 'block' : 'hidden'}`} />
                                    <MdOutlineAssignment className='text-3xl md:text-5xl' />
                                    <p className="mt-2">Order Placed</p>
                                </div>
                                
                                {/* <div className={`place-items-center relative min-w-18 sm:min-w-20 md:min-w-24  ${isStepActive(1) ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    <div className={`absolute top-3 md:top-4 right-5 md:right-6 -z-10 bg-emerald-700 w-4 h-4 md:w-7 md:h-7 rounded-full opacity-90 ${isStepActive(1) ? 'block' : 'hidden'}`} />
                                    <MdOutlineAssignmentTurnedIn className='text-3xl md:text-5xl' />
                                    <p className="mt-2">Order Confirmed</p>
                                </div> */}

                                <div className={`place-items-center relative min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(2) ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    <div className={`absolute top-3 md:top-4 right-5 md:right-6 -z-10 bg-emerald-700 w-4 h-4 md:w-7 md:h-7 rounded-full opacity-90 ${isStepActive(2) ? 'block' : 'hidden'}`} />
                                    <FiBox className='text-3xl md:text-5xl' />
                                    <p className="mt-2">In progress</p>
                                </div>

                                <div className={`place-items-center relative min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(3) ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    <div className={`absolute top-3 md:top-4 right-5 md:right-6 -z-10 bg-emerald-700 w-4 h-4 md:w-7 md:h-7 rounded-full opacity-90 ${isStepActive(3) ? 'block' : 'hidden'}`} />
                                    <TbTruckDelivery className='text-3xl md:text-5xl' />
                                    <p className="mt-2">On the Way</p> 
                                </div>

                                <div className={`place-items-center relative min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(4) ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                    <div className={`absolute top-3 md:top-4 right-5 md:right-6 -z-10 bg-emerald-700 w-4 h-4 md:w-7 md:h-7 rounded-full opacity-90 ${isStepActive(4) ? 'block' : 'hidden'}`} />
                                    <TbTruck className='text-3xl md:text-5xl' />
                                    <p className="mt-2">Delivered</p>
                                </div>
                            </div>

                            <div className="relative mx-6 md:mx-16">
                                <div className="w-full absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gray-300"></div>
                                <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-black transition-all" 
                                    style={{ width: `${fillPercentage}%` }}
                                ></div>

                                <div className="relative flex justify-between w-full z-10">
                                    {statuses.map((status, index) => (
                                    <div 
                                        key={status} 
                                        className={`w-6 md:w-8 h-6 md:h-8 flex justify-center items-center rounded-lg transition-all 
                                        ${index <= currentStatusIndex ? 'bg-black' : 'bg-gray-300'}`}
                                    >
                                        <FiCheck className='text-white text-xl'/>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-between md:mx-8 text-xs sm:text-sm md:text-base'>
                                <div className={`place-items-center min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(1) ? 'text-black' : 'text-gray-500'}`}>
                                    <p>{ new Date(order?.created_at).toDate() }</p>
                                    <p className='uppercase'>{ new Date(order?.created_at).toTime() } </p>
                                </div>
                                <div className={`place-items-center min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(2) ? 'text-black' : 'text-gray-500'}`}>

                                </div>
                                <div className={`place-items-center min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(3) ? 'text-black' : 'text-gray-500'}`}>
                                    <p>{ order?.shipped_at && new Date(order.shipped_at).toDate() }</p>
                                    <p className='uppercase'>{ order?.shipped_at && new Date(order.shipped_at).toTime()  } </p>

                                </div>
                                <div className={`place-items-center min-w-18 sm:min-w-20 md:min-w-24 ${isStepActive(4) ? 'text-black' : 'text-gray-500'}`}>
                                    <p>{!order?.delivered_at && 'Expected'}</p>
                                    <p>{order?.delivered_at ? new Date(order.delivered_at).toDate() : new Date(order?.estimated_delivery_date).toDate() }</p>
                                    <p className='uppercase'>{ order?.delivered_at && new Date(order.delivered_at).toTime() } </p>
                                </div>
                            </div>
                        </main>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                        <div className='space-y-2 md:space-y-6 border border-gray-300 p-4 md:p-8'>
                            <h2 className='text-base lg:text-lg font-semibold'>Products</h2>
                            <hr className='text-gray-300' />

                            {order?.order_items && order.order_items.length > 0 && (
                                <StaggerContainer className='space-y-2 md:space-y-6'>
                                {order.order_items.map((item, index) => 
                                    <StaggerItem key={item.id} className='space-y-2 md:space-y-6'>
                                        <div className='flex gap-3'>
                                            <img src={ item.product.images?.[0]?.image } alt={ item.product } className='bg-gray-300 aspect-4/5 w-16 min-w-16 md:w-25'/>
                                            <div className='content-center'>
                                                <h2 className='font-semibold text-sm sm:text-base lg:text-lg line-clamp-2'>{ item.product.name }</h2>
                                                <p className='text-xs sm:text-sm lg:text-base capitalize mt-1'>
                                                    Color : 
                                                    <span className='font-medium text-gray-700'> { item.color.name } </span>
                                                     | Size : 
                                                    <span className='font-medium text-gray-700'> { item.size.name } </span>
                                                     | Qty. 
                                                    <span className='font-medium text-gray-700'> { item.quantity } </span>
                                                </p>                                            </div>
                                        </div>
                                        {index < order.order_items.length - 1 && <hr className='text-gray-300' /> }     
                                    </StaggerItem>
                                )}
                                </StaggerContainer>
                            )}

                        </div>
                        </FadeIn>

                    </div>
                    </FadeIn>   
                </section>

                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default TrackYourOrder;
