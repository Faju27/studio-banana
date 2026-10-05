import React from 'react';

const AdminOrdersListSkeleton = () => {
    return (
         // SKELETON CARDS VIEW (When NOT Ready)
        <div className='space-y-2'>
            <div className="hidden md:grid grid-cols-7 gap-2 sm:gap-0 lg:gap-4 px-4 py-3 text-xs uppercase text-gray-400 font-semibold">
                <div>Order ID</div>
                <div>Date</div>
                <div>Customer</div>
                <div>Items</div>
                <div>Payment</div>
                <div>Amount</div>
                <div>Status</div>
            </div>

            <div className='space-y-2 overflow-x-hidden'>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div 
                        key={index} 
                        className="md:grid grid-cols-7 space-y-2 md:space-y-0 lg:gap-4 items-center bg-white shadow-sm rounded-lg p-2 sm:p-4 animate-pulse"
                    >
                        <div className='flex justify-between'>
                            <div className="h-5 w-20 bg-slate-200 rounded" />
                            <div className="md:hidden h-6 w-32 bg-slate-200 rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <div className="h-5 md:h-4 w-52 md:w-20 bg-slate-200 rounded" />
                            <div className="hidden md:block h-3 w-12 bg-slate-100 rounded" />
                        </div>
                        <hr className='text-gray-300 md:hidden'/>

                        <div className="hidden md:block h-5 w-52 md:w-32 bg-slate-200 rounded" />
                        <div className="hidden md:block h-5 w-28 md:w-12 bg-slate-200 rounded" />

                        <div className='flex justify-between col-span-3 md:grid grid-cols-3'>
                            <div className="h-6 w-16 bg-slate-200 rounded-lg" />
                            <div className="h-5 w-32 md:w-16 bg-slate-200 rounded" />
                            <div className="h-6 w-20 bg-slate-200 rounded-lg" />
                        </div>

                        <div className='h-5 w-16 place-self-end md:hidden bg-slate-200 rounded' />

                    </div>
                ))}
            </div>

            <div className='flex justify-between items-center opacity-50 pointer-events-none'>
                <div className='flex items-center gap-2'>
                    <div className="h-8 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
                <div className="h-8 w-48 bg-slate-200 rounded" />
            </div>
        </div>
    );
}

export default AdminOrdersListSkeleton;
