import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';

const COLORS = ["#0052cc", "#e53e3e", "#d69e2e", "#2b6cb0", "#805ad5", "#c05621", "#276749", "#b83280", "#553c9a", "#2c7a7b"];
const TOOLTIPS = {
    "Yield Point": "Safe: <90% of UL | Caution: 90-100% of UL | Critical: ≥UL",
    "Yield Point Normal Dist": "Normal distribution of Yield Point with individual lot mappings.",
    "Ultimate Tensile Strength": "Safe: Center 70% of tolerance band | Caution: Outer margins | Critical: ≤LL or ≥UL",
    "UTS Normal Dist": "Normal distribution of Ultimate Tensile Strength with individual lot mappings.",
    "Elongation": "Safe: >110% of LL | Caution: 100-110% of LL | Critical: ≤LL",
    "Carbon %": "Safe: <90% of UL | Caution: 90-100% of UL | Critical: ≥UL",
    "Carbon % Normal Dist": "Normal distribution of Carbon % with individual lot mappings.",
    "TSYP Trend": "Safe: >1.20 | Caution: 1.15-1.20 | Critical: <1.15",
    "TSYP Bar Charts": "Higher TSYP indicates better formability. TSYP > 1.20 is preferred.",
    "TSYP Distribution": "Safe: >1.20 | Caution: 1.15-1.20 | Critical: <1.15",
    "Yield Point vs UTS": "TSYP > 1.20 preferred (points well above the line).",
    "Yield Point & UTS by Supplier": "Supplier comparison of key strength metrics."
};

const getMean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const getStd = (arr, mean) => arr.length > 1 ? Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1)) : 0;
const getNormalPdf = (x, mean, std) => (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));

