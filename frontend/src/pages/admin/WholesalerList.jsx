import React, { Fragment, useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { useWholesaler } from '../../hooks/useWholesaler';
import { MdDelete, MdEdit } from 'react-icons/md';

const WholesalerList = () => {

    const { fetchWholesalerList, wholesalerList, updateWholesalerStatus } = useWholesaler();

    const [isEditable, setIsEditable] = useState(false);
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        fetchWholesalerList();
    }, []);

    const handleEditClick = (id) => {
        // Toggle row visibility: close if clicked again, otherwise open the clicked row
        setEditingId(editingId === id ? null : id);
    };

    if (!wholesalerList) return <Loader />;


    return (
        <Fragment>
            <section className='flex items-center py-4'>
                <h2 className='font-medium text-xl sm:text-2xl text-emerald-800!'>User List</h2>
            </section>

            <section className='space-y-4'>
                <div className='w-full bg-white rounded-lg p-4'>
                    <h2 className='section-title'>Approved Users</h2>
                    <div className='overflow-x-scroll xl:overflow-hidden' >
                        <table className='w-full text-xs sm:text-sm text-left text-gray-700'>
                            <thead className="uppercase text-gray-400 ">
                                <tr className='border-b border-emerald-900'>
                                    <th className="py-2 sm:py-4 px-2">Name</th>
                                    <th className="py-2 sm:py-4 px-2">Email</th>
                                    <th className="py-2 sm:py-4 px-2">Phone</th>
                                    <th className="py-2 sm:py-4 px-2">GST No</th>
                                    <th className="py-2 sm:py-4 px-2">Status</th>
                                    <th className="py-2 sm:py-4 px-2">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wholesalerList.filter(w => w.is_approved === true && w.is_active === true).map(w => {
                                    const isEditing = editingId === w.id;
                                    return (
                                        <React.Fragment key={w.id} >
                                            <tr className={`hover:bg-gray-100 transition-colors ${isEditing ? 'bg-gray-50' : '' }`}>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-48">{w.business_name} </td>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-44">{w.email || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-20 sm:min-w-28">{w.phone}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-26 sm:min-w-32">{w.gst_number || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2">
                                                    {w.is_approved === true ? 
                                                    <p className='bg-green-100 text-green-500 text-center w-20 sm:w-28'>Approved</p>
                                                    :
                                                    <p className='bg-amber-100 text-center w-20 sm:w-28 text-amber-800'>Not Approved</p>
                                                    }
                                                </td>
                                                <td className="py-2 sm:py-4 px-2 flex">
                                                    <div onClick={() => handleEditClick(w.id)} className='bg-gray-200 rounded-lg p-2'>
                                                        <MdEdit className='w-4 sm:w-5 h-4 sm:h-5'/>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isEditing &&  (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={6} className="py-2 sm:py-4 px-2">
                                                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">                                                    
                                                            <div className="flex-1">
                                                                <h4 className="text-xs font-semibold uppercase mb-1">Registered Address</h4>
                                                                <p>
                                                                    {[w.billing_street, w.billing_city, w.billing_state, w.billing_pincode]
                                                                    .filter(Boolean)
                                                                    .join(', ') || 'No address provided.'}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                                <button 
                                                                    onClick={() => updateWholesalerStatus(w.id, 'is_approved', false)}
                                                                    className="text-white bg-red-500"
                                                                >
                                                                    Disapprove
                                                                </button>
                                                                
                                                                {/* <button 
                                                                    onClick={() => updateWholesalerStatus(w.id, 'is_active', false)}
                                                                    className="flex items-center gap-1 text-white bg-red-600"
                                                                >
                                                                    <MdDelete size={16}/> Delete
                                                                </button> */}
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )}
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className='w-full bg-white rounded-lg p-4'>
                    <h2 className='section-title'>Approval Pending</h2>
                    <div className='overflow-x-scroll xl:overflow-hidden' >
                        <table className='w-full text-xs sm:text-sm text-left text-gray-700'>
                            <thead className="uppercase text-gray-400 ">
                                <tr className='border-b border-emerald-900'>
                                    <th className="py-2 sm:py-4 px-2">Name</th>
                                    <th className="py-2 sm:py-4 px-2">Email</th>
                                    <th className="py-2 sm:py-4 px-2">Phone</th>
                                    <th className="py-2 sm:py-4 px-2">GST No</th>
                                    <th className="py-2 sm:py-4 px-2">Status</th>
                                    <th className="py-2 sm:py-4 px-2">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wholesalerList.filter(w => w.is_approved === false && w.is_active === true).map(w => {
                                    const isEditing = editingId === w.id;
                                    return (
                                        <React.Fragment key={w.id} >
                                            <tr className={`hover:bg-gray-100 transition-colors ${isEditing ? 'bg-gray-50' : '' }`}>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-48">{w.business_name} </td>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-44">{w.email || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-20 sm:min-w-28">{w.phone}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-26 sm:min-w-32">{w.gst_number || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2">
                                                    {w.is_approved === true ? 
                                                    <p className='bg-green-100 text-green-500 text-center w-20 sm:w-28'>Approved</p>
                                                    :
                                                    <p className='bg-amber-100 text-center w-20 sm:w-28 text-amber-500'>Not Approved</p>
                                                    }
                                                </td>
                                                <td className="py-2 sm:py-4 px-2 flex">
                                                    <div onClick={() => handleEditClick(w.id)} className='bg-gray-200 rounded-lg p-2'>
                                                        <MdEdit className='w-4 sm:w-5 h-4 sm:h-5'/>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isEditing &&  (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={6} className="py-2 sm:py-4 px-2">
                                                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">                                                    
                                                            <div className="flex-1">
                                                                <h4 className="text-xs font-semibold uppercase mb-1">Registered Address</h4>
                                                                <p>
                                                                    {[w.billing_street, w.billing_city, w.billing_state, w.billing_pincode]
                                                                    .filter(Boolean)
                                                                    .join(', ') || 'No address provided.'}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                                <button 
                                                                    onClick={() => updateWholesalerStatus(w.id, 'is_approved', true)}
                                                                    className="btn-primary"
                                                                >
                                                                    Approve
                                                                </button>
                                                                
                                                                <button 
                                                                    onClick={() => updateWholesalerStatus(w.id, 'is_active', false)}
                                                                    className="flex items-center gap-1 text-white bg-red-600"
                                                                >
                                                                    <MdDelete size={16}/> Delete
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )}
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className='w-full bg-gray-100 rounded-lg p-4'>
                    <h2 className='section-title'>Deleted / Inactive Users</h2>
                    <div className='overflow-x-scroll xl:overflow-hidden' >
                        <table className='w-full text-xs sm:text-sm text-left text-gray-700'>
                            <thead className="uppercase text-gray-400 ">
                                <tr className='border-b border-emerald-900'>
                                    <th className="py-2 sm:py-4 px-2">Name</th>
                                    <th className="py-2 sm:py-4 px-2">Email</th>
                                    <th className="py-2 sm:py-4 px-2">Phone</th>
                                    <th className="py-2 sm:py-4 px-2">GST No</th>
                                    <th className="py-2 sm:py-4 px-2">Status</th>
                                    <th className="py-2 sm:py-4 px-2">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wholesalerList.filter(w => w.is_active === false).map(w => {
                                    const isEditing = editingId === w.id;
                                    return (
                                        <React.Fragment key={w.id} >
                                            <tr className={`hover:bg-gray-100 transition-colors ${isEditing ? 'bg-gray-50' : '' }`}>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-48">{w.business_name} </td>
                                                <td className="py-2 sm:py-4 px-2 min-w-40 sm:min-w-44">{w.email || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-20 sm:min-w-28">{w.phone}</td>
                                                <td className="py-2 sm:py-4 px-2 min-w-26 sm:min-w-32">{w.gst_number || '-'}</td>
                                                <td className="py-2 sm:py-4 px-2">
                                                    {w.is_active === true ? 
                                                    <p className='bg-green-100 text-green-500 text-center w-20 sm:w-28'>Active</p>
                                                    :
                                                    <p className='bg-red-100 text-center w-20 sm:w-28 text-red-600'>Inactive</p>
                                                    }
                                                </td>
                                                <td className="py-2 sm:py-4 px-2 flex">
                                                    <div onClick={() => handleEditClick(w.id)} className='bg-gray-200 rounded-lg p-2'>
                                                        <MdEdit className='w-4 sm:w-5 h-4 sm:h-5'/>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isEditing &&  (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={6} className="py-2 sm:py-4 px-2">
                                                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">                                                    
                                                            <div className="flex-1">
                                                                <h4 className="text-xs font-semibold uppercase mb-1">Registered Address</h4>
                                                                <p>
                                                                    {[w.billing_street, w.billing_city, w.billing_state, w.billing_pincode]
                                                                    .filter(Boolean)
                                                                    .join(', ') || 'No address provided.'}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 self-end md:self-center">
                                                                <button 
                                                                    onClick={() => updateWholesalerStatus(w.id, 'is_active', true)}
                                                                    className="btn-primary"
                                                                >
                                                                    Set Active
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )}
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </section>
        </Fragment>
    );
}

export default WholesalerList;
