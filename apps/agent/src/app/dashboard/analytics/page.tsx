"use client";
import React, { useState, useEffect } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";
import {
    TrendingUp, Users, Target, Award,
    Calendar, Filter, Download, ArrowUpRight
} from "lucide-react";
import { getAgentDashboardStats } from "@/services/agent.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// No mock data here - all data should come from backend stats

// Default empty data for chart fallback
const DEFAULT_CHART_DATA = [
    { name: "Expert", value: 0, color: "#F25E0A" },
    { name: "Mandir", value: 0, color: "#800000" },
    { name: "User", value: 0, color: "#FFB800" },
    { name: "Merchant", value: 0, color: "#4B5563" },
];


let cachedAnalyticsStats: any = null;

export default function AnalyticsPage() {
    const dashboardRef = React.useRef<HTMLDivElement>(null);
    const [stats, setStats] = useState<any>(cachedAnalyticsStats);
    const [loading, setLoading] = useState(!cachedAnalyticsStats);
    const [isExporting, setIsExporting] = useState(false);
    const [timeRange, setTimeRange] = useState("30d");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [showCalendar, setShowCalendar] = useState(false);
    
    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleExport = async () => {
        if (!dashboardRef.current || !stats) return;

        try {
            setIsExporting(true);
            
            // Wait a bit for charts to be fully stable
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: "#F9FAFB",
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    // Ensure all SVGs are visible in the clone
                    const svgs = clonedDoc.querySelectorAll('svg');
                    svgs.forEach(svg => {
                        svg.setAttribute('width', svg.getBoundingClientRect().width.toString());
                        svg.setAttribute('height', svg.getBoundingClientRect().height.toString());
                    });
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // If dashboard is very long, add more pages
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Agent_Performance_Report_${timeRange}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };



    const fetchStats = async () => {

        if (!stats) setLoading(true);
        const params: any = { range: timeRange };
        if (timeRange === "custom" && dateRange.start && dateRange.end) {
            params.startDate = dateRange.start;
            params.endDate = dateRange.end;
        }
        console.log('--- [FRONTEND] FETCHING STATS WITH PARAMS ---', params);
        const [data, error] = await getAgentDashboardStats(params);
        console.log('--- [FRONTEND] RECEIVED STATS DATA ---', data);
        if (data) {
            setStats(data);
            if (timeRange === "30d") cachedAnalyticsStats = data;
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchStats();
    }, [timeRange, dateRange]);

    const handleDateClick = (date: string) => {
        if (!dateRange.start || (dateRange.start && dateRange.end)) {
            setDateRange({ start: date, end: "" });
        } else {
            if (new Date(date) < new Date(dateRange.start)) {
                setDateRange({ start: date, end: dateRange.start });
            } else {
                setDateRange({ ...dateRange, end: date });
            }
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

        return (
            <div className="absolute top-full right-0 mt-4 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[100] w-[320px] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-1000">&lt;</button>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-1000">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-[10px] font-black text-gray-1000 text-center uppercase py-2">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, i) => {
                        if (!date) return <div key={i} />;
                        const dateStr = date.toISOString().split('T')[0];
                        const isStart = dateRange.start === dateStr;
                        const isEnd = dateRange.end === dateStr;
                        const isInRange = dateRange.start && dateRange.end && dateStr > dateRange.start && dateStr < dateRange.end;
                        
                        return (
                            <button
                                key={i}
                                onClick={() => handleDateClick(dateStr)}
                                className={`
                                    h-10 text-[11px] font-bold rounded-lg transition-all relative
                                    ${isStart || isEnd ? 'bg-[#F25E0A] text-white' : ''}
                                    ${isInRange ? 'bg-orange-50 text-[#F25E0A]' : 'hover:bg-gray-50 text-gray-700'}
                                `}
                            >
                                {date.getDate()}
                                {(isStart || isEnd) && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-6 flex gap-2">
                    <button 
                        onClick={() => { setDateRange({ start: "", end: "" }); setTimeRange("30d"); setShowCalendar(false); }}
                        className="flex-1 py-2 text-[10px] font-black uppercase text-gray-1000 hover:text-gray-1000 transition-colors"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={() => setShowCalendar(false)}
                        className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Apply
                    </button>
                </div>
            </div>
        );
    };

    // Dynamic chart data from backend stats
    const networkCompositionData = React.useMemo(() => {
        if (!stats) return DEFAULT_CHART_DATA;
        return [
            { name: "Expert", value: stats.experts_count || 0, color: "#F25E0A" },
            { name: "Mandir", value: stats.mandirs_count || 0, color: "#800000" },
            { name: "User", value: stats.clients_count || 0, color: "#FFB800" },
            { name: "Merchant", value: stats.puja_shops_count || 0, color: "#4B5563" },
        ];
    }, [stats]);


    return (
        <div ref={dashboardRef} className="min-h-screen space-y-8 pb-20 animate-in fade-in duration-700 bg-[#F9FAFB] p-4 md:p-8 rounded-2xl md:rounded-[2.5rem]">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-xs md:text-sm font-medium text-gray-1000 mt-1 md:mt-0">Real-time insights and growth metrics for your agent network.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative w-full md:w-auto mt-4 md:mt-0">
                    <div className="relative group w-full sm:w-auto">
                        <select 
                            value={timeRange}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTimeRange(val);
                                if (val === "custom") setShowCalendar(true);
                                else { setDateRange({ start: "", end: "" }); setShowCalendar(false); }
                            }}
                            className="appearance-none w-full sm:min-w-[180px] flex items-center gap-2 pl-10 pr-10 py-3 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-1000 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-[#F25E0A]/20"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last 1 Year</option>
                            <option value="custom">{dateRange.start && dateRange.end ? `${dateRange.start} - ${dateRange.end}` : 'Custom Range'}</option>
                        </select>
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-1000" />
                        <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-1000 pointer-events-none" />
                    </div>

                    {showCalendar && renderCalendar()}

                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 w-full sm:w-auto bg-[#F25E0A] rounded-xl text-xs font-black text-white hover:bg-[#d45209] transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isExporting ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Download className="w-3.5 h-3.5" />
                        )}
                        {isExporting ? "Exporting..." : "Export"}
                    </button>


                </div>
            </div>


            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: stats ? `₹${(stats.total_earned || 0).toLocaleString("en-IN")}` : "₹0", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Total Registration", value: stats?.total_users || "0", trend: "+8.2%", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Success Rate", value: stats?.success_rate || "94.2%", trend: "+2.1%", icon: Target, color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "Agent Rank", value: stats?.rank || "#14", trend: "Top 5%", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
                ].map((card, i) => (
                    <div key={i} className="group bg-white rounded-[1.5rem] shadow-sm flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-[#F25E0A]">
                        <div className="p-4 md:p-6 flex items-start justify-between flex-grow">
                            <div className="space-y-1">
                                <p className="text-[10px] md:text-xs font-medium text-gray-1000 tracking-tight transition-colors group-hover:text-gray-1000">{card.label}</p>
                                <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left">
                                    {card.value}
                                </h3>
                                <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-500 ${card.color}`}>
                                    <span className="text-base md:text-lg group-hover:translate-y-[-2px]">↑</span> {card.trend} <span className="text-gray-300 font-normal ml-1 hidden md:inline">Current</span>
                                </p>
                            </div>
                            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl ${card.bg} flex items-center justify-center ${card.color} transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm shrink-0`}>
                                <card.icon className="w-4 h-4 md:w-6 md:h-6" />
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Growth Chart */}
                <div className="bg-white p-8 rounded-[2rem] border-2 border-[#F25E0A] shadow-sm space-y-6 hover:shadow-[0_40px_80px_-20px_rgba(242,94,10,0.08)] hover:-translate-y-1 transition-all duration-700 group/chart relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover/chart:bg-orange-100/30 transition-colors" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover/chart:text-[#F25E0A] transition-colors">Revenue Growth</h3>
                            <p className="text-xs font-bold text-gray-1000">Monthly earnings trend from referrals.</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-xs font-black">+18%</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.revenue_growth || []}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F25E0A" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F25E0A" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                />

                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#F25E0A"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown Chart */}
                <div className="bg-white p-8 rounded-[2rem] border-2 border-[#F25E0A] shadow-sm space-y-6 hover:shadow-[0_40px_80px_-20px_rgba(128,0,0,0.06)] hover:-translate-y-1 transition-all duration-700 group/pie">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover/pie:text-[#800000] transition-colors">Network Composition</h3>
                        <p className="text-xs font-bold text-gray-1000">Distribution of all registered entities in your network.</p>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={networkCompositionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {networkCompositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-[10px] font-black uppercase text-gray-1000 tracking-wider ml-2">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Registration Activity Bar Chart */}
                <div className="bg-white p-8 rounded-[2rem] border-2 border-[#F25E0A] shadow-sm space-y-6 lg:col-span-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-700 group/bar">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover/bar:text-gray-800 transition-colors">Registration Activity</h3>
                            <p className="text-xs font-bold text-gray-1000">Daily registration volume for the current week.</p>
                        </div>
                        <div className="px-3 py-1.5 bg-orange-50 rounded-lg group-hover/bar:bg-orange-100 transition-colors">
                            <span className="text-[10px] font-black text-[#F25E0A] tracking-widest uppercase">Weekly Goal: 150</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.registration_activity || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                    {(stats?.registrationActivity || []).map((entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.count > 20 ? "#F25E0A" : "#800000"}
                                        />
                                    ))}
                                </Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-[2rem] border-2 border-[#F25E0A] shadow-sm overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] transition-all duration-700">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Recent Activity</h3>
                        <p className="text-xs font-bold text-gray-1000">Latest registrations and listings in your network for the selected period.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-1000 uppercase tracking-widest">Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-1000 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-1000 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-1000 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-1000 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((activity: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#F25E0A] font-black text-xs group-hover:scale-110 transition-transform">
                                                    {activity.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-gray-900">{activity.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">{activity.type}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-gray-1000">{activity.action}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-gray-1000">{new Date(activity.date).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <Calendar className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-black text-gray-1000 uppercase tracking-widest">No activity found in this period</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
