import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';


const LoginForm = () => {

    const {login} = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({ username:'', password:'' });

    const navigate = useNavigate()
    const location = useLocation()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    // const handleChange = (e) => {
    //     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true)
        try {
            const res = await api.post('login/', loginForm);         // loginForm or credentials

            login(res.data);

            if (res.data.user_type === 'admin') { 
                navigate('/admin/dashboard');
            } else if (res.data.user_type === 'wholesaler') {
                if (location.state?.redirectTo) {
                    navigate(location.state.redirectTo)
                    // navigate(-1)
                } else {
                    navigate('/products')
                }
            } else navigate('/');

            toast.success('Login Successful' || res.data?.message)

        } catch (error) {
            console.error("Login failed:", error);
            const serverError  = error.response?.data?.error
            toast.error('Invalid username or password' || serverError );
        } finally {
            setIsSubmitting(false)
        }
    };


    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-1/2 place-self-center'>
            <label className='text-start text-black font-medium py-1'>Username *</label>
            <input name="username" value={loginForm.username} onChange={handleChange} placeholder="Enter your username" required autoFocus />
            <label className='text-start text-black font-medium py-1 mt-2'>Password *</label>
            <div className='relative'>
                <input className='w-full' name="password" type={showPassword ? 'text' : 'password'} value={loginForm.password} onChange={handleChange} placeholder="Enter your password" required />
                {showPassword ? (
                    <FaEyeSlash onClick={() => setShowPassword(false)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' /> 
                ) : (
                    <FaEye onClick={() => setShowPassword(true)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
                )}
            </div>
            <button type="submit" disabled={isSubmitting} className='mt-4 bg-black text-white'> {isSubmitting ? 'Processing...' : 'Login'} </button>
        </form>
    );
}

export default LoginForm;
