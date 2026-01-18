import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics = () => {
    const [data, setData] = useState({ performance: [], attendanceDistribution: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { fetchAnalytics } = await import('../../services/api');
                const result = await fetchAnalytics();
                setData(result);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card title="Department Performance" description="Average CGPA by Department">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.performance}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
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
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
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

            {/* 
            <Card title="Performance Trends (Mock)" description="Mock trend analysis over semesters">
               ... Removed Mock Trend until we have real historical data ...
            </Card> 
            */}
        </div>
    );
};
