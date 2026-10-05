import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className='w-1/2 max-w-56 sm:max-w-none sm:w-56 lg:w-72 p-2 lg:p-4 shrink-0 bg-white rounded-3xl shadow animate-pulse pointer-events-none'>
            
            {/* 1. Image Container (Maintains exact 4/5 aspect ratio box) */}
            <div className='relative overflow-hidden rounded-2xl bg-slate-200 border border-slate-100' style={{ aspectRatio: 4 / 5 }} />
            
            {/* 2. Metadata Info Rows */}
            <div className='mt-2 lg:mt-4 space-y-3'>
                
                {/* Category & Heart row */}
                <div className='flex justify-between items-center'>
                    {/* Matches category pill sizing */}
                    <div className="h-6 w-16 bg-slate-200 rounded-lg shrink-0" />
                    {/* Matches heart icon sizing */}
                    <div className='h-5 w-5 bg-slate-100 rounded-full' />
                </div>
                
                {/* Product Name Mask (Two structural lines to mimic line-clamp-2 container) */}
                <div className='space-y-1.5 h-10 lg:h-14 justify-center flex flex-col'>
                    <div className='h-4 w-11/12 bg-slate-200 rounded' />
                    <div className='h-4 w-2/3 bg-slate-200 rounded' />
                </div>
                
                {/* Prices row (Original & Discount) */}
                <div className='flex items-center gap-2 pt-1'>
                    <div className='h-5 w-14 bg-slate-200 rounded' />
                    <div className='h-5 w-12 bg-slate-100 rounded' />
                </div>
                
            </div> 
        </div>
    );
}

export default ProductCardSkeleton;
