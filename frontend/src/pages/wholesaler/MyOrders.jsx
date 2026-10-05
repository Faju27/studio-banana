import React, { Fragment, useEffect, useState } from 'react';
import { useOrder } from '../../hooks/useOrder';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { usePayment } from '../../hooks/usePayment';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { MyOrdersSkeleton } from '../../components/skeletons';

const MyOrders = () => {

    const {total} = useCart()
    const { orders, fetchOrdersList, updateOrderStatus, ordersLoading } = useOrder();
    const {handleRetryPayment} = usePayment();

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState('active');

    const navigate = useNavigate()

    // useEffect(() => {
    //     fetchOrdersList()
    // }, []);

    const STATUS_GROUPS = {
        active: ['pending', 'accepted', 'processing', 'shipped'],
        delivered: ['delivered'],
        cancelled: ['cancelled'],
    };

    const counts = {
        active: orders.filter(o => STATUS_GROUPS.active.includes(o.status)).length,
        delivered: orders.filter(o => STATUS_GROUPS.delivered.includes(o.status)).length,
        cancelled: orders.filter(o => STATUS_GROUPS.cancelled.includes(o.status)).length,
    };

    useEffect(() => {
        fetchOrdersList({ status: undefined }); 
    }, []);

    const filteredOrders = orders.filter(order =>
        STATUS_GROUPS[selectedStatus]?.includes(order.status)
    );


    return (
        <Fragment>
            <section className='flex flex-col gap-3 px-4'> 
                {/* <p className='text-black font-semibold'>Orders ({filteredOrders?.length})</p> */}
                <div className="flex gap-2 text-black text-sm lg:text-base">
                    <div onClick={() => setSelectedStatus('active')} className={`flex items-center justify-between px-1 py-1 rounded-full!  sm:gap-2 border  ${selectedStatus === 'active' ? 'btn-primary bg-emerald-700' : 'border-gray-300'}`}>
                        <span className='px-1 sm:px-4 text-xs sm:text-base'>Active Orders</span> 
                        <span className={`w-6 h-6 sm:w-8 sm:h-8 content-center text-center rounded-full ${selectedStatus === 'active' ? 'bg-white text-black' : 'bg-gray-200'}`}>{counts.active}</span>
                    </div>

                    <div onClick={() => setSelectedStatus('delivered')} className={`flex items-center justify-between px-1 py-1 rounded-full!  sm:gap-2 border  ${selectedStatus === 'delivered' ? 'btn-primary bg-emerald-700' : 'border-gray-300'}`}>
                        <span className='px-1 sm:px-4 text-xs sm:text-base'>Delivered</span>
                        <span className={`w-6 h-6 sm:w-8 sm:h-8 content-center text-center rounded-full ${selectedStatus === 'delivered' ? 'bg-white text-black' : 'bg-gray-200'}`}>{counts.delivered}</span>
                    </div>

                    <div onClick={() => setSelectedStatus('cancelled')} className={`flex items-center justify-between px-1 py-1 rounded-full!  sm:gap-2 border  ${selectedStatus === 'cancelled' ? 'btn-primary bg-emerald-700' : 'border-gray-300'}`}>
                        <span className='px-1 sm:px-4 text-xs sm:text-base'>Cancelled</span>
                        <span className={`w-6 h-6 sm:w-8 sm:h-8 content-center text-center rounded-full ${selectedStatus === 'cancelled' ? 'bg-white text-black' : 'bg-gray-200'}`}>{counts.cancelled}</span>
                    </div>
                </div>

                {ordersLoading ? (
                    <MyOrdersSkeleton />                
                ) : filteredOrders && filteredOrders.length > 0 ? (
                    <StaggerContainer className='space-y-3'>
                    {filteredOrders
                    ?.map(order => 
                        <StaggerItem key={order.id}>
                        <div className='flex flex-col gap-3 border border-gray-300 pb-2 md:pb-4 text-sm sm:text-base'>
                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4 ${order.status === 'cancelled' ? 'bg-slate-600' : 'bg-emerald-700'}`}>
                                <div>
                                    <p className='text-gray-300 text-sm lg:text-base'>Order ID</p>
                                    <p className='text-white font-semibold text-base lg:text-lg'>#{ order.order_number }</p>
                                </div>
                                {/* <span className='border-l border-gray-300'></span> */}
                                <div>
                                    <p className='text-gray-300 text-sm lg:text-base'>Total payment</p>
                                    <p className='text-white font-semibold text-base lg:text-lg'>${ order.total_price }</p>
                                </div>
                                {/* <span className='border-l border-gray-300'></span> */}
                                <div>
                                    <p className='text-gray-300 text-sm lg:text-base'>Payment Method</p>
                                    <p className='text-white font-semibold text-base lg:text-lg capitalize'>{ order.payments?.find(p => p.status === "paid")?.payment_method || '-'}</p>
                                </div>
                                {/* <span className='border-l border-gray-300'></span> */}
                                <div>
                                    {order.status === 'delivered' ? (
                                        <>
                                            <p className='text-gray-300 text-sm lg:text-base'>Delivered Date</p>
                                            <p className='text-white font-semibold text-base lg:text-lg'>{new Date(order.delivered_at).toDate()}</p>
                                        </>
                                    ) : order.status === 'cancelled'? (
                                        <>
                                            <p className='text-gray-300 text-sm lg:text-base'>Cancelled Date</p>
                                            <p className='text-white font-semibold text-base lg:text-lg'>{new Date(order.cancelled_at).toDate()}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className='text-gray-300 text-sm lg:text-base'>Estimated Delivery</p>
                                            <p className='text-white font-semibold text-base lg:text-lg '>{new Date(order.estimated_delivery_date).toDate()}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {order.order_items?.map(item => 
                                <div key={item.id} className='flex flex-col gap-3 px-2 md:px-4'>
                                    <div className={`flex gap-3 ${ order.status === 'cancelled' && 'opacity-50'} `}>
                                        <img src={ item.product.images?.[0]?.image } alt={ item.product } className='bg-gray-300 aspect-4/5 w-16 min-w-16 md:w-25'/>
                                        <div className='content-center'>
                                            <h2 className={`font-semibold text-sm sm:text-base lg:text-lg line-clamp-2 ${order.status === 'cancelled' && 'line-through'}`}>{ item.product.name }</h2>
                                            <p className='text-xs sm:text-sm lg:text-base capitalize mt-1'>
                                                Color : 
                                                <span className='font-medium text-gray-700'> { item.color?.name } </span>
                                                    | Size : 
                                                <span className='font-medium text-gray-700'> { item.size?.name } </span>
                                                    | Qty. 
                                                <span className='font-medium text-gray-700'> { item.quantity } </span>
                                            </p>
                                        </div>
                                    </div>
                                    <hr className='text-gray-300' />               
                                </div>
                            )}
                            
                            {order.status === 'pending' ? (
                                <>
                                    <div className='flex gap-3 px-2 md:px-4'>
                                        <div className='border border-amber-500 bg-amber-100 text-amber-500 px-2 capitalize'>{ order.status }</div>
                                        {/* <p>Awaiting payment confirmation</p> */}
                                        <p>{order.payment_status === 'paid' ? 'Payment confirmed': 'Awaiting payment confirmation'}</p>
                                    </div>
                                    <div className='flex justify-between items-center px-2 md:px-4'>
                                        <div className='flex gap-4'>
                                            {order.payment_status !== 'paid' && (
                                                <button onClick={() => handleRetryPayment(order)} className='btn-primary rounded-none!'>Retry Payment</button>
                                            )}
                                            {order.payment_status === 'paid' && (
                                                <button className='btn-primary-outline rounded-none!'>Proforma</button>
                                            )}
                                        </div>
                                        <p onClick={() => setSelectedOrder(order)} className='text-red-600 font-semibold cursor-pointer'>Cancel Order</p>
                                    </div>
                                </>
                            ) : order.status === 'accepted' ? (
                                <>
                                    <div className='flex gap-3 px-2 md:px-4'>
                                        <div className='border border-blue-500 bg-blue-100 text-blue-500 px-2 capitalize'>{ order.status }</div>
                                        <p>Your Order has been accepted</p>
                                    </div>

                                    <div className='flex justify-between items-center px-2 md:px-4'>
                                        <div className='flex gap-4'>
                                            <button onClick={() => navigate(`/track-your-order/${order.id}`)} className='btn-primary rounded-none!'>Track Order</button>
                                            <button className='btn-primary-outline rounded-none!'>Invoice</button>
                                        </div>
                                        <p onClick={() => setSelectedOrder(order)} className='text-red-600 font-semibold cursor-pointer'>Cancel Order</p>
                                    </div>
                                </>
                            ) : order.status === 'processing' ? (
                                <>
                                    <div className='flex gap-3 px-2 md:px-4 items-center'>
                                        <div className='border border-violet-500 bg-violet-100 text-violet-500 px-2 capitalize'>{ order.status }</div>
                                        <p>Your order is being packed and prepared</p>
                                    </div>

                                    <div className='flex justify-between items-center px-2 md:px-4'>
                                        <div className='flex gap-4'>
                                            <button onClick={() => navigate(`/track-your-order/${order.id}`)} className='btn-primary rounded-none!'>Track Order</button>
                                            <button className='btn-primary-outline rounded-none!'>Invoice</button>
                                        </div>
                                        <p onClick={() => setSelectedOrder(order)} className='text-red-600 font-semibold cursor-pointer'>Cancel Order</p>
                                    </div>
                                </>
                            ): order.status === 'shipped' ? (
                                <>
                                    <div className='flex gap-3 px-2 md:px-4'>
                                        <div className='border border-green-500 bg-green-100 text-green-500 px-2 capitalize'>{ order.status }</div>
                                        <p>Your order is on the way</p>
                                    </div>

                                    <div className='flex gap-4 px-2 md:px-4'>
                                        <button onClick={() => navigate(`/track-your-order/${order.id}`)} className='btn-primary rounded-none!'>Track Order</button>
                                        <button className='btn-primary-outline rounded-none!'>Invoice</button>
                                    </div>
                                </>
                            ): order.status === 'delivered' ? (
                                <>
                                    <div className='flex gap-3 px-2 md:px-4'>
                                        <div className='border border-emerald-800 bg-emerald-800 text-white px-2 capitalize'>{ order.status }</div>
                                        <p>Your order has been delivered </p>
                                    </div>
                                    <div className='flex gap-4 px-2 md:px-4'>
                                        <button className='btn-primary rounded-none!'>Add Review</button>
                                        <button className='btn-primary-outline rounded-none!'>Invoice</button>
                                    </div>
                                </>
                            ): order.status === 'cancelled' ? (
                                <div className='md:flex justify-between items-center px-2 md:px-4'>
                                    <div className='flex gap-3'>
                                        <div className='border border-red-600 bg-red-600 text-white px-2 capitalize'>{ order.status }</div>
                                        <p>This order has been cancelled</p>
                                    </div>
                                    {order.payment_status === 'paid' && (
                                    <button className='btn-primary-outline rounded-none! opacity-60 mt-3 md:mt-0 '>Refund Receipt</button>
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        </StaggerItem>
                    )}
                    </StaggerContainer>
                ) : (
                    <p className='text-center font-medium py-20'>No Data</p>
                )}


                {/* {selectedOrder && ( */}
                    <ConfirmModal
                        isOpen={selectedOrder}
                        title="Cancel Order?"
                        message={`Are you sure you want to cancel order #${selectedOrder?.order_number}?`}
                        confirmText="Cancel Order"
                        cancelText="Keep Order"
                        onConfirm={async () => {
                            await updateOrderStatus(selectedOrder.id, "cancelled");
                            setSelectedOrder(null);
                        }}
                        onCancel={() => setSelectedOrder(null)}
                    />
                {/* )} */}
                

            </section>
        </Fragment>
    );
}

export default MyOrders;
