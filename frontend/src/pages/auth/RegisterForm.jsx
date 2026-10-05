import React, { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = ({onSuccess}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirm_password: '',
        business_name: '',
        phone: '',
        // email: '',
    });
    const [registerErrors, setRegisterErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (registerForm.password !==registerForm.confirm_password) {
            setRegisterErrors({confirm_password : 'Passwords do not match'})
            return;
        }
        
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(registerForm.phone)) {
            setRegisterErrors({ phone: 'Phone number must be exactly 10 digits.' });
            return;
        }


        setIsSubmitting(true)
        try {
            await api.post('/register/wholesaler/', registerForm);

            toast.success('Wholesaler registered successfully. Waiting for approval.')
            
            onSuccess() // Triggers the panel to slide back to the Login view

            setRegisterForm({ username: '', password: '', confirm_password: '',
                    business_name: '', phone: '', });
            setRegisterErrors({})

        } catch (error) {
            console.error(error.response?.data);

            if (error.response && error.response.data) {
                const serverErrors = error.response.data;

                // If the server returns field-specific arrays (e.g., username: [...])
                if (typeof serverErrors === 'object') {
                    const mappedErrors = {};
                    Object.keys(serverErrors).forEach((field) => {
                        const message = serverErrors[field];
                        mappedErrors[field] = Array.isArray(message) ? message[0] : message;
                    })
                    
                    setRegisterErrors(mappedErrors)
                    // Grab the first available error message across any failing field
                    // const errorFields = Object.keys(serverErrors);
                    // const firstField = errorFields[0];
                    // const firstMessage = serverErrors[firstField];

                    // // If it's an array (standard DRF format), grab the first item string
                    // if (Array.isArray(firstMessage)) {
                    //     toast.error(`${firstMessage[0]}`);
                    // } else {
                    //     toast.error(`${firstMessage || 'Registration failed'}`);
                    // }
                } else {
                    toast.error('Registration failed. Please check your data.');
                }
            } else {
                toast.error('Unable to reach the server. Please try again later.');
            }

        } finally {
            setIsSubmitting(false)
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     if (isAgency) {
    //         formData.append('user.username', agencyForm.username);
    //         formData.append('user.email', agencyForm.email);
    //         formData.append('user.password', agencyForm.password);
    //         formData.append('agency_name', agencyForm.agency_name);
    //         formData.append('logo', agencyForm.logo);
    //         formData.append('description', agencyForm.description);
    //         formData.append('phone', agencyForm.phone);
    //         formData.append('location', agencyForm.location);
    //         formData.append('approved', agencyForm.approved);

    //         try {
    //             await axios.post('http://localhost:8000/agencies/', formData)
    //             alert('Agency Registered Succesfully.')
    //             setAgencyForm({username : '',email : '',password : '',agency_name : '',logo : null,
    //                 description : '',phone : '',location : '',approved:false})
    //         } catch (error) {
    //             console.error(error.response?.data || error.message)
    //             alert('Registration Failed.')
    //         }
    //     }


    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-1/2 place-self-center space-y-2'>
            <div className='flex flex-col'>
                <label className='text-start text-black font-medium'>Username *</label>
                <input name="username" value={registerForm.username} onChange={handleChange} placeholder="Username" required autoFocus />
                {registerErrors.username && (
                    <span className="text-start text-red-500 text-xs mt-1">{registerErrors.username}</span>
                )}
            </div>
            
            <div className='flex flex-col'>
                <label className='text-start text-black font-medium'>Password *</label>
                <div className='relative'>
                    <input className='w-full' name="password" type={showPassword ? 'text' : 'password'} value={registerForm.password} onChange={handleChange} placeholder="Password" required />
                    {showPassword ? (
                        <FaEyeSlash onClick={() => setShowPassword(false)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' /> 
                    ) : (
                        <FaEye onClick={() => setShowPassword(true)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
                    )}
                </div>
            </div>

            <div className='flex flex-col'>
                <label className='text-start text-black font-medium'>Confirm Password *</label>
                <div className='relative'>
                    <input className='w-full' name="confirm_password" type={showConfirmPassword ? 'text' : 'password'} value={registerForm.confirm_password} onChange={handleChange} placeholder="Enter your password" required />
                    {showConfirmPassword ? (
                        <FaEyeSlash onClick={() => setShowConfirmPassword(false)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' /> 
                    ) : (
                        <FaEye onClick={() => setShowConfirmPassword(true)} size={20} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
                    )}
                </div>
                {registerErrors.confirm_password && (
                    <span className="text-start text-red-500 text-xs mt-1">{registerErrors.confirm_password}</span>
                )}
            </div>

            <div className='flex flex-col'>
                <label className='text-start text-black font-medium'>Business Name *</label>
                <input className='' name="business_name" type='text' value={registerForm.business_name} onChange={handleChange} placeholder="Business Name" required />
            </div>
            
            <div className='flex flex-col'>
                <label className='text-start text-black font-medium'>Phone *</label>
                <input name="phone" type='number' value={registerForm.phone} onChange={handleChange} placeholder="Phone" required />
                {registerErrors.phone && (
                    <span className="text-start text-red-500 text-xs mt-1">{registerErrors.phone}</span>
                )}
            </div>
            {/* <label className='text-start text-black font-medium'>Email *</label>
            <input name="email" type='email' value={registerForm.email} onChange={handleChange} placeholder="Email" required /> */}
            <button type="submit" disabled={isSubmitting} className='mt-4 bg-black text-white'>{isSubmitting ? 'Saving...' : 'Register'}</button>
        </form>
    );
}

export default RegisterForm;
