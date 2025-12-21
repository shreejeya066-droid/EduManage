import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({
    label,
    error,
    className,
    type = 'text',
    suffix,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    ref={ref}
                    className={twMerge(
                        clsx(
                            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
                            suffix && 'pr-10',
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )
                    )}
                    {...props}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {suffix}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
