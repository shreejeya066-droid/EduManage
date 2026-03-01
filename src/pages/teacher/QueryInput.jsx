import eduIcon from '../../assets/edu-icon.png';
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Send, Sparkles, User, Briefcase, GraduationCap, Code } from 'lucide-react';

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
            setResponse({ error: true, message: "Server error processing query. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 pb-12">
            {/* Header Section */}
            <div className="text-center space-y-4 pt-6">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-2">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900">
                    Smart AI Student Search
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Type naturally to find exactly who you need. The AI understands complex queries.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
                    <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 shadow-sm animate-pulse-slow cursor-pointer hover:bg-indigo-50" onClick={() => setQuery("CSE students with CGPA above 8")}>"CSE students with CGPA above 8"</span>
                    <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 shadow-sm cursor-pointer hover:bg-indigo-50" onClick={() => setQuery("Placement ready knowing Python")}>"Placement ready knowing Python"</span>
                    <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 shadow-sm cursor-pointer hover:bg-indigo-50" onClick={() => setQuery("IT students planning higher studies")}>"IT students for higher studies"</span>
                </div>
            </div>

            {/* Search Input Card */}
            <Card className="p-2 bg-white/60 backdrop-blur-xl border-white/50 shadow-2xl relative overflow-hidden group rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <form onSubmit={handleQuery} className="relative flex items-center bg-white rounded-2xl p-2 shadow-inner border border-gray-100">
                    <Input
                        placeholder="Ask me anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6 px-6 bg-transparent placeholder:text-gray-400 font-medium"
                    />
                    <Button
                        type="submit"
                        disabled={loading || !query}
                        className="h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-300 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Analyzing...</span>
                            </span>
                        ) : (
                            <span className="flex items-center text-lg font-semibold tracking-wide">
                                Search <Send className="ml-2 h-5 w-5" />
                            </span>
                        )}
                    </Button>
                </form>
            </Card>

            {/* Results Section */}
            {response && !response.error && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-100 rounded-xl">
                                <img src={eduIcon} alt="AI" className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold border-b-2 border-indigo-500 inline-block pb-1">Search Results</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Filters applied: <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{response.meta.extracted_keyword}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-medium whitespace-nowrap">
                            <span className="text-indigo-600 text-xl font-bold">{response.meta.count}</span> Students Found
                        </div>
                    </div>

                    {response.data && response.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {response.data.map((student, idx) => {
                                const name = student.firstName ? `${student.firstName} ${student.lastName}` : student.rollNumber;
                                const isCgpaQuery = response.meta.extracted_intent && response.meta.extracted_intent.minCgpa !== undefined;

                                return (
                                    <Card
                                        key={student._id || idx}
                                        className="group bg-white/90 backdrop-blur-sm border-gray-100 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 block"
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg shadow-inner ring-2 ring-white">
                                                        {name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-700 transition-colors">{name}</h4>
                                                        <p className="text-sm font-medium text-gray-500">{student.rollNumber}</p>
                                                    </div>
                                                </div>
                                                {student.cgpa && (
                                                    <div className="text-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                                        <span className="block font-black text-green-700 text-lg">{student.cgpa}</span>
                                                        <span className="block text-[10px] uppercase font-bold text-green-600 tracking-wider">CGPA</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-4 px-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <GraduationCap className="h-4 w-4 text-indigo-400" />
                                                    <span className="font-medium truncate">{student.department || 'N/A Dept'}</span>
                                                </div>
                                                {student.placementWillingness && student.placementWillingness.toLowerCase().includes('yes') && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Briefcase className="h-4 w-4 text-amber-500" />
                                                        <span className="font-medium text-amber-700">Placement Ready</span>
                                                    </div>
                                                )}
                                                {student.higherStudies && student.higherStudies.toLowerCase().includes('yes') && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium text-blue-700">Higher Studies</span>
                                                    </div>
                                                )}
                                                {student.technicalSkills && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2 mt-1">
                                                        <Code className="h-4 w-4 text-purple-400 shrink-0" />
                                                        <span className="truncate text-xs text-gray-500 tracking-wide">{student.technicalSkills}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Semester Wise Breakdown for CGPA Queries */}
                                            {isCgpaQuery && (
                                                <div className="mt-5 pt-4 border-t border-gray-100/80 bg-gray-50/50 -mx-5 -mb-5 px-5 pb-5">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Semester History</p>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                                                            const sgpa = student[`sem${sem}_cgpa`];
                                                            if (!sgpa) return null;
                                                            return (
                                                                <div key={sem} className="bg-white rounded-md p-1.5 shadow-sm border border-gray-100 text-center hover:scale-105 transition-transform cursor-default">
                                                                    <div className="text-[10px] font-bold text-indigo-400">S{sem}</div>
                                                                    <div className="text-xs font-black text-gray-800">{sgpa}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center animate-in fade-in">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-10 w-10 text-indigo-300" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">No exactly matching students</h4>
                            <p className="text-gray-500">We couldn't find any student profile that perfectly matches your query.</p>
                            <p className="text-sm text-indigo-400 mt-2">Try broadening your search terms like "CSE", "Python", or "CGPA above 7.0"</p>
                        </div>
                    )}
                </div>
            )}

            {response && response.error && (
                <div className="p-6 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-center font-medium shadow-sm animate-in slide-in-from-top-4">
                    {response.message}
                </div>
            )}
        </div>
    );
};
