import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';


export const OrderContext = createContext()

const OrderProvider = ({children}) => {

    const [orders, setOrders] = useState([]);
    // const [orderItems, setOrderItems] = useState([]);
    const [order, setOrder] = useState(null);

    const [ordersLoading, setOrdersLoading] = useState(true);


    // const fetchOrderList = async () => {
    //     try {
    //         const res = await api.get('/order');

    //         setOrders(res.data.results || res.data)
    //         console.log('Order list fetched successfully');
    //     } catch (error) {
    //         console.error(error.response?.data);
    //     }
    // }

    const fetchOrdersList = async ({
        search = '',
        status = '',
        ordering = '-created_at',
        page = 1,
        pageSize = 1000,
    } = {}) => {
        try {
            setOrdersLoading(true)

            const res = await api.get('/order/', {
                params: {
                    search: search || undefined,
                    status: status || undefined,
                    ordering,
                    page,
                    page_size: pageSize,
                }
            });

            setOrders(res.data.results);
            console.log(res.data);
            console.log('Order list fetched successfully');
            
            return res.data;

        } catch (error) {
            console.log(error);
        } finally {
            setOrdersLoading(false)
        }
    };

    // const fetchOrderItems = async () => {
    //     try {
    //         const res = await api.get('/order-items');

    //         setOrderItems(res.data)
    //         console.log('order Items fetched successfully');
    //     } catch (error) {
    //         console.error(error.response?.data);
    //     }
    // }

    const fetchOrder = async (id) => {
        try {
            const res = await api.get(`/order/${id}/`);

            setOrder(res.data);
            console.log('current order fetched successfully');

            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    // const createOrder = async (orderData) => {
    //     try {
    //         const res = await api.post("/order/", {

    //             wholesaler: orderData.wholesaler,
    //             total_price: orderData.total_price,
    //             shipping_address: orderData.shipping_address,
    //             status: "pending"

    //         });
    //         return res.data;

    //     } catch (error) {
    //         console.log(error.response?.data);
    //     }
    // };
    // const createOrderItem = async (item, orderId) => {
    //     try {

    //         await api.post("/order-items/", {

    //             order: orderId,
    //             product: item.product.id,
    //             color: item.color.id,
    //             size: item.size.id,
    //             quantity: item.quantity,
    //             price_at_purchase:
    //                 item.product.discount_price ??
    //                 item.product.price

    //         });

    //     } catch (error) {
    //         console.log(error.response?.data);
    //     }
    // };

    // const placeOrder = async (shippingAddress, totalPrice) => {
    //     try {
    //         const res = await api.post("/order/", {
    //             total_price : totalPrice,
    //             shipping_address: shippingAddress,
    //         });
    //         return res.data;

    //     } catch (error) {
    //         console.log(error.response?.data);
    //     }
    // };

    // useEffect(() => {
    //     fetchOrdersList()
    // }, []);

    // useEffect(() => {
    //     fetchOrderItems()
    // }, []);

    const updateOrderStatus = async (id, status) => {
        // if (status === "cancelled") {
        //     if (!window.confirm("Are you sure you want to cancel this order?")) {
        //         return;
        //     }
        // }
        try {
            await api.patch(`/order/${id}/`, {
                status
            });

            fetchOrder(id)
            fetchOrdersList();
            console.log('Order status updated successfully');
            if (status === 'cancelled' || status === 'accepted') {
                toast.success(`Order ${status}.`)
            } else {
                toast.success(`Order status updated to ${status}.`)
            }

        } catch (error) {
            console.log(error);
            if (status === 'cancelled') {
                toast.error('Failed to cancel the order.')
            } else {
                toast.error('Failed to update order status.')
            }
        }
    };

    const updateOrderDeliveryDate = async (id, date) => {
        try {
            await api.patch(`/order/${id}/`, {
                estimated_delivery_date : date
            });

            toast.success('Delivery date updated.')

            fetchOrder(id)
            fetchOrdersList();

        } catch (error) {
            console.error('Failed to update delivery date' ,error);
            toast.error('Failed to update delivery date.')
        }
    };


    return (
        <OrderContext.Provider value={{orders, order, fetchOrdersList, fetchOrder, updateOrderStatus, updateOrderDeliveryDate, ordersLoading}}>
            {children}
        </OrderContext.Provider>
    );
}

export default OrderProvider;
