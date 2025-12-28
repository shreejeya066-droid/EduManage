import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const MainLayout = () => {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
                    <div className="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
