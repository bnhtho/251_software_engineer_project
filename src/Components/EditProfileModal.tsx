import React, { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
// NOTE: createRoot is typically used in index.tsx, not the component file, 
// but is kept here to match the structure of the original JSX file's imports.
import { createRoot } from 'react-dom/client';
import { User, UserPen } from 'lucide-react';
// import Info from './ProfileCard';
import InfoForm from './InfoForm';

const App: React.FC = (): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Functions to manage modal state.
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

// Load content modal as component [x]
    const formSubmit =() =>  {

        alert("Người dùng submit ");
        // closeModal()
    }
    // Tailwind CSS Utility Classes

    return (
        <div className=" ">
            {/* --- Open Modal Button --- */}
            <button 
                onClick={openModal} 
                className="bg-[#0E7AA0] text-white px-4 py-2 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors" 
                type="button"
            >
                <UserPen className="inline-block mr-2 h-5 w-5" />
                Cập nhật thông tin
            </button>

            {/* --- Modal Overlay and Content --- */}
            {isModalOpen && (
                <div 
                    id="edit-profile-modal" 
                    aria-modal="true" 
                    role="dialog"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-black/40"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (e.target instanceof HTMLDivElement && e.target.id === 'edit-profile-modal') {
                            closeModal();
                        }
                    }}
                >
                    {/* inside modal */}
                    <div className="relative w-full max-w-2xl max-h-full">
                        {/* Modal Content Card */}
                        <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-5">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Edit Profile Information
                                </h3>
                                <button 
                                    type="button" 
                                    className="text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors" 
                                    onClick={closeModal}
                                >
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            
                            {/* Modal Body (Content) */}
                            
                            {/* Commponent */}
                            {/* Infoform */}
                            <div className='p-10'>
                            <InfoForm isEditable ={true}></InfoForm>
                            </div>
                            {/* Modal Footer (Actions) */}
                            <div className="flex items-center border-t border-gray-200 p-5 space-x-4">
                                <button 
                                    onClick={formSubmit} 
                                    type="button" 
                                    className="text-white bg-[#0E7AA0] box-border border border-transparent hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-300 shadow-sm font-medium leading-5 rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
                                >
                                    Save Changes
                                </button>
                                {/* Secondary Cancel Button */}
                                <button 
                                    onClick={closeModal} 
                                    type="button" 
                                    className="text-gray-500 bg-white hover:bg-gray-100 box-border border border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 shadow-sm font-medium leading-5 rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;