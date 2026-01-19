import React, { useRef, useEffect } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarjetaCotizacion, TarjetaClarificacion } from './Cards';

const MessageBubble = ({ message, onOptionSelect }) => {
    const isUser = message.role === 'user';

    // Si es un tool_result o sistema interno, no lo mostramos (o lo mostramos diferente)
    // Pero en nuestro flujo el backend ya devuelve la respuesta procesada.
    // Asumimos que message.content puede ser string o JSON parsed.

    const content = message.content;
    const isJson = typeof content === 'object' && content !== null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isUser
                ? 'bg-gradient-to-br from-gray-100 to-gray-300'
                : 'bg-gradient-to-br from-primary to-secondary'
                }`}>
                {isUser ? (
                    <User size={16} className="text-gray-800" />
                ) : (
                    <Bot size={16} className="text-white" />
                )}
            </div>

            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 mb-1 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-semibold text-gray-300">{isUser ? 'Vendedor' : 'QuoteMaster'}</span>
                    <span className="text-[10px] text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {isJson ? (
                    // Render based on JSON type
                    content.tipo === 'cotizacion' ? (
                        <TarjetaCotizacion data={content} />
                    ) : content.tipo === 'clarificacion' ? (
                        <TarjetaClarificacion data={content} onSelect={onOptionSelect} />
                    ) : content.tipo === 'error_tokens' ? (
                        <div className="glass-panel px-5 py-4 bg-yellow-500/10 border-yellow-500/30 rounded-xl max-w-md">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Límite de Tokens Alcanzado</h4>
                                    <p className="text-yellow-200/80 text-xs leading-relaxed mb-3">
                                        {content.mensaje}
                                    </p>
                                    <a
                                        href="https://console.groq.com/settings/billing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
                                    >
                                        Actualizar plan en Groq →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel px-4 py-3 bg-red-500/10 border-red-500/20 text-red-200">
                            {content.mensaje || JSON.stringify(content)}
                        </div>
                    )
                ) : (
                    <div className={`rounded-2xl px-5 py-3 shadow-md text-sm leading-relaxed ${isUser
                        ? 'bg-white text-gray-900 rounded-tr-none'
                        : 'bg-surface border border-white/10 text-gray-100 rounded-tl-none'
                        }`}>
                        {content}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ChatArea = ({ messages, isLoading, onOptionSelect }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scroll-smooth" ref={scrollRef}>
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 select-none">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 animate-pulse-slow">
                        <Bot size={40} className="text-primary/50" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">QuoteMaster AI</h2>
                    <p className="text-gray-400 max-w-sm">
                        Describe lo que necesitas usando tu propia jerga. Yo me encargo de los códigos y precios.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-3 max-w-md w-full">
                        {['50 codos de media', 'Cinta para fugas', 'Tubo pvc hidráulico', 'Pegamento azul'].map(ex => (
                            <div key={ex} className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-400">
                                "{ex}"
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} onOptionSelect={onOptionSelect} />
                ))}
            </AnimatePresence>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-primary" />
                        <span className="text-sm text-gray-400">Calculando precios...</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ChatArea;
