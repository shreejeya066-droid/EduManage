import React from 'react';
import { Card } from '../../components/ui/Card';
import { Bell, Clock, FileText } from 'lucide-react';

export const Notifications = () => {
    // Mock Notifications
    const notifications = [
        {
            id: 1,
            studentName: 'Alice Johnson',
            studentId: '23BIT05',
            type: 'Profile Edit Request',
            timestamp: '2 hours ago',
            status: 'Pending Admin Approval',
            message: 'Requested a change in contact details.'
        },
        {
            id: 2,
            studentName: 'Bob Smith',
            studentId: '23BIT12',
            type: 'Academic Update',
            timestamp: '1 day ago',
            status: 'Approved',
            message: 'Semester 3 marks have been updated by Admin.'
        },
        {
            id: 3,
            studentName: 'Charlie Brown',
            studentId: '22BIT45',
            type: 'Profile Edit Request',
            timestamp: '2 days ago',
            status: 'Rejected',
            message: 'Address update request rejected due to insufficient proof.'
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <div className="grid gap-4">
                {notifications.map((notif) => (
                    <Card key={notif.id} className="transition-all hover:bg-gray-50 flex flex-row items-center p-4">
                        <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            {notif.type.includes('Profile') ? <FileText className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">
                                    {notif.studentName} <span className="text-gray-500 text-sm">({notif.studentId})</span>
                                </p>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {notif.timestamp}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${notif.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        notif.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {notif.status}
                                </span>
                                <span className="text-xs text-gray-400">• {notif.type}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
