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

    // --- Manual Hybrid Filters ---
    const [filters, setFilters] = useState({
        year: 'All',
        cgpa: 'All',
        placement: 'All',
        skill: 'All'
    });

    // --- Auto Sync Logic ---
    const syncFiltersFromText = (text) => {
        const lower = text.toLowerCase();
        const newFilters = { ...filters };

        // 1. Year Sync
        const yearMatch = lower.match(/(1st|2nd|3rd|4th|first|second|third|fourth)\s*year/);
        if (yearMatch) {
            const val = yearMatch[1];
            if (val.startsWith('1') || val.startsWith('fir')) newFilters.year = '1';
            else if (val.startsWith('2') || val.startsWith('sec')) newFilters.year = '2';
            else if (val.startsWith('3') || val.startsWith('thi')) newFilters.year = '3';
            else if (val.startsWith('4') || val.startsWith('fou')) newFilters.year = '4';
        }

        // 2. CGPA Sync
        const cgpaMatch = lower.match(/(?:above|more than|>|greater than)\s*(\d+(\.\d+)?)/);
        if (cgpaMatch) {
            const val = parseFloat(cgpaMatch[1]);
            if (val >= 8) newFilters.cgpa = '>8';
            else if (val >= 7) newFilters.cgpa = '>7';
            else if (val >= 6) newFilters.cgpa = '>6';
        }

        // 3. Placement Sync
        if (lower.includes('not interested') || lower.includes('not willing')) newFilters.placement = 'Not Interested';
        else if (lower.includes('interested') || lower.includes('willing') || lower.includes('ready')) newFilters.placement = 'Interested';

        // 4. Skills Sync
        const skills = ['python', 'java', 'coding', 'quiz', 'web development'];
        for (const s of skills) {
            if (lower.includes(s)) {
                newFilters.skill = s.charAt(0).toUpperCase() + s.slice(1);
                break;
            }
        }

        setFilters(newFilters);
    };

    const handleQueryChange = (e) => {
        const text = e.target.value;
        setQuery(text);
        syncFiltersFromText(text);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        // Could also update query text here if needed, but requirements say manual 
        // selection overrides NLP detection conceptually in the request.
    };

    const clearAll = () => {
        setQuery('');
        setFilters({ year: 'All', cgpa: 'All', placement: 'All', skill: 'All' });
        setResponse(null);
    };

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResponse(null);
        try {
            const { naturalLanguageQuery } = await import('../../services/api');
            // We pass filters as a secondary source if needed, 
            // but the backend NLP is already robust. 
            // For now, we still rely on the 'query' text which is synced.
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
                    Smart Student Search
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
                    Search and filter in one unified dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs font-semibold">
                    <span className="px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-indigo-600 shadow-sm cursor-pointer hover:bg-indigo-50 hover:scale-105 transition-transform" onClick={() => { setQuery("2nd year students with CGPA above 8"); syncFiltersFromText("2nd year students with CGPA above 8"); }}>"2nd year students above 8"</span>
                    <span className="px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-indigo-600 shadow-sm cursor-pointer hover:bg-indigo-50 hover:scale-105 transition-transform" onClick={() => { setQuery("Placement ready knowing Python"); syncFiltersFromText("Placement ready knowing Python"); }}>"Placement ready Python"</span>
                </div>
            </div>

            {/* Smart Search Container */}
            <div className="space-y-4">
                {/* Search Input Card */}
                <Card className="p-2 bg-white/60 backdrop-blur-xl border-white/50 shadow-2xl relative overflow-hidden group rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <form onSubmit={handleQuery} className="relative flex items-center bg-white rounded-2xl p-2 shadow-inner border border-gray-100">
                        <Input
                            placeholder="Ask me anything..."
                            value={query}
                            onChange={handleQueryChange}
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
                                    <span>Analysing...</span>
                                </span>
                            ) : (
                                <span className="flex items-center text-lg font-semibold tracking-wide">
                                    Search <Send className="ml-2 h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-3 px-2 justify-center">
                    {/* Year Dropdown */}
                    <div className="space-y-1">
                        <select 
                            className="h-11 rounded-full px-5 border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-300 transition-colors cursor-pointer"
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                        >
                            <option value="All">Year: All</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    {/* CGPA Dropdown */}
                    <div className="space-y-1">
                        <select 
                            className="h-11 rounded-full px-5 border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-300 transition-colors cursor-pointer"
                            value={filters.cgpa}
                            onChange={(e) => handleFilterChange('cgpa', e.target.value)}
                        >
                            <option value="All">CGPA: All</option>
                            <option value=">6">{">"} 6.0</option>
                            <option value=">7">{">"} 7.0</option>
                            <option value=">8">{">"} 8.0</option>
                        </select>
                    </div>

                    {/* Placement Dropdown */}
                    <div className="space-y-1">
                        <select 
                            className="h-11 rounded-full px-5 border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-300 transition-colors cursor-pointer"
                            value={filters.placement}
                            onChange={(e) => handleFilterChange('placement', e.target.value)}
                        >
                            <option value="All">Placement: All</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                        </select>
                    </div>

                    {/* Skill Dropdown */}
                    <div className="space-y-1">
                        <select 
                            className="h-11 rounded-full px-5 border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-300 transition-colors cursor-pointer"
                            value={filters.skill}
                            onChange={(e) => handleFilterChange('skill', e.target.value)}
                        >
                            <option value="All">Skill: All</option>
                            <option value="Coding">Coding</option>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="Quiz">Quiz</option>
                        </select>
                    </div>

                    <Button 
                        variant="ghost" 
                        onClick={clearAll}
                        className="h-11 rounded-full px-6 text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-bold transition-all"
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

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
