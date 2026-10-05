import React, { Fragment, useEffect, useState } from 'react';
import { useWholesaler } from '../../hooks/useWholesaler';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { useAuth } from '../../hooks/useAuth';

const BusinessProfile = () => {

    const { fetchWholesaler, wholesaler, editWholesalerField, authLoading} = useWholesaler();
    const {accessToken} = useAuth();
    
    const [isEditable, setIsEditable] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (accessToken) {
            fetchWholesaler();
        }
    }, [accessToken]);

    if (authLoading) return <p className='px-4'>Loading Profile...</p>;
    if (!wholesaler) return <p>Profile not found</p>

    return (
        <Fragment>
            {wholesaler && (
                <StaggerContainer className='space-y-3 px-4 text-sm md:text-base'>
                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>Userame *</label>
                        <input disabled defaultValue={user?.username}  
                            className={`w-full border p-4! border-gray-300! rounded-none! bg-gray-100`} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>Business Name *</label>
                        <input type='text' placeholder='Enter Business Name' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.business_name}  
                            onBlur={(e) => editWholesalerField('business_name', e.target.value, wholesaler.business_name, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>Email *</label>
                        <input type='email' placeholder='Enter Email' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.email}  
                            onBlur={(e) => editWholesalerField('email', e.target.value, wholesaler.email, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>GST Number *</label>
                        <input type='text' placeholder='Enter GST Number' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.gst_number}  
                            onBlur={(e) => editWholesalerField('gst_number', e.target.value, wholesaler.gst_number, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>PAN *</label>
                        <input type='text' placeholder='Enter PAN' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.pan}  
                            onBlur={(e) => editWholesalerField('pan', e.target.value, wholesaler.pan, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>Phone *</label>
                        <input type='number' placeholder='Enter Phone' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.phone}  
                            onBlur={(e) => editWholesalerField('phone', e.target.value, wholesaler.phone, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem>
                        {/* {!isEditable && */}
                            <button onClick={() => setIsEditable(!isEditable)} 
                                className='btn-primary mt-4 rounded-none!'>
                                {isEditable ? 'Finish Editing' : 'Update Changes'}
                            </button>
                        {/* } */}
                    </StaggerItem>
                </StaggerContainer>
            )}
        </Fragment>
    );
}

export default BusinessProfile;
