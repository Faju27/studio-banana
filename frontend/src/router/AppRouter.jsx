import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NotFound from '../pages/public/NotFound';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Products from '../pages/public/Products';
import AuthPage from '../pages/auth/AuthPage';
import RegisterPage from '../pages/auth/RegisterForm';
import Dashboard from '../pages/admin/Dashboard';
import PrivateRoute from './PrivateRoute';
import AddProduct from '../pages/admin/AddProduct';
import ProductDetailManager from '../pages/admin/ProductDetailManager';
import AllProducts from '../pages/admin/AllProducts';
import WholesalerApproval from '../pages/admin/WholesalerApproval';
import Layout from '../layouts/AdminLayout';
import WholesalerList from '../pages/admin/WholesalerList';
import ProductDetails from '../pages/public/ProductDetails';
import Orders from '../pages/admin/Orders/Orders';
import AccountLayout, { LogoutModal } from '../layouts/AccountLayout';
import BusinessProfile from '../pages/wholesaler/BusinessProfile';
import MyOrders from '../pages/wholesaler/MyOrders';
import ManageAddress from '../pages/wholesaler/ManageAddress';
import MyCart from '../pages/wholesaler/MyCart';
import Checkout from '../pages/wholesaler/Checkout';
import OrderCompleted from '../pages/wholesaler/OrderCompleted';
import TrackYourOrder from '../pages/wholesaler/TrackYourOrder';
import OrderDetails from '../pages/admin/Orders/OrderDetails';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../hooks/useAuth';

const AppRouter = () => {

    const {userType} = useAuth()
    console.log(userType);
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('accessToken'));
    // console.log(localStorage.getItem('user_type'));
    // console.log(JSON.parse(localStorage.getItem('user')));


    // function TitleManager() {
    //     const location = useLocation();

    //     useEffect(() => {
    //         // Fallback default title
    //         let title = "Studio Banana"; 

    //         // Convert pathname (e.g. "/dashboard" -> "Dashboard")
    //         if (location.pathname === "/") {
    //             title = "Home | Studio Banana";
    //         } else {
    //             const pageName = location.pathname
    //                 .replace("/", " ") // Remove the slash
    //                 .replace("-", " "); // Handle names like "user-profile" -> "user profile"
            
    //         // Capitalize first letter of each word
    //         const formattedName = pageName
    //             .split(" ")
    //             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    //             .join(" ");

    //         title = `${formattedName} | Studio Banana`;
    //         }

    //         document.title = title;
    //     }, [location]);

    //     return null; // This component doesn't render any UI, it just updates title
    //     }
    function TitleManager() {
        const location = useLocation();

        useEffect(() => {
            // Default fallback
            if (location.pathname === "/") {
                document.title = "Home | Studio Banana";
                return;
            }

            // Split paths by "/" and remove empty strings
            const pathSegments = location.pathname.split("/").filter(Boolean);

            // Filter out IDs/numbers so title doesn't display "33"
            const words = pathSegments.filter(segment => isNaN(segment));

            // Format the final array: capitalize each word and join them with an arrow " • " (Alt + 7)
            const formattedTitle = words.map(word => {
                    const cleanedWord = word.replace("-", " ").replace("_", " ");
                    return cleanedWord.charAt(0).toUpperCase() + cleanedWord.slice(1);
                })
                .join(" • ");

            document.title = `${formattedTitle} | Studio Banana`;
        }, [location]);

        return null; 
    }



    return (
        <>
            <TitleManager />

            <Routes>
                {/* Public routes */}
                <Route index element={<Home />} />
                {/* <Route path='' element={<Home />} /> */}
                <Route path='about' element={<About />} />
                <Route path='contact' element={<Contact />} />
                <Route path='products' >
                    <Route index element={<Products />} />
                    <Route path=':productId' element={<ProductDetails />} />
                </Route>


                {/* Auth */}
                <Route path='auth' element={<AuthPage />} />
                {/* <Route path='wholesaler/register' element={<RegisterPage />} /> */}


                {/* Role based protected routes */}
                    {/* Admin */}
                    <Route path='admin' element={<PrivateRoute allowedRoles={['admin']} />} >            // checks permission
                    {/* <Route path='admin' > */}
                        <Route element={<AdminLayout />}>
                            {/* <Route index element={<Dashboard />} />  */}
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='products' >
                                <Route index element={<AllProducts />} />
                                <Route path=':productId/manage' element={<ProductDetailManager />} />
                            </Route>
                            <Route path='product-add' element={<AddProduct />} />
                            <Route path='orders'>
                                <Route index element={<Orders />} />
                                <Route path=':orderId' element={<OrderDetails />} />
                            </Route>
                            <Route path='wholesaler/approval' element={<WholesalerApproval />} />
                            <Route path='customers' element={<WholesalerList />} />
                        </Route>
                    </Route>

                    {/* Wholesaler */}
                    <Route element={<PrivateRoute allowedRoles={['wholesaler']} />} >
                        <Route path='my-account' element={<AccountLayout />}>
                            <Route index element={<BusinessProfile />} />
                            {/* <Route path='business-profile' element={<BusinessProfile />} /> */}
                            <Route path='my-orders' element={<MyOrders />} />
                            <Route path='manage-address' element={<ManageAddress />} />
                            <Route path='logout' element={<LogoutModal />} />
                        </Route>
                        <Route path='my-cart' element={<MyCart />} />
                        <Route path='checkout' element={<Checkout />} />
                        <Route path='order-completed/:orderId' element={<OrderCompleted />} />
                        <Route path='track-your-order/:orderId' element={<TrackYourOrder />} />
                    </Route>        

                    {/* <Route path="/admin/dashboard" element={       // if using children instead of Outlet
                            <PrivateRoute roles={['admin']}>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    /> */}


                {/* other routes */}
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </>
    );
}

export default AppRouter;
