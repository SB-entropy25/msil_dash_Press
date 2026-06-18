import React, { useState } from 'react';
import { X, Info, LayoutList } from 'lucide-react';

const DailyMonitor = ({ isOpen, onClose, dailyData, dailyDate, setDailyDate }) => {
    const [showAllLots, setShowAllLots] = useState(false);

    return (
        <>
            {/* Dark Overlay when open */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] transition-opacity" onClick={onClose}></div>
            )}

            {/* Sliding Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        📊 DAILY INTAKE MONITOR
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">Select Operations Date</label>
                        <input type="date" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} className="w-full h-[48px] px-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-base font-bold text-slate-700 shadow-sm" />
                    </div>

                    {!dailyData || dailyData.total_lots === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-bold text-lg italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No intake recorded for this date.
                        </div>
                    ) : (
                        <>
                            {/* Big KPIs */}
                            <div className="text-center mb-10">
                                <div className="text-7xl font-black text-blue-700 tracking-tight mb-2">{dailyData.total_lots}</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Lots Received</div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-slate-800">{dailyData.materials}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mt-2">Materials</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-black text-slate-800">{dailyData.suppliers}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mt-2">Suppliers</div>
                                </div>
                                <div className={`border rounded-xl p-4 text-center ${dailyData.oos > 0 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className={`text-2xl font-black ${dailyData.oos > 0 ? 'text-red-600' : 'text-slate-800'}`}>{dailyData.oos}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-center gap-1.5 mt-2">
                                        OOS Lots <span title="Out Of Specification Lots. Review alerts immediately." className="cursor-help text-slate-400"><Info size={14}/></span>
                                    </div>
                                </div>
                            </div>

                            {/* The "View All Lots" Toggle */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-8 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setShowAllLots(!showAllLots)}>
                                <div className="flex items-center gap-3">
                                    <LayoutList size={20} className="text-blue-600"/>
                                    <span className="text-base font-bold text-slate-800">View All Today's Lots</span>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showAllLots ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${showAllLots ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Conditional Rendering: List of Lots OR Supplier Summary */}
                            {showAllLots ? (
                                <div className="space-y-4">
                                    <div className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-3 mb-4">
                                        📋 Individual Lot Records
                                    </div>
                                    
                                    {/* DOM SAFEGUARD: .slice(0, 100) implemented here */}
                                    {dailyData.daily_lots?.slice(0, 100).map((lot, idx) => {
                                        let border = "border-green-300 border-l-4 border-l-green-500"; let badge = "SAFE"; let badgeBg = "bg-green-100 text-green-800";
                                        if (lot.status === 'CRIT') { border = "border-red-300 border-l-4 border-l-red-500"; badge = "CRITICAL"; badgeBg = "bg-red-100 text-red-800"; }
                                        else if (lot.status === 'CAUT') { border = "border-yellow-300 border-l-4 border-l-yellow-500"; badge = "CAUTION"; badgeBg = "bg-yellow-100 text-yellow-800"; }

                                        return (
                                            <div key={idx} className={`bg-white border ${border} rounded-xl p-4 shadow-sm`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-black text-base text-slate-900">Lot: {lot.lot}</div>
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded tracking-wider ${badgeBg}`}>{badge}</span>
                                                </div>
                                                <div className="text-sm font-bold text-slate-600 mb-1">{lot.material}</div>
                                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">🏭 {lot.supplier}</div>
                                            </div>
                                        );
                                    })}

                                    {/* DOM SAFEGUARD WARNING: Alerts users if data was trimmed */}
                                    {dailyData.daily_lots?.length > 100 && (
                                        <div className="text-center py-4 mt-4 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-500">
                                            Displaying top 100 prioritized lots to maintain system performance.<br/>
                                            Export to CSV for full daily records.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-3 mb-4">🏭 Supplier Summary</div>
                                    {dailyData.supplier_chips?.map((sup, idx) => {
                                        let bg = "bg-green-50"; let border = "border-green-200"; let text = "text-green-800"; let badge = "SAFE";
                                        if (sup.status === 'CRIT') { bg = "bg-red-50"; border = "border-red-300 border-l-4 border-l-red-500"; text = "text-red-900"; badge = `${sup.oos} CRIT`; }
                                        else if (sup.status === 'CAUT') { bg = "bg-yellow-50"; border = "border-yellow-300 border-l-4 border-l-yellow-500"; text = "text-yellow-900"; badge = `${sup.warns} CAUT`; }

                                        return (
                                            <div key={idx} className={`${bg} border ${border} rounded-xl p-4 shadow-sm transition-transform hover:-translate-y-0.5`}>
                                                <div className="flex justify-between items-start">
                                                    <div className={`font-black text-base ${text} pr-4 leading-tight`}>{sup.name}</div>
                                                    <span className={`text-[11px] font-black px-2.5 py-1 rounded whitespace-nowrap ${sup.status === 'CRIT' ? 'bg-red-200 text-red-900' : (sup.status === 'CAUT' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900')}`}>
                                                        {badge}
                                                    </span>
                                                </div>
                                                <div className={`text-sm font-bold mt-3 ${sup.status==='CRIT'?'text-red-600':sup.status==='CAUT'?'text-yellow-700':'text-green-600'}`}>{sup.lots} Lots Processed</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DailyMonitor;