import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics = () => {
    const { user } = useAuth();
    const [data, setData] = useState({ performance: [], attendanceDistribution: [] });
    const [loading, setLoading] = useState(true);

    // --- Power BI Configuration ---
    // PASTE YOUR POWER BI EMBED URL HERE
    // Ensure it is a valid "Publish to Web" or "Website or Portal" link.
    const POWER_BI_EMBED_URL = "https://app.powerbi.com/reportEmbed?reportId=00000000-0000-0000-0000-000000000000&autoAuth=true&ctid=00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        const loadData = async () => {
            try {
                const { fetchAnalytics } = await import('../../services/api');
                const result = await fetchAnalytics();
                setData(result);
            } catch (error) {
                console.error("Failed to load internal analytics", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Access Control Fallback
    if (user && user.role !== 'teacher') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Access Denied</h3>
                    <p>You do not have permission to view the Teacher Analysis Dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Teacher Analysis Dashboard</h2>
                <p className="text-gray-500">Live academic performance data and insights.</p>
            </div>

            {/* Power BI Embed Section */}
            <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-gray-200">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 19h4v-7H4v7zm6 0h4V9h-4v10zm6 0h4v-3h-4v3zM4 5v2h16V5H4z" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Live Power BI Report</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-white border px-2 py-1 rounded">
                        Live Data
                    </span>
                </div>

                {/* Responsive Iframe Container */}
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-gray-100">
                    {POWER_BI_EMBED_URL.includes('0000') ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <p className="mb-2 font-medium">Power BI Configuration Required</p>
                            <p className="text-sm">Please update <code>POWER_BI_EMBED_URL</code> in code with your dashboard link.</p>
                        </div>
                    ) : (
                        <iframe
                            title="Teacher Analytics Dashboard"
                            width="100%"
                            height="100%"
                            src={POWER_BI_EMBED_URL}
                            frameBorder="0"
                            allowFullScreen={true}
                            className="block"
                        />
                    )}
                </div>
            </Card>

            <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </span>
                    Internal System Metrics
                </h3>

                {loading ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-lg border">Loading internal metrics...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card title="Department Performance" description="Average CGPA by Department">
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.performance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="avgCGPA" name="Avg CGPA (x10)" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Attendance Distribution" description="Breakdown of student attendance levels">
                            <div className="h-[300px] w-full mt-4 flex justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.attendanceDistribution}
                                            cx="50%" cy="50%" labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100} fill="#8884d8" dataKey="value"
                                        >
                                            {data.attendanceDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};
