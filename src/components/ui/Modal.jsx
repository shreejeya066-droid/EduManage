import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
            <div
                ref={modalRef}
                className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                            {title && (
                                <h3
                                    className="text-base font-semibold leading-6 text-gray-900 mb-4"
                                    id="modal-title"
                                >
                                    {title}
                                </h3>
                            )}
                            <div className="mt-2 w-full">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
                {(footer || onClose) && (
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        {footer}
                        {!footer && (
                            <Button onClick={onClose} variant="outline" className="mt-3 sm:mt-0 sm:w-auto">
                                Close
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