const ChartDisplay = ({ chartData, settings, ALL_SLIDES, includedSlides, currentIndex, setCurrentIndex, isAutoPlay }) => {
    const [viewMode, setViewMode] = useState('Trend'); 

    useEffect(() => {
        if (!isAutoPlay || includedSlides.length === 0) return;
        const timer = setInterval(() => setCurrentIndex(prev => (prev + 1) % includedSlides.length), 5000);
        return () => clearInterval(timer);
    }, [isAutoPlay, includedSlides.length, setCurrentIndex]);

    const nextSlide = () => { setCurrentIndex(prev => (prev + 1) % includedSlides.length); setViewMode('Trend'); };
    const prevSlide = () => { setCurrentIndex(prev => (prev - 1 + includedSlides.length) % includedSlides.length); setViewMode('Trend'); };

    if (!chartData || chartData.length === 0 || includedSlides.length === 0) {
        return <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 font-semibold text-lg">No chart data or slides selected.</div>;
    }

    const activeSlideId = includedSlides[currentIndex];
    const activeSlideData = ALL_SLIDES.find(s => s.id === activeSlideId);
    if (!activeSlideData) return null;

    const activeMetric = activeSlideData.id;
    let colKey = ''; let yLabel = '';
    if (activeMetric.includes('Yield Point')) { colKey = 'Yield_Point'; yLabel = 'Yield Point (MPa)'; }
    else if (activeMetric.includes('Ultimate Tensile Strength') || activeMetric.includes('UTS Normal')) { colKey = 'UTS'; yLabel = 'UTS (MPa)'; }
    else if (activeMetric.includes('Elongation')) { colKey = 'Elongation'; yLabel = 'Elongation (%)'; }
    else if (activeMetric.includes('Carbon %')) { colKey = 'Carbon_pct'; yLabel = 'Carbon (%)'; }
    else if (activeMetric.includes('TSYP')) { colKey = 'TSYP'; yLabel = 'TSYP (UTS/YP)'; }

    const orderedLots = Array.from(new Set(chartData.filter(r => r['Inspection Lot']).map(r => r['Inspection Lot'])));

    const buildCustomData = (dataArray) => {
        return dataArray.map(r => [
            r['Inspection Lot'] || 'N/A', r['Inspection Lot Date'] || 'N/A', r['Material_Display'] || 'N/A', r['Supplier Name'] || 'N/A', 
            (r['Yield_Point'] !== null && r['Yield_Point'] !== "") ? Number(r['Yield_Point']).toFixed(1) : 'N/A',
            (r['UTS'] !== null && r['UTS'] !== "") ? Number(r['UTS']).toFixed(1) : 'N/A',
            (r['Elongation'] !== null && r['Elongation'] !== "") ? Number(r['Elongation']).toFixed(2) : 'N/A',
            (r['Carbon_pct'] !== null && r['Carbon_pct'] !== "") ? Number(r['Carbon_pct']).toFixed(4) : 'N/A',
            (r['TSYP'] !== null && r['TSYP'] !== "") ? Number(r['TSYP']).toFixed(4) : 'N/A',
            r[`${colKey}_LL`] || 'N/A', r[`${colKey}_UL`] || 'N/A'
        ]);
    };

    const getHoverTemplate = (isXValue = false) => {
        if (!settings.showHoverInfo) return isXValue ? '%{x}<extra></extra>' : '%{y}<extra></extra>';
        const valStr = isXValue ? '%{x:.4f}' : '%{y:.4f}';
        return `<b>Lot:</b> %{customdata[0]}<br><b>Date:</b> %{customdata[1]}<br><b>Material:</b> %{customdata[2]}<br><b>Supplier:</b> %{customdata[3]}<br>──────────────<br><b>Value:</b> ${valStr}<br><b>Yield Point:</b> %{customdata[4]} MPa<br><b>UTS:</b> %{customdata[5]} MPa<br><b>Elongation:</b> %{customdata[6]} %<br><b>Carbon %:</b> %{customdata[7]}<br><b>TSYP:</b> %{customdata[8]}<br><i>Limits: %{customdata[9]} to %{customdata[10]}</i><extra></extra>`;
    };

    const isOutlier = (row, metric) => {
        const val = parseFloat(row[colKey]);
        if (isNaN(val)) return false;
        if (metric.includes('Yield Point') && row[`${colKey}_UL`]) return val >= parseFloat(row[`${colKey}_UL`]);
        if (metric.includes('Carbon %') && row[`${colKey}_UL`]) return val >= parseFloat(row[`${colKey}_UL`]);
        if (metric.includes('Elongation') && row[`${colKey}_LL`]) return val <= parseFloat(row[`${colKey}_LL`]);
        if (metric.includes('Ultimate Tensile Strength')) {
            if (row[`${colKey}_LL`] && val <= parseFloat(row[`${colKey}_LL`])) return true;
            if (row[`${colKey}_UL`] && val >= parseFloat(row[`${colKey}_UL`])) return true;
        }
        if (metric.includes('TSYP')) return val < 1.15;
        return false;
    };

    const traces = []; const shapes = []; const annotations = [];
    
    let layoutConfig = { 
        autosize: true, margin: { t: 30, r: 40, l: 80, b: 130 }, showlegend: true, 
        legend: { orientation: 'h', yanchor: 'top', y: -0.35, xanchor: 'center', x: 0.5, font: { size: 12, color: '#334155' }, bordercolor: '#e2e8f0', borderwidth: 1 },
        plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff', font: { family: 'Inter, sans-serif' },
        xaxis: { autorange: true, tickangle: -45, tickfont: { size: 12, color: '#64748b', weight: '500' }, gridcolor: '#f8fafc', zerolinecolor: '#f8fafc', title: { font: { size: 15, color: '#0f172a', weight: 'bold' }, standoff: 15 }}, 
        yaxis: { autorange: true, tickfont: { size: 12, color: '#64748b', weight: '500' }, gridcolor: '#f8fafc', zerolinecolor: '#f8fafc', title: { font: { size: 16, color: '#0f172a', weight: 'bold' }, standoff: 15 }}
    };

    if (['Yield Point', 'Ultimate Tensile Strength', 'Elongation', 'Carbon %'].includes(activeMetric)) {
        let ll = null; let ul = null;
        const validLLs = chartData.map(r => parseFloat(r[`${colKey}_LL`])).filter(v => !isNaN(v));
        if (validLLs.length > 0) ll = Math.min(...validLLs);
        const validULs = chartData.map(r => parseFloat(r[`${colKey}_UL`])).filter(v => !isNaN(v));
        if (validULs.length > 0) ul = Math.max(...validULs);

        if (viewMode === 'Trend') {
            const grouped = {}; const outliers = [];
            chartData.forEach(r => {
                if (r[colKey] !== "" && r[colKey] != null) {
                    if (!grouped[r.Material_Display]) grouped[r.Material_Display] = [];
                    grouped[r.Material_Display].push(r);
                    if (isOutlier(r, activeMetric)) outliers.push(r);
                }
            });
            let colorIdx = 0;
            for (const [mat, rows] of Object.entries(grouped)) {
                traces.push({ x: rows.map(r => r['Inspection Lot']), y: rows.map(r => parseFloat(r[colKey])), mode: 'lines+markers', name: mat, type: 'scatter', marker: { size: 6 }, line: { width: 3, color: COLORS[colorIdx % COLORS.length] }, customdata: buildCustomData(rows), hovertemplate: getHoverTemplate() });
                colorIdx++;
            }
            if (settings.showOutliers && outliers.length > 0) {
                traces.push({ x: outliers.map(r => r['Inspection Lot']), y: outliers.map(r => parseFloat(r[colKey])), mode: 'markers', type: 'scatter', name: 'Critical Outlier', marker: { symbol: 'circle-open', color: '#ef4444', size: 18, line: { width: 3.5 } }, customdata: buildCustomData(outliers), hovertemplate: getHoverTemplate() });
            }
            if (settings.showZoneShading) {
                const vals = chartData.map(r => parseFloat(r[colKey])).filter(v => !isNaN(v));
                const dMin = vals.length ? Math.min(...vals) : 0; const dMax = vals.length ? Math.max(...vals) : 100;
                let pad = (dMax - dMin) * 0.15; if (pad === 0) pad = 10;
                let yTop = dMax + pad; let yBot = Math.max(0, dMin - pad);
                if (ul !== null) yTop = Math.max(yTop, ul + pad);
                if (ll !== null) yBot = Math.min(yBot, Math.max(0, ll - pad));

                if (['Yield Point', 'Carbon %'].includes(activeMetric) && ul !== null) {
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: yBot, y1: 0.90 * ul, fillcolor: 'rgba(34,197,94,0.06)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: 0.90 * ul, y1: ul, fillcolor: 'rgba(234,179,8,0.1)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ul, y1: yTop, fillcolor: 'rgba(239,68,68,0.12)', line: { width: 0 }, layer: 'below' });
                } else if (activeMetric === 'Elongation' && ll !== null) {
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: 1.10 * ll, y1: yTop, fillcolor: 'rgba(34,197,94,0.06)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ll, y1: 1.10 * ll, fillcolor: 'rgba(234,179,8,0.1)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: yBot, y1: ll, fillcolor: 'rgba(239,68,68,0.12)', line: { width: 0 }, layer: 'below' });
                } else if (activeMetric === 'Ultimate Tensile Strength' && ll !== null && ul !== null) {
                    const band = ul - ll;
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ll + 0.15 * band, y1: ul - 0.15 * band, fillcolor: 'rgba(34,197,94,0.06)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ll, y1: ll + 0.15 * band, fillcolor: 'rgba(234,179,8,0.1)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ul - 0.15 * band, y1: ul, fillcolor: 'rgba(234,179,8,0.1)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: yBot, y1: ll, fillcolor: 'rgba(239,68,68,0.12)', line: { width: 0 }, layer: 'below' });
                    shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: ul, y1: yTop, fillcolor: 'rgba(239,68,68,0.12)', line: { width: 0 }, layer: 'below' });
                }
            }
            if (settings.showSpecLimits) {
                if (ll !== null && ul !== null) {
                    const mean = (ll + ul) / 2;
                    shapes.push({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: mean, y1: mean, line: { color: '#0f172a', width: 2, dash: 'dot' }});
                    annotations.push({ xref: 'paper', x: 0, y: mean, xanchor: 'left', yanchor: 'bottom', text: `<b>— Mean = ${mean.toFixed(2)}</b>`, showarrow: false, font: {size: 12, color: '#0f172a'} });
                }
                if (ll !== null) {
                    shapes.push({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: ll, y1: ll, line: { color: '#ef4444', width: 2.5, dash: 'dash' }});
                    annotations.push({ xref: 'paper', x: 1, y: ll, xanchor: 'right', yanchor: 'top', text: `<b>▼ Lower Spec Limit (LL) = ${ll.toFixed(2)}</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} });
                }
                if (ul !== null) {
                    shapes.push({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: ul, y1: ul, line: { color: '#ef4444', width: 2.5, dash: 'dash' }});
                    annotations.push({ xref: 'paper', x: 1, y: ul, xanchor: 'right', yanchor: 'bottom', text: `<b>▲ Upper Spec Limit (UL) = ${ul.toFixed(2)}</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} });
                }
            }
            layoutConfig.xaxis.type = 'category'; layoutConfig.xaxis.categoryorder = 'array'; layoutConfig.xaxis.categoryarray = orderedLots;
            layoutConfig.xaxis.title.text = '<b>Inspection Lot</b>'; layoutConfig.yaxis.title.text = `<b>${yLabel}</b>`;

        } else {
            let colorIdx = 0; const grouped = {};
            chartData.forEach(r => { const val = parseFloat(r[colKey]); if (!isNaN(val)) { if(!grouped[r.Material_Display]) grouped[r.Material_Display] = []; grouped[r.Material_Display].push(val); }});
            for (const [mat, data] of Object.entries(grouped)) { traces.push({ x: data, type: 'histogram', name: mat, opacity: 0.85, marker: {color: COLORS[colorIdx % COLORS.length]} }); colorIdx++; }
            layoutConfig.barmode = 'stack'; layoutConfig.xaxis.title.text = `<b>${yLabel}</b>`; layoutConfig.yaxis.title.text = '<b>Number of Lots</b>'; layoutConfig.xaxis.tickangle = 0; 
            
            if (settings.showSpecLimits) {
                if (ll !== null && ul !== null) { const mean = (ll + ul) / 2; shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: mean, x1: mean, line: { color: '#0f172a', width: 2, dash: 'dot' }}); annotations.push({ yref: 'paper', y: 1, x: mean, xanchor: 'center', yanchor: 'bottom', text: `<b>Mean (${mean.toFixed(2)})</b>`, showarrow: false, font: {size: 12, color: '#0f172a'} }); }
                if (ll !== null) { shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: ll, x1: ll, line: { color: '#ef4444', width: 2.5, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: ll, xanchor: 'right', yanchor: 'top', text: `<b>LL (${ll.toFixed(2)})</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} }); }
                if (ul !== null) { shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: ul, x1: ul, line: { color: '#ef4444', width: 2.5, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: ul, xanchor: 'left', yanchor: 'top', text: `<b>UL (${ul.toFixed(2)})</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} }); }
            }
        }
    } 
    else if (activeMetric.includes('Normal Dist') || activeMetric === 'TSYP Distribution') {
        const validRows = chartData.filter(r => !isNaN(parseFloat(r[colKey])));
        const vals = validRows.map(r => parseFloat(r[colKey]));
        const mean = getMean(vals); const std = getStd(vals, mean);
        
        traces.push({ x: vals, type: 'histogram', histnorm: 'probability density', name: 'Observed', opacity: 0.35, marker: { color: COLORS[0] } });
        let colorIdx = 0; const groupedRows = {};
        validRows.forEach(r => { if(!groupedRows[r.Material_Display]) groupedRows[r.Material_Display] = []; groupedRows[r.Material_Display].push(r); });
        for (const [mat, rows] of Object.entries(groupedRows)) { traces.push({ x: rows.map(r => parseFloat(r[colKey])), y: rows.map(() => 0), mode: 'markers', name: mat, marker: { size: 8, color: COLORS[colorIdx % COLORS.length], opacity: 0.8, line: { width: 1, color: 'white' } }, customdata: buildCustomData(rows), hovertemplate: getHoverTemplate(true) }); colorIdx++; }

        if (std > 0) {
            const xCurve = []; const yCurve = []; for(let i=0; i<=100; i++){ const x = mean - 4*std + (8*std * (i/100)); xCurve.push(x); yCurve.push(getNormalPdf(x, mean, std)); }
            traces.push({ x: xCurve, y: yCurve, type: 'scatter', mode: 'lines', name: `N(μ=${mean.toFixed(4)}, σ=${std.toFixed(4)})`, line: {color: '#f97316', width: 3.5} });
            if (settings.showZoneShading) { shapes.push({ type: 'rect', xref: 'x', yref: 'paper', x0: mean-3*std, x1: mean+3*std, y0: 0, y1: 1, fillcolor: 'rgba(239,68,68,0.08)', line: {width:0}, layer:'below' }); shapes.push({ type: 'rect', xref: 'x', yref: 'paper', x0: mean-2*std, x1: mean+2*std, y0: 0, y1: 1, fillcolor: 'rgba(249,115,22,0.1)', line: {width:0}, layer:'below' }); shapes.push({ type: 'rect', xref: 'x', yref: 'paper', x0: mean-std, x1: mean+std, y0: 0, y1: 1, fillcolor: 'rgba(234,179,8,0.15)', line: {width:0}, layer:'below' }); }
            if (settings.showSpecLimits) {
                shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: mean, x1: mean, line: { color: '#0ea5e9', width: 2, dash: 'solid' }}); annotations.push({ yref: 'paper', y: 1, x: mean, xanchor: 'center', yanchor: 'bottom', text: '<b>μ</b>', showarrow: false, font: {size: 13, color: '#0ea5e9'} });
                shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: mean+std, x1: mean+std, line: { color: '#f59e0b', width: 2, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: mean+std, xanchor: 'center', yanchor: 'bottom', text: '<b>+1σ</b>', showarrow: false, font: {size: 12, color: '#f59e0b'} });
                shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: mean-std, x1: mean-std, line: { color: '#f59e0b', width: 2, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: mean-std, xanchor: 'center', yanchor: 'bottom', text: '<b>-1σ</b>', showarrow: false, font: {size: 12, color: '#f59e0b'} });
            }
        }
        layoutConfig.xaxis.title.text = `<b>${yLabel}</b>`; layoutConfig.xaxis.tickangle = 0; layoutConfig.yaxis.title.text = '<b>Probability Density</b>';
    }
    else if (activeMetric === 'TSYP Trend') {
        const grouped = {}; const outliers = [];
        chartData.forEach(r => { const tsypVal = parseFloat(r.TSYP); if (!isNaN(tsypVal)) { if(!grouped[r.Material_Display]) grouped[r.Material_Display] = []; grouped[r.Material_Display].push(r); if (isOutlier(r, activeMetric)) outliers.push(r); }});
        let colorIdx = 0; for (const [mat, rows] of Object.entries(grouped)) { traces.push({ x: rows.map(r=>r['Inspection Lot']), y: rows.map(r=>parseFloat(r.TSYP)), mode: 'lines+markers', name: mat, type: 'scatter', line: {color: COLORS[colorIdx % COLORS.length]}, customdata: buildCustomData(rows), hovertemplate: getHoverTemplate() }); colorIdx++; }
        if (settings.showOutliers && outliers.length > 0) { traces.push({ x: outliers.map(r=>r['Inspection Lot']), y: outliers.map(r=>parseFloat(r.TSYP)), mode: 'markers', type: 'scatter', name: 'Critical Point', marker: { symbol: 'circle-open', color: '#ef4444', size: 16, line: { width: 3 } }, customdata: buildCustomData(outliers), hovertemplate: getHoverTemplate() }); }
        if (settings.showSpecLimits) { shapes.push({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: 1.0, y1: 1.0, line: { color: '#0f172a', width: 2, dash: 'dot' }}); annotations.push({ xref: 'paper', x: 0, y: 1.0, xanchor: 'left', yanchor: 'bottom', text: `<b>— Minimum TSYP Ratio = 1.0</b>`, showarrow: false, font: {size: 12, color: '#0f172a'} }); }
        if (settings.showZoneShading) {
            const vals = chartData.map(r => parseFloat(r.TSYP)).filter(v => !isNaN(v)); const dMin = vals.length ? Math.min(...vals) : 1.0; const dMax = vals.length ? Math.max(...vals) : 1.5; const pad = (dMax - dMin) * 0.15 || 0.1; const yTop = Math.max(dMax + pad, 1.30); const yBot = Math.min(Math.max(0, dMin - pad), 1.10);
            shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: 1.20, y1: yTop, fillcolor: 'rgba(34,197,94,0.06)', line: { width: 0 }, layer: 'below' }); shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: 1.15, y1: 1.20, fillcolor: 'rgba(234,179,8,0.1)', line: { width: 0 }, layer: 'below' }); shapes.push({ type: 'rect', xref: 'paper', x0: 0, x1: 1, y0: yBot, y1: 1.15, fillcolor: 'rgba(239,68,68,0.12)', line: { width: 0 }, layer: 'below' });
        }
        layoutConfig.xaxis.type = 'category'; layoutConfig.xaxis.categoryorder = 'array'; layoutConfig.xaxis.categoryarray = orderedLots; layoutConfig.xaxis.title.text = '<b>Inspection Lot</b>'; layoutConfig.yaxis.title.text = '<b>TSYP Ratio (UTS/YP)</b>';
    }
    else if (activeMetric === 'Yield Point vs UTS') {
        const grouped = {}; chartData.forEach(r => { const ypVal = parseFloat(r.Yield_Point); const utsVal = parseFloat(r.UTS); if(!isNaN(ypVal) && !isNaN(utsVal)){ if(!grouped[r.Material_Display]) grouped[r.Material_Display] = []; grouped[r.Material_Display].push(r); }});
        let colorIdx = 0; for (const [mat, rows] of Object.entries(grouped)) { traces.push({ x: rows.map(r=>parseFloat(r.Yield_Point)), y: rows.map(r=>parseFloat(r.UTS)), mode: 'markers', type: 'scatter', name: mat, marker: { size: 8, opacity: 0.8, color: COLORS[colorIdx % COLORS.length] }, customdata: buildCustomData(rows), hovertemplate: getHoverTemplate() }); colorIdx++; }
        const validYPs = chartData.map(r => parseFloat(r.Yield_Point)).filter(v => !isNaN(v)); if(validYPs.length > 0){ const minX = Math.min(...validYPs); const maxX = Math.max(...validYPs); traces.push({ x: [minX, maxX], y: [minX, maxX], mode: 'lines', name: 'TSYP = 1.0 (UTS = YP)', line: { dash: 'dot', color: '#64748b', width: 2 }, hoverinfo: 'skip' }); }
        if (settings.showSpecLimits) {
            let ll = null; let ul = null; let uts_ll = null;
            const validYpLLs = chartData.map(r => parseFloat(r['Yield_Point_LL'])).filter(v => !isNaN(v)); if (validYpLLs.length > 0) ll = Math.min(...validYpLLs);
            const validYpULs = chartData.map(r => parseFloat(r['Yield_Point_UL'])).filter(v => !isNaN(v)); if (validYpULs.length > 0) ul = Math.max(...validYpULs);
            const validUtsLLs = chartData.map(r => parseFloat(r['UTS_LL'])).filter(v => !isNaN(v)); if (validUtsLLs.length > 0) uts_ll = Math.min(...validUtsLLs);
            if (ll !== null) { shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: ll, x1: ll, line: { color: '#ef4444', width: 2.5, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: ll, xanchor: 'right', yanchor: 'top', text: `<b>◀ YP LL (${ll.toFixed(0)})</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} }); }
            if (ul !== null) { shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: ul, x1: ul, line: { color: '#ef4444', width: 2.5, dash: 'dash' }}); annotations.push({ yref: 'paper', y: 1, x: ul, xanchor: 'left', yanchor: 'top', text: `<b>▶ YP UL (${ul.toFixed(0)})</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} }); }
            if (ll !== null && ul !== null) { const mean = (ll + ul) / 2; shapes.push({ type: 'line', yref: 'paper', y0: 0, y1: 1, x0: mean, x1: mean, line: { color: '#0f172a', width: 2, dash: 'dot' }}); }
            if (uts_ll !== null) { shapes.push({ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: uts_ll, y1: uts_ll, line: { color: '#ef4444', width: 2.5, dash: 'dash' }}); annotations.push({ xref: 'paper', x: 1, y: uts_ll, xanchor: 'right', yanchor: 'bottom', text: `<b>▼ UTS LL (${uts_ll.toFixed(0)})</b>`, showarrow: false, font: {size: 12, color: '#ef4444'} }); }
        }
        layoutConfig.xaxis.title.text = '<b>Yield Point (MPa)</b>'; layoutConfig.xaxis.tickangle = 0; layoutConfig.yaxis.title.text = '<b>UTS (MPa)</b>';
    }
    else if (activeMetric === 'TSYP Bar Charts' || activeMetric === 'Yield Point & UTS by Supplier') {
        let stats = [];
        if (activeMetric === 'TSYP Bar Charts') {
            const matStats = {}; chartData.forEach(r => { const val = parseFloat(r.TSYP); if(!isNaN(val)) { if(!matStats[r.Material_Display]) matStats[r.Material_Display] = []; matStats[r.Material_Display].push(val); } });
            stats = Object.keys(matStats).map(mat => ({ mat: mat.length>20?mat.substring(0,20)+'...':mat, avg: getMean(matStats[mat]), std: getStd(matStats[mat], getMean(matStats[mat])) })).sort((a,b)=>a.avg-b.avg);
            return (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6 font-sans">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">{activeSlideData.label} <span title={TOOLTIPS[activeMetric]} className="cursor-help text-blue-500 hover:text-blue-700 transition-colors"><Info size={20} /></span></h2>
                    
                    {/* RESPONSIVE FIX: Replaced fixed h-[550px] with responsive height bounds */}
                    <div className="flex flex-col xl:flex-row gap-8 w-full h-auto xl:h-[50vh] min-h-[400px] max-h-[550px]">
                        <div className="w-full xl:w-1/2">
                            <Plot data={[{ type: 'bar', x: stats.map(s=>s.avg), y: stats.map(s=>s.mat), orientation: 'h', marker: {color:'#0ea5e9'}, text: stats.map(s=>s.avg.toFixed(3)), textposition: 'outside', textfont: {size: 12, weight: 'bold', color: '#1e293b'} }]} layout={{ title: {text: '<b>Avg TSYP by Material</b>', font: {size: 16}}, margin: {l: 160, r: 40, t: 40, b: 60}, xaxis: {autorange: true, title: {text: '<b>Avg TSYP</b>', font: {size: 14}}}, plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff', font: {family: 'Inter, sans-serif'} }} useResizeHandler={true} config={{ responsive: true }} style={{ width: '100%', height: '100%' }}/>
                        </div>
                        <div className="w-full xl:w-1/2">
                            <Plot data={[{ type: 'bar', x: stats.map(s=>s.std), y: stats.map(s=>s.mat), orientation: 'h', marker: {color:'#f97316'}, text: stats.map(s=>s.std.toFixed(4)), textposition: 'outside', textfont: {size: 12, weight: 'bold', color: '#1e293b'} }]} layout={{ title: {text: '<b>Std Dev TSYP by Material</b>', font: {size: 16}}, margin: {l: 160, r: 40, t: 40, b: 60}, xaxis: {autorange: true, title: {text: '<b>Std Dev TSYP</b>', font: {size: 14}}}, plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff', font: {family: 'Inter, sans-serif'} }} useResizeHandler={true} config={{ responsive: true }} style={{ width: '100%', height: '100%' }}/>
                        </div>
                    </div>
                </div>
            );
        } else {
            const supAgg = {}; chartData.forEach(r => { const sup = r['Supplier Name']; if(!supAgg[sup]) supAgg[sup] = { yp: [], uts: [] }; if(!isNaN(parseFloat(r.Yield_Point))) supAgg[sup].yp.push(parseFloat(r.Yield_Point)); if(!isNaN(parseFloat(r.UTS))) supAgg[sup].uts.push(parseFloat(r.UTS)); });
            stats = Object.keys(supAgg).map(sup => ({ sup: sup.length > 25 ? sup.substring(0,25)+'..' : sup, avgYp: getMean(supAgg[sup].yp), avgUts: getMean(supAgg[sup].uts) })).sort((a,b) => a.avgYp - b.avgYp);
            traces.push({ type: 'bar', y: stats.map(s=>s.sup), x: stats.map(s=>s.avgYp), name: 'Avg Yield Point', orientation: 'h', marker: {color: COLORS[0]}, text: stats.map(s=>s.avgYp.toFixed(0)), textposition: 'outside', textfont: {size: 12, weight: 'bold', color: '#1e293b'} });
            traces.push({ type: 'bar', y: stats.map(s=>s.sup), x: stats.map(s=>s.avgUts), name: 'Avg UTS', orientation: 'h', marker: {color: COLORS[4]}, text: stats.map(s=>s.avgUts.toFixed(0)), textposition: 'outside', textfont: {size: 12, weight: 'bold', color: '#1e293b'} });
            layoutConfig.barmode = 'group'; layoutConfig.xaxis.title.text = '<b>Average Value (MPa)</b>'; layoutConfig.yaxis.title.text = ''; layoutConfig.xaxis.tickangle = 0; layoutConfig.margin.l = 180; 
        }
    }

    layoutConfig.shapes = shapes;
    layoutConfig.annotations = annotations;

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden font-sans w-full">
            {/* Header Area */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 w-full">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    {activeSlideData.label} 
                    <span title={TOOLTIPS[activeMetric]} className="cursor-help text-blue-500 hover:text-blue-700 transition-colors"><Info size={22} /></span>
                </h2>

                {activeSlideData.hasViews && (
                    <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={viewMode === 'Trend'} onChange={() => setViewMode('Trend')} className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-600" />
                            <span className="text-sm font-bold text-slate-700">Trend Line</span>
                        </label>
                        <div className="w-px h-5 bg-slate-200"></div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={viewMode === 'Distribution'} onChange={() => setViewMode('Distribution')} className="w-5 h-5 text-slate-900 border-slate-300 focus:ring-slate-900" />
                            <span className="text-sm font-bold text-slate-700">Count Histogram</span>
                        </label>
                    </div>
                )}
            </div>

            {/* RESPONSIVE FIX: Absolute positioning for buttons and responsive height bounds for graph container */}
            <div className="p-4 bg-white relative group w-full">
                
                {/* Left Button - Floating */}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur border border-slate-200 text-slate-500 p-2.5 rounded-full shadow-lg hover:text-blue-600 hover:border-blue-300 hover:scale-110 transition-all hidden md:block">
                    <ChevronLeft size={32} />
                </button>
                
                {/* Responsive Chart Container */}
                <div className="w-full px-2 md:px-12 h-[50vh] min-h-[400px] max-h-[550px]">
                    <Plot 
                        data={traces} 
                        layout={layoutConfig} 
                        useResizeHandler={true} 
                        config={{ responsive: true }} /* Forces Plotly to scale cleanly */
                        style={{ width: '100%', height: '100%' }} 
                    />
                </div>

                {/* Right Button - Floating */}
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur border border-slate-200 text-slate-500 p-2.5 rounded-full shadow-lg hover:text-blue-600 hover:border-blue-300 hover:scale-110 transition-all hidden md:block">
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
};
export default ChartDisplay;