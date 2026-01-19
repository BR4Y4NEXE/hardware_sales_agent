import React from 'react';
import { Home, BarChart2, User, Settings, Layers, Star } from 'lucide-react';

const NavItem = ({ icon: Icon, active = false }) => (
    <button
        className={`p-3 rounded-xl transition-all duration-300 group relative ${active ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={24} strokeWidth={2} />
        {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
        )}
        <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            Tooltip
        </div>
    </button>
);

const SidebarLeft = () => {
    return (
        <div className="w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-[#0f0f12]/50 backdrop-blur-sm z-20">
            {/* Brand Icon */}
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                <Layers className="text-white" size={24} />
            </div>

            <nav className="flex flex-col gap-2 w-full px-2">
                <NavItem icon={Home} active />
                <NavItem icon={BarChart2} />
                <NavItem icon={Star} />
                <NavItem icon={User} />
            </nav>

            <div className="mt-auto flex flex-col gap-4">
                <NavItem icon={Settings} />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto" />
            </div>
        </div>
    );
};

export default SidebarLeft;
