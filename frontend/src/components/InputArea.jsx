import React, { useState } from 'react';
import { Send, Plus, Mic, Image as ImageIcon } from 'lucide-react';

const InputArea = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-[#0f0f12]/80 backdrop-blur-xl border-t border-white/5 z-30">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-end gap-2 bg-surface/80 border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                    <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0">
                        <Plus size={20} />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe lo que necesitas (ej: '50 codos pvc')..."
                        className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 max-h-32 min-h-[44px] py-3 resize-none custom-scrollbar font-medium"
                        rows={1}
                        disabled={disabled}
                    />

                    <div className="flex items-center gap-1 pb-1 shrink-0">
                        {/* <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
               <ImageIcon size={18} />
             </button>
             <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
               <Mic size={18} />
             </button> */}

                        <button
                            type="submit"
                            disabled={!input.trim() || disabled}
                            className="p-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all ml-1"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                <div className="text-center mt-3 text-[10px] text-gray-600 font-medium">
                    QuoteMaster puede cometer errores. Verifica siempre el SKU y precio final.
                </div>
            </form>
        </div>
    );
};

export default InputArea;
