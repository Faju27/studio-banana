import React from 'react';

const ProductDetailsSkeleton = () => {
    return (
        <section className='grow container px-4 md:px-6 lg:px-8 my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 place-self-center animate-pulse w-full'>
                    
                    {/* ========================================================
                        LEFT COLUMN: IMAGES GALLERY SECTION (col-span-6)
                       ======================================================== */}
                    <div className='col-span-1 lg:col-span-6'>
                        <div className="overflow-hidden gap-4 flex flex-col">
                            <div className='grid grid-cols-6 gap-4'>
                                
                                {/* 1A. VERTICAL THUMBNAIL LIST (Hidden on mobile, matches xl:flex) */}
                                <div className='col-span-1 relative hidden xl:flex flex-col justify-between shrink-0 h-140 py-'>
                                    {/* Empty space holding layout structure for arrows */}
                                    {/* <div className="h-6" /> */}
                                    <div className="flex flex-col gap-4 overflow-hidden">
                                        {Array.from({ length: 4 }).map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                style={{ width: '120px', height: '120px' }} 
                                                className="shrink-0 rounded-xl bg-slate-200" 
                                            />
                                        ))}
                                    </div>
                                    <div className="h-6" />
                                </div>
        
                                {/* 1B. MAIN FEATURED IMAGE PLACEHOLDER (Matches aspect-4/5 lg:max-h-140) */}
                                <div className='col-span-6 xl:col-span-5 w-full aspect-4/5 lg:max-h-140 bg-slate-200 rounded-2xl border border-gray-200' />
                            </div>  
        
                            {/* 1C. HORIZONTAL THUMBNAIL LIST (Visible only below xl breakpoint) */}
                            <div className='relative flex items-center xl:hidden'>
                                <div className="flex flex-row gap-2 lg:gap-4 overflow-hidden w-full">
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className="w-20 h-20 sm:w-26 sm:h-26 shrink-0 rounded-xl bg-slate-200" 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* ========================================================
                        RIGHT COLUMN: PRODUCT DETAILED METRICS SECTION (col-span-6)
                       ======================================================== */}
                    <div className='col-span-1 lg:col-span-6'>
                        <div className='flex flex-col h-full space-y-5 lg:space-y-6'>
                            
                            {/* Product Name Title Track */}
                            <div className="space-y-2">
                                <div className='h-8 w-4/5 bg-slate-200 rounded-md' />
                            </div>
        
                            {/* Prices Strip (Original vs Discount) */}
                            <div className='flex items-center gap-4'>
                                <div className='h-7 w-24 bg-slate-200 rounded' />
                                <div className='h-5 w-16 bg-slate-100 rounded' />
                            </div>
        
                            {/* Description Text Mock Box */}
                            <div className='space-y-2.5 pt-2'>
                                <div className='h-4 w-full bg-slate-100 rounded' />
                                <div className='h-4 w-full bg-slate-100 rounded' />
                                <div className='h-4 w-3/4 bg-slate-100 rounded' />
                            </div>
        
                            {/* Color Swatch Circles Selection Wrapper */}
                            <div className='pt-2'>
                                <div className='h-5 w-32 bg-slate-200 rounded mb-3' />
                                <div className="flex gap-2">
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <div key={idx} className="p-1 border border-gray-200 rounded-full">
                                            <div className='w-5 h-5 rounded-full bg-slate-200' />
                                        </div>
                                    ))}
                                </div>
                            </div>
        
                            {/* Size Options Squares Selection Wrapper */}
                            <div>
                                <div className='h-5 w-28 bg-slate-200 rounded mb-3' />
                                <div className='flex gap-4'>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={idx} className='py-2 rounded-sm h-9 w-12 bg-slate-200' />
                                    ))}
                                </div>
                            </div>
        
                            {/* Quantity Adjustment Pill Selector */}
                            <div>
                                <div className='h-5 w-20 bg-slate-200 rounded mb-3' />
                                <div className="h-11 w-36 bg-slate-100 rounded-full" />
                            </div>
        
                            {/* Lower Primary Add to Cart Button Block (Anchors to flex footer layout) */}
                            <div className='flex gap-4 lg:mt-auto pt-4'>
                                <div className='w-full h-12 bg-slate-200 rounded-none!' />
                            </div>
        
                        </div>
                    </div>
        
                </section>
    );
}

export default ProductDetailsSkeleton;
