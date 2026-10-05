import React, { Fragment, useEffect, useState } from 'react';
import { useWholesaler } from '../../hooks/useWholesaler';
import StaggerContainer, { StaggerItem } from '../../animations/StaggerContainer';
import { useAuth } from '../../hooks/useAuth';

const ManageAddress = () => {

    const {accessToken} = useAuth();
    const { fetchWholesaler, wholesaler, editWholesalerField, authLoading} = useWholesaler();
        
    const [isEditable, setIsEditable] = useState(false);


    useEffect(() => {
        if (accessToken) {
            fetchWholesaler();
        }
    }, [accessToken]);

    if (authLoading) return <p className='px-4'>Loading Address...</p>;
    if (!wholesaler) return <p>Profile not found</p>

    return (
        <Fragment>
            {wholesaler && (
                <StaggerContainer className='space-y-3 px-4 text-sm md:text-base'>
                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>Street *</label>
                        <input type='text' placeholder='Shop/Plot No., Building, Street' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.billing_street} 
                            onBlur={(e) => editWholesalerField('billing_street', e.target.value, wholesaler.billing_street, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>
                    
                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>City *</label>
                        <input type='text' placeholder='Enter City' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.billing_city}
                            onBlur={(e) => editWholesalerField('billing_city', e.target.value, wholesaler.billing_city, e.target)}
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>State *</label>
                        <input type='text' placeholder='Enter State' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.billing_state}
                            onBlur={(e) => editWholesalerField('billing_state', e.target.value, wholesaler.billing_state, e.target)} 
                            className={`w-full border p-4! border-gray-300! rounded-none! ${!isEditable ? 'bg-gray-100!' : 'bg-white!' } `} />
                    </StaggerItem>

                    <StaggerItem className='flex flex-col'>
                        <label className='text-black font-semibold mb-1'>PIN code *</label>
                        <input type='text' placeholder='Enter 6-digit PIN code' 
                            disabled={!isEditable} 
                            defaultValue={wholesaler.billing_pincode}
                            onBlur={(e) => editWholesalerField('billing_pincode', e.target.value, wholesaler.billing_pincode, e.target)}
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

export default ManageAddress;
