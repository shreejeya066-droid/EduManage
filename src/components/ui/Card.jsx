import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, title, description, ...props }) => {
    return (
        <div
            className={twMerge('rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm', className)}
            {...props}
        >
            {(title || description) && (
                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                    {title && <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>
            )}
            <div className="p-6 pt-0">
                {children}
            </div>
        </div>
    );
};
