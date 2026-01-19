/**
 * Manual mock for groq-sdk
 * This mock is used by Jest to replace the actual Groq SDK in tests
 */

// Mock response data
const mockChatResponse = {
    choices: [
        {
            message: {
                role: 'assistant',
                content: JSON.stringify({
                    tipo: 'cotizacion',
                    mensaje: 'Mock response',
                    productos: []
                })
            }
        }
    ]
};

// Mock Groq class
class Groq {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.chat = {
            completions: {
                create: jest.fn().mockResolvedValue(mockChatResponse)
            }
        };
    }
}

// Helper to set mock responses for tests
Groq.__setMockResponse = (response) => {
    mockChatResponse.choices[0].message = response;
};

// Helper to set mock tool call responses
Groq.__setMockToolCallResponse = (toolCalls) => {
    mockChatResponse.choices[0].message = {
        role: 'assistant',
        tool_calls: toolCalls,
        content: null
    };
};

// Helper to reset mock
Groq.__resetMock = () => {
    mockChatResponse.choices[0].message = {
        role: 'assistant',
        content: JSON.stringify({
            tipo: 'cotizacion',
            mensaje: 'Mock response',
            productos: []
        })
    };
};

module.exports = Groq;
