import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NotFound = () => {

        const { logout  } = useAuth();
    
    const navigate = useNavigate();
    const user_type = localStorage.getItem('user_type')
    const isAdmin = user_type === 'admin';

    return (
        <Fragment>
            <div className='h-lvh place-items-center content-center text-sm md:text-base'>
                <h2 className='text-8xl md:text-9xl font-extrabold text-emerald-800! mb-6'>404</h2>
                <h2 className='text-2xl md:text-3xl font-bold mb-2'>Oops! Page not Found</h2>
                <p className='text-center text-black'>The page you are looking for cannot be found, <br/>or has been moved</p>
                {isAdmin ? (
                    <button onClick={() => navigate('/admin/dashboard')} className='btn-primary rounded-none! mt-6' >Back To Dashboard</button>

                ) : (
                    <button onClick={() => navigate('/')} className='btn-primary rounded-none! mt-6' >Go To Home Page</button>
                )}
            </div>
        </Fragment>
    );
}

export default NotFound;
