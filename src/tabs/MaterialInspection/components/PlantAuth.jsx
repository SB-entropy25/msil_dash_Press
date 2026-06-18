import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { loginPlant } from '../api/client';

const PlantAuth = ({ plant, onSuccess, onBack }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter your password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await loginPlant(plant.id, password);
            onSuccess(data);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Authentication failed. Please try again.';
            setError(typeof msg === 'string' ? msg : 'Authentication failed.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to plant selection
                </button>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 px-8 py-6 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck size={22} /></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Secure Access</span>
                        </div>
                        <h1 className="text-xl font-black leading-snug">
                            Welcome to {plant.display_name}
                        </h1>
                        <p className="text-slate-400 text-lg mt-2 font-medium">
                            Material Inspection Dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Plant Password
                        </label>
                        <div className="relative mb-4">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Enter password to access dashboard"
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-800 font-medium"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Access Dashboard'}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 mt-5 font-medium">
                            Session secured with JWT · Append requires re-authentication
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlantAuth;
