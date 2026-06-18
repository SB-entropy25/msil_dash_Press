import React from 'react';
import { Factory, MapPin, ChevronRight } from 'lucide-react';

const PLANT_META = {
    manesar: { gradient: 'from-sky-500 to-blue-700', icon: '🏭', tagline: 'Manesar Press Shop' },
    gurgaon: { gradient: 'from-indigo-500 to-violet-700', icon: '🏗️', tagline: 'Gurgaon Press Shop' },
    kharkhoda: { gradient: 'from-amber-500 to-orange-600', icon: '⚙️', tagline: 'Kharkhoda Press Shop' },
    hansalpur: { gradient: 'from-emerald-500 to-teal-700', icon: '🌿', tagline: 'Hansalpur Press Shop' },
};

const PlantLanding = ({ plants, onSelectPlant }) => {
    return (
        <div className="min-h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-y-auto">
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
            />

            <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-16">
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-lg font-bold tracking-widest uppercase text-slate-300 mb-6">
                        <Factory size={14} /> Material Inspection Quality Systems
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                        Material Inspection Dashboard
                    </h1>
                    <p className="text-slate-400 text-2xl max-w-xl mx-auto">
                        Select your press plant to access inspection analytics, daily monitoring, and master data tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                    {plants.map((plant) => {
                        const meta = PLANT_META[plant.id] || { gradient: 'from-slate-600 to-slate-800', icon: '🏭', tagline: 'Press Shop' };
                        return (
                            <button
                                key={plant.id}
                                onClick={() => onSelectPlant(plant)}
                                className="group relative text-left rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/25 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                <div className="relative p-6 lg:p-8 flex flex-col h-full min-h-[180px]">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-4xl">{meta.icon}</span>
                                        <ChevronRight size={22} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mt-1" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-1">{plant.display_name}</h2>
                                    <p className="text-sm text-slate-400 font-large flex items-center gap-1.5 mb-4">
                                        <MapPin size={13} /> {meta.tagline}
                                    </p>
                                    <div className="mt-auto pt-3 border-t border-white/10">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            {plant.master_file}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <p className="text-center text-slate-600 text-xs mt-12 font-large">
                    Authorized personnel only · Plant-specific credentials required
                </p>
            </div>
        </div>
    );
};

export default PlantLanding;
