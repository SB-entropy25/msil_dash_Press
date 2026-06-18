import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, X, Play, Settings, Upload, Search, Factory, LogOut } from 'lucide-react';

const MultiSelect = ({ options, selected, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => { 
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm(''); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (opt) => selected.includes(opt) ? onChange(selected.filter(i => i !== opt)) : onChange([...selected, opt]);
    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={`relative w-44 ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={wrapperRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="flex h-[34px] w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-2.5 text-sm shadow-sm cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-wrap gap-1 overflow-hidden">
                    {selected.length === 0 ? <span className="text-slate-400 font-medium">{placeholder}</span> : 
                     selected.length === 1 ? <span className="truncate block max-w-[130px] font-semibold text-slate-800">{selected[0]}</span> : 
                     <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[11px]">{selected.length} Selected</span>}
                </div>
                <div className="flex items-center gap-1">
                    {selected.length > 0 && <X size={14} className="text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); onChange([]); }} />}
                    <ChevronDown size={14} className="text-slate-500" />
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 relative shrink-0">
                        <Search size={14} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" placeholder="Type to search..." value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div className="overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="py-3 px-4 text-sm text-slate-500 text-center italic">No results found</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div key={opt} onClick={() => toggleOption(opt)} className="cursor-pointer select-none py-2 pl-3 pr-3 hover:bg-blue-50 text-slate-800 flex items-center text-sm font-medium">
                                    <input type="checkbox" checked={selected.includes(opt)} readOnly className="mr-3 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="block truncate" title={opt}>{opt}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const TopFilters = ({ options, filters, setFilters, onExport, uniqueLots, uniqueMats, showOOS, setShowOOS, includedSlides, setIncludedSlides, ALL_SLIDES, isAutoPlay, setIsAutoPlay, chartSettings, setChartSettings, currentIndex, setCurrentIndex, setIsAppendOpen, plantInfo, onLogout }) => {
    const [showIncludes, setShowIncludes] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const toggleInclude = (id) => includedSlides.includes(id) ? setIncludedSlides(includedSlides.filter(i => i !== id)) : setIncludedSlides([...includedSlides, id]);

    return (
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-wrap items-center gap-2 lg:gap-2.5 w-full">

                <div className="flex flex-col"><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">Start Date</div><input type="date" value={filters.startDate} onChange={(e) => setFilters(p => ({ ...p, startDate: e.target.value }))} className="h-[34px] block rounded-lg border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2.5 text-sm font-semibold text-slate-700" /></div>
                <div className="flex flex-col"><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">End Date</div><input type="date" value={filters.endDate} onChange={(e) => setFilters(p => ({ ...p, endDate: e.target.value }))} className="h-[34px] block rounded-lg border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2.5 text-sm font-semibold text-slate-700" /></div>
                <div className="flex flex-col"><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">Materials</div><MultiSelect options={options.materials} selected={filters.materials} onChange={(s) => setFilters(p => ({ ...p, materials: s, suppliers: [] }))} placeholder="All Materials" disabled={filters.suppliers.length > 0} /></div>
                <div className="flex flex-col"><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">Suppliers</div><MultiSelect options={options.suppliers} selected={filters.suppliers} onChange={(s) => setFilters(p => ({ ...p, suppliers: s, materials: [] }))} placeholder="All Suppliers" disabled={filters.materials.length > 0} /></div>

                <div className="flex items-center justify-center gap-1.5 h-[34px] bg-slate-50 px-2.5 rounded-lg border border-slate-200 whitespace-nowrap shadow-sm self-end">
                    <span className="text-sm font-bold text-blue-800">{uniqueLots} Lots</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm font-bold text-blue-800">{uniqueMats} Mats</span>
                </div>

                <div className="relative self-end">
                    <button onClick={() => setShowIncludes(!showIncludes)} className="flex items-center gap-1.5 h-[34px] px-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors whitespace-nowrap">
                        Graphs <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[11px] font-bold">{includedSlides.length}</span> <ChevronDown size={14} className="text-slate-400"/>
                    </button>
                    {showIncludes && (
                        <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-3">
                            <div className="px-4 pb-2 mb-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Graphs to Display</div>
                            {ALL_SLIDES.map(slide => (
                                <label key={slide.id} className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm font-medium text-slate-700 transition-colors">
                                    <input type="checkbox" checked={includedSlides.includes(slide.id)} onChange={() => toggleInclude(slide.id)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-3 h-4 w-4" />
                                    {slide.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative self-end">
                    <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-1.5 h-[34px] px-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors whitespace-nowrap">
                        <Settings size={14} className="text-slate-500" /> Overlays <ChevronDown size={14} className="text-slate-400"/>
                    </button>
                    {showSettings && (
                        <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
                            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer mb-3"><input type="checkbox" checked={chartSettings.showSpecLimits} onChange={(e) => setChartSettings({...chartSettings, showSpecLimits: e.target.checked})} className="rounded border-slate-300 text-blue-600 h-4 w-4"/> Spec Limit Lines</label>
                            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer mb-3"><input type="checkbox" checked={chartSettings.showZoneShading} onChange={(e) => setChartSettings({...chartSettings, showZoneShading: e.target.checked})} className="rounded border-slate-300 text-blue-600 h-4 w-4"/> Directional Zone Shading</label>
                            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer mb-3"><input type="checkbox" checked={chartSettings.showOutliers} onChange={(e) => setChartSettings({...chartSettings, showOutliers: e.target.checked})} className="rounded border-slate-300 text-blue-600 h-4 w-4"/> Highlight Critical Outliers</label>
                            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer mb-3"><input type="checkbox" checked={chartSettings.showHoverInfo} onChange={(e) => setChartSettings({...chartSettings, showHoverInfo: e.target.checked})} className="rounded border-slate-300 text-blue-600 h-4 w-4"/> Detailed Hover Tooltips</label>
                            <div className="border-t border-slate-100 my-3"></div>
                            <label className="flex items-center gap-3 text-sm font-bold text-red-700 cursor-pointer"><input type="checkbox" checked={showOOS} onChange={(e) => setShowOOS(e.target.checked)} className="rounded border-slate-300 text-red-600 h-4 w-4"/> Show Action Required Panel</label>
                        </div>
                    )}
                </div>

                <select value={includedSlides[currentIndex]} onChange={(e) => setCurrentIndex(includedSlides.indexOf(e.target.value))} className="h-[34px] px-2.5 border border-slate-300 bg-white text-slate-800 rounded-lg font-semibold text-sm shadow-sm cursor-pointer focus:ring-blue-500 focus:border-blue-500 max-w-[260px] truncate self-end">
                    {includedSlides.map((id, index) => <option key={id} value={id}>Graph {index + 1} / {includedSlides.length}: {ALL_SLIDES.find(s=>s.id===id).label}</option>)}
                </select>

                <button onClick={() => setIsAutoPlay(!isAutoPlay)} className={`flex items-center gap-1.5 px-2.5 h-[34px] rounded-lg text-sm font-semibold shadow-sm transition-colors border whitespace-nowrap self-end ${isAutoPlay ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    <Play size={14} className={isAutoPlay ? "text-blue-600" : "text-slate-400"} /> Auto
                </button>

                {plantInfo && (
                    <div className="flex items-center gap-1.5 h-[34px] px-3 rounded-full bg-white border border-[#d0d7de] text-sm font-medium text-[#374151] shadow-sm whitespace-nowrap self-end select-none">
                        <Factory size={13} className="text-[#4a6cf7]" />
                        {plantInfo.display_name}
                    </div>
                )}

                <div className="flex items-center gap-2 ml-auto self-end">
                    <button onClick={() => setIsAppendOpen(true)} className="flex items-center gap-1.5 px-3 h-[34px] rounded-lg text-sm font-bold shadow-sm transition-colors border bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
                        <Upload size={14} className="text-blue-600" /> Append Tool
                    </button>

                    <button onClick={onExport} className="flex items-center gap-1.5 px-3 h-[34px] bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
                        <Download size={14} /> Export CSV
                    </button>

                    {onLogout && (
                        <button onClick={onLogout} title="Switch plant" className="flex items-center gap-1.5 px-3 h-[34px] rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors whitespace-nowrap">
                            <LogOut size={14} /> Switch Plant
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};
export default TopFilters;