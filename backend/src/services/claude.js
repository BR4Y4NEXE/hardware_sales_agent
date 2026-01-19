require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const SYSTEM_PROMPT = require('../lib/systemPrompt');
const { consultarInventario, consultarInventarioTool } = require('../tools/consultarInventario');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Process messages with Claude and handle tool calls
 * @param {Array} messages - Array of conversation messages
 * @returns {Object} - Claude's response parsed as JSON
 */
async function processChat(messages) {
    try {
        let currentMessages = [...messages];
        let continueLoop = true;
        let finalResponse = null;

        while (continueLoop) {
            const response = await client.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2048,
                system: SYSTEM_PROMPT,
                tools: [consultarInventarioTool],
                messages: currentMessages
            });

            // Check if Claude wants to use a tool
            const toolUseBlock = response.content.find(block => block.type === 'tool_use');

            if (toolUseBlock) {
                // Execute the tool
                console.log(`🔧 Tool call: ${toolUseBlock.name}`, toolUseBlock.input);

                let toolResult;
                if (toolUseBlock.name === 'consultar_inventario') {
                    toolResult = consultarInventario(toolUseBlock.input);
                }

                console.log(`📊 Tool result:`, toolResult);

                // Add assistant response and tool result to messages
                currentMessages.push({
                    role: 'assistant',
                    content: response.content
                });

                currentMessages.push({
                    role: 'user',
                    content: [{
                        type: 'tool_result',
                        tool_use_id: toolUseBlock.id,
                        content: JSON.stringify(toolResult)
                    }]
                });

                // Continue the loop to get next response
            } else {
                // No more tool calls, extract final response
                const textBlock = response.content.find(block => block.type === 'text');
                if (textBlock) {
                    finalResponse = textBlock.text;
                }
                continueLoop = false;
            }
        }

        // Parse the final response as JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(finalResponse);
        } catch (parseError) {
            console.error('❌ Error parsing JSON:', finalResponse);
            parsedResponse = {
                tipo: 'error',
                mensaje: 'Error procesando la respuesta. Por favor intenta de nuevo.'
            };
        }

        return parsedResponse;

    } catch (error) {
        console.error('❌ Claude API Error:', error.message);

        if (error.status === 401) {
            throw new Error('API Key inválida. Verifica ANTHROPIC_API_KEY en .env');
        }

        throw new Error('Error comunicándose con Claude API');
    }
}

module.exports = {
    processChat
};
