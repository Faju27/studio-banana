import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { MdClose } from 'react-icons/md';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import FadeIn from '../../animations/FadeIn';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { AnimatePresence, motion } from "motion/react";
import { CartSkeleton } from '../../components/skeletons';
import { useWholesaler } from '../../hooks/useWholesaler';
import { useAuth } from '../../hooks/useAuth';

const MyCart = () => {

    const { accessToken } = useAuth();
    const { fetchWholesaler, wholesaler } = useWholesaler();
    const { cartItems, cartItemsLoading, removeFromCart, increaseQuantity,
            decreaseQuantity, clearCart, totalItems, subtotal, total} = useCart();

    const [showClearModal, setShowClearModal] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (accessToken) {
            fetchWholesaler();
        }
    }, [accessToken]);


    const isApproved = wholesaler?.is_approved;
    const minimumQuantity = 10;

    const hasUnavailableProducts = cartItems.some(item => !item.product.is_active)

    const hasOutOfStockproducts = cartItems.some(item =>
        item.product.stock === 0
        // || item.quantity > item.product.stock //check quantity is greater than stock
    );

    const hasUnavailableVariants = cartItems.some(item => {
        const selectedSizeAvailable = item.product.sizes.some(
            size => size.id === item.size.id
        );

        const selectedColorAvailable = item.product.colors.some(
            color => color.id === item.color.id
        );

        return !selectedSizeAvailable || !selectedColorAvailable;
    });

    const totalAvailableQuantity = cartItems
        .filter(item => item.product.is_active)
        .reduce((total, item) => 
            total + item.quantity,
            0
        );

    const canProceed =
        isApproved &&
        !hasUnavailableProducts &&
        !hasOutOfStockproducts &&
        !hasUnavailableVariants &&
        totalAvailableQuantity >= minimumQuantity;

    return (
        <Fragment>
            <div className='min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Your Wholesale Cart</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Cart </p>
                    </FadeIn>
                </section>
                

                <section className='grow container place-self-center grid grid-cols-3 gap-8 mt-16 pb-30 px-4 '>
                    <main className="col-span-3 xl:col-span-2">
                        <FadeIn delay={0.15}>
                            {cartItemsLoading ? (
                                <CartSkeleton />
                            ) : cartItems.length > 0 ? (
                                <div className='flex flex-col gap-4 md:gap-8'>
                                    <div className='hidden md:grid md:grid-cols-9 gap-4 p-4 bg-emerald-700 text-white font-semibold text-lg'>
                                        <p className='col-span-1'></p>
                                        <p className='col-span-4'>Product</p>
                                        <p className='col-span-1'>Price</p>
                                        <p className='col-span-2'>Quantity</p>
                                        <p className='col-span-1'>Subtotal</p>
                                    </div>

                                    <StaggerContainer className='space-y-4 md:space-y-8'>
                                        <AnimatePresence mode='popLayout'>
                                        {cartItems.map((item, index) => {
                                            const isUnavailable = !item.product.is_active || item.product.stock === 0 || !item.product.sizes.some(size => size.id === item.size.id) || !item.product.colors.some(color => color.id === item.color.id)
                                            const sellingPrice = item.product.discount_price !== null ? item.product.discount_price : item.product.price
                                            const itemTotal = Number(sellingPrice) * item.quantity

                                            return (
                                                <StaggerItem key={item.id} 
                                                    className="flex flex-col gap-8"
                                                >
                                                    <div className='flex flex-col md:grid md:grid-cols-9 gap-2 md:gap-4 p-2 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-100 md:bg-transparent md:p-0 md:rounded-none md:border-none'>
                                                        
                                                        <div className='col-span-9 md:col-span-5 md:grid md:grid-cols-5 flex gap-3'>
                                                            <div className='md:col-span-1 order-3 md:order-1 ml-auto md:ml-0 place-self-center'>
                                                                <IoCloseOutline onClick={() => removeFromCart(item.id)} 
                                                                    title='Clear this Item from cart?' size={36} 
                                                                    className='text-black md:text-gray-500 hover:text-black active:text-gray-500 cursor-pointer'/>
                                                            </div>
                                                            <div className={`flex gap-3 order-2 md:order-1 md:col-span-4 ${isUnavailable ? 'opacity-50' : ''} ${item.product.is_active ? 'cursor-pointer' : 'cursor-default'}`} 
                                                                onClick={() => {
                                                                    if(item.product.is_active) {
                                                                        navigate(`/products/${item.product.id}`)
                                                                    }
                                                                }}>
                                                                <img src={ item.product.images?.[0]?.image } alt={item.product} className='bg-gray-300 aspect-4/5 w-16 md:w-25' />
                                                                <div className='content-center'>
                                                                    <h2 className='font-semibold text-sm sm:text-base lg:text-lg line-clamp-2'>{item.product.name}</h2>
                                                                    <p className='text-xs sm:text-sm lg:text-base capitalize mt-1'>Color : <span className='font-medium text-gray-700'>
                                                                        {/* { item.product.colors.find(c => c.id === item.color).name } */}
                                                                        {item.color?.name}
                                                                        </span> | 
                                                                        Size : <span className='font-medium text-gray-700'>
                                                                        {/* { item.product?.sizes?.find(s => s.id === item.size.id).name }  */}
                                                                        {item.size?.name || 'N/A'}</span>
                                                                    </p>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                        
                                                        <div className='flex md:contents flex-wrap items-center justify-between pt-2 md:pt-0 border-t md:border-none border-gray-100'>
                                                            <div className={`col-span-1 flex flex-col md:justify-center ${isUnavailable ? 'opacity-50' : ''} `}>
                                                                <span className='text-xs text-gray-400 block md:hidden'>Price:</span>
                                                                <div className='flex items-center gap-1 md:flex-col'>
                                                                    <span className='text-black font-semibold text-sm sm:text-base lg:text-lg'>${sellingPrice}</span>
                                                                    {item.product.discount_price !== null && (
                                                                        <span className='line-through text-gray-500 text-sm lg:text-base'>${ item.product.price }</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={`col-span-2 flex flex-col justify-center ${isUnavailable ? 'opacity-50' : ''} `}>
                                                                <span className='text-xs text-gray-400 block mb-1 md:hidden'>Quantity:</span>
                                                                <div className='items-center text-base lg:text-lg text-black flex'>
                                                                    <button disabled={isUnavailable || item.quantity <= 1} className={` ${isUnavailable || item.quantity <= 1 ? '' : 'hover:bg-gray-300'} unstyled-btn no-hover-effect p-2 md:p-3 border border-gray-300 rounded-full cursor-pointer transition`}>
                                                                        <FiMinus size={16} 
                                                                            onClick={() => decreaseQuantity(item)} />
                                                                    </button>
                                                                    <span className="w-8 md:w-10 text-center font-semibold"> { item.quantity } </span>
                                                                    <button disabled={isUnavailable} className={` ${isUnavailable ? '' : 'hover:bg-gray-300'} unstyled-btn no-hover-effect p-2 md:p-3 border border-gray-300 rounded-full cursor-pointer transition`} >
                                                                        <FiPlus size={16} 
                                                                        onClick={() => increaseQuantity(item)} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className={`col-span-1 content-center text-right md:text-left ${isUnavailable ? 'opacity-50' : ''} `}>
                                                                <span className='text-xs text-gray-400 block md:hidden'>Subtotal:</span>
                                                                <span className='font-bold text-sm sm:text-base lg:text-lg text-emerald-800'>${ itemTotal.toFixed(2) }</span> 
                                                            </div>
                                                        </div>

                                                        {/* <div className='col-span-full' > */}
                                                            {!item.product.is_active ? (
                                                                <p className='text-xs sm:text-sm text-red-600 font-medium col-span-full '>
                                                                    This product is no longer available.
                                                                </p>
                                                            ) : item.product.stock === 0 ? (
                                                                <p className='text-xs sm:text-sm text-red-600 font-medium col-span-full '>
                                                                    This product is currently out of stock.
                                                                </p>
                                                            ) : !item.product.sizes.some(size => size.id === item.size.id) ? (
                                                                <p className="text-xs sm:text-sm text-red-600 font-medium col-span-full">
                                                                    The selected size is no longer available.
                                                                </p>
                                                            ) : !item.product.colors.some(color => color.id === item.color.id) ? (
                                                                <p className="text-xs sm:text-sm text-red-600 font-medium col-span-full">
                                                                    The selected color is no longer available.
                                                                </p>
                                                            )  : null}
                                                        {/* </div> */}
                                                    </div>
                                                    
                                                    <hr className='hidden md:block text-gray-300' />
                                                </StaggerItem>
                                            )
                                        })}
                                        </AnimatePresence>
                                    </StaggerContainer>

                                    <div className='flex flex-col gap-6 items-stretch my-4 md:flex-row md:justify-between md:items-center'>
                                        <div className='flex gap-2 md:gap-4 text-sm sm:text-base'>
                                            <input className='border bg-white! p-3! border-gray-300! rounded-none!' placeholder='Coupon Code' />
                                            <button className='btn-primary rounded-none! '>Apply Coupon</button>
                                        </div>
                                            <a onClick={() => cartItems.length && setShowClearModal(true)} 
                                                className={`font-semibold underline ${cartItems.length ? "text-emerald-800 cursor-pointer" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>
                                                Clear Shopping Cart
                                            </a>
                                        {/* {showClearModal && */}
                                            <ConfirmModal
                                                isOpen={showClearModal}
                                                title="Clear Cart?"
                                                message="Are you sure you want to clear all items from cart?"
                                                confirmText="Clear Cart"
                                                cancelText="Cancel"
                                                onConfirm={async () => {
                                                    await clearCart();
                                                    setShowClearModal(false);
                                                }}
                                                onCancel={() => setShowClearModal(false)}
                                            />
                                        {/* } */}
                                    </div>
                                </div>
                            ) : (
                                <p className='text-center font-medium py-20'>
                                    Your cart is empty.
                                </p>
                            )}
                        </FadeIn>
                    </main>


                    <aside className='col-span-3 xl:col-span-1'>
                        <FadeIn delay={0.3}>
                            <div className='border border-gray-300 p-4 md:p-6 flex flex-col gap-4 text-sm lg:text-base'>
                                <h2 className='text-base sm:text-lg lg:text-xl font-semibold mb-2'>Order Summary</h2>
                                <hr className='text-gray-300' />
                                <div className='flex justify-between'>
                                    <p>Items</p>
                                    <p className='text-black'>{ totalItems }</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>Sub Total</p>
                                    <p className='text-black'>${ subtotal }</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>Shipping</p>
                                    <p className='text-black'>$00.00</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>Taxes</p>
                                    <p className='text-black'>$00.00</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>Coupon Discount</p>
                                    <p className='text-black'>-$00.00</p>
                                </div>
                                <hr className='text-gray-300' />
                                <div className='flex justify-between'>
                                    <p>Total</p>
                                    <p className='text-black'>${total}</p>
                                </div>
                                <div>
                                    <button disabled={!canProceed} onClick={() => navigate(`/checkout`)} 
                                    className={`w-full rounded-none! mt-4 py-4! $ ${!canProceed ? 'bg-gray-300 cursor-not-allowed!' : 'btn-primary'} `}>
                                        Proceed to Checkout
                                    </button>
                                    {!isApproved ? (
                                        <p className="text-sm text-amber-600 text-center mt-2">
                                            Approval pending. Checkout will be available after your account is approved.
                                        </p>
                                    ) : hasUnavailableProducts ? (
                                    <p className='text-sm text-red-600 text-center mt-2'>
                                        Some items in your cart are no longer available.
                                        Please remove them before proceeding.
                                    </p> 
                                    ) : hasOutOfStockproducts ? (
                                        <p className='text-sm text-red-600 text-center mt-2'>
                                            Some products in your cart are out of stock.
                                            Please remove them before proceeding.
                                        </p>
                                    ): hasUnavailableVariants ? (
                                        <p className="text-sm text-red-600 text-center mt-2">
                                            Some selected sizes or colors are no longer available.
                                            Please remove those items before proceeding.
                                        </p>
                                    )  : totalAvailableQuantity < 10 ? (
                                        <p className="text-sm text-red-600  text-center mt-2">
                                            Minimum order quantity is 10 pieces. You currently have {totalAvailableQuantity}.
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </FadeIn>
                    </aside>

                </section>

                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default MyCart;
