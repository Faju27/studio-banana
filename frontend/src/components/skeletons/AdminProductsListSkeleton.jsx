import React from 'react';

const AdminProductsListSkeleton = () => {
    return (
        <div className='space-y-2' >
            <div className="hidden md:grid grid-cols-6 gap-2 lg:gap-4 px-4 py-3 text-xs uppercase text-gray-400 font-semibold">
                <div className='col-span-2'>Product</div>
                <div>Category</div>
                <div>Options</div>
                <div>Price</div>
                <div>Status</div>
            </div>


            <div className="space-y-2">
                {Array.from({ length: 10}).map((_, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-2 lg:gap-5 bg-white shadow-sm rounded-lg px-2 md:px-4 py-2 items-center">
                        <div className='col-span-2 flex items-center gap-2 mb-3 md:mb-0'>
                            <div className='h- w-18 md:w-16 aspect-3/4 md:aspect-square bg-slate-200 rounded shrink-0' />
                            <div className='space-y-1 md:space-y-0'>
                                <div className='h-5 w-38 xs:w-52 bg-slate-200 rounded ' />
                                <div className='block md:hidden h-6 max-w-32 w-auto bg-slate-200 rounded' />
                                <div className='flex md:hidden gap-1'>
                                    {Array.from({length : 3}).map((_, i) => (
                                        <div key={i} className='h-4 w-4 bg-slate-200 rounded-full' />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='hidden md:block h-6 max-w-32 w-auto bg-slate-200 rounded-lg' />
                        <div className='hidden md:flex gap-1'>
                            {Array.from({length : 3}).map((_, i) => (
                                <div key={i} className='h-4 w-4 bg-slate-200 rounded-full' />
                            ))}
                        </div>
                        <div className='h-5 w-16 bg-slate-200 rounded' />
                        <div className='h-6 w-20 bg-slate-200 rounded-lg place-self-end md:place-self-auto' />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProductsListSkeleton;
