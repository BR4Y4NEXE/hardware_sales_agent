require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function testModels() {
    // Test multiple models to find working ones
    const modelsToTest = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'llama-3.2-90b-text-preview',
        'mixtral-8x7b-32768'
    ];

    for (const model of modelsToTest) {
        console.log(`\n=== Testing ${model} ===`);
        try {
            const response = await groq.chat.completions.create({
                model: model,
                messages: [
                    { role: 'user', content: 'Busco cinta teflón' }
                ],
                tools: [{
                    type: "function",
                    function: {
                        name: "consultar_inventario",
                        description: "Busca productos",
                        parameters: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "Búsqueda"
                                }
                            },
                            required: ["query"]
                        }
                    }
                }],
                tool_choice: 'auto'
            });

            console.log('✅ SUCCESS!');
            console.log('Message:', JSON.stringify(response.choices[0].message, null, 2));
            break; // Found a working model

        } catch (error) {
            console.error('❌ Failed:', error.message);
        }
    }
}

testModels();
