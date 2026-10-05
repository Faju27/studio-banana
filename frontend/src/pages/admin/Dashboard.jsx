import { Fragment, useEffect, useState } from 'react';
import { useWholesaler } from '../../hooks/useWholesaler';
import { GoPackage } from "react-icons/go";
import {  MdOutlinePeople, MdOutlineShoppingCart, MdShoppingBasket } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useProducts } from '../../hooks/useProducts';
import Loader from '../../components/Loader';
import { FaZ } from 'react-icons/fa6';
import { useOrder } from '../../hooks/useOrder';
import { PiReceipt } from 'react-icons/pi';
import WholesalerList from './WholesalerList';
import Products from '../public/Products';
import AllProducts from './AllProducts';
import { AiOutlineDollar } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CardsSkeleton, RecentOrdersSkeleton, RecentProductsSkeleton } from '../../components/skeletons'


const Dashboard = () => {
    const {wholesalerList, fetchWholesalerList}= useWholesaler();
    const { fetchProductList }= useProducts();
    const { orders, fetchOrdersList } = useOrder();
    
    const [productList , setProductList] = useState([])

    const [totalProducts, setTotalProducts] = useState(null);
    const [totalOrders, setTotalOrders] = useState(null);

    const [isWholesalersLoading, setIsWholesalersLoading] = useState(true)
    const [isOrdersLoading, setIsOrdersLoading] = useState(true)
    const [isProductsLoading, setIsProductsLoading] = useState(true)

    const navigate = useNavigate();

    // for dashboard stats
    useEffect(() => {
        // const fetchDashboardStats = async () => {
        //     const product = await fetchProductList('/products/'); 
        //     if (product) {
        //         setTotalProducts(product.count);
        //     }

        //     const order = await fetchOrdersList(); 
        //     if (order) {
        //         setTotalOrders(order.count);
        //     }

        //     await fetchWholesalerList();

        // };
        
        // // for recent orders
        // const loadOrders = async () => {
        //     const order = await fetchOrdersList(); 
        //     setIsOrdersLoading(false); // Initial load complete for orders
        // };
        
        // fetchDashboardStats();
        // loadOrders()
        const loadProducts = async () => {
            const product = await fetchProductList('/products/'); 
            if (product) {
                setProductList(product.results); 
                setTotalProducts(product.count);  
            }
            setIsProductsLoading(false); 
        };

        const loadOrders = async () => {
            const order = await fetchOrdersList(); 
            if (order) {
                setTotalOrders(order.count); 
            }
            setIsOrdersLoading(false);
        };

        const loadWholesalers = async () => {
            await fetchWholesalerList();
            setIsWholesalersLoading(false);
        };

        // Fire all 3 operations at the exact same time
        loadProducts();
        loadOrders();
        loadWholesalers();

    }, []);
    

    


    return (
        <Fragment>
            <section className='py-4 flex justify-between'>
                <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>Dashboard</h2>
            </section>

            
            <section className='flex flex-col gap-2 sm:gap-4'>
                {isWholesalersLoading || isOrdersLoading || isProductsLoading ? (
                    <CardsSkeleton />
                ) : (
                    <div className='grid xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4'>
                        <div className='col-span-1 flex items-center gap-2 p-2 sm:p-4 rounded-lg bg-white shadow border-b-4 border-b-emerald-800'>
                            <div className='bg-emerald-800 text-white rounded-lg p-2'>
                                <PiReceipt className='w-6 h-6 sm:w-8 sm:h-8' />
                            </div>
                            <div>
                                <p>Total Orders</p>
                                <div className='font-bold text-base sm:text-xl text-black'>{totalOrders}</div>
                            </div>
                        </div>
                        <div className='col-span-1 flex items-center gap-2 p-2 sm:p-4 rounded-lg bg-white shadow border-b-4 border-b-emerald-800'>
                            <div className='bg-emerald-800 text-white rounded-lg p-2'>
                                <GoPackage className='w-6 h-6 sm:w-8 sm:h-8' />
                            </div>
                            <div>
                                <p>Total Products</p>
                                <div className='font-bold text-base sm:text-xl text-black'>{totalProducts}</div>
                            </div>
                        </div>
                        <div className='col-span-1 flex items-center gap-2 p-2 sm:p-4 rounded-lg bg-white shadow border-b-4 border-b-emerald-800'>
                            <div className='bg-emerald-800 text-white rounded-lg p-2'>
                                <PiReceipt className='w-6 h-6 sm:w-8 sm:h-8' />
                            </div>
                            <div>
                                <p>Total Customer</p>
                                <div className='font-bold text-base sm:text-xl text-black'>{wholesalerList?.length}</div>
                            </div>
                        </div>
                        <div className='col-span-1 flex items-center gap-2 p-2 sm:p-4 rounded-lg bg-white shadow border-b-4 border-b-emerald-800'>
                            <div className='bg-emerald-800 text-white rounded-lg p-2'>
                                <AiOutlineDollar className='w-6 h-6 sm:w-8 sm:h-8' />
                            </div>
                            <div>
                                <p>Total Revenue</p>
                                <div className='font-bold text-base sm:text-xl text-black'>$215,860</div>
                            </div>
                        </div>
                    </div>
                )}


                {isOrdersLoading ? (
                    <RecentOrdersSkeleton /> 
                ) : (
                    <main className='p-2 sm:p-4 rounded-lg border border-gray-300 bg-white space-y-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='section-title'>Recent Orders</h2>
                            <button onClick={() => navigate('/admin/orders')} className='text-emerald-800 border'>See All Orders</button>
                        </div>

                        <div className='space-y-2'>
                            <div className="hidden md:grid grid-cols-5 gap-2 md:gap-4 p-4 bg-slate-100 rounded-lg text-xs text-gray-400 font-semibold uppercase">
                                <div>Order ID </div>
                                <div>Customer</div>
                                <div>Payment</div>
                                <div>Amount</div>
                                <div>Status</div> 
                            </div>

                            <div className='space-y-2'>
                                {orders && orders.length > 0 ? (
                                    orders.slice(0, 5)
                                    .map(order => (
                                        <div key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} 
                                            className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 items-center cursor-pointer hover:bg-gray-100 transition-colors px-2 md:px-4 py-2 border-b border-gray-300 last:border-b-0">
                                            <div className="order-2 md:order-1 text-black">#{order.order_number}</div>
                                            <div className="order-3 md:order-1 col-span-2 md:col-span-1 text-black capitalize font-semibold">{order.wholesaler.business_name}</div>

                                            <div className='order-3 md:order-1 place-content-center'>
                                                <div className={` px-4 py-1 capitalize text-center text-xs rounded-lg font-semibold w-fit
                                                    ${order.payment_status === 'failed' ? 'bg-red-500 text-white'
                                                    : order.payment_status === 'paid' ? 'bg-green-500 text-white'
                                                    : order.payment_status === 'pending' ? 'bg-amber-500 text-white'
                                                    : '' }`}
                                                >
                                                    {order.payment_status === 'pending' ? 'unpaid' : order.payment_status}
                                                </div>
                                            </div>

                                            <div className="order-3 md:order-1 place-self-end md:place-self-auto">
                                                <span className='md:hidden text-sm'>Total : </span>
                                                <span className='text-emerald-800 font-semibold'>${order.total_price}</span>
                                            </div>

                                            <div className='order-2 md:order-1 place-self-end md:place-self-auto'>
                                                <div className={`border px-4 py-1 capitalize text-center text-xs rounded-lg font-semibold w-fit xs:w-32 sm:w-fit 
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
                                            
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-center font-medium py-20'>Unable to load Orders. Try Again</p>
                                )}
                            </div>
                        </div>
                    </main>
                )}


                {isProductsLoading ? (
                    <RecentProductsSkeleton />
                ) : (
                    <main className='p-2 sm:p-4 rounded-lg border border-gray-300 bg-white space-y-2'>
                        <div className='flex justify-between items-center'>
                            <h2 className='section-title'>Recent Products</h2>
                            <button onClick={() => navigate('/admin/products')} className='text-emerald-800 border'>All Products</button>
                        </div>
                        <div className='space-y-2'>
                            <div className="hidden sm:grid grid-cols-4 gap-2 md:gap-4 p-4 bg-slate-100 rounded-lg text-xs text-gray-400 font-semibold uppercase">
                                <div className='col-span-2'>Name</div>
                                <div>Price</div>
                                <div>Status</div> 
                            </div>

                            <div className='space-y-2'>
                                {productList && productList.length > 0 ? (
                                    productList.slice(0,5)
                                    .map(p => (
                                        <div key={p.id} onClick={() => navigate(`/admin/products/${p.id}/manage`)} 
                                            className="grid sm:grid-cols-4 sm:gap-2 md:gap-4 items-center cursor-pointer hover:bg-gray-100 transition-colors px-2 md:px-4 py-2 border-b border-gray-300 last:border-b-0">
                                            <div className="col-span-2 flex items-center gap-2">
                                                <div className="w-12 h-12 aspect-3/4 relative bg-gray-100 rounded-md overflow-hidden shrink-0">
                                                    <img src={p.images?.[0]?.image || placeholderImage } alt={p.name} className="w-full h-full object-cover" />
                                                    {p.is_new_arrival === true && 
                                                        <span className='absolute top-0 left-0 z-10 font-bold bg-amber-50 text-amber-700 text-[10px] uppercase py-0.5 px-4 -rotate-45 -translate-x-4 shadow-sm'>New</span>
                                                    }
                                                </div>
                                                <div className='text-black capitalize font-semibold line-clamp-2'>
                                                    {p.name}
                                                </div>
                                            </div>
                                            
                                            <div className='col-span-1 flex flex-col sm:justify-center'>
                                                <span className='text-xs text-gray-400 block sm:hidden'>Price:</span>
                                                <div className='flex items-center sm:items-start gap-1 sm:flex-col'>
                                                    <span className='text-black font-semibold'>${p.discount_price !== null ? p.discount_price : p.price}</span>
                                                    {p.discount_price !== null && (
                                                        <span className='line-through text-gray-500 text-sm lg:text-base'>${ p.price }</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex flex-col gap-1 place-self-end sm:place-self-auto'>
                                                <span className='text-xs text-gray-400 block sm:hidden'>Status:</span>
                                                {p.is_active === true ? 
                                                <span className='bg-emerald-800 text-white px-4 py-1 text-center text-xs rounded-lg font-semibold w-fit xs:w-32 sm:w-fit'>Active</span>
                                                :
                                                <span className='bg-red-600 text-white px-4 py-1 text-center text-xs rounded-lg font-semibold w-fit xs:w-32 sm:w-fit'>Inactive</span>
                                                }
                                            </div>
                                            
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-center font-medium py-20'>Unable to load Products. Try Again.</p>
                                )}
                            </div>
                        </div>
                    </main>
                )}


            </section>
            
        </Fragment>
    );
}

export default Dashboard;


