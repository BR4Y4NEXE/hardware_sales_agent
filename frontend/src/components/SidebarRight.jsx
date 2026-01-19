import React from 'react';
import { Clock, Search, MoreHorizontal, MessageSquare } from 'lucide-react';

const HistoryItem = ({ title, time, active }) => (
    <div className={`p-3 rounded-xl cursor-pointer group transition-all ${active ? 'bg-white/5 border border-white/5' : 'hover:bg-white/5 border border-transparent'
        }`}>
        <div className="flex items-start gap-3">
            <MessageSquare size={16} className={`mt-1 ${active ? 'text-primary' : 'text-gray-500'}`} />
            <div className="flex-1 overflow-hidden">
                <h4 className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{time}</p>
            </div>
        </div>
    </div>
);

const SidebarRight = () => {
    return (
        <div className="w-80 border-l border-white/5 bg-[#0f0f12]/50 backdrop-blur-sm p-6 hidden lg:flex flex-col gap-6 z-20">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    History <span className="text-primary">✨</span>
                </h2>
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-400">
                    <Search size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</h3>
                    </div>
                    <div className="space-y-1">
                        <HistoryItem title="50 Codos PVC 1/2" time="Just now" active />
                        <HistoryItem title="Tubería Hidráulica" time="2h ago" />
                        <HistoryItem title="Válvulas de Esfera" time="5h ago" />
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Yesterday</h3>
                    </div>
                    <div className="space-y-1">
                        <HistoryItem title="Cinta Teflón Stock" time="Yesterday" />
                        <HistoryItem title="Pegamento PVC" time="Yesterday" />
                        <HistoryItem title="Cotización Juan Pérez" time="Yesterday" />
                    </div>
                </section>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-white/5">
                    <h4 className="text-sm font-medium text-white mb-1">Pro Plan</h4>
                    <p className="text-xs text-gray-400 mb-3">Get unlimited quotes and PDF exports.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarRight;
