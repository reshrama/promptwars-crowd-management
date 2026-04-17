import React, { useState, useMemo, useEffect } from 'react';
import {
    Users, MapPin, Bell, Activity, Sparkles, Zap, ShieldCheck,
    AlertTriangle, LayoutGrid, Share2, Download, Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VenueMap from './components/VenueMap';
import { getCrowdData, EventPhase } from './logic/crowdSimulator';
import { getAIInsights, AIInsights } from './logic/aiService';

export default function App() {
    const [view, setView] = useState<'manager' | 'attendee'>('manager');
    const [phase, setPhase] = useState<EventPhase>('PRE_GAME');
    const [aiInsights, setAiInsights] = useState<AIInsights>({
        managerSuggestion: "Analyzing stadium patterns...",
        attendeeGuidance: "Welcome! Check the live map for the fastest routes."
    });

    // Sync data with phase
    const crowdData = useMemo(() => getCrowdData(phase), [phase]);

    // Fetch AI insights when data changes
    useEffect(() => {
        const fetchInsights = async () => {
            const insights = await getAIInsights(crowdData, phase);
            setAiInsights(insights);
        };
        fetchInsights();
    }, [crowdData, phase]);

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* Accessibility: Skip Link */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
                Skip to main content
            </a>

            {/* Header / Navigation */}
            <header className="fixed top-0 w-full z-40 px-6 py-4 flex items-center justify-between glass border-b border-indigo-500/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex-center shadow-lg shadow-indigo-500/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            CrowdSync
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-400/80 leading-tight">
                            Smart Venue Ops
                        </p>
                    </div>
                </div>

                <nav className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5" role="tablist">
                    <button
                        onClick={() => setView('manager')}
                        role="tab"
                        aria-selected={view === 'manager'}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'manager' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Manager View
                    </button>
                    <button
                        onClick={() => setView('attendee')}
                        role="tab"
                        aria-selected={view === 'attendee'}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'attendee' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <MapPin className="w-4 h-4" /> Attendee View
                    </button>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Live</span>
                    </div>
                </div>
            </header>

            <main id="main-content" className="pt-24 pb-12 px-6 max-w-7xl mx-auto focus:outline-none" tabIndex={-1}>
                {view === 'manager' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Stats Sidebar */}
                        <aside className="lg:col-span-3 space-y-4" aria-label="Operational Stats">
                            <div className="glass p-5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                                <label htmlFor="phase-select" className="block text-[10px] uppercase tracking-[0.15em] font-black text-indigo-400 mb-3">
                                    Current Event Phase
                                </label>
                                <select
                                    id="phase-select"
                                    value={phase}
                                    onChange={(e) => setPhase(e.target.value as EventPhase)}
                                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                                >
                                    <option value="PRE_GAME">Pre-Game Arrivals</option>
                                    <option value="LIVE">Live Match</option>
                                    <option value="HALFTIME">Halftime Peak</option>
                                    <option value="POST_GAME">Post-Game Exit</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <StatCard icon={Users} label="Total Attendance" value={crowdData.stats.totalAttendance.toLocaleString()} trend="+2k/min" />
                                <StatCard icon={Zap} label="Avg Flow Rate" value="850/m" trend="Peak" />
                                <StatCard icon={ShieldCheck} label="Ops Efficacy" value="92%" trend="Stable" />
                            </div>

                            <section className="glass p-5 rounded-3xl border border-white/5" aria-labelledby="bottlenecks-title">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h2 id="bottlenecks-title" className="text-sm font-black uppercase tracking-wider">Critical Bottlenecks</h2>
                                </div>
                                <div className="space-y-4">
                                    {crowdData.bottlenecks.map((b, i) => (
                                        <div key={i} className="group p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-slate-200">{b.area}</span>
                                                <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">{b.waitMinutes}m Wait</span>
                                            </div>
                                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={b.waitMinutes} aria-valuemin={0} aria-valuemax={60} aria-label={`${b.area} wait time`}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, b.waitMinutes * 3.3)}%` }}
                                                    className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </aside>

                        {/* Main Heatmap */}
                        <section className="lg:col-span-6 space-y-6" aria-label="Venue Heatmap">
                            <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight mb-1">Live Stadium Heatmap</h2>
                                        <p className="text-xs text-slate-400 font-medium">Monitoring real-time sector load & egress clusters</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button aria-label="Share Dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer border border-white/5">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button aria-label="Download Report" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer border border-white/5">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <VenueMap densities={crowdData.sectorDensities} bottlenecks={crowdData.bottlenecks} />
                            </div>

                            <section className="glass p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/30 overflow-hidden relative" aria-labelledby="ai-ops-title">
                                <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl bg-indigo-500 rounded-full" />
                                <div className="flex items-center gap-4 mb-6 relative">
                                    <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 id="ai-ops-title" className="text-lg font-black tracking-tight text-white">AI Operational Analyst</h2>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Powered by Gemini 1.5 Flash</p>
                                    </div>
                                </div>
                                <div className="text-slate-200 text-sm leading-relaxed font-semibold bg-slate-900/60 p-6 rounded-2xl border border-white/10 shadow-inner">
                                    {aiInsights.managerSuggestion}
                                </div>
                            </section>
                        </section>

                        {/* Control Panel */}
                        <aside className="lg:col-span-3 space-y-6" aria-label="Actions & Coordination">
                            <section className="glass p-6 rounded-3xl border border-white/5" aria-labelledby="broadcast-title">
                                <h2 id="broadcast-title" className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Coordination
                                </h2>
                                <button className="w-full group bg-slate-900 border border-white/10 hover:border-indigo-500/40 p-5 rounded-2xl text-left transition-all mb-4 focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <h3 className="font-bold text-slate-200 mb-1 group-hover:text-indigo-400 transition-colors">Broadcast Alert</h3>
                                    <p className="text-xs text-slate-500">Push real-time directions to all fans in Critical sectors.</p>
                                </button>
                                <button className="w-full group bg-slate-900 border border-white/10 hover:border-indigo-500/40 p-5 rounded-2xl text-left transition-all focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <h3 className="font-bold text-slate-200 mb-1 group-hover:text-amber-400 transition-colors">Dispatch Support</h3>
                                    <p className="text-xs text-slate-500">Deploy additional stewards to identified bottlenecks.</p>
                                </button>
                            </section>

                            <div className="glass p-6 rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-slate-900 to-indigo-950/20" aria-label="Engagement Stats">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">Fan Engagement</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400">Response Rate</span>
                                        <span className="font-black text-emerald-400">88%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400">Sentiment Score</span>
                                        <span className="font-black text-indigo-400">4.8/5</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    /* Attendee View */
                    <section className="max-w-md mx-auto space-y-6" aria-label="Attendee Companion Experience">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black tracking-tight mb-2">Good Evening!</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Exclusive Access</span>
                            </div>
                        </div>

                        <section className="glass p-6 rounded-[2rem] border border-indigo-500/30 bg-indigo-600/5 relative overflow-hidden" aria-labelledby="fan-ai-title">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 id="fan-ai-title" className="text-sm font-black uppercase tracking-widest text-white">AI Smart Guide</h3>
                            </div>
                            <div className="text-slate-100 text-sm font-bold leading-relaxed bg-slate-900/40 p-5 rounded-2xl border border-white/5 mb-4 shadow-inner">
                                {aiInsights.attendeeGuidance}
                            </div>
                            <div className="text-[10px] font-black text-indigo-400/60 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Real-time Venue Logic
                            </div>
                        </section>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-2">Your personalized guide</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <AttendeeCard icon={Users} label="Restrooms" wait="3m wait" location="Section 104" />
                                <AttendeeCard icon={Coffee} label="Food & Drinks" wait="12m wait" location="Concourse A" />
                                <AttendeeCard icon={MapPin} label="Next Event" wait="Live" location="Main Field" />
                            </div>
                        </div>

                        <section className="glass p-6 rounded-[2rem] border border-white/5" aria-labelledby="your-map-title">
                            <h3 id="your-map-title" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 text-center">Your Live Map</h3>
                            <div className="aspect-square bg-slate-900/50 rounded-2xl border border-white/5 flex-center p-4 shadow-inner">
                                <VenueMap densities={crowdData.sectorDensities} bottlenecks={crowdData.bottlenecks} />
                            </div>
                        </section>
                    </section>
                )}
            </main>

            {/* Notifications FAB */}
            <button
                className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex-center shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer z-50 focus:ring-4 focus:ring-white/20 outline-none"
                aria-label="View recent notifications"
                title="Notifications"
            >
                <div className="relative">
                    <Bell className="w-7 h-7" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-indigo-600 rounded-full" />
                </div>
            </button>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, trend }: any) {
    return (
        <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/50 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                    <Icon className="w-5 h-5" />
                </div>
                {trend && <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black tracking-tight text-white">{value}</p>
            </div>
        </div>
    );
}

function AttendeeCard({ icon: Icon, label, wait, location }: any) {
    return (
        <div className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-200">{label}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{location}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-indigo-400">{wait}</p>
            </div>
        </div>
    );
}
