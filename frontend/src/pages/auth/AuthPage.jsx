import React, { Fragment, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import RegisterForm from './RegisterForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';

const AuthPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    // const [isRegister, setIsRegister] = useState(false);
    const mode = searchParams.get('mode') || 'login';
    const isRegister = mode === 'register';

    const setModeRegister = () => setSearchParams({ mode: 'register' });
    const setModeLogin = () => setSearchParams({ mode: 'login' });

    const navigate = useNavigate()

    return (
        <Fragment>
            <div className="w-full h-lvh bg-white shadow-xl backdrop-blur-lg flex items-center justify-center sm:py-8 lg:py-0 ">
                <div className="w-full sm:w-125 lg:w-260 h-full lg:h-3/4 sm:rounded-4xl block lg:flex relative overflow-hidden bg-white shadow-2xl drop-shadow-2xl transition-transform duration-500">

                    

                    <div className={`hidden absolute top-0 bottom-0 w-1/2 border-8 border-white bg-emerald-700 rounded-4xl z-20 p-10 lg:flex flex-col justify-between transition-transform duration-500 ${isRegister ? 'translate-x-full' : 'translate-x-0'}`}>
                        <p className='text-white'>A WISE QUOTE  ____________</p>
                        <div className="text-white">
                            <h1 className="text-5xl text-white! font-serif leading-tight">
                                Get <br /> Everything <br /> You Want
                            </h1>
                            <p className="mt-4 text-sm opacity-80">
                                You can get everything you want if you work hard,<br />
                                trust the process, and stick to the plan.
                            </p>
                        </div>
                    </div>

                    {/* Register form section */}

                    {/* <div className={`w-full lg:w-1/2 h-full py-10 space-y-4 overflow-y-scroll flex-col justify-between items-center transition-all duration-500 ${isRegister ? 'flex translate-x-0 opacity-100 z-10' : 'hidden lg:flex lg:translate-x-full opacity-0 z-0'}`}> */}
                    <div className={`w-full lg:w-1/2 h-full py-10 space-y-4 overflow-y-auto absolute top-0 left-0 right-0 mx-auto lg:relative flex flex-col justify-between items-center transition-all duration-700 ease-in-out ${isRegister ? 'translate-x-0 opacity-100 z-10 pointer-events-auto' : '-translate-x-20 lg:translate-x-full opacity-0 z-0 pointer-events-none'}`}>
                        <h2 onClick={() => navigate('/')} className='font-bold text-2xl cursor-pointer' style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'4px'}}>STUDIO BANANA</h2>
                        <div className='w-full text-center'>
                            <h2 className='font-semibold text-3xl text-black mb-8' style={{fontFamily: 'Times New Roman, serif'}}> Create Account</h2>
                            <RegisterForm onSuccess={setModeLogin} />
                        </div>
                        <p>Already have an account? <a className='font-medium text-black cursor-pointer' onClick={setModeLogin}>Sign In</a></p>
                    </div>

                    {/* Login form section */}
                    {/* <div className={`w-full lg:w-1/2 h-full py-10 space-y-4 overflow-y-scroll flex-col justify-between items-center transition-all duration-500 ${isRegister ? 'hidden lg:flex lg:-translate-x-full opacity-0 z-0' : 'flex translate-x-0 opacity-100 z-10'}`}> */}
                    <div className={`w-full lg:w-1/2 h-full py-10 space-y-4 overflow-y-scroll absolute top-0 left-0 right-0 mx-auto lg:relative flex flex-col justify-between items-center transition-all duration-700 ease-in-out ${isRegister ? 'translate-x-20 lg:-translate-x-full opacity-0 z-0 pointer-events-none' : 'translate-x-0 opacity-100 z-10 pointer-events-auto'}`}>
                        <h2 onClick={() => navigate('/')} className='font-bold text-2xl cursor-pointer' style={{fontFamily:'Rustic Printed, sans-serif',letterSpacing:'4px'}}>STUDIO BANANA</h2>
                        <div className='w-full text-center'>
                            <h2 className='font-semibold text-3xl text-black mb-4' style={{fontFamily: 'Times New Roman, serif'}}>Welcome Back</h2>
                            <p className='text-sm mb-8'>Enter your username and password to access your account</p>
                            <LoginForm />
                        </div>
                        <p>Don't have an account? <a className='font-medium text-black cursor-pointer' onClick={setModeRegister}>Create Account</a></p>
                    </div>
                    

                </div>
            </div>
        </Fragment>
    );
}

export default AuthPage;
