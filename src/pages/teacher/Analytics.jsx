import React from 'react';
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
import { ANALYTICS_DATA } from '../../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card title="Subject Performance Comparison" description="Average scores across key subjects">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={ANALYTICS_DATA.performance}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" fill="#8884d8" />
                                <Bar dataKey="Physics" fill="#82ca9d" />
                                <Bar dataKey="English" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Attendance Distribution" description="Breakdown of student attendance levels">
                    <div className="h-[300px] w-full mt-4 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ANALYTICS_DATA.attendanceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {ANALYTICS_DATA.attendanceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Performance Trends (Mock)" description="Mock trend analysis over semesters">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={[
                                { name: 'Sem 1', avg: 75 },
                                { name: 'Sem 2', avg: 78 },
                                { name: 'Sem 3', avg: 76 },
                                { name: 'Sem 4', avg: 82 },
                                { name: 'Sem 5', avg: 85 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="avg" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
