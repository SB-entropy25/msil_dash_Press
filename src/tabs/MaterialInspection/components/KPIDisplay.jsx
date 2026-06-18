import React from 'react';
import { AlertTriangle } from 'lucide-react';

const KPICard = ({ title, value, unit, isAlert }) => (
    <div className={`p-4 rounded-lg shadow-sm border ${isAlert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} flex flex-col justify-center`}>
        <div className={`text-xs font-semibold uppercase ${isAlert ? 'text-red-600' : 'text-gray-500'}`}>
            {title}
        </div>
        <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${isAlert ? 'text-red-700' : 'text-gray-900'}`}>
                {value}
            </span>
            {unit && <span className={`text-sm ${isAlert ? 'text-red-500' : 'text-gray-500'}`}>{unit}</span>}
        </div>
    </div>
);

const KPIDisplay = ({ kpis, showOOS, onToggleAlertAccordion }) => {
    if (!kpis) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <KPICard title="Avg Weight" value={kpis.avg_weight} unit="Tons" />
            <KPICard title="Avg TSYP" value={kpis.avg_tsyp} unit="" />
            <KPICard title="Std Dev TSYP" value={kpis.std_tsyp} unit="" />
            <KPICard title="Avg Yield Point" value={kpis.avg_yield} unit="MPa" />
            <KPICard title="Avg UTS" value={kpis.avg_uts} unit="MPa" />
            <KPICard title="Avg Elongation" value={kpis.avg_elongation} unit="%" />
            <KPICard title="Avg Carbon" value={kpis.avg_carbon} unit="%" />
            
            {/* The Conditional 8th Alert Card */}
            {showOOS && (
                <div 
                    onClick={onToggleAlertAccordion}
                    className="p-4 rounded-lg shadow-sm border bg-red-50 border-red-300 flex flex-col justify-center cursor-pointer hover:bg-red-100 transition-colors group"
                >
                    <div className="text-xs font-semibold uppercase text-red-600 flex items-center gap-1">
                        <AlertTriangle size={14} />
                        OOS Lots
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-700">
                            {kpis.total_oos}
                        </span>
                    </div>
                    <div className="text-[10px] text-red-500 mt-1 uppercase tracking-wider group-hover:underline">
                        Click to view alerts
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPIDisplay;