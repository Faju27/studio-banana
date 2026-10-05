import React from 'react';

const CartSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 md:gap-8 animate-pulse w-full pointer-events-none">
            
            {/* ========================================================
                1. TABLE HEADER (Always stays visible & unshifted)
               ======================================================== */}
            <div className='hidden md:grid md:grid-cols-9 gap-4 p-4 bg-emerald-700/90 text-white font-semibold text-lg'>
                <div className='col-span-1'></div>
                <div className='col-span-4'>Product</div>
                <div className='col-span-1'>Price</div>
                <div className='col-span-2'>Quantity</div>
                <div className='col-span-1'>Subtotal</div>
            </div>

            {/* ========================================================
                2. SKELETON CART ROWS (Renders 2 mock item rows)
               ======================================================== */}
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-8 w-full">
                    <div className='flex flex-col md:grid md:grid-cols-9 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 md:bg-transparent md:p-0 md:rounded-none md:border-none'>
                        
                        {/* Left Side: Close Icon, Thumbnail, and Product Descriptions */}
                        <div className='col-span-9 md:col-span-5 md:grid md:grid-cols-5 flex gap-3 items-center'>
                            {/* Close Icon Mask */}
                            <div className='md:col-span-1 order-3 md:order-1 ml-auto md:ml-0 place-self-center'>
                                <div className='h-9 w-9 bg-slate-200 rounded-full' />
                            </div>
                            
                            {/* Image Thumbnail & Text Groups */}
                            <div className='flex gap-3 order-2 md:order-1 md:col-span-4 flex-1 items-center'>
                                {/* Perfect match for your thumbnail aspect-4/5 layout */}
                                <div className='bg-slate-200 aspect-4/5 w-16 md:w-25 shrink-0 rounded-lg' />
                                <div className='space-y-2.5 flex-1 py-1'>
                                    {/* Product Title Bar */}
                                    <div className='h-4 w-5/6 sm:w-2/3 bg-slate-200 rounded' />
                                    {/* Variant Specs Info Row */}
                                    <div className='h-3.5 w-1/2 sm:w-1/3 bg-slate-100 rounded' />
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Side Responsive Panel (Grid rows on desktop, Flex spacing on mobile) */}
                        <div className='flex md:contents flex-wrap items-center justify-between pt-2 md:pt-0 border-t md:border-none border-gray-100'>
                            
                            {/* Price Metrics Column */}
                            <div className='col-span-1 flex flex-col md:justify-center space-y-1.5'>
                                <div className='h-3 w-10 bg-slate-100 rounded md:hidden' /> {/* Mobile Label */}
                                <div className='h-5 w-14 bg-slate-200 rounded' />
                            </div>
                            
                            {/* Quantity Adjustment Pill Column */}
                            <div className='col-span-2 flex flex-col justify-center space-y-1.5'>
                                <div className='h-3 w-14 bg-slate-100 rounded md:hidden' /> {/* Mobile Label */}
                                <div className='h-9 w-28 md:h-11 md:w-32 bg-slate-100 rounded-full' />
                            </div>
                            
                            {/* Subtotal Column */}
                            <div className='col-span-1 content-center text-right md:text-left space-y-1.5'>
                                <div className='h-3 w-12 bg-slate-100 rounded md:hidden ml-auto' /> {/* Mobile Label */}
                                <div className='h-5 w-16 bg-slate-200 rounded font-bold ml-auto md:ml-0' />
                            </div>
                            
                        </div>

                    </div>
                    {/* Divider Line matching desktop view layout rules */}
                    <hr className='hidden md:block text-gray-200' />
                </div>
            ))}
            
        </div>
    );
}

export default CartSkeleton;
