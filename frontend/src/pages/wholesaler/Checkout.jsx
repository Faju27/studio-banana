import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../hooks/useCart';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { usePayment } from '../../hooks/usePayment';
import FadeIn from '../../animations/FadeIn';
import { useWholesaler } from '../../hooks/useWholesaler';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { useAuth } from '../../hooks/useAuth';

const Checkout = () => {

    const { accessToken } = useAuth();
    const { cart, cartItems, totalItems, subtotal, total } = useCart();
    const { fetchWholesaler, wholesaler, editWholesalerField, authLoading} = useWholesaler();
    const { createPayment , startPayment, isPlacingOrder, setIsPlacingOrder} = usePayment();


    const [step, setStep] = useState(1)

    const [profileForm, setProfileForm] = useState({
        business_name: '',
        email: '',
        gst_number: '',
        pan: '',
        phone: ''
    })
    const [profileErrors, setProfileErrors] = useState({})

    const [billingForm, setBillingForm] = useState({
        billing_street: '',
        billing_city: '',
        billing_state: '',
        billing_pincode: ''
    });
    const [billingErrors, setBillingErrors] = useState({});

    const [actionLoading, setActionLoading] = useState(false)


    const [shippingForm, setShippingForm] = useState({
        shipping_street: '',
        shipping_city: '',
        shipping_state: '',
        shipping_pincode: ''
    });
    const [shippingErrors, setShippingErrors] = useState({});


    const [activeOrderId, setActiveOrderId] = useState(null)

    const navigate = useNavigate()





    useEffect(() => {
        if (accessToken) {
            fetchWholesaler();
        }
    }, [accessToken]);

    useEffect(() => {
        if (wholesaler) {
            setBillingForm({
                billing_street: wholesaler.billing_street || '',
                billing_city: wholesaler.billing_city || '',
                billing_state: wholesaler.billing_state || '',
                billing_pincode: wholesaler.billing_pincode || ''
            });
            setProfileForm({
                business_name: wholesaler.business_name || '',
                email: wholesaler.email || '',
                gst_number: wholesaler.gst_number || '',
                pan: wholesaler.pan || '',
                phone: wholesaler.phone || '',
            });
        }
    }, [wholesaler]); 

    

    const isProfileValid = 
        wholesaler?.business_name?.trim() !== "" &&
        wholesaler?.email?.trim() !== "" &&
        wholesaler?.gst_number?.trim() !== "" &&
        wholesaler?.pan?.trim() !== "" &&
        wholesaler?.phone?.toString().trim() !== "";
    
    const isBillingValid = 
        wholesaler?.billing_street?.trim() !== "" &&
        wholesaler?.billing_city?.trim() !== "" &&
        wholesaler?.billing_state?.trim() !== "" &&
        wholesaler?.billing_pincode?.toString().trim() !== "" ;
    
    const isShippingValid = 
        shippingForm?.shipping_street?.trim() !== "" &&
        shippingForm?.shipping_city?.trim() !== "" &&
        shippingForm?.shipping_state?.trim() !== "" &&
        shippingForm?.shipping_pincode?.toString().trim() !== "" ;


    const handleSameAsBilling = (e) => {
        if (e.target.checked) {
            setShippingForm({
                shipping_street: wholesaler?.billing_street,
                shipping_city: wholesaler?.billing_city,
                shipping_state: wholesaler?.billing_state,
                shipping_pincode: wholesaler?.billing_pincode
            });
        } else {
            setShippingForm({ shipping_street: '', shipping_city: '', shipping_state: '', shipping_pincode: '' });
        }
    };

    

    // const handleShippingChange = (e) => {
    //     setShippingForm({
    //         ...shippingForm,
    //         [e.target.name]: e.target.value
    //     });
    // };

    const handleShippingChange = (e) => {
        const {name, value} = e.target;
        setShippingForm(prevForm => ({...prevForm, [name]: value}))
    };
    const handleBillingChange = (e) => {
        const {name, value} = e.target;
        setBillingForm(prevForm => ({...prevForm, [name]: value}))
    };
    const handleProfileChange = (e) => {
        const {name, value} = e.target;
        setProfileForm(prevForm => ({...prevForm, [name]: value}))
    };

    // const handleFormChange = (setFormState) => (e) => {
    //     const { name, value } = e.target;
    //     setFormState(prev => ({ ...prev, [name]: value }));
    // };

    const handleProfileNext = async () => {
        setProfileErrors({});
        const errors = {};

        if (!profileForm.business_name.trim()) errors.business_name = "Business Name is required.";
        if (!profileForm.email.trim()) errors.email = "Email is required.";
        if (!profileForm.gst_number.trim()) errors.gst_number = "GST number is required.";
        // if (!profileForm.phone.toString().trim()) errors.phone = "Phone number is required.";


        if (!profileForm.phone.toString().trim()) {
            errors.phone = "Phone number is required.";
        } else {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(profileForm.phone.toString().trim())) {
                errors.phone = "Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.";
            }
        }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (profileForm.email.trim() && !emailRegex.test(profileForm.email)) {
        //     errors.email = "Please enter a valid email address.";
        // }

        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            return;
        }

        try {
            setActionLoading(true);
            await api.patch('/wholesaler/profile/', profileForm);
            await fetchWholesaler(); 
            setStep(2); 

        } catch (err) {
            console.error("Profile update failed:", err.response?.data);

            if (err.response && err.response.data) {
                const serverErrors = err.response.data;

                if (typeof serverErrors === 'object') {
                    const mappedErrors = {};
                    
                    Object.keys(serverErrors).forEach((field) => {
                        const message = serverErrors[field];
                        // Extract the clean message text string out of the array format
                        mappedErrors[field] = Array.isArray(message) ? message[0] : message;
                    });

                    setProfileErrors(mappedErrors); 
                } 
                else {
                    toast.error("Failed to save profile information.");
                }
            } else {
                toast.error("Unable to reach the server. Please try again later.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleBillingNext = async () => {
        setBillingErrors({});
        const errors = {};

        if (!billingForm.billing_street.trim()) errors.billing_street = "Street is required.";
        if (!billingForm.billing_city.trim()) errors.billing_city = "City is required.";
        if (!billingForm.billing_state.trim()) errors.billing_state = "State is required.";
        
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(billingForm.billing_pincode.toString().trim())) {
            errors.billing_pincode = "PIN code must be exactly 6 digits.";
        }

        if (Object.keys(errors).length > 0) {
            setBillingErrors(errors);
            return;
        }

        try {
            setActionLoading(true);
            await api.patch('/wholesaler/profile/', billingForm);
            await fetchWholesaler(); 
            setStep(3); 

        } catch (err) {
            toast.error("Failed to save billing information.Please check your data.");
        } finally {
            setActionLoading(false);
        }
    };


    const placeOrder = async (shippingDetails) => {
        try {
            const res = await api.post("/order/", shippingDetails);
            console.log('Order Created:', res.data);
            return res.data;            

        } catch (error) {
            console.log(error.response?.data);
            if (error.response && error.response.data) {
                // setShippingErrors({server : error.response.data?.error});
                setShippingErrors(prev => ({...prev, server: error.response.data?.error || 'Server error occurred'}));
            }
            return null;
        }
    };

    const handlePlaceOrder = async () => {
        if (totalItems < 1) {
            toast("Your cart is empty!Redirecting you back...", {id: 'empty-cart-toast', icon: '⚠️' });
            navigate('/my-cart');
            return;
        }

        setShippingErrors({})
        const errors = {};

        if (!shippingForm?.shipping_street?.trim()) errors.shipping_street = '* Please enter street.';
        if (!shippingForm?.shipping_city?.trim()) errors.shipping_city = '* Please enter city.';
        if (!shippingForm?.shipping_state?.trim()) errors.shipping_state = '* Please enter state.';

        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(shippingForm.shipping_pincode.toString().trim())) {
            errors.shipping_pincode = "* PIN code must be exactly 6 digits.";
        }

        // Update state with all errors found
        // setShippingErrors(errors)

        if (Object.keys(errors).length > 0) {
            setShippingErrors(errors);

            return; // For to stops the function completely if an error occured
        }
        
        // If there are errors, stop execution and scroll to the first one
        // if (Object.keys(errors).length > 0) {
        //     const firstErrorField = Object.keys(errors)[0];
        //     const element = document.getElementsByName(firstErrorField)[0];
            
        //     if (element) {
        //         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //         element.focus(); // Focus the field so the user can just start typing
        //     }
        //     return;
        // }

        try{
            setIsPlacingOrder(true)
            let orderId = activeOrderId;
            let orderData = null;

            // 1. Create order if one doesnt already exist  
            if (!orderId) {
                const order = await placeOrder(shippingForm);

                if (!order || !order.id) {
                    // toast.error('Unable to create order.');
                    setIsPlacingOrder(false);
                    return;
                }
                
                orderId = order.id;
                orderData = order;

                setActiveOrderId(order.id); 
            }

            await startPayment(orderId, orderData)

        } catch(error) {
            console.error(error);
            toast.error('Unable to start payment.')
        } finally {
            setIsPlacingOrder(false)
        }
    };

    return (
        <Fragment>
            <div className='min-h-screen'>
                <Header />

                <section className='h-30 sm:h-40 md:h-50 flex flex-col items-center justify-center bg-[#f5f2eb]/80'>
                    <FadeIn className='text-center'>
                        <h2 className='text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800! font-primary'>Checkout</h2>
                        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-semibold'>Home / Shopping Cart / Checkout </p>
                    </FadeIn>
                </section>

                <section className='grow container place-self-center mt-16 pb-30 px-4'>
                    <FadeIn delay={0.1}>
                        <h2 className='text-base sm:text-lg lg:text-2xl font-semibold mb-4'>
                            {step === 1 || step === 2 ? 'Billing Details' :  'Shipping Details'}
                        </h2>
                    </FadeIn>

                    

                    <div className='grid grid-cols-6 gap-8 text-sm lg:text-base'>
                        {(wholesaler && step === 1) &&
                            <main className='col-span-6 md:col-span-3 xl:col-span-4'>
                                <FadeIn delay={0.2} className='space-y-3'>
                                    {/* <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Business Name *</label>
                                        <input type='text' placeholder='Enter Business Name'  
                                            defaultValue={wholesaler.business_name}  
                                            onBlur={(e) => editWholesalerField('business_name', e.target.value, wholesaler.business_name, e.target)}
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Email *</label>
                                        <input type='email' placeholder='Enter Email'  
                                            defaultValue={wholesaler.email}  
                                            onBlur={(e) => editWholesalerField('email', e.target.value, wholesaler.email, e.target)}
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>GST Number *</label>
                                        <input type='text' placeholder='Enter GST Number'  
                                            defaultValue={wholesaler.gst_number}  
                                            onBlur={(e) => editWholesalerField('gst_number', e.target.value, wholesaler.gst_number, e.target)}
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>PAN </label>
                                        <input type='text' placeholder='Enter PAN'  
                                            defaultValue={wholesaler.pan}  
                                            onBlur={(e) => editWholesalerField('pan', e.target.value, wholesaler.pan, e.target)}
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Phone *</label>
                                        <input type='number' placeholder='Enter Phone'  
                                            defaultValue={wholesaler.phone}  
                                            onBlur={(e) => editWholesalerField('phone', e.target.value, wholesaler.phone, e.target)}
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                    </div> */}



                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Business Name *</label>
                                        <input type='text' name='business_name' placeholder='Enter Business Name'  
                                            value={profileForm.business_name}
                                            onChange={handleProfileChange}  
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                        {profileErrors.business_name && (
                                            <span className="text-red-500 text-xs mt-1">{profileErrors.business_name}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Email *</label>
                                        <input type='email' name='email' placeholder='Enter Email'  
                                            value={profileForm.email}
                                            onChange={handleProfileChange}  
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                        {profileErrors.email && (
                                            <span className="text-red-500 text-xs mt-1">{profileErrors.email}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>GST Number *</label>
                                        <input type='text' name='gst_number' placeholder='Enter GST Number'  
                                            value={profileForm.gst_number}
                                            onChange={handleProfileChange}  
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                        {profileErrors.gst_number && (
                                            <span className="text-red-500 text-xs mt-1">{profileErrors.gst_number}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>PAN </label>
                                        <input type='text' name='pan' placeholder='Enter PAN'  
                                            value={profileForm.pan}
                                            onChange={handleProfileChange}  
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                        {profileErrors.pan && (
                                            <span className="text-red-500 text-xs mt-1">{profileErrors.pan}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-black font-semibold mb-1'>Phone *</label>
                                        <input type='number' name='phone' placeholder='Enter Phone'  
                                            value={profileForm.phone}
                                            onChange={handleProfileChange}  
                                            className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                        {profileErrors.phone && (
                                            <span className="text-red-500 text-xs mt-1">{profileErrors.phone}</span>
                                        )}
                                    </div>

                                    {/* <button 
                                        // disabled={!isProfileValid} 
                                        onClick={() => setStep(2)} 
                                        className={`place-self-end rounded-none! ${isProfileValid ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed!'}`}
                                    >
                                        Next
                                    </button> */}
                                    <button 
                                        disabled={actionLoading} 
                                        onClick={handleProfileNext} 
                                        className={`place-self-end rounded-none! w-26 ${!actionLoading ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed!'}`}
                                    >
                                        {actionLoading ? 'Saving...' : 'Next'}
                                    </button>
                                    
                                </FadeIn>
                            </main>
                        }

                        {(wholesaler && step === 2) && (
                            <StaggerContainer className='col-span-6 md:col-span-3 xl:col-span-4 space-y-3'>
                                {/* <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>Street *</label>
                                    <input type='text' placeholder='Shop/Plot No., Building, Street'  
                                        defaultValue={wholesaler.billing_street} 
                                        onBlur={(e) => editWholesalerField('billing_street', e.target.value, wholesaler.billing_street, e.target)}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                </StaggerItem>
                                
                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>City *</label>
                                    <input type='text' placeholder='Enter City'  
                                        defaultValue={wholesaler.billing_city}
                                        onBlur={(e) => editWholesalerField('billing_city', e.target.value, wholesaler.billing_city, e.target)}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                </StaggerItem>

                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>State *</label>
                                    <input type='text' placeholder='Enter State'  
                                        defaultValue={wholesaler.billing_state}
                                        onBlur={(e) => editWholesalerField('billing_state', e.target.value, wholesaler.billing_state, e.target)} 
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                </StaggerItem>

                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>PIN code *</label>
                                    <input type='text' placeholder='Enter 6-digit PIN code'  
                                        defaultValue={wholesaler.billing_pincode}
                                        onBlur={(e) => editWholesalerField('billing_pincode', e.target.value, wholesaler.billing_pincode, e.target)}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white! `} />
                                </StaggerItem> */}

                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>Street *</label>
                                    <input type='text' name='billing_street' placeholder='Shop/Plot No., Building, Street'  
                                        value={billingForm.billing_street} 
                                        onChange={handleBillingChange}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white!`} />
                                    {billingErrors.billing_street && (
                                        <span className="text-red-500 text-xs mt-1">{billingErrors.billing_street}</span>
                                    )}
                                </StaggerItem>
                                
                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>City *</label>
                                    <input type='text' name='billing_city' placeholder='Enter City'  
                                        value={billingForm.billing_city}
                                        onChange={handleBillingChange}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white!`} />
                                    {billingErrors.billing_city && (
                                        <span className="text-red-500 text-xs mt-1">{billingErrors.billing_city}</span>
                                    )}
                                </StaggerItem>

                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>State *</label>
                                    <input type='text' name='billing_state' placeholder='Enter State'  
                                        value={billingForm.billing_state}
                                        onChange={handleBillingChange} 
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white!`} />
                                    {billingErrors.billing_state && (
                                        <span className="text-red-500 text-xs mt-1">{billingErrors.billing_state}</span>
                                    )}
                                </StaggerItem>

                                <StaggerItem className='flex flex-col'>
                                    <label className='text-black font-semibold mb-1'>PIN code *</label>
                                    <input type='number' name='billing_pincode' placeholder='Enter 6-digit PIN code'  
                                        value={billingForm.billing_pincode}
                                        onChange={handleBillingChange}
                                        className={`w-full border p-4! border-gray-300! rounded-none! bg-white!`} />
                                    {billingErrors.billing_pincode && (
                                        <span className="text-red-500 text-xs mt-1">{billingErrors.billing_pincode}</span>
                                    )}
                                </StaggerItem>
                                
                                <StaggerItem className='flex justify-between'>
                                     <button 
                                        onClick={() => setStep(1)}
                                        className='btn-primary rounded-none! w-26'
                                    >
                                        Back
                                    </button>
                                    {/* <button 
                                        disabled={!isBillingValid} 
                                        onClick={() => setStep(3)}
                                        className={`rounded-none! ${isBillingValid ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed!'}`}
                                    >
                                        Next
                                    </button> */}
                                    
                                    <button 
                                        disabled={actionLoading}
                                        onClick={handleBillingNext}
                                        className={`rounded-none! w-26 ${!actionLoading ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed!'}`}
                                    >
                                        {actionLoading ? 'Saving...' : 'Next'}
                                    </button>
                                </StaggerItem>
                            </StaggerContainer>
                        )}
                        
                        {step === 3 &&
                            <main className="col-span-6 md:col-span-3 xl:col-span-4">
                            <FadeIn delay={0.2} className='space-y-3'>
                                {(step !== 1 && step !== 2) && (
                                        <label className={`flex gap-2 items-center p-4 border border-gray-300 ${!activeOrderId ? 'bg-white! cursor-pointer' : 'bg-gray-100! cursor-not-allowed'}`}>
                                            <input type='checkbox' disabled={!!activeOrderId} onChange={handleSameAsBilling} className='w-4 h-4'/>
                                            <span>Use billing address for shipping</span>
                                        </label>
                                )}
                                <div className="flex flex-col">
                                    <label className='text-black font-semibold mb-1'>Street *</label>
                                    <input 
                                        type="text" name="shipping_street" disabled={!!activeOrderId} autoFocus
                                        value={shippingForm.shipping_street} onChange={handleShippingChange} 
                                        placeholder="Shop/Plot No., Building, Street" className={`border border-gray-300 rounded-none! py-4! ${!activeOrderId ? 'bg-white!' : 'bg-gray-100!'} `}
                                    />
                                    {shippingErrors.shipping_street && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block', marginTop: '4px' }}>
                                            {shippingErrors.shipping_street}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-black font-semibold mb-1'>City *</label>
                                    <input 
                                        type="text" name="shipping_city" disabled={!!activeOrderId}
                                        value={shippingForm.shipping_city} onChange={handleShippingChange} 
                                        placeholder="Enter City" className={`border border-gray-300 rounded-none! py-4! ${!activeOrderId ? 'bg-white!' : 'bg-gray-100!'} `}
                                    />
                                    {shippingErrors.shipping_city && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block', marginTop: '4px' }}>
                                            {shippingErrors.shipping_city}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-black font-semibold mb-1'>State *</label>
                                    <input 
                                        type="text" name="shipping_state" disabled={!!activeOrderId}
                                        value={shippingForm.shipping_state} onChange={handleShippingChange} 
                                        placeholder="Enter State" className={`border border-gray-300 rounded-none! py-4! ${!activeOrderId ? 'bg-white!' : 'bg-gray-100!'} `}
                                    />
                                     {shippingErrors.shipping_state && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block', marginTop: '4px' }}>
                                            {shippingErrors.shipping_state}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-black font-semibold mb-1'>PIN Code *</label>
                                    <input 
                                        type="number" name="shipping_pincode" disabled={!!activeOrderId}
                                        value={shippingForm.shipping_pincode} onChange={handleShippingChange} 
                                        placeholder="Enter 6-digit PIN code" className={`border border-gray-300 rounded-none! py-4! ${!activeOrderId ? 'bg-white!' : 'bg-gray-100!'} `}
                                        maxLength={6}
                                    />                                
                                    {shippingErrors.shipping_pincode && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block', marginTop: '4px' }}>
                                            {shippingErrors.shipping_pincode}
                                        </span>
                                    )}
                                </div>

                                <div className='flex justify-between'>
                                    <button 
                                        onClick={() => setStep(2)}
                                        className='btn-primary rounded-none! w-26'
                                    >
                                        Back
                                    </button>
                                    {activeOrderId &&
                                        <button onClick={() => setActiveOrderId(null)} className='btn-primary rounded-none!'>Edit Shipping</button>
                                    }
                                </div>
                            </FadeIn>
                            </main>
                        }
                        
                    

                        <aside className='col-span-6 md:col-span-3 xl:col-span-2'>
                        <FadeIn delay={0.3}>
                            <div className='border border-gray-300 p-4 md:p-6 flex flex-col gap-4 text-sm lg:text-base'>
                                <h2 className='text-base sm:text-lg lg:text-xl font-semibold mb-2'>Order Summary</h2>
                                <hr className='text-gray-300' />
                                <div className='flex justify-between'>
                                    <p>Items</p>
                                    <p className='text-black'>{ totalItems}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>Sub Total</p>
                                    <p className='text-black'>${subtotal}</p>
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
                                    <p>Coupon Discount</p>
                                    <p className='text-black'>-$00.00</p>
                                </div>
                                <hr className='text-gray-300' />
                                <div className='flex justify-between'>
                                    <p>Total</p>
                                    <p className='text-black'>${total}</p>
                                </div>
                                <div>
                                    <button disabled={ step !== 3 || isPlacingOrder } onClick={handlePlaceOrder} className={`w-full rounded-none! mt-4 py-4! ${ step !== 3 || isPlacingOrder ? 'bg-gray-300 cursor-not-allowed!' : 'btn-primary'}`}>
                                        { isPlacingOrder ? ('Processing...') : activeOrderId ? ('Retry Payment') : ('Continue to Payment')}
                                    </button>
                                    {shippingErrors.server && (
                                        <p className='text-red-600 text-sm text-center mt-2'>
                                            {shippingErrors.server}
                                        </p>
                                    )}
                                </div>
                                
                            </div>
                        </FadeIn>
                        </aside>
                    </div>
                </section>

                <section>
                    <Footer />
                </section>
            </div>
        </Fragment>
    );
}

export default Checkout;
