require('dotenv').config();
const Groq = require('groq-sdk');
const SYSTEM_PROMPT = require('../lib/systemPrompt');
const { consultarInventario, consultarInventarioTool } = require('../tools/consultarInventario');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Process messages with Groq and handle tool calls
 * @param {Array} messages - Array of conversation messages
 * @returns {Object} - Groq's response parsed as JSON
 */
async function processChat(messages) {
    try {
        let currentMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ];
        let continueLoop = true;
        let finalResponse = null;
        let iterations = 0;
        const MAX_ITERATIONS = 10;

        while (continueLoop && iterations < MAX_ITERATIONS) {
            iterations++;
            console.log(`🔄 Iteration ${iterations}/${MAX_ITERATIONS}`);

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile', // Back to 3.3 which is current and available
                messages: currentMessages,
                tools: [consultarInventarioTool],
                tool_choice: 'auto',
                temperature: 0.1 // Lower temperature for more deterministic function calling
            });

            const responseMessage = response.choices[0].message;
            console.log('📨 Response message:', JSON.stringify(responseMessage, null, 2));

            // Check for tool calls
            if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                console.log(`🔧 Processing ${responseMessage.tool_calls.length} tool call(s)`);

                // Add assistant's message with tool calls to history
                currentMessages.push(responseMessage);

                // Process each tool call
                for (const toolCall of responseMessage.tool_calls) {
                    console.log(`🔧 Tool call:`, JSON.stringify(toolCall, null, 2));

                    if (toolCall.function && toolCall.function.name === 'consultar_inventario') {
                        try {
                            console.log(`📥 Function arguments:`, toolCall.function.arguments);

                            const toolArgs = JSON.parse(toolCall.function.arguments);

                            // Validate arguments
                            if (!toolArgs.query) {
                                throw new Error('Missing required "query" parameter');
                            }

                            const toolResult = consultarInventario(toolArgs);
                            console.log(`📊 Tool result:`, JSON.stringify(toolResult, null, 2));

                            // Add tool response to history
                            currentMessages.push({
                                role: 'tool',
                                tool_call_id: toolCall.id,
                                name: 'consultar_inventario',
                                content: JSON.stringify(toolResult)
                            });
                        } catch (toolError) {
                            console.error(`❌ Error executing tool:`, toolError);
                            // Add error response
                            currentMessages.push({
                                role: 'tool',
                                tool_call_id: toolCall.id,
                                name: 'consultar_inventario',
                                content: JSON.stringify({
                                    error: toolError.message,
                                    total_resultados: 0,
                                    encontrados: []
                                })
                            });
                        }
                    }
                }
                // Loop continues to get next response from model
            } else {
                // No tool calls, this is the final textual response
                finalResponse = responseMessage.content;
                console.log('✅ Final response received');
                continueLoop = false;
            }
        }

        if (iterations >= MAX_ITERATIONS) {
            console.warn('⚠️ Max iterations reached, forcing completion');
            finalResponse = finalResponse || JSON.stringify({
                tipo: 'error',
                mensaje: 'Se alcanzó el límite de procesamiento. Por favor intenta de nuevo.'
            });
        }

        // Parse the final response as JSON
        let parsedResponse;
        try {
            // Try direct parsing first
            parsedResponse = JSON.parse(finalResponse);
            console.log('✅ Direct JSON parse successful');
        } catch (parseError) {
            // If direct parsing fails, try to extract JSON from the text
            console.warn('⚠️ Direct JSON parse failed, attempting extraction...');
            console.log('Raw response:', finalResponse);

            try {
                let cleanedResponse = finalResponse;

                // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
                cleanedResponse = cleanedResponse.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '');

                // Try parsing after removing code blocks
                try {
                    parsedResponse = JSON.parse(cleanedResponse.trim());
                    console.log('✅ Successfully parsed after removing markdown');
                } catch (e) {
                    // Look for JSON object pattern - find the first { and last }
                    const firstBrace = cleanedResponse.indexOf('{');
                    const lastBrace = cleanedResponse.lastIndexOf('}');

                    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                        const jsonStr = cleanedResponse.substring(firstBrace, lastBrace + 1);
                        parsedResponse = JSON.parse(jsonStr);
                        console.log('✅ Successfully extracted JSON from text');
                    } else {
                        throw new Error('No valid JSON object found in response');
                    }
                }
            } catch (extractError) {
                console.error('❌ Error extracting JSON. Raw response:', finalResponse);
                console.error('❌ Parse error:', extractError.message);
                parsedResponse = {
                    tipo: 'error',
                    mensaje: 'Error procesando la respuesta del asistente. Por favor intenta de nuevo.'
                };
            }
        }

        return parsedResponse;

    } catch (error) {
        console.error('❌ Groq API Error:', error.message);

        if (error.status === 401) {
            throw new Error('API Key inválida. Verifica GROQ_API_KEY en .env');
        }

        throw new Error('Error comunicándose con Groq API');
    }
}

module.exports = {
    processChat
};
