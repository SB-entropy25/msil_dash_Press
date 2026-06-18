import React, { useState, useEffect } from 'react';
import { X, Upload, DatabaseBackup, Download, History, Play, Lock, Loader2 } from 'lucide-react';
import { api, verifyAppendPassword, downloadAppendLog } from '../api/client';

const AppendAuthGate = ({ plantInfo, onUnlocked, onClose }) => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
                <div>
                    <h3 className="font-black text-lg">Append Authorization</h3>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">{plantInfo?.display_name}</p>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={18} /></button>
            </div>
            <AppendPasswordForm plantInfo={plantInfo} onUnlocked={onUnlocked} />
        </div>
    </div>
);

const AppendPasswordForm = ({ plantInfo, onUnlocked }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyAppendPassword(password);
            onUnlocked();
        } catch (err) {
            const msg = err.response?.data?.detail || 'Incorrect password.';
            setError(typeof msg === 'string' ? msg : 'Authorization failed.');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <p className="text-sm text-slate-600 mb-4 font-medium">
                Re-enter your plant password to authorize master file append operations. Access expires in 15 minutes.
            </p>
            <div className="relative mb-4">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Plant password"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                />
            </div>
            {error && <div className="mb-4 text-sm font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Authorize Append'}
            </button>
        </form>
    );
};

