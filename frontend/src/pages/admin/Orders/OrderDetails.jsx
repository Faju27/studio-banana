import React, { Fragment, useEffect, useState } from 'react';
import { MdCheckCircle, MdKeyboardBackspace, MdMailOutline, MdOutlineAssignment, MdOutlineAssignmentTurnedIn, MdOutlineCheckCircle, MdOutlineFactCheck, MdOutlineLocationOn, MdOutlinePhone, MdPersonOutline } from 'react-icons/md';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { useOrder } from '../../../hooks/useOrder';
import { FaCheck } from 'react-icons/fa';
import { FiBox, FiCheck, FiX } from 'react-icons/fi';
import { PiMapPinAreaBold } from 'react-icons/pi';
import { TbTruckDelivery } from 'react-icons/tb';
import { FaXmark } from 'react-icons/fa6';
import ConfirmModal from '../../../components/ConfirmModal';

const OrderDetails = () => {
    const { orderId } = useParams()
    const { order, fetchOrder, updateOrderStatus, updateOrderDeliveryDate } = useOrder();

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const navigate = useNavigate()

    const {asideVisible} = useOutletContext();

    // Automatically populates the calendar field once the data arrives
    useEffect(() => {
        if (order?.estimated_delivery_date) {
            setSelectedDate(order.estimated_delivery_date);
        }
    }, [order]);

    useEffect(() => {
        fetchOrder(orderId);
    }, [orderId]);

    const statuses = ['pending', 'accepted', 'processing', 'shipped', 'delivered'];
    const isCancelled = order?.status === 'cancelled';
    const currentStatusIndex = statuses.indexOf(order?.status);

    const fillPercentage = (currentStatusIndex / (statuses.length - 1)) * 100;

    const isStepActive = (stepNumber) => {

        if (isCancelled) return false; 

        if (stepNumber === 1) return currentStatusIndex >= 0; // Placed
        if (stepNumber === 2) return currentStatusIndex >= 1; // 
        if (stepNumber === 3) return currentStatusIndex >= 2; // In progress
        if (stepNumber === 4) return currentStatusIndex >= 3; // On the Way (shipped)
        if (stepNumber === 5) return currentStatusIndex >= 4; // Delivered
        return false;
    };

    const handleSave = async () => {
        await updateOrderDeliveryDate(order.id, selectedDate);
        setIsEditing(false);
    };

    const paidPayment = order?.payments?.find(
        payment => payment.status === "paid"
    );


    if (!order) return <p>Please reload the page...</p>

    return (
        <Fragment>
            <section className='flex items-center gap-2 sm:gap-4 py-4'>
                <MdKeyboardBackspace onClick={() => navigate(-1)} className='w-10 h-10 sm:w-11 sm:h-11 p-2 rounded-md border text-emerald-800 bg-white hover:bg-gray-300'/>
                <div>
                    <p>Back to order list</p>
                    <h2 className='font-semibold text-xl sm:text-2xl text-emerald-800!'>Order Details</h2>
                </div>
            </section>

            <section className='grid grid-cols-12 gap-2 sm:gap-4'>
                <div className='col-span-12 lg:col-span-7 space-y-2 sm:space-y-4'>
                    <div className=''>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-lg sm:text-xl font-semibold flex'>
                                <span className='hidden xs:block'>Order ID </span> 
                                <span className='text-emerald-800'> #{order?.order_number}</span></h2>
                            <div className='flex gap-2 text-black'>
                                {/* <p>{new Date(order?.created_at).toLocaleDateString(undefined, {day:'numeric',month:'short',year:'numeric'})}
                                    <span className='uppercase'>, {new Date(order?.created_at).toLocaleTimeString(undefined, {hour:'2-digit',minute:'2-digit',hour12:true})}</span>
                                </p> */}
                                <div className={`border px-4 py-1 capitalize text-center text-sm rounded-lg font-semibold w-fit 
                                    ${order?.status === 'expired' ? 'border-slate-600 bg-slate-600 text-white'
                                    : order?.status === 'cancelled' ? 'border-red-600 bg-red-600 text-white'
                                    : order?.status === 'delivered' ? 'border-emerald-800 bg-emerald-800 text-white' 
                                    : order?.status === 'shipped' ? 'border-green-500 bg-green-100 text-green-500'
                                    : order?.status === 'processing' ? 'border-violet-500 bg-violet-100 text-violet-500'
                                    : order?.status === 'accepted' ? 'border-blue-500 bg-blue-100 text-blue-500'
                                    : 'border-amber-500 bg-amber-100 text-amber-500'}`}
                                >
                                    {order?.status}
                                </div>
                            </div>
                        </div>
                        <div className='text-xs xs:text-sm sm:text-base'>Placed On <span className='text-black'>{new Date(order?.created_at).toLocaleDateString(undefined, {weekday:'long',day:'numeric',month:'short',year:'numeric'})}</span>
                            <span className='text-black uppercase'>, {new Date(order?.created_at).toLocaleTimeString(undefined, {hour:'2-digit',minute:'2-digit',hour12:true})}</span>
                        </div>
                        
                    </div>

                    <div className='form-section space-y-4'>
                        <h2 className='section-title'>Order Items</h2>
                        <div className='hidden sm:grid grid-cols-7 px-4'>
                            <p className='col-span-4'>Items</p>
                            <p>Qty</p>
                            <p>Price</p>
                            <p>Subtotal</p>
                        </div>
                        <hr className='hidden sm:block text-gray-300' />
                        {order?.order_items.map(item => 
                            <div key={item.id} className='flex flex-col gap-4'>
                                <div className='sm:grid grid-cols-7 sm:px-4'>
                                    <div className='col-span-4 flex gap-3'>
                                        <img src={ item.product.images?.[0]?.image } alt={item.product.name} className='bg-gray-300 w-14 sm:w-20 aspect-3/4 object-cover' />
                                        <div className='content-center'>
                                            <h2 className='font-semibold line-clamp-2'>{item.product.name}</h2>
                                            <p className='text-xs sm:text-sm md:text-base'>
                                                Color : <span className='capitalize font-medium'>{item.color?.name}</span> | 
                                                Size : <span className='font-medium'>{item.size?.name || 'N/A'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='col-span-3 flex justify-between sm:grid grid-cols-3'>
                                        <div className="col-span-1 content-center w-10 text-black text-center ">
                                            <span className='sm:hiiden '>Qty.</span>
                                            <span className='font-semibold'>{ item.quantity }</span>
                                        </div>
                                        <div className='col-span-1 content-center'>
                                            {/* <span className='line-through text-gray-500'>${ item.product.price }</span> */}
                                            <span className='text-black'>${item.price_at_purchase} </span>
                                            <span className='sm:hidden'>/each</span>
                                        </div>
                                        <div className='col-span-1 flex flex-col xs:block content-center'>
                                            <span className='sm:hidden text-xs'>Subtotal :</span>
                                            <span className='text-black'> ${ (item.price_at_purchase * item.quantity).toFixed(2) }</span>
                                        </div>
                                    </div>

                                </div>
                                <hr className='text-gray-300' />
                            </div>
                        )}
                        <div className='flex justify-end gap-4 sm:px-4'>
                            <p>Total Amount</p>
                            <p className='text-emerald-800 font-semibold'>${ order?.total_price}</p>
                        </div>
                    </div>

                    <div className={`grid sm:grid-cols-2 gap-2 sm:gap-4 ${asideVisible ? "lg:grid-cols-1 xl:grid-cols-2" : 'lg:grid-cols-2'}`}>
                        <div className='col-span-1 form-section'>
                            <h2 className='section-title'>Customer</h2>
                            <div className='space-y-2'>
                                <h2 className='text-center font-semibold'>{order?.wholesaler.business_name}</h2>
                                <hr className='text-gray-300' />
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <MdPersonOutline /> <span>Username</span>
                                    </div> 
                                    <p className='text-black'>{ order?.wholesaler.user.username }</p>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <MdOutlinePhone /> <span>Phone</span>
                                    </div> 
                                    <p className='text-black'>{ order?.wholesaler.phone }</p>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <MdMailOutline /> <span>Email</span>
                                    </div> 
                                    <p className='text-black'>{ order?.wholesaler.email || '-'}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <MdOutlineFactCheck /> <span>GST</span>
                                    </div> 
                                    <p className='text-black'>
                                        { order?.wholesaler.gst_number || '-' }
                                         {/* | 22*********1Z5 */}
                                    </p>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <MdOutlineFactCheck /> <span>PAN</span>
                                    </div> 
                                    <p className='text-black'>
                                        { order?.wholesaler.pan  || '-' }
                                         {/* | ******1234 */}
                                    </p>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex items-center h-fit gap-1'>
                                        <MdOutlineLocationOn /> <span>Billing Address</span>
                                    </div> 
                                    <div className='text-black text-end'>
                                        <p>{ order?.wholesaler.billing_street || '-'}</p>
                                        <p>{ order?.wholesaler.billing_city || '-'}</p>
                                        <p>{ order?.wholesaler.billing_state || '-'}, {order?.wholesaler.billing_pincode || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-1 form-section'>
                            <h2 className='section-title mb-6'>Order Tracking</h2>
                            <div className='flex flex-col mt-2 place-self-center'>
                                {isCancelled ? (
                                    <>
                                        <div className='flex gap-2 h-16'>
                                            <div className='w-22 shrink-0'>
                                                {order?.cancelled_at && (
                                                    <p className='text-sm text-black'>
                                                        {new Date(order.cancelled_at).toDate()} <br />
                                                        <span className='text-xs'>{new Date(order.cancelled_at).toTime()}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className='relative flex flex-col items-center'>
                                                <div className='z-10 bg-white rounded-full'>
                                                    <FaXmark className='p-2 bg-red-600 border border-red-600 text-white rounded-full' size={32}/>
                                                </div>
                                                <div className='absolute top-4 bottom-0 border-l border-dashed border-red-600 z-0' />
                                            </div>
                                            <div className='pt-1'>
                                                <p className='text-sm text-red-600 font-semibold'>Order Cancelled</p>
                                                {/* {order?.cancellation_reason && (
                                                    <p className='text-xs text-gray-500'>Reason: {order.cancellation_reason}</p>
                                                )} */}
                                            </div>
                                        </div>
                                        <div className='flex gap-2 h-16'>
                                            <div className='w-22 shrink-0'>
                                                {order?.created_at && (
                                                    <p className='text-sm text-black'>
                                                        {new Date(order.created_at).toDate()} <br />
                                                        <span className='text-xs'>{new Date(order.created_at).toTime()}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className='relative flex flex-col items-center'>
                                                <div className='z-10 bg-white rounded-full'>
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                </div>
                                            </div>
                                            <div className='pt-1'>
                                                <p className='text-sm text-black font-semibold'>Order Placed</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    
                                    <>
                                    <div className='flex gap-2 h-16'>
                                        <div className='w-22 shrink-0'>
                                            {order?.delivered_at ? (
                                                <p className={`text-sm ${isStepActive(5) && 'text-black'}`}>
                                                    {new Date(order.delivered_at).toDate()} <br />
                                                    <span className='text-xs'>{new Date(order.delivered_at).toTime()} </span>
                                                </p>
                                            ) : order?.estimated_delivery_date ? (
                                                <p className={`text-sm ${isStepActive(5) && 'text-black content-center'}`}>
                                                    {new Date(order?.estimated_delivery_date).toDate()}
                                                </p>
                                            ) : (
                                                <div className="h-5" />
                                            )}
                                        </div>
                                        <div className='relative flex flex-col items-center'>
                                            <div className='z-10 bg-white rounded-full'>
                                                {isStepActive(5) ? 
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                :
                                                    <PiMapPinAreaBold className='p-1 bg-emerald-50 border border-emerald-800 text-emerald-800 rounded-full' size={32} />
                                                }
                                            </div>
                                            <div className='absolute top-4 bottom-0 border-l border-dashed border-emerald-800 z-0' />
                                        </div>
                                        <div className='pt-1'>
                                            <p className={`text-sm ${isStepActive(5) && 'text-black font-semibold'}`}>Delivered</p>
                                        </div>
                                    </div>

                                    <div className='flex gap-2 h-16'>
                                        <div className='w-22 shrink-0'>
                                            {order?.shipped_at ? (
                                                <p className={`text-sm ${isStepActive(4) && 'text-black'}`}>
                                                    {new Date(order.shipped_at).toDate()} 
                                                    <br />
                                                    <span className='text-xs'>{new Date(order.shipped_at).toTime()}</span>
                                                </p>
                                            ) : (
                                                <div className="h-5" />
                                            )}
                                        </div>
                                        <div className='relative flex flex-col items-center'>
                                            <div className='z-10 bg-white rounded-full'>
                                                {isStepActive(4) ? 
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                :
                                                    <TbTruckDelivery className='p-1 bg-emerald-50 border border-emerald-800 text-emerald-800 rounded-full' size={32}/>
                                                }
                                            </div>
                                            <div className='absolute top-4 bottom-0 border-l border-dashed border-emerald-800 z-0' />
                                        </div>
                                        <div className='pt-1'>
                                            <p className={`text-sm ${isStepActive(4) && 'text-black font-semibold'}`}>Out for Delivery</p>
                                        </div>
                                    </div>

                                    <div className='flex gap-2 h-16'>
                                        <div className='w-22 shrink-0'>
                                            {order?.processed_at ? (
                                                <p className={`text-sm ${isStepActive(3) && 'text-black'}`}>
                                                    {new Date(order.processed_at).toDate()}  <br /><span className='text-xs'>{new Date(order.processed_at).toTime()} </span>
                                                </p>
                                            ) : (
                                                <div className="h-5" />
                                            )}
                                        </div>
                                        <div className='relative flex flex-col items-center'>
                                            <div className='z-10 bg-white rounded-full'>
                                                {isStepActive(3) ? 
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                :
                                                    <FiBox className='p-1 bg-emerald-50 border border-emerald-800 text-emerald-800 rounded-full' size={32}/>
                                                }
                                            </div>
                                            <div className='absolute top-4 bottom-0 border-l border-dashed border-emerald-800 z-0' />
                                        </div>
                                        <div className='pt-1'>
                                            <p className={`text-sm ${isStepActive(3) && 'text-black font-semibold'}`}>In progress</p>
                                        </div>
                                    </div>

                                    <div className='flex gap-2 h-16'>
                                        <div className='w-22 shrink-0'>
                                            {order?.accepted_at ? (
                                                <p className={`text-sm ${isStepActive(2) && 'text-black'}`}>
                                                    {new Date(order.accepted).toDate()} <br /><span className='text-xs'>{new Date(order.accepted).toTime()} </span>
                                                </p>
                                            ) : (
                                                <div className="h-5" />
                                            )}
                                        </div>
                                        <div className='relative flex flex-col items-center'>
                                            <div className='z-10 bg-white rounded-full'>
                                                {isStepActive(2) ? 
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                :   
                                                    <MdOutlineAssignmentTurnedIn className='p-1 bg-emerald-50 border border-emerald-800 text-emerald-800 rounded-full' size={32} />
                                                }
                                            </div>
                                            <div className='absolute top-4 bottom-0 border-l border-dashed border-emerald-800 z-0' />
                                        </div>
                                        <div className='pt-1'>
                                            <p className={`text-sm ${isStepActive(2) && 'text-black font-semibold'}`}>Order Confirmed</p>
                                        </div>
                                    </div>

                                    <div className='flex gap-2 h-auto'>
                                        <div className='w-22 shrink-0'>
                                            {order?.created_at && (
                                                <p className={`text-sm ${isStepActive(1) && 'text-black'}`}>
                                                    {new Date(order.created_at).toDate()} 
                                                    <br />
                                                    <span className='text-xs'>{new Date(order.created_at).toTime()} </span>
                                                </p>
                                            )}
                                        </div>
                                        <div className='relative flex flex-col items-center'>
                                            <div className='z-10 bg-white rounded-full'>
                                                {isStepActive(1) ? 
                                                    <FiCheck className='p-2 bg-emerald-800 border border-emerald-800 text-white rounded-full' size={32}/>
                                                :
                                                    <MdOutlineAssignment className='p-1 bg-emerald-50 border border-emerald-800 text-emerald-800 rounded-full' size={32} />
                                                }
                                            </div>
                                        </div>
                                        <div className='pt-1'>
                                            <p className='text-sm text-black font-semibold'>Order Placed</p>
                                        </div>
                                    </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>






                <div className='col-span-12 lg:col-span-5 grid lg:block sm:grid-cols-2 gap-2 sm:gap-4 lg:space-y-4'>
                    <div className={`form-section text-black ${(!order?.cancelled_at && !order?.delivered_at) ? 'order-1' : 'order-2'}`}>
                        <h2 className='section-title'>Shipping Details</h2>
                        <p>{order?.shipping_street}, </p>
                        <p>{order?.shipping_city}, </p>
                        <p>{order?.shipping_state}, {order?.shipping_pincode}</p>
                    </div>

                    { (!order?.cancelled_at && !order?.delivered_at) && 
                        <div className='form-section order-1'>
                            <h2 className='section-title'>Estimated Delivery</h2>
                            <div className='flex justify-between items-center'>
                                <p>
                                    <span className='text-black'>{new Date(order?.estimated_delivery_date).toLocaleDateString(undefined, {weekday:'long',day:'numeric',month:'short',year:'numeric'})} </span>
                                </p>
                                {isEditing ? (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm space-y-4">
                                            <h2 className="text-lg font-bold text-emerald-800!">Change Estimated Delivery Date</h2>
                                            <input 
                                                type="date" 
                                                value={selectedDate} 
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="w-full border p-1 rounded"
                                            />
                                            <div className='flex gap-2'>
                                                <button onClick={() => {setIsEditing(false); setSelectedDate(order?.estimated_delivery_date) }} className="flex-1 bg-gray-300 text-black p-2 font-medium">Cancel</button>
                                                <button disabled={selectedDate === order?.estimated_delivery_date} onClick={handleSave} className="flex-1 btn-primary disabled:brightness-50">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                <a onClick={() => setIsEditing(true)} className='text-emerald-800 font-semibold underline cursor-pointer'>Change</a>
                                )}
                            </div>
                        </div>
                    }

                    <div className='col-span-1 order-1 form-section space-y-2'>
                        <h2 className='section-title'>Order Summary</h2>
                        <div className='flex justify-between'>
                            <p>Sub Total <span>({ order?.order_items.reduce((total,item) => total + item.quantity, 0)} Items)</span></p>
                            <p className='text-black'>${ order?.total_price }</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Shipping</p>
                            <p className='text-black'>$00.00</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Taxes</p>
                            <p className='text-black'>$00.00</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Discount</p>
                            <p className='text-black'>-$00.00</p>
                        </div>
                        <hr className='text-gray-300' />
                        <div className='flex justify-between'>
                            <p>Grand Total</p>
                            <p className='text-black font-semibold'>${order?.total_price}</p>
                        </div>
                    </div>

                    <div className='col-span-1 order-1 form-section space-y-2'>
                        <h2 className='section-title'>Payment Info</h2>
                        <div className='flex justify-between'>
                            <p>Status</p>
                            <div className={` px-4 py-1 capitalize text-center text-xs rounded-lg font-semibold w-fit 
                                ${order?.payment_status === 'failed' ? 'bg-red-500 text-white'
                                : order?.payment_status === 'paid' ? 'bg-green-500 text-white'
                                : order?.payment_status === 'pending' ? 'bg-amber-500 text-white'
                                : '' }`}
                            >
                                {order?.payment_status === 'pending' ? 'unpaid' : order?.payment_status}
                            </div>
                        </div>
                        <hr className='text-gray-300' />
                        <div className='flex justify-between items-center'>
                            <p>Payment Method</p>
                            <p className='text-black capitalize'>{ order?.payments?.find(p => p.status === 'paid')?.payment_method || '-'}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p>Payment ID</p>
                            <p className='text-black'>
                                {order?.payments?.find(p => p.status === "paid")?.razorpay_payment_id || '-'}
                            </p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <p>Razorpay Order ID</p>
                            <p className='text-black'>
                                {order?.payments?.find(p => p.status === 'paid')?.razorpay_order_id || '-'}
                            </p>
                        </div>
                    </div>
                    
                    {(order?.status !== 'delivered' && order?.status !== 'cancelled') && (
                        <div className='sm:col-span-2 order-1 form-section space-y-2'>
                            <h2 className='section-title'>Order Status</h2>
                            <div className='capitalize'>
                                { (order?.status === 'pending' && order?.payment_status === 'paid') ? 
                                <div className='flex items-center gap-1'><div className='bg-amber-500 w-3 h-3 rounded-full' />{ order?.status }</div>
                                : order?.status === 'accepted' ?
                                <div className='flex items-center gap-1'><div className='bg-blue-500 w-3 h-3 rounded-full' />{ order?.status }</div>
                                : order?.status === 'processing' ?
                                <div className='flex items-center gap-1'><div className='bg-violet-500 w-3 h-3 rounded-full' />{ order?.status }</div>
                                : order?.status === 'shipped' ?
                                <div className='flex items-center gap-1'><div className='bg-green-500 w-3 h-3 rounded-full' />{ order?.status }</div>
                                : 
                                    <></>
                                }
                            </div>
                            {order?.status === "pending" && order?.payment_status === "paid" && (
                                <div className="flex justify-center gap-4 mt-2">
                                    <button className='btn-primary' onClick={() => updateOrderStatus(order.id, "accepted") }> Accept Order</button>
                                    <button className='btn-primary-outline' onClick={() => setShowCancelModal(true) }> Cancel Order</button>
                                </div>
                            )}
                            {order?.status === "pending" && order?.payment_status !== "paid" && (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-amber-600 font-semibold"> Payment pending</p>
                                    <p className="text-sm">This order cannot be accepted until payment is completed.</p>
                                    <button className='btn-primary-outline' onClick={() => setShowCancelModal(true)}> Cancel Order</button>
                                </div>
                            )}
                            {order?.status === "accepted" && (
                                <div className="flex justify-center gap-4 mt-2">
                                    <button className='btn-primary' onClick={() =>updateOrderStatus(order.id, "processing")}>Start Processing</button>
                                    <button className='btn-primary-outline' onClick={() =>setShowCancelModal(true)}>Cancel Order</button>
                                </div>
                            )}
                            {order?.status === "processing" && (
                                <div className="flex justify-center gap-4 mt-2">
                                    <button className='btn-primary' onClick={() =>updateOrderStatus(order.id, "shipped")}>Mark as Shipped</button>
                                    <button className='btn-primary-outline' onClick={() =>setShowCancelModal(true)}>Cancel Order</button>
                                </div>
                            )}
                            {order?.status === "shipped" && (
                                <button className='btn-primary mt-2' onClick={() => updateOrderStatus(order.id, "delivered")}>
                                    Mark as Delivered
                                </button>
                            )}
                            {/* {showCancelModal && */}
                                <ConfirmModal
                                    isOpen={showCancelModal}
                                    title="Cancel Order?"
                                    message="Are you sure you want to cancel this order?"
                                    confirmText="Cancel Order"
                                    cancelText="Keep Order"
                                    onConfirm={() => {
                                        updateOrderStatus(order.id, "cancelled");
                                        setShowCancelModal(false);
                                    }}
                                    onCancel={() => setShowCancelModal(false)}
                                />
                            {/* } */}

                        </div>
                    )}
                </div>
            </section>
        </Fragment>
    );
}

export default OrderDetails;
