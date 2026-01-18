import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Send, Bot } from 'lucide-react';

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
                <p className="text-gray-500">Ask questions like "Show me students interested in Drawing"</p>
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
                        {loading ? 'Analyzing...' : <><Send className="mr-2 h-4 w-4" /> Ask AI</>}
                    </Button>
                </form>
            </Card>

            {response && !response.error && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-indigo-100 bg-indigo-50/50 p-6">
                        <div className="flex gap-4 mb-4">
                            <div className="mt-1 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-indigo-900">Analysis Result</h4>
                                <p className="text-sm text-indigo-700">
                                    Found <strong>{response.meta.count}</strong> students interested in "<strong>{response.meta.extracted_keyword}</strong>"
                                </p>
                            </div>
                        </div>

                        {response.data && response.data.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {response.data.map((student) => {
                                    const name = student.firstName ? `${student.firstName} ${student.lastName}` : student.rollNumber;
                                    return (
                                        <div key={student._id} className="bg-white p-3 rounded-lg border shadow-sm">
                                            <p className="font-bold text-gray-900">{name}</p>
                                            <p className="text-xs text-gray-500">{student.rollNumber}</p>
                                            <p className="text-xs text-indigo-600 mt-1 font-medium">{student.department}</p>
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
