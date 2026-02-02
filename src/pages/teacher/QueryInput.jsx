import eduIcon from '../../assets/edu-icon.png';
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Send } from 'lucide-react';

export const QueryInput = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResponse(null);
        try {
            const { naturalLanguageQuery } = await import('../../services/api');
            const result = await naturalLanguageQuery(query);
            setResponse(result);
        } catch (error) {
            console.error("Query failed", error);
            setResponse({ error: true, message: "Failed to process query. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analysis Query</h2>
                <p className="text-gray-500">Ask questions like "Who knows Python?", "Ready for placement", "Planning higher studies", or "CGPA above 8.0"</p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleQuery} className="flex gap-4">
                    <Input
                        placeholder="e.g., 'Show me students interested in Coding'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={loading || !query}>
                        {loading ? 'Analyzing...' : <><Send className="mr-2 h-4 w-4" /> search</>}
                    </Button>
                </form>
            </Card>

            {response && !response.error && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-indigo-100 bg-indigo-50/50 p-6">
                        <div className="flex gap-4 mb-4">
                            <div className="mt-1 shrink-0">
                                <img src={eduIcon} alt="Analysis Result" className="h-12 w-12" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-indigo-900">Analysis Result</h4>
                                <p className="text-sm text-indigo-700">
                                    Found <strong>{response.meta.count}</strong> students matching "<strong>{response.meta.extracted_keyword}</strong>"
                                </p>
                            </div>
                        </div>

                        {response.data && response.data.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {response.data.map((student) => {
                                    const name = student.firstName ? `${student.firstName} ${student.lastName}` : student.rollNumber;
                                    const isCgpaQuery = response.meta.extracted_intent && response.meta.extracted_intent.type === 'cgpa';

                                    return (
                                        <div key={student._id} className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900">{name}</p>
                                                    <p className="text-xs text-gray-500">{student.rollNumber}</p>
                                                    <p className="text-xs text-indigo-600 mt-1 font-medium">{student.department}</p>
                                                </div>
                                                {student.cgpa && (
                                                    <div className="text-right">
                                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                            {student.cgpa}
                                                        </span>
                                                        <p className="text-[10px] text-gray-400 mt-1">CGPA</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Semester Wise Breakdown for CGPA Queries */}
                                            {isCgpaQuery && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-700 mb-2">Semester Performance:</p>
                                                    <div className="grid grid-cols-4 gap-2 text-center">
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                                                            const sgpa = student[`sem${sem}_cgpa`];
                                                            if (!sgpa) return null;
                                                            return (
                                                                <div key={sem} className="bg-gray-50 rounded p-1">
                                                                    <div className="text-[10px] text-gray-500">S{sem}</div>
                                                                    <div className="text-xs font-bold text-gray-800">{sgpa}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    {!Object.keys(student).some(k => k.match(/sem\d_cgpa/)) && (
                                                        <p className="text-xs text-gray-400 italic">No semester records found.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 bg-white rounded-lg border border-indigo-100 text-sm text-gray-500 italic text-center">
                                No matching students found for this interest.
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {response && response.error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 text-center">
                    {response.message}
                </div>
            )}
        </div>
    );
};
