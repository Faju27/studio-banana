import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import AuthProvider from './context/AuthProvider';
import WholesalerProvider from './context/WholesalerProvider';
import ProductProvider from './context/ProductProvider';
import CartProvider from './context/CartProvider';
import OrderProvider from './context/OrderProvider';
import toast, { Toaster } from "react-hot-toast";
import PaymentProvider from './context/PaymentProvider';


const App = () => {


    const [isMobile, setIsMobile] = useState(false)
  
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('accessToken'));
    // console.log(localStorage.getItem('user_type'));
    // console.log(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
        };

        // Run once on mount
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  
  return (
    <>
        <Toaster
            position = {isMobile ? 'top-center' : 'top-right'}		
            // position='top-right'
            gutter = {10} 			// gap the toasts
            reverseOrder = {false} 		// New toasts are added top of the toast
            toastOptions = {{
            // for default options
                className: 'border border-emerald-800',
                duration: 2000,
                removeDelay: 1000, 	// for smoother toast exit
                style: {
                    // color: 'red' 
                },
                // for specific types
                success: {
                    duration: 3000,
                    // icon: '🎯',
                    className: 'p-3! border border-emerald-800',
                    iconTheme: {
                        primary: '#006045',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    className:'p-3! border border-red-500!',
                    iconTheme: {
                        primary: '#fb2c36',
                        secondary: '#ffffff',
                    },
                },
                
            }}
        />
        <AuthProvider >
            <ProductProvider>
                <WholesalerProvider>
                    <CartProvider>
                        <OrderProvider>
                            <PaymentProvider>
                                <AppRouter />
                            </PaymentProvider>  
                        </OrderProvider>
                    </CartProvider>
                </WholesalerProvider>
            </ProductProvider>
        </AuthProvider>
      </>
  );
}

export default App;