const AppendTool = ({ isOpen, onClose, onAppendSuccess, plantInfo }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [appendUnlocked, setAppendUnlocked] = useState(false);
    const [showAuthGate, setShowAuthGate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAppendUnlocked(false);
            setShowAuthGate(true);
            setFile(null);
            setPreview(null);
            setResult(null);
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/append/history');
            setHistory(res.data);
        } catch (e) {
            if (e.response?.status === 403) setAppendUnlocked(false);
            console.error("History fetch error", e);
        }
    };

    useEffect(() => {
        if (isOpen && appendUnlocked) fetchHistory();
    }, [isOpen, appendUnlocked]);

    const handleUpload = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f); setLoading(true); setResult(null);
        try {
            const formData = new FormData();
            formData.append('file', f);
            const res = await api.post('/append/preview', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.error) alert(res.data.error);
            else setPreview(res.data);
        } catch (error) {
            if (error.response?.status === 403) {
                setAppendUnlocked(false);
                setShowAuthGate(true);
                alert("Append authorization expired. Please re-enter your password.");
            } else {
                alert("Error previewing file.");
            }
        }
        setLoading(false);
    };

    const confirmAppend = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/append/commit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.error) alert(res.data.error);
            else {
                setResult(res.data);
                setPreview(null); setFile(null);
                fetchHistory();
                if (onAppendSuccess) onAppendSuccess();
            }
        } catch (error) {
            if (error.response?.status === 403) {
                setAppendUnlocked(false);
                setShowAuthGate(true);
                alert("Append authorization expired. Please re-enter your password.");
            } else {
                alert("Server error appending to master.");
            }
        }
        setLoading(false);
    };

    const handleRestore = async () => {
        if (!window.confirm("Are you sure you want to overwrite the master with the last backup?")) return;
        try {
            const res = await api.post('/append/restore');
            alert(res.data.success || res.data.error);
            if (res.data.success && onAppendSuccess) onAppendSuccess();
        } catch (e) {
            if (e.response?.status === 403) {
                setAppendUnlocked(false);
                setShowAuthGate(true);
            } else {
                alert("Restore failed.");
            }
        }
    };

    const downloadLog = async () => {
        try {
            await downloadAppendLog(plantInfo?.master_file?.replace('master', 'transaction') || 'transaction_log.xlsx');
        } catch {
            alert("Could not download log.");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {showAuthGate && !appendUnlocked && (
                <AppendAuthGate
                    plantInfo={plantInfo}
                    onUnlocked={() => { setAppendUnlocked(true); setShowAuthGate(false); }}
                    onClose={onClose}
                />
            )}

            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] transition-opacity" onClick={onClose}></div>

            <div className={`fixed top-0 right-0 h-full w-[650px] bg-slate-50 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white shadow-sm shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">📊 Master Data Append Tool</h2>
                        {plantInfo && <p className="text-xs font-bold text-blue-600 mt-0.5">{plantInfo.display_name} · {plantInfo.master_file}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {!appendUnlocked ? (
                    <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-medium text-sm">
                        Awaiting append authorization...
                    </div>
                ) : (
                <div className="p-6 flex-1 overflow-y-auto font-sans">

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Upload Monthly File (.xlsx)</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-blue-500" />
                                    <p className="mb-2 text-sm text-slate-500"><span className="font-bold text-blue-600">Click to upload</span> your monthly file</p>
                                    <p className="text-xs text-slate-400">Excel files (.xlsx) only</p>
                                </div>
                                <input id="dropzone-file" type="file" accept=".xlsx" className="hidden" onChange={handleUpload} />
                            </label>
                        </div>
                        {loading && <div className="text-blue-600 text-sm font-bold mt-4 animate-pulse text-center">Processing file... Please wait.</div>}
                        {file && !loading && !result && <div className="text-green-600 text-sm font-bold mt-4 text-center">File selected: {file.name}</div>}
                    </div>

                    {result && (
                        <div className="bg-green-50 border border-green-200 p-5 rounded-xl mb-6 shadow-sm">
                            <h3 className="text-green-800 font-bold text-lg mb-2">✅ Master updated successfully.</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm text-green-900">
                                <div><span className="font-bold">Transaction:</span> {result.transaction}</div>
                                <div><span className="font-bold">Rows Added:</span> {result.rows_added}</div>
                                <div><span className="font-bold">Rows Ignored:</span> {result.rows_ignored}</div>
                                <div className="col-span-2 mt-2"><span className="font-bold">Backup Generated:</span> <br/><span className="text-xs">{result.backup_file}</span></div>
                            </div>
                            <button onClick={() => setResult(null)} className="mt-4 text-sm font-bold text-green-700 underline">Upload another file</button>
                        </div>
                    )}

                    {preview && (
                        <div className="space-y-6 mb-8">
                            <div className="grid grid-cols-5 gap-2 text-center">
                                <div className="bg-white border rounded-lg p-2"><div className="text-lg font-black text-slate-700">{preview.master_before}</div><div className="text-[9px] font-bold uppercase text-slate-400">Master Before</div></div>
                                <div className="bg-white border rounded-lg p-2"><div className="text-lg font-black text-slate-700">{preview.monthly_rows}</div><div className="text-[9px] font-bold uppercase text-slate-400">Monthly Rows</div></div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2"><div className="text-lg font-black text-blue-700">{preview.rows_added}</div><div className="text-[9px] font-bold uppercase text-blue-600">Rows Added</div></div>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2"><div className="text-lg font-black text-amber-700">{preview.rows_ignored}</div><div className="text-[9px] font-bold uppercase text-amber-600">Rows Ignored</div></div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-2"><div className="text-lg font-black text-green-700">{preview.master_after}</div><div className="text-[9px] font-bold uppercase text-green-600">Master After</div></div>
                            </div>

                            {preview.rows_added > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 border-b pb-1">Rows Added (Preview Top 100)</h4>
                                    <div className="max-h-48 overflow-auto border border-slate-200 rounded bg-white text-xs shadow-inner">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead className="bg-slate-100 sticky top-0 text-slate-600">
                                                <tr>
                                                    <th className="p-2.5 border-b border-r font-bold">Inspection Lot</th>
                                                    <th className="p-2.5 border-b border-r font-bold">Material</th>
                                                    <th className="p-2.5 border-b border-r font-bold">Check Item</th>
                                                    <th className="p-2.5 border-b font-bold">Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {preview.preview_added.map((r, i) => (
                                                    <tr key={i} className="border-b hover:bg-slate-50 transition-colors">
                                                        <td className="p-2.5 border-r font-semibold text-slate-800">{r["Inspection Lot"]}</td>
                                                        <td className="p-2.5 border-r truncate max-w-[200px]" title={r["Material Description"]}>{r["Material Number"]}</td>
                                                        <td className="p-2.5 border-r text-slate-600">{r["Check Item"]}</td>
                                                        <td className="p-2.5 font-black text-blue-600">{r["Result Recorded"]}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <button onClick={confirmAppend} disabled={loading} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                                <Play size={18} /> Confirm & Append To Master
                            </button>
                        </div>
                    )}

                    <div className="border-t border-slate-300 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><History size={16}/> Last 10 Transactions</h3>
                        </div>

                        {history.length > 0 ? (
                            <div className="max-h-60 overflow-auto border border-slate-200 rounded-lg bg-white shadow-sm mb-4">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-800 text-white sticky top-0">
                                        <tr><th className="p-2.5">Trx No</th><th className="p-2.5">Timestamp</th><th className="p-2.5">File</th><th className="p-2.5 text-center">Added</th><th className="p-2.5 text-center">Ignored</th></tr>
                                    </thead>
                                    <tbody>
                                        {history.map((h, i) => (
                                            <tr key={i} className="border-b hover:bg-slate-50">
                                                <td className="p-2.5 font-semibold text-blue-600">{h['Transaction No']}</td><td className="p-2.5">{h['Timestamp']}</td><td className="p-2.5 truncate max-w-[100px]">{h['Monthly File']}</td><td className="p-2.5 text-center font-bold text-blue-600">{h['Rows Added']}</td><td className="p-2.5 text-center text-slate-500">{h['Rows Ignored']}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 italic mb-4 bg-slate-100 p-4 rounded-lg text-center border border-dashed border-slate-300">No transactions logged yet.</div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={downloadLog} className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 flex justify-center items-center gap-2"><Download size={16}/> Download Log</button>
                            <button onClick={handleRestore} className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 flex justify-center items-center gap-2"><DatabaseBackup size={16}/> Restore Backup</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
    );
};

export default AppendTool;
