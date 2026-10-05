import React, { createContext, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const PaymentContext = createContext();

const PaymentProvider = ({children}) => {

    const { setCartItems } = useCart();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    
    const navigate = useNavigate();

    const createPayment = async (orderId) => {
        try {
            const res = await api.post('/payments/', {
                order_id: orderId
            });

            return res.data;

        } catch (error) {
            console.error("Payment creation failed:", error);
            throw error;
        }
    };

    const startPayment = async (orderId, orderData) => {
        try {
            setIsPlacingOrder(true);

            // Create payment
            const payment = await createPayment(orderId);

            if (!payment || !payment.razorpay_order_id) {
                toast.error("Unable to start payment.");
                setIsPlacingOrder(false);
                return;
            }

            // Open Razorpay checkout/modal
            const options = {
                key: payment.key,
                amount: payment.amount,
                currency: payment.currency,

                name: "Studio Banana",
                description: `Order #${payment.order_number}`,

                order_id: payment.razorpay_order_id,

                handler: async function (response) {
                    console.log("Razorpay response:", response);
                    // Verification
                    try {
                        const result = await api.post('/payments/verify/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        console.log("Payment verified:", result.data);
                        toast.success(result.data.message);

                        setCartItems([])
                        // setShippingData({ shipping_street: '', shipping_city: '', shipping_state: '', shipping_pincode: '' });
                        navigate(`/order-completed/${result.data.order_id}`);

                    } catch (error) {
                        console.log(error.response?.data);
                        toast.error("Payment verification failed.");
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log("User closed the Razorpay modal.");
                        toast("Payment cancelled. Try again.", {icon: "⚠️"});
                        setIsPlacingOrder(false);
                    }
                },

                prefill: {
                    name: orderData?.wholesaler?.business_name || '',
                    email: orderData?.wholesaler?.email || '',
                },

                theme: {
                    color: "#047857"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', async function (response) {
                console.log("Payment failed details:", response.error);
                 try {
                    await api.post('/payments/fail/', {
                        razorpay_order_id: response.error.metadata?.order_id,
                        razorpay_payment_id: response.error.metadata?.payment_id
                    });
                    
                    toast.error(`Payment Failed: ${response.error.description}`);
                } catch (error) {
                    console.log(
                        "Failed to record payment failure:",
                        error.response?.data
                    );
                }
                setIsPlacingOrder(false);
            });

            razorpay.open();

        } catch (error) {
            console.error(error);
            toast.error("Unable to start payment.");
            setIsPlacingOrder(false);
        }
    };

    const handleRetryPayment = async (order) => {
        if (order.payment_status === 'paid') {
            toast.error("This order has already been paid.");
            return;
        }

        await startPayment(order.id);
    };




    return (
        <PaymentContext.Provider value={{createPayment, startPayment, handleRetryPayment, isPlacingOrder, setIsPlacingOrder}}>
            {children}
        </PaymentContext.Provider>
    );
}

export default PaymentProvider;
