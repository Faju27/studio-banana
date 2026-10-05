import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';


export const WholesalerContext = createContext()

const WholesalerProvider = ({children}) => {

    const [wholesalerList, setWholesalerList] = useState([]);
    const [wholesaler, setWholesaler] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false)
    
    // for admin list view
    const fetchWholesalerList = async () => {
        setActionLoading(true)
        try {
            const res = await api.get('/wholesalers/')
            setWholesalerList(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setActionLoading(false)
        }
    }

    // for admin to hide / approve wholesaler
    const updateWholesalerStatus = async ( id, field, value ) => {     

        setActionLoading(true)
        try {
            await api.patch(`/wholesalers/${id}/`, 
                { [field] : value }
            )
            if (field === 'is_approved') {
                toast.success(`Wholesaler ${value == true ? 'approved' : 'disapproved'} successfully.`)
            } else if (field === 'is_active'){
                toast.success(`Wholesaler ${value == true ? 'activated' : 'deactivated'} successfully.`)
            } else {
                toast.success(`${field} updated successfully.`);
            }
            await fetchWholesalerList()   // refresh the list
            
        } catch (error) {
            console.error(error)
            // toast.error("Update failed. Please try again.");
        } finally {
            setActionLoading(false)
        }
    }




    
    // for current logged wholesaler profile
    const fetchWholesaler = async () => {

        setAuthLoading(true);
        try {
            const res = await api.get('/wholesaler/profile/')
            setWholesaler(res.data.wholesaler)
            setUser(res.data.user)
        } catch (err) {
            console.error(err);
        } finally {
            setAuthLoading(false);
        }
    }

    const editWholesalerField = async (field, newValue, initialValue, inputElement) => {      // initialValue == Current value
        // if (newValue === initialValue) return ;
         // Convert all entries to clean string fragments to prevent bugs
        const cleanNewValue = String(newValue || '').trim();
        const cleanInitialValue = String(initialValue || '').trim();

        // If the field was blank before and is still blank now, stop instantly! (No API request)
        if (cleanNewValue === cleanInitialValue) {
            if (inputElement) {
                inputElement.value = initialValue; 
            }
            return
        } 

        const formatFieldName = (text) => {
            if (!text) return "";
            return text
                .replace(/_/g, ' ')             // Replace underscores with spaces
                .replace(/billing/g, '')                        
                .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of every word
                .replace(/pincode/i, 'PIN Code')           // Quick override for specific words
                .replace(/Gst/i, 'GST')
                .replace(/pan/i, 'PAN');
        };

        // const FIELD_LABELS = {
        //     billing_street: "Street Address",
        //     billing_city: "City",
        //     billing_state: "State",
        //     billing_pincode: "PIN Code",
        //     business_name: "Business Name",
        //     gst_number: "GSTIN Number"
        // };

        // Prevent clearing fields if they were already filled out before
        if (cleanInitialValue !== '' && cleanNewValue === '') {
        // if (initialValue && newValue.trim() === '') {
            // toast(`${FIELD_LABELS[field] || field} cannot be left blank.`, { icon: '⚠️' });
            toast(`${formatFieldName(field)} cannot be left blank.`, { icon: '⚠️' });
            
            if (inputElement) {
                inputElement.value = initialValue || '';
            }
            return;
        }

        if (field === 'phone') {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(cleanNewValue)) {
                toast('Phone number must be exactly 10 digits.', {icon : '⚠️' });
                if (inputElement) {
                    inputElement.value = initialValue; 
                }
                return;
            }
        }

        if (field === 'billing_pincode') {        
            const pincodeRegex = /^\d{6}$/;
            if (!pincodeRegex.test(cleanNewValue)) {
                toast( "PIN code must be exactly 6 digits.", { icon: '⚠️' });

                if (inputElement) {
                    inputElement.value = initialValue; 
                }
                return;
            }
        }

        setActionLoading(true)
        try {
            await api.patch('/wholesaler/profile/', {
                [field]: cleanNewValue === '' ? null : cleanNewValue,
            });

            
            // if (window.location.pathname !== '/checkout') {
                toast.success(`${formatFieldName(field)} updated successfully!`);
            // }

            await fetchWholesaler();  // for refresh values

        } catch (err) {
            console.error("Update failed:", err.response?.data);
            
            if (err.response && err.response.data) {
                const serverErrors = err.response.data;

                // If the server sent a specific error message for this field (e.g., phone: [...])
                if (serverErrors[field]) {
                    const backendMessage = serverErrors[field];
                    toast(Array.isArray(backendMessage) ? backendMessage[0] : backendMessage, { icon: '⚠️' });
                } 
                // Fallback if the error dictionary contains general system keys
                else if (serverErrors.error) {
                    toast(serverErrors.error, { icon: '⚠️' });
                } 
                else {
                    toast.error(`Failed to update ${formatFieldName(field)}.`);
                }
            } else {
                toast.error(`Unable to reach the server. Please try again later.`);  
            }

            if (inputElement) inputElement.value = initialValue || '';

        } finally {
            setActionLoading(false)
        }
    };


    


    return (
        <WholesalerContext.Provider value={{ wholesalerList, fetchWholesalerList, updateWholesalerStatus, wholesaler, user, fetchWholesaler, authLoading, editWholesalerField}}>
            {children}
        </WholesalerContext.Provider>
    );
}

export default WholesalerProvider;
