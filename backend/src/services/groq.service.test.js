// Mock groq-sdk module
const mockCreate = jest.fn();

jest.mock('groq-sdk', () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: mockCreate
            }
        }
    }));
});

const { processChat } = require('./groq.js');

describe('Groq Service', () => {
    beforeEach(() => {
        // Reset mock before each test
        mockCreate.mockClear();
    });

    describe('processChat', () => {
        it('should parse a valid JSON response', async () => {
            // Setup mock to return a standard JSON response
            const mockResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: JSON.stringify({
                                tipo: 'cotizacion',
                                mensaje: 'Test response',
                                productos: []
                            })
                        }
                    }
                ]
            };

            mockCreate.mockResolvedValue(mockResponse);

            const result = await processChat([{ role: 'user', content: 'test' }]);

            expect(result).toEqual({
                tipo: 'cotizacion',
                mensaje: 'Test response',
                productos: []
            });
        });

        it('should handle tool calls correctly', async () => {
            // First response: tool call
            const toolCallResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            tool_calls: [
                                {
                                    id: 'call_123',
                                    type: 'function',
                                    function: {
                                        name: 'consultar_inventario',
                                        arguments: JSON.stringify({ query: 'codo' })
                                    }
                                }
                            ]
                        }
                    }
                ]
            };

            // Second response: final answer
            const finalResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: JSON.stringify({
                                tipo: 'cotizacion',
                                mensaje: 'Encontré productos',
                                productos: []
                            })
                        }
                    }
                ]
            };

            mockCreate
                .mockResolvedValueOnce(toolCallResponse)
                .mockResolvedValueOnce(finalResponse);

            const result = await processChat([{ role: 'user', content: 'busca codo' }]);

            expect(result).toHaveProperty('tipo', 'cotizacion');
            expect(mockCreate).toHaveBeenCalledTimes(2);
        });

        it('should extract JSON from markdown code blocks', async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: '```json\n{"tipo":"respuesta","mensaje":"test"}\n```'
                        }
                    }
                ]
            };

            mockCreate.mockResolvedValue(mockResponse);

            const result = await processChat([{ role: 'user', content: 'test' }]);

            expect(result).toEqual({
                tipo: 'respuesta',
                mensaje: 'test'
            });
        });

        it('should handle invalid JSON gracefully', async () => {
            const mockResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: 'This is not valid JSON at all'
                        }
                    }
                ]
            };

            mockCreate.mockResolvedValue(mockResponse);

            const result = await processChat([{ role: 'user', content: 'test' }]);

            expect(result).toHaveProperty('tipo', 'error');
            expect(result.mensaje).toContain('Error procesando la respuesta');
        });

        it('should handle API errors', async () => {
            const apiError = new Error('API Error');
            apiError.status = 401;

            mockCreate.mockRejectedValue(apiError);

            await expect(processChat([{ role: 'user', content: 'test' }]))
                .rejects.toThrow('API Key inválida');
        });
    });
});
