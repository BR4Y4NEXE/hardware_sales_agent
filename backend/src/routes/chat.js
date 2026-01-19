const express = require('express');
const router = express.Router();
const { processChat } = require('../services/groq'); // Changed from claude to groq

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                tipo: 'error',
                mensaje: 'Se requiere un array de "messages" con al menos un mensaje.'
            });
        }

        // Process with Groq
        const response = await processChat(messages);

        res.json(response);

    } catch (error) {
        console.error('❌ Error en /api/chat:', error.message);

        res.status(500).json({
            tipo: 'error',
            mensaje: error.message || 'Error interno del servidor'
        });
    }
});

module.exports = router;
