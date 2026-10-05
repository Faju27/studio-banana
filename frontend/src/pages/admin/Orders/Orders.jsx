import React, { Fragment, useEffect } from 'react';
import { useOrder } from '../../../hooks/useOrder';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlineCheckCircle } from 'react-icons/md';
import { FiLoader, FiXCircle, FiZap } from "react-icons/fi";
import { PiReceipt } from "react-icons/pi";
import { useState } from 'react';
import { FaArrowDown, FaArrowDown91, FaArrowsUpDown, FaArrowUp, FaArrowUp19 } from 'react-icons/fa6';
import StaggerContainer, { StaggerItem } from '../../../animations/StaggerContainer';
import { AdminOrdersListSkeleton } from '../../../components/skeletons';

const Orders = () => {

    const { fetchOrdersList, updateOrderStatus, } = useOrder();

    const [orders, setOrders] = useState([]);

    // Global stats (Unchanging)
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalDelivered, setTotalDelivered] = useState(0);
    const [totalCancelled, setTotalCancelled] = useState(0);
    const [totalUnfulfilled, setTotalUnfulfilled] = useState(0);

    // Changes when searching/filtering
    const [filteredCount, setFilteredCount] = useState(0);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [ordering, setOrdering] = useState("-created_at");

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFetchingOrders, setIsFetchingOrders] = useState(false);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    const [isSortOpen, setIsSortOpen] = useState(false)

    const navigate = useNavigate()


    useEffect(() => {
        
        setIsFetchingOrders(true)

        const delay = setTimeout(async () => {
            try {
                const data = await fetchOrdersList({
                    search,
                    status,
                    ordering,
                    page,
                    pageSize,
                });

                if (data) {
                    setOrders(data.results)
                    setFilteredCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch debounced orders:", error);
            } finally {
                setIsFetchingOrders(false)
                setIsInitialLoad(false)
            }

            }, 500);

        return () => clearTimeout(delay);

    }, [search, status, ordering, page, pageSize,]);

    useEffect(() => {
        const fetchDashboardStats = async () => {

            // try {
            //     const res = await api.get('/order/dashboard-stats/');
            //     setTotalOrders(res.data.totalOrders);
            //     setTotalDelivered(res.data.totalDelivered);
            //     ...
            // } catch {}
             
            try {                
                const data = await fetchOrdersList({
                    // search: '',
                    // status: '',
                    // pageSize: 1000 
                });

                if (data && data.results) {
                    const allOrdersArray = data.results;

                    setTotalOrders(data.count || allOrdersArray.length);

                    let delivered = 0;
                    let cancelled = 0;
                    let unfulfilled = 0;

                    allOrdersArray.forEach(order => {
                        const currentStatus = order.status;
                        
                        if (currentStatus === 'delivered') {
                            delivered++;
                        } else if (currentStatus === 'cancelled') {
                            cancelled++;
                        } else {
                            unfulfilled++; 
                        }
                    });

                    setTotalDelivered(delivered);
                    setTotalCancelled(cancelled);
                    setTotalUnfulfilled(unfulfilled);
                }
            } catch (error) {
                console.error('Dashboard stats failed');
            } finally {
                setIsStatsLoading(false)
            }
        };
        
        fetchDashboardStats();
    }, []);

    const handleSort = (field) => {
        if (ordering === field) {
            setOrdering(`-${field}`);
        } else {
            setOrdering(field);
        }
        setPage(1);
    };
    
    
    const statusButtons = [
        { label: 'All', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
    ];

    const totalPages = Math.ceil(filteredCount / pageSize);

    const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    const newOrdersCount = orders.filter(order => {
            return new Date(order.created_at) >= oneWeekAgo}).length;

    return (
        <Fragment>
            <section className='py-4 space-y-4'>
                <div className='flex justify-between'>
                    <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>Orders</h2>  

                    {/* <button className='gap-1 btn-primary '>
                        <FaPlus size={16} />
                        <span>Create Order</span>
                    </button> */}
                    <div className="relative inline-block w-40 text-sm">
                            <div onClick={() => setIsSortOpen(!isSortOpen)}
                                className="w-full bg-white border border-gray-300 p-2 rounded flex justify-between items-center cursor-pointer text-black hover:border-emerald-800 transition-colors"
                            >
                                <span className='truncate'>
                                    {ordering === 'total_price' && 'Price: Low to High'}
                                    {ordering === '-total_price' && 'Price: High to Low'}
                                    {ordering === '-created_at' && 'Newest First'}
                                    {ordering === 'created_at' && 'Oldest First'}
                                    {ordering === 'order_number' && 'ID: (A-Z / 1-9)'}
                                    {ordering === '-order_number' && 'ID: (Z-A / 9-1)'}  
                                    {ordering === 'payment_status' && 'Payment Status'}
                                    {ordering === '-payment_status' && 'Payment Status'}                                    
                                    {ordering === '' && 'Sort by'}
                                </span>
                                <span className={`transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>▼</span>
                            </div>

                            {isSortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                    
                                    <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg overflow-hidden z-20">
                                        {[
                                            { value: 'total_price', label: 'Price: Low to High' },
                                            { value: '-total_price', label: 'Price: High to Low' },
                                            { value: '-created_at', label: 'Newest First' },
                                            { value: 'created_at', label: 'Oldest First' },
                                            { value: 'order_number', label: 'ID: (A-Z / 1-9)' },
                                            { value: '-order_number', label: 'ID: (Z-A / 9-1)' }, 
                                            { value : 'payment_status', label: 'Payment Status'},
                                            { value : '-payment_status', label: 'Payment Status'} 
                                        ].map((option) => {
                                            const isSelected = ordering === option.value;
                                            return (
                                                <li 
                                                    key={option.value}
                                                    onClick={() => {
                                                        setOrdering(option.value); // Set your state value
                                                        setIsSortOpen(false);      // Close menu
                                                    }}
                                                    className={`px-4 py-2.5 cursor-pointer text-left transition-colors
                                                        ${isSelected 
                                                            ? 'bg-emerald-800 text-white font-medium' 
                                                            : 'text-gray-700 hover:bg-emerald-900 hover:text-white'
                                                        }`
                                                    }
                                                >
                                                    {option.label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </>
                            )}
                        </div>
                </div>
                <div className='grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4'>
                    {isStatsLoading ? (
                        // SKELETON CARDS VIEW (When NOT Ready)
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className='first:col-span-2 xs:first:col-span-1 col-span-1 p-2 sm:p-4 rounded-lg shadow-sm border-b-4 border-b-emerald-800 bg-white animate-pulse space-y-2'>
                                <div className='flex sm:block items-center gap-2 sm:space-y-2'>
                                    <div className='h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-slate-200' />
                                    <div className='h-6 sm:h-7 w-16 rounded bg-slate-200' />
                                </div>
                                <div className='h-3 sm:h-4 w-24 rounded bg-slate-100' />
                            </div>
                        ))
                    ) : (
                        <>
                            <div className='col-span-2 xs:col-span-1 p-2 sm:p-4 rounded-lg shadow border-b-4 border-b-emerald-800 bg-white'>
                                <div className='flex sm:block items-center gap-2'>
                                    <PiReceipt className='text-emerald-800 w-6 h-6 sm:w-8 sm:h-8' />
                                    <p className='font-bold text-base sm:text-xl text-black sm:mt-2'>{ totalOrders}</p>
                                </div>
                                <p>Total Orders</p>
                            </div>
                            <div className='col-span-1 p-2 sm:p-4 rounded-lg shadow border-b-4 border-b-emerald-800 bg-white'>
                                <div className='flex sm:block items-center gap-2'>
                                    <FiZap className='text-emerald-800 w-6 h-6 sm:w-8 sm:h-8' />
                                    <p className='font-bold text-base sm:text-xl text-black sm:mt-2'>{ newOrdersCount}</p>
                                </div>
                                <p>This Week</p>
                            </div>
                            <div className='col-span-1 p-2 sm:p-4 rounded-lg shadow border-b-4 border-b-emerald-800 bg-white'>
                                <div className='flex sm:block items-center gap-2'>
                                    <FiLoader className='text-emerald-800 w-6 h-6 sm:w-8 sm:h-8' />
                                    <p className='font-bold text-base sm:text-xl text-black sm:mt-2'>
                                        {/* {orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length} */}
                                        { totalUnfulfilled}
                                    </p>
                                </div>
                                <p>Active Orders</p>
                            </div>
                            <div className='col-span-1 p-2 sm:p-4 rounded-lg shadow border-b-4 border-b-emerald-800 bg-white'>
                                <div className='flex sm:block items-center gap-2'>
                                    <MdOutlineCheckCircle className='text-emerald-800 w-6 h-6 sm:w-8 sm:h-8' />
                                    <p className='font-bold text-base sm:text-xl text-black sm:mt-2'>{ totalDelivered}</p>
                                </div>
                                <p>Delivered</p>
                            </div>
                            <div className='col-span-1 p-2 sm:p-4 rounded-lg shadow border-b-4 border-b-emerald-800 bg-white'>
                                <div className='flex sm:block items-center gap-2'>
                                    <FiXCircle className='text-emerald-800 w-6 h-6 sm:w-8 sm:h-8' />
                                    <p className='font-bold text-base sm:text-xl text-black sm:mt-2'>{ totalCancelled}</p>
                                </div>
                                <p>Cancelled</p>
                            </div>
                        </>
                    )} 
                </div>
            </section>
           
            
                <section className="sm:overflow-x-auto space-y-2">
                    <div className='flex flex-col lg:flex-row justify-between gap-4 py-2'>
                        <div className="order-4 lg:order-1 md:w-fit flex bg-white rounded-xl overflow-x-auto [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {statusButtons.map((sb) => (
                                <div
                                    key={sb.value}
                                    onClick={() => {setStatus(sb.value); setPage(1);}}
                                    className={`px-4 py-2 content-center text-xs sm:text-sm capitalize cursor-pointer font-semibold rounded-xl transition-colors ${
                                    status === sb.value && 'bg-emerald-800 text-white'}`}
                                >
                                    {sb.label}
                                </div>
                            ))}
                        </div>

                        <input type="search" placeholder="Customer or ID..."
                            value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                            className="order-2 lg:order-1 bg-white! shadow w-full xs:w-64" />

                        {/* <select
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="-created_at">Newest</option>
                            <option value="created_at">Oldest</option>
                            <option value="total_price">Price-- Low to High</option>
                            <option value="-total_price">Price--High to Low</option>
                        </select> */}
                        
                    </div>
                    {isInitialLoad ? (
                       <AdminOrdersListSkeleton />
                    ) : isFetchingOrders ? (
                        <p className='text-center font-medium py-20'>Fetching orders...</p>
                    ) : orders && orders.length > 0 ? (
                        <div className='space-y-2'>
                            <div className="hidden md:grid grid-cols-7 gap-2 sm:gap-0 lg:gap-4 px-4 py-3  text-xs uppercase text-gray-400 font-semibold">
                                <div onClick={() => handleSort('order_number')} className='flex items-center gap-1 cursor-pointer'>
                                    <span>Order ID </span>
                                    {ordering === 'order_number' ? <FaArrowUp /> : ordering === '-order_number' ? <FaArrowDown /> : <FaArrowsUpDown />}
                                </div>
                                <div onClick={() => handleSort('created_at')} className='flex items-center gap-1 cursor-pointer'>
                                    <span>Date </span>
                                    {ordering === 'created_at' ? <FaArrowUp /> : ordering === '-created_at' ? <FaArrowDown /> : <FaArrowsUpDown />}
                                </div>
                                <div>Customer</div>
                                <div>Items</div>
                                <div onClick={() => handleSort('payment_status')} className='flex items-center gap-1 cursor-pointer'>
                                    <span>Payment</span>
                                    {ordering === 'payment_status' ? <FaArrowUp /> : ordering === '-payment_status' ? <FaArrowDown /> : <FaArrowsUpDown />}
                                </div>
                                <div onClick={() => handleSort('total_price')} className='flex items-center gap-1 cursor-pointer'>
                                    <span>Amount</span>
                                    {ordering === 'total_price' ? <FaArrowUp /> : ordering === '-total_price' ? <FaArrowDown /> : <FaArrowsUpDown />}
                                </div>
                                <div>Status</div>
                                
                                {/* <div>Actions</div> */}
                            </div>

                            <StaggerContainer  className='space-y-2 overflow-x-hidden'>
                                {orders.map(order => (
                                    <StaggerItem key={order.id} >
                                        <div onClick={() => navigate(`${order.id}`)} className="grid grid-cols-6 md:grid-cols-7 lg:gap-4 items-center cursor-pointer bg-white hover:bg-gray-100 transition-colors shadow-sm rounded-lg p-2 sm:p-4">
                                            <div className="col-span-3 md:col-span-1 order-2 md:order-1">
                                                <span className='text-black'>#{order.order_number}</span>
                                            </div>
                                            <div className="text-black xs:flex md:block order-4 md:order-1 col-span-2 md:col-span-1">
                                                <p className='text-sm md:text-base'>{new Date(order.created_at).toLocaleDateString(undefined, {day:'2-digit',month:'short',year:'2-digit'})}, </p>
                                                <p className='text-xs xs:text-sm uppercase text-gray-500'>{new Date(order.created_at).toLocaleTimeString(undefined, {hour:'2-digit',minute:'2-digit'})}</p>
                                            </div>
                                            <div className='flex gap-1 order-3 md:order-1 col-span-6 md:col-span-1'>
                                                <span className='text-black font-semibold capitalize line-clamp-2'>{order.wholesaler?.business_name}</span>
                                            </div>
                                            <hr className='order-3 col-span-6 my-2 text-gray-300 md:hidden' />
                                            <div className='order-3 md:order-1 col-span-2 md:col-span-1 shrink-0'>
                                                <span className='text-black'>{order.order_items.length} items</span>        
                                            </div>

                                            <div className='order-4 md:order-1 col-span-2 md:col-span-1  place-content-center '>
                                                <div className={` px-4 py-1 capitalize text-center text-xs rounded-lg font-semibold w-fit place-self-end md:place-self-auto
                                                    ${order.payment_status === 'failed' ? 'bg-red-500 text-white'
                                                    : order.payment_status === 'paid' ? 'bg-green-500 text-white'
                                                    : order.payment_status === 'pending' ? 'bg-amber-500 text-white'
                                                    : '' }`}
                                                >
                                                    {order.payment_status === 'pending' ? 'unpaid' : order.payment_status}
                                                </div>
                                            </div>

                                            {/* <hr className='order-4 col-span-6 my-2 text-gray-300 md:hidden' /> */}

                                            <div className="order-4 md:order-1 col-span-6 md:col-span-1 place-self-end md:place-self-auto mt-2 md:mt-0">
                                                <span className='md:hidden text-sm'>Total : </span>
                                                <span className='text-emerald-800 font-semibold'>${order.total_price}</span>
                                            </div>

                                            {/* { order.status === 'pending' ? 
                                                <div className='border border-amber-500 bg-amber-100 text-amber-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : order.status === 'accepted' ?
                                                <div className='border border-amber-500 bg-amber-100 text-amber-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : order.status === 'processing' ?
                                                <div className='border border-amber-500 bg-amber-100 text-amber-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : order.status === 'shipped' ?
                                                <div className='border border-blue-500 bg-blue-100 text-blue-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : order.status === 'delivered' ?
                                                <div className='border border-green-500 bg-green-100 text-green-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : order.status === 'cancelled' ?
                                                <div className='border border-red-500 bg-red-100 text-red-500 px-2 capitalize text-center text-xs rounded-lg py-1 font-semibold'>{ order.status }</div>
                                            : 
                                                <></>
                                            } */}
                                            <div className='order-2 md:order-1 col-span-3 md:col-span-1 place-self-end md:place-self-auto'>
                                                <div className={`border px-4 py-1 capitalize text-center text-xs rounded-lg font-semibold w-32 md:w-fit 
                                                    ${order.status === 'expired' ? 'border-slate-600 bg-slate-600 text-white'
                                                    : order.status === 'cancelled' ? 'border-red-600 bg-red-600 text-white'
                                                    : order.status === 'delivered' ? 'border-emerald-800 bg-emerald-800 text-white' 
                                                    : order.status === 'shipped' ? 'border-green-500 bg-green-100 text-green-500'
                                                    : order?.status === 'processing' ? 'border-violet-500 bg-violet-100 text-violet-500'
                                                    : order?.status === 'accepted' ? 'border-blue-500 bg-blue-100 text-blue-500'
                                                    : 'border-amber-500 bg-amber-100 text-amber-500'}`}
                                                >
                                                    {order.status}
                                                </div>
                                            </div>

                                            {/* <div>
                                                <button onClick={() => navigate(`${order.id}`)} className='bg-gray-100 text-black gap-1'>
                                                    <IoMdEye size={16} />
                                                    <span>View</span>
                                                </button>
                                            </div> */}
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-2 mt-4'>
                                <div className='flex items-center gap-2'>
                                    <select value={pageSize} onChange={(e) => {setPageSize(e.target.value); setPage(1);}} 
                                    className="bg-white! border px-1! py-1!"
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select> 
                                    <p>
                                    {filteredCount === totalOrders 
                                        ? `Showing ${totalOrders} orders` 
                                        : `Showing ${filteredCount} filtered orders`
                                    }
                                    </p>
                                </div>

                                <div className="flex gap-3 items-center mx-auto sm:mx-0">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(prev => prev - 1)}
                                        className={`${page === 1 ? 'cursor-not-allowed! bg-white text-gray-500' : 'btn-primary'}`}
                                    >
                                        <MdArrowBackIosNew className='text-lg sm:text-xl'/>
                                    </button>
                                    <div>
                                        Page {page} of {totalPages}
                                    </div>

                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(prev => prev + 1)}
                                        className={`${page >= totalPages ? 'cursor-not-allowed! bg-white text-gray-500' : 'btn-primary'}`}
                                    >
                                        <MdArrowForwardIos className='text-lg sm:text-xl'/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-center font-medium py-20'>No Results</p>
                    )}   

                    
                </section>
            



        </Fragment>
    );
}

export default Orders;
