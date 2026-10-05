import React, { Fragment, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';
import { FiCheck } from 'react-icons/fi';
import { useOrder } from '../../hooks/useOrder';
import FadeIn from '../../animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';

const OrderCompleted = () => {
    const { orderId } = useParams()
    const { order, fetchOrder } = useOrder();

    useEffect(() => {
        fetchOrder(orderId);
    }, [orderId]);



    return (
        <Fragment>
            <div className='min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Order Completed</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Order Completed </p>
                    </FadeIn>
                </section>

                <section className='grow container place-self-center gap-8 pb-30 px-4'>
                    <FadeIn delay={0.1}>
                    <main className='flex flex-col justify-center items-center my-8 lg:my-16'>
                        <FiCheck className='bg-emerald-700 text-white rounded-full p-2 my-4 text-5xl md:text-6xl'  />
                        <h2 className='text-xl lg:text-3xl font-semibold'>Your order is completed!</h2>
                        <p className='text-base lg:text-xl'>Thank you. Your Order has been received.</p>
                    </main>
                    </FadeIn>

                    <div className='flex flex-col gap-4'>
                        <FadeIn delay={0.2}>
                        <div className='bg-emerald-700 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2 md:p-4'>
                            <div>
                                <p className='text-gray-300 text-sm lg:text-base'>Order ID</p>
                                <p onClick={() => order?.order_number && navigator.clipboard.writeText(order.order_number)} className='text-white font-semibold text-base lg:text-lg cursor-pointer'>#{ order?.order_number } </p>
                            </div>
                            {/* <span className='border-l border-gray-300'></span> */}
                            <div>
                                <p className='text-gray-300 text-sm lg:text-base'>Payment Method</p>
                                <p className='text-white font-semibold text-base lg:text-lg capitalize'>{ order?.payments?.find(p => p.status === 'paid')?.payment_method}</p>
                            </div>
                            {/* <span className='border-l border-gray-300'></span> */}
                            <div>
                                <p className='text-gray-300 text-sm lg:text-base'>Payment ID</p>
                                <p className='text-white font-semibold text-base lg:text-lg truncate'>{ order?.payments?.find(p => p.status === 'paid')?.razorpay_payment_id }</p>
                            </div>
                            {/* <span className='border-l border-gray-300'></span> */}
                            <div>
                                <p className='text-gray-300 text-sm lg:text-base'>Estimated Delivary</p>
                                <p className='text-white font-semibold text-base lg:text-lg truncate'>{ new Date(order?.estimated_delivery_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }</p>
                            </div>
                            <div className='text-sm lg:text-base'>
                                <button className='btn-primary-outline rounded-none! font-semibold'>Download Invoice</button>
                            </div>
                        </div>
                        </FadeIn>


                        <FadeIn delay={0.3}>
                        <div className='space-y-4 border border-gray-300 p-4 md:p-8 overflow-hidden'>
                            <h2 className='text-lg lg:text-xl font-semibold'>Order Details</h2>
                            <hr className='text-gray-300' />               
                            <div className='flex justify-between text-base lg:text-lg text-black font-semibold'>
                                <p>Products</p>
                                <p>Sub Total</p>
                            </div>
                            {order?.order_items && order.order_items.length > 0 && (
                                <StaggerContainer className='space-y-4'>
                                {order?.order_items.map(item => 
                                    <StaggerItem key={item.id} className='flex justify-between items-center gap-2'>
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
                                                </p>
                                            </div>
                                        </div>
                                        <p className='text-sm sm:text-base lg:text-lg text-black'>${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</p>
                                    </StaggerItem>
                                )}
                                </StaggerContainer>
                            )}
                            
                            <hr className='text-gray-300' />      
                            <div className='flex justify-between text-sm sm:text-base lg:text-lg text-black'>
                                <div className='font-semibold space-y-4'>
                                    <p>Shipping</p>
                                    <p>Taxes</p>
                                    <p>Coupon Discount</p>
                                </div>
                                <div className='place-items-center space-y-4'>
                                    <p>$00.00</p>
                                    <p>$00.00</p>
                                    <p>-$00.00</p>
                                </div>
                            </div>         
                            <hr className='text-gray-300' />
                            <div className='flex justify-between text-base sm:text-lg lg:text-xl text-black font-semibold'>
                                <p>Total</p>
                                <p>${ order?.total_price }</p>
                            </div>        
                        </div>
                        </FadeIn>
                    </div>   
                </section>

                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default OrderCompleted;
