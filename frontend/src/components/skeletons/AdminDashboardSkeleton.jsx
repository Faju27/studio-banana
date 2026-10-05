import React from 'react';

// 1. Top Row Metric Cards Skeleton
export const CardsSkeleton = () => (
    <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2 sm:p-4 rounded-lg bg-white shadow border-b-4 border-b-emerald-800">
                <div className='h-10 sm:h-13 w-10 sm:w-13 bg-slate-200 rounded-lg'/>
                <div>
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-5 sm:h-6 w-12 mt-2 bg-slate-200 rounded" />
                </div>
            </div>
        ))}
    </div>
);

// 2. Recent Orders Panel Skeleton
export const RecentOrdersSkeleton = () => (
    <div className="p-2 sm:p-4 rounded-lg border border-slate-300 bg-white space-y-2 animate-pulse">
        <div className='flex justify-between items-center'>
            <h2 className='section-title'>Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} className='text-emerald-800 border'>See All Orders</button>
        </div>        
        <div className="hidden md:grid grid-cols-5 gap-2 md:gap-4 p-4 bg-slate-100 rounded-lg text-xs text-slate-400 font-semibold uppercase">
            <div>Order ID </div>
            <div>Customer</div>
            <div>Payment</div>
            <div>Amount</div>
            <div>Status</div> 
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 items-center px-2 md:px-4 py-2 border-b border-slate-300 last:border-b-0">
                <div className="h-5 w-20 order-2 md:order-1 bg-slate-200 rounded" />
                <div className="h-5 w-32 order-3 md:order-1 col-span-2 md:col-span-1 bg-slate-200 rounded" />
                <div className="h-6 w-20 order-3 md:order-1 bg-slate-200 rounded-lg mb-0.5" />
                <div className='h-5 w-16 order-3 md:order-1 bg-slate-200 rounded place-self-end md:place-self-auto' />
                <div className='h-6 w-20 order-2 md:order-1 bg-slate-200 rounded-lg place-self-end md:place-self-auto' />
            </div>
        ))}
    </div>
);

// 3. Recent Products Panel Skeleton
export const RecentProductsSkeleton = () => (
    <div className="p-2 sm:p-4 rounded-lg border border-slate-300 bg-white space-y-2 animate-pulse">
        <div className='flex justify-between items-center'>
            <h2 className='section-title'>Recent Products</h2>
            <button onClick={() => navigate('/admin/products')} className='text-emerald-800 border'>All Products</button>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-2 md:gap-4 p-4 bg-slate-100 rounded-lg text-xs text-slate-400 font-semibold uppercase">
            <div className='col-span-2'>Name</div>
            <div>Price</div>
            <div>Status</div> 
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-2 md:gap-4 items-center px-2 md:px-4 py-2 border-b border-slate-300 last:border-b-0">
                <div className='col-span-2 flex items-center gap-2 mb-3 sm:mb-0'>
                    <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                    <div className='h-5 w-52 bg-slate-200 rounded' />
                </div>
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded-lg place-self-end md:place-self-auto" />
            </div>
        ))}
    </div>
);

