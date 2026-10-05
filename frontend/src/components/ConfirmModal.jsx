import React from 'react';

const ConfirmModal = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel,}) => {

    if(!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/25">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md p-6 border border-emerald-800">

                {/* Title */}
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-sm lg:text-base text-gray-600 mt-3">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6 text-sm sm:text-base">

                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white"
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>  
    );
}

export default ConfirmModal;
