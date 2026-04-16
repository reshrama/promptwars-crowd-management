import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Users, MapPin, Bell, Send, Landmark, Coffee, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import VenueMap from './components/VenueMap';
import { getCrowdData, EventPhase } from './logic/crowdSimulator';
import { getAIInsights, AIInsights } from './logic/aiService';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function App() {
    const [view, setView] = useState<'manager' | 'attendee'>('manager');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [phase, setPhase] = useState<EventPhase>('PRE_GAME');
    const [lastAlert, setLastAlert] = useState<string | null>(null);
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

    const handleBroadcast = () => {
        const alerts = [
            "Heavy traffic at Gate G. Please use Gate B for faster entry.",
            "Halftime snacks: Concession A is clear. Concession C is 20m wait.",
            "Post-game flow: Use the North Express Exit for 15m faster egress.",
            "Weather Update: All outdoor concourses are currently covered."
        ];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        setLastAlert(alert);
        setTimeout(() => setLastAlert(null), 5000);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0f172a] text-slate-100" role="application" aria-label="CrowdSync Platform">
            {/* Sidebar */}
            <aside
                className={cn(
                    "glass z-20 transition-all duration-300 flex flex-col border-r border-white/5",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
                role="navigation"
                aria-label="Main Navigation"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex-center shrink-0">
                        <Users size={20} className="text-white" />
                    </div>
                    {isSidebarOpen && <h1 className="text-xl font-bold gradient-text truncate">CrowdSync</h1>}
                </div>

                <nav className="flex-1 mt-8 space-y-2 px-3">
                    <NavItem
                        isActive={view === 'manager'}
                        onClick={() => setView('manager')}
                        icon={<LayoutDashboard size={20} />}
                        label="Manager View"
                        collapsed={!isSidebarOpen}
                    />
                    <NavItem
                        isActive={view === 'attendee'}
                        onClick={() => setView('attendee')}
                        icon={<MapPin size={20} />}
                        label="Attendee View"
                        collapsed={!isSidebarOpen}
                    />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="card glass p-4 rounded-2xl flex flex-col gap-2" role="region" aria-label="Event Phase Selector">
                        {isSidebarOpen ? (
                            <>
                                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Live Phase</div>
                                <select
                                    value={phase}
                                    onChange={(e) => setPhase(e.target.value as EventPhase)}
                                    className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer appearance-none text-indigo-400"
                                    aria-label="Select Event Phase"
                                >
                                    <option value="PRE_GAME">Pre-Game</option>
                                    <option value="LIVE">In-Game (Live)</option>
                                    <option value="HALFTIME">Halftime</option>
                                    <option value="POST_GAME">Post-Game</option>
                                </select>
                            </>
                        ) : (
                            <div className="text-center font-bold text-indigo-400 text-xs" aria-hidden="true">{phase.split('_')[0]}</div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col" role="main">
                {/* Top Bar */}
                <header className="flex justify-between items-center p-8 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {view === 'manager' ? 'Ops Intelligence' : 'Fan Experience'}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {view === 'manager'
                                ? 'Managing flow for 48,000+ attendees'
                                : 'Your personalized venue guide'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {view === 'manager' && (
                            <button
                                onClick={handleBroadcast}
                                className="btn btn-primary px-4 py-2 text-sm"
                                aria-label="Broadcast Alert to Attendees"
                            >
                                <Send size={16} /> Broadcast Alert
                            </button>
                        )}
                        <div
                            className="px-4 py-2 rounded-full glass text-xs font-bold border-emerald-500/30 text-emerald-400 border bg-emerald-500/10 flex items-center gap-2"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="pulse-indicator" /> LIVE
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 pt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view + phase}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {view === 'manager' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                                    {/* Left Column: Visuals & KPIs */}
                                    <div className="lg:col-span-8 flex flex-col gap-6">
                                        <div className="flex-1 card glass min-h-[400px] relative" role="img" aria-label="Live Stadium Density Heatmap">
                                            <div className="absolute top-4 left-6 z-10">
                                                <h4 className="font-bold flex items-center gap-2">
                                                    <Landmark size={18} className="text-indigo-400" />
                                                    Stadium Density Heatmap
                                                </h4>
                                            </div>
                                            <VenueMap densities={crowdData.sectorDensities} />
                                        </div>

                                        <div className="grid grid-cols-3 gap-6" role="group" aria-label="Key Performance Indicators">
                                            <StatCard title="Total Attendance" value={crowdData.stats.totalAttendance.toLocaleString()} trend="+2k/min" />
                                            <StatCard title="Avg Flow Rate" value={`${crowdData.stats.peakFlow}/m`} trend="Peak" />
                                            <StatCard title="Ops Efficacy" value={`${crowdData.stats.staffEfficiency}%`} status="good" />
                                        </div>
                                    </div>

                                    {/* Right Column: Bottlenecks */}
                                    <div className="lg:col-span-4 space-y-6">
                                        <div className="card glass flex flex-col h-full max-h-[600px]" role="region" aria-label="Crowd Bottlenecks">
                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                <Info size={18} className="text-pink-400" />
                                                Critical Bottlenecks
                                            </h3>
                                            <div className="flex-1 space-y-3 overflow-auto pr-2 custom-scrollbar">
                                                {crowdData.bottlenecks.map(b => (
                                                    <BottleneckItem key={b.id} area={b.area} time={`${b.waitMinutes}m`} level={b.level} />
                                                ))}
                                            </div>
                                            <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10" role="complementary" aria-label="AI Operations Suggestion">
                                                <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-tighter">AI Suggestion</div>
                                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                                    "{aiInsights.managerSuggestion}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {/* Attendee Mobile View */}
                                    <div className="relative aspect-[9/16] max-h-[700px] mx-auto w-full md:w-[360px] glass rounded-[3rem] p-4 border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col" role="region" aria-label="Mobile Fan Companion">
                                        <div className="w-20 h-1.5 bg-slate-800 rounded-full mx-auto mb-6" />

                                        <div className="flex-1 space-y-4 overflow-auto px-2 custom-scrollbar">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-bold">Good Evening!</h3>
                                                <button className="p-2 glass rounded-xl" aria-label="View Notifications"><Bell size={18} /></button>
                                            </div>

                                            <div className="card bg-indigo-600 p-5 rounded-3xl shadow-lg relative overflow-hidden" role="alert">
                                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                                                <div className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">AI Smart Guide</div>
                                                <div className="text-lg font-bold text-white mb-2 leading-tight">
                                                    {aiInsights.attendeeGuidance}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/80 text-xs">
                                                    <MapPin size={12} /> Powered by CrowdSync AI
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Nearby Amenities">
                                                <AmenityCard icon={<Users size={16} />} label="Restrooms" status="3m wait" sub="Section 104" />
                                                <AmenityCard icon={<Coffee size={16} />} label="Food & Drinks" status="12m wait" sub="Concourse A" />
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Map</h4>
                                                <div className="aspect-square card glass p-2 rounded-3xl relative overflow-hidden" role="img" aria-label="Interactive Venue Map">
                                                    <VenueMap densities={crowdData.sectorDensities} />
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {lastAlert && (
                                                <motion.div
                                                    initial={{ y: 50, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 20, opacity: 0 }}
                                                    className="absolute bottom-6 left-4 right-4 p-4 glass rounded-2xl border-indigo-500/50 bg-indigo-500/20 backdrop-blur-xl z-30"
                                                >
                                                    <div className="flex gap-3">
                                                        <Bell className="text-indigo-400 shrink-0" size={20} />
                                                        <p className="text-xs font-medium leading-relaxed">{lastAlert}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function NavItem({ isActive, onClick, icon, label, collapsed }: { isActive: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed: boolean }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                isActive ? "bg-indigo-500/20 text-indigo-400 shadow-sm" : "hover:bg-slate-800/50 text-slate-400"
            )}
        >
            <div className={cn("shrink-0", isActive ? "text-indigo-400" : "text-slate-500")}>
                {icon}
            </div>
            {!collapsed && <span className="font-semibold text-sm">{label}</span>}
        </button>
    );
}

function StatCard({ title, value, trend, status }: { title: string, value: string, trend?: string, status?: string }) {
    return (
        <div className="card glass">
            <div className="text-slate-500 text-xs font-bold uppercase mb-1">{title}</div>
            <div className={cn("text-3xl font-bold", status === 'critical' ? "text-pink-500" : "")}>{value}</div>
            {trend && <div className="text-xs text-indigo-400 font-bold mt-1">{trend} trend</div>}
        </div>
    )
}

function BottleneckItem({ area, time, level }: { area: string, time: string, level: 'high' | 'med' | 'low' }) {
    const colors = {
        high: 'bg-rose-500',
        med: 'bg-amber-500',
        low: 'bg-emerald-500'
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
            <div className={cn("w-2 h-12 rounded-full", colors[level])} />
            <div className="flex-1">
                <div className="font-semibold">{area}</div>
                <div className="text-sm text-slate-400">Estimated wait</div>
            </div>
            <div className="text-xl font-bold">{time}</div>
        </div>
    )
}

function AmenityCard({ icon, label, status, sub }: { icon: React.ReactNode, label: string, status: string, sub: string }) {
    return (
        <div className="card glass flex items-start gap-4 p-4 border border-white/5">
            <div className="text-indigo-400 mt-1 shrink-0">{icon}</div>
            <div className="flex flex-col">
                <div className="font-bold text-sm tracking-tight text-slate-200">{label}</div>
                <div className="text-[10px] text-indigo-400 font-black mb-1">{status}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sub}</div>
            </div>
        </div>
    )
}
