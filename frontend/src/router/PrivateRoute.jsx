import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({allowedRoles}) => {      // or allowedRoles , children

    const { authLoading , userType } = useAuth();
    const accessToken = localStorage.getItem('accessToken')

    // const token = localStorage.getItem('token');
    // const userType = localStorage.getItem('user_type');

    if ( authLoading ) return <Loader />;

    // Check if user is logged in
    if (!accessToken) return <Navigate to="/auth" replace />;

    // Check for specific roles (admin, wholesaler, etc.)
    if (allowedRoles && !allowedRoles.includes(userType)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If all checks pass, render the child routes
    return <Outlet />;                      // or children
    
}

export default PrivateRoute;
