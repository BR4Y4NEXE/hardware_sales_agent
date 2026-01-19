const testRequest = {
    messages: [
        {
            role: 'user',
            content: 'Necesito cinta teflón'
        }
    ]
};

async function testAPI() {
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testRequest)
        });

        const data = await response.json();
        console.log('\n✅ Response:');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

testAPI();
