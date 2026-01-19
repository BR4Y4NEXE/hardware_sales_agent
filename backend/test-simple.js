require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function testSimpleCall() {
    console.log('Testing simple Groq API call without tools...\n');

    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
            messages: [
                { role: 'user', content: 'Say hello in one word' }
            ],
            temperature: 0.1
        });

        console.log('✅ Simple call success!');
        console.log('Response:', response.choices[0].message.content);

        // Now test with tools
        console.log('\n\nTesting with tools...\n');

        const toolResponse = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
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
            tool_choice: 'auto',
            temperature: 0.1
        });

        console.log('✅ Tool call test success!');
        console.log('Response:', JSON.stringify(toolResponse.choices[0].message, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.error) {
            console.error('Error details:', JSON.stringify(error.error, null, 2));
        }
    }
}

testSimpleCall();
