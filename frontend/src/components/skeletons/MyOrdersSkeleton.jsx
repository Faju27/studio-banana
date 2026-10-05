import React from 'react';

const MyOrdersSkeleton = () => {
    return (
        <div className='flex flex-col gap-3 border border-gray-300 pb-2 md:pb-4 animate-pulse'>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4 bg-emerald-700/90">
                <div className="space-y-1.5">
                    <div className="h-3.5 w-16 bg-emerald-600/50 rounded" />
                    <div className="h-4.5 w-24 bg-emerald-500/40 rounded" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-emerald-600/50 rounded" />
                    <div className="h-4.5 w-20 bg-emerald-500/40 rounded" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-emerald-600/50 rounded" />
                    <div className="h-4.5 w-12 bg-emerald-500/40 rounded" />
                </div>
                <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-emerald-600/50 rounded" />
                    <div className="h-4.5 w-36 bg-emerald-500/40 rounded" />
                </div>
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className='flex flex-col gap-3 px-2 md:px-4'>
                    <div className='flex gap-3'>
                        <div className='bg-slate-200 aspect-4/5 w-16 min-w-16 md:w-25 rounded' />
                        
                        <div className='content-center flex-1 space-y-2.5'>
                            <div className="h-4 w-4/5 sm:w-2/3 bg-slate-200 rounded" />
                            <div className="h-3.5 w-1/2 sm:w-1/3 bg-slate-100 rounded" />
                        </div>
                    </div>
                    <hr className='text-gray-200' />               
                </div>
            ))}
            
            <div className='flex gap-3 px-2 md:px-4 items-center'>
                <div className='h-6 w-16 border border-amber-200 bg-amber-50 rounded' />
                <div className='h-4 w-44 bg-slate-100 rounded' />
            </div>
            
            <div className='flex justify-between items-center px-2 md:px-4 pt-2'>
                <div className='h-10 w-28 bg-slate-200 rounded-none!' />
                <div className='h-4 w-20 bg-slate-100 rounded' />
            </div>

        </div>
    );
}

export default MyOrdersSkeleton;

