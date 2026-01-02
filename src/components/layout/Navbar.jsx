import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-gray-50/40 px-6 lg:h-[60px]">
            <button
                onClick={onMenuClick}
                className="inline-flex items-center justify-center rounded-md text-gray-700 md:hidden hover:text-indigo-600 focus:outline-none"
            >
                <Menu className="h-6 w-6" />
            </button>
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold text-gray-900">
                    Welcome, {user?.name}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    {user?.name?.[0]}
                </div>
            </div>
        </header>
    );
};
