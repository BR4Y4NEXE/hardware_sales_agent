require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function testToolModel() {
    console.log('Testing Groq Tool-Use Model...\n');

    try {
        console.log('1. Testing simple call...');
        const response1 = await groq.chat.completions.create({
            model: 'llama3-groq-70b-8192-tool-use-preview',
            messages: [
                { role: 'user', content: 'Say hello' }
            ]
        });
        console.log('✅ Simple call works!');
        console.log('Response:', response1.choices[0].message.content);

        console.log('\n2. Testing with function calling...');
        const response2 = await groq.chat.completions.create({
            model: 'llama3-groq-70b-8192-tool-use-preview',
            messages: [
                { role: 'user', content: 'Busco cinta teflón' }
            ],
            tools: [{
                type: "function",
                function: {
                    name: "consultar_inventario",
                    description: "Busca productos en inventario",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "Término de búsqueda"
                            }
                        },
                        required: ["query"]
                    }
                }
            }],
            tool_choice: 'auto'
        });

        console.log('✅ Function calling works!');
        console.log('Message:', JSON.stringify(response2.choices[0].message, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.error) {
            console.error('Details:', JSON.stringify(error.error, null, 2));
        }
    }
}

testToolModel();
