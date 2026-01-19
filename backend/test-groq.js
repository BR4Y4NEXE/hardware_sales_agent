require('dotenv').config();
const { processChat } = require('./src/services/groq');

async function test() {
    console.log('🧪 Testing Groq Service...\n');
    console.log('API Key present:', !!process.env.GROQ_API_KEY);
    console.log('API Key length:', process.env.GROQ_API_KEY?.length || 0);
    console.log('---\n');

    try {
        const messages = [
            {
                role: 'user',
                content: 'Necesito cinta teflón'
            }
        ];

        console.log('📤 Sending message:', messages[0].content);
        console.log('---\n');

        const response = await processChat(messages);

        console.log('\n✅ Success! Response:');
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('\n❌ Test failed:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

test();
