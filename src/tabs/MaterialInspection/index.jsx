import React, { useState, useEffect } from 'react';
import { fetchOptions, fetchDashboardData, fetchDailyMonitorData } from './api/client';
import TopFilters from './components/TopFilters';
import KPIDisplay from './components/KPIDisplay';
import DailyMonitor from './components/DailyMonitor';
import ChartDisplay from './components/ChartDisplay';
import AppendTool from './components/AppendTool'; 
import { Database } from 'lucide-react';

const ALL_SLIDES = [
    { id: 'Yield Point', label: 'Yield Point', hasViews: true }, { id: 'Yield Point Normal Dist', label: 'Yield Point Normal Dist', hasViews: false },
    { id: 'Ultimate Tensile Strength', label: 'Ultimate Tensile Strength', hasViews: true }, { id: 'UTS Normal Dist', label: 'UTS Normal Dist', hasViews: false },
    { id: 'Elongation', label: 'Elongation', hasViews: true }, { id: 'Carbon %', label: 'Carbon %', hasViews: true }, { id: 'Carbon % Normal Dist', label: 'Carbon % Normal Dist', hasViews: false },
    { id: 'TSYP Trend', label: 'TSYP Trend', hasViews: false }, { id: 'TSYP Bar Charts', label: 'TSYP Bar Charts', hasViews: false }, { id: 'TSYP Distribution', label: 'TSYP Distribution', hasViews: false },
    { id: 'Yield Point vs UTS', label: 'Yield Point vs UTS', hasViews: false }, { id: 'Yield Point & UTS by Supplier', label: 'Yield Point & UTS by Supplier', hasViews: false }
];

const MaterialInspection = ({ plantInfo, onLogout }) => {
    const [options, setOptions] = useState({ materials: [], suppliers: [] });
    const [filters, setFilters] = useState({ startDate: '2026-04-27', endDate: '2026-05-26', materials: [], suppliers: [] });
    
    const [dashboardData, setDashboardData] = useState({ kpis: null, alerts: [], distributions: {}, chart_data: [], table_data: [], db_info: {} });
    const [dailyDate, setDailyDate] = useState('2026-04-27');
    const [dailyData, setDailyData] = useState(null);
    const [isMonitorOpen, setIsMonitorOpen] = useState(false);
    const [isAppendOpen, setIsAppendOpen] = useState(false); 
    
    const [includedSlides, setIncludedSlides] = useState(ALL_SLIDES.map(s => s.id));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [chartSettings, setChartSettings] = useState({ showSpecLimits: true, showZoneShading: true, showOutliers: true, showHoverInfo: true });
    const [showOOS, setShowOOS] = useState(false);

    // INITIAL LOAD
    useEffect(() => { fetchOptions().then(setOptions); }, []);
    useEffect(() => { fetchDashboardData(filters).then(setDashboardData); }, [filters]);
    useEffect(() => { fetchDailyMonitorData(dailyDate).then(setDailyData); }, [dailyDate]);

    // INDUSTRY STANDARD: 5-Minute Background Heartbeat (Polling)
    useEffect(() => {
        const heartbeat = setInterval(() => {
            console.log(" Fetching live data...");
            fetchDashboardData(filters).then(setDashboardData);
            fetchDailyMonitorData(dailyDate).then(setDailyData);
            fetchOptions().then(setOptions);
        }, 300000); // 300,000 ms = 5 minutes

        return () => clearInterval(heartbeat);
    }, [filters, dailyDate]);

    // AUTO-REFRESH FUNCTION (Triggered instantly after AppendTool success)
    const refreshData = () => {
        fetchDashboardData(filters).then(setDashboardData);
        fetchDailyMonitorData(dailyDate).then(setDailyData);
        fetchOptions().then(setOptions);
    };

    const handleExportCSV = () => {
        if (!dashboardData?.table_data || dashboardData.table_data.length === 0) return alert("No data to export!");
        const headers = Object.keys(dashboardData.table_data[0]).join(',');
        const rows = dashboardData.table_data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
        const a = document.createElement('a'); a.href = window.URL.createObjectURL(new Blob([`${headers}\n${rows}`], { type: 'text/csv' }));
        a.download = `Inspection_Data.csv`; a.click();
    };

    const uniqueLots = dashboardData?.chart_data ? new Set(dashboardData.chart_data.map(r => r['Inspection Lot'])).size : 0;
    const uniqueMats = dashboardData?.chart_data ? new Set(dashboardData.chart_data.map(r => r['Material_Display'])).size : 0;

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50 p-4 lg:p-6 text-slate-800 font-sans relative">
            <TopFilters 
                options={options} filters={filters} setFilters={setFilters} onExport={handleExportCSV} 
                uniqueLots={uniqueLots} uniqueMats={uniqueMats}
                showOOS={showOOS} setShowOOS={setShowOOS}
                includedSlides={includedSlides} setIncludedSlides={setIncludedSlides} ALL_SLIDES={ALL_SLIDES}
                isAutoPlay={isAutoPlay} setIsAutoPlay={setIsAutoPlay} chartSettings={chartSettings} setChartSettings={setChartSettings}
                currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
                setIsAppendOpen={setIsAppendOpen}
                plantInfo={plantInfo}
                onLogout={onLogout}
            />
            
            <KPIDisplay kpis={dashboardData?.kpis} showOOS={showOOS} />
            
            {showOOS && dashboardData?.alerts?.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-5 mb-6 shadow-sm max-h-64 overflow-y-auto">
                    <h3 className="text-red-800 font-bold text-lg mb-3 border-b border-red-200 pb-2">Action Required ({dashboardData.alerts.length})</h3>
                    <div className="space-y-3">
                        {dashboardData.alerts.map((a, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-red-100 flex justify-between text-base shadow-sm">
                                <div><span className="font-bold text-slate-900 mr-3">Lot: {a.lot}</span><span className="text-slate-500 text-sm">{a.date}</span><div className="text-slate-600 mt-1 font-semibold">{a.material}</div></div>
                                <div className="text-red-600 font-bold text-right">{a.reasons.map((r, i) => <div key={i}>⚠️ {r}</div>)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full mb-8">
                <ChartDisplay 
                    chartData={dashboardData?.chart_data || []} settings={chartSettings} ALL_SLIDES={ALL_SLIDES}
                    includedSlides={includedSlides} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
                    isAutoPlay={isAutoPlay}
                />
            </div>

            <div className="mt-12 mb-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 opacity-80">
                <Database size={16} />
                📁 {plantInfo?.master_file || dashboardData?.db_info?.master_file || 'master_file.xlsx'} | 🏭 {plantInfo?.display_name} | {dashboardData?.db_info?.total_lots || 0} Total Lots | {dashboardData?.db_info?.total_rows || 0} Entries
            </div>

            <DailyMonitor isOpen={isMonitorOpen} onClose={() => setIsMonitorOpen(false)} dailyData={dailyData} dailyDate={dailyDate} setDailyDate={setDailyDate} />

            <AppendTool isOpen={isAppendOpen} onClose={() => setIsAppendOpen(false)} onAppendSuccess={refreshData} plantInfo={plantInfo} />

            {!isMonitorOpen && (
                <button onClick={() => setIsMonitorOpen(true)} className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white rounded-l-xl shadow-2xl hover:bg-blue-700 transition-colors z-[9997] px-2 py-6 border-y border-l border-slate-700 flex flex-col items-center gap-3">
                    <span className="text-xl">📊</span>
                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} className="font-bold tracking-widest text-xs uppercase">Daily Intake</span>
                </button>
            )}
        </div>
    );
};
export default MaterialInspection;