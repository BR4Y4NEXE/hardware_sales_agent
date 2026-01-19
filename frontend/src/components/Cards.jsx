import React from 'react';
import { ShoppingCart, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TarjetaCotizacion = ({ data }) => {
    const { items, total, notas } = data;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-0 overflow-hidden max-w-lg w-full my-2 shadow-2xl shadow-black/50"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <ShoppingCart size={18} />
                    </div>
                    <h3 className="text-white font-semibold">Cotización Generada</h3>
                </div>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    CMD-{(Math.random() * 1000).toFixed(0)}
                </span>
            </div>

            {/* Items Table */}
            <div className="p-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-white/5">
                            <th className="pb-2 font-medium">Cant</th>
                            <th className="pb-2 font-medium">Producto</th>
                            <th className="pb-2 font-medium text-right">P. Unit</th>
                            <th className="pb-2 font-medium text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map((item, idx) => (
                            <tr key={idx} className="group">
                                <td className="py-3 text-gray-400 font-mono">{item.cantidad}x</td>
                                <td className="py-3 text-gray-200">
                                    <div className="font-medium">{item.nombre}</div>
                                    <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                                </td>
                                <td className="py-3 text-gray-400 text-right font-mono">${item.precio_unitario.toFixed(2)}</td>
                                <td className="py-3 text-white text-right font-mono font-medium">${item.subtotal.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="bg-black/20 p-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" />
                        {notas || 'Precios sujetos a cambio'}
                    </div>
                    <div className="text-right">
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Total</span>
                        <div className="text-2xl font-bold text-white font-mono tracking-tight">
                            ${total.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors border border-white/5">
                        <FileText size={14} />
                        Exportar PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-medium text-white transition-colors shadow-lg shadow-primary/20">
                        <CheckCircle size={14} />
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const TarjetaClarificacion = ({ data, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 max-w-md w-full my-2 border-l-4 border-yellow-500"
        >
            <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-white font-medium text-sm">¿Cuál necesitas?</h4>
                    <p className="text-sm text-gray-400 mt-1">{data.mensaje}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-3 pl-8">
                {data.opciones?.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(opt.material || opt.tamaño || opt)}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-yellow-500/50 transition-all text-left group"
                    >
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {typeof opt === 'object' ? (opt.material || opt.tamaño || JSON.stringify(opt)) : opt}
                        </span>
                        {opt.precio && (
                            <span className="text-xs font-mono text-gray-500 group-hover:text-yellow-500">
                                ${opt.precio}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export { TarjetaCotizacion, TarjetaClarificacion };
