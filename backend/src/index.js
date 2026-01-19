require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'QuoteMaster API' });
});

app.use('/api/chat', chatRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        tipo: 'error',
        mensaje: 'Endpoint no encontrado'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err.message);
    console.error(err.stack);

    res.status(500).json({
        tipo: 'error',
        mensaje: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🔧 QuoteMaster API Server           ║
║   Running on port ${PORT}               ║
║   Environment: ${process.env.NODE_ENV || 'development'}        ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
