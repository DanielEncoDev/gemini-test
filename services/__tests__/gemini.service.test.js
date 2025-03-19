const { generateResponse } = require('../gemini.service');

// Mock de las dependencias de Firebase
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn()
}));

jest.mock('firebase/vertexai', () => ({
    getVertexAI: jest.fn(),
    getGenerativeModel: jest.fn(),
    Schema: {
        object: jest.fn(),
        string: jest.fn(),
        boolean: jest.fn()
    }
}));

describe('Gemini Service', () => {
    let mockModel;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar el mock del modelo
        mockModel = {
            generateContent: jest.fn()
        };

        // Configurar el mock de getGenerativeModel
        require('firebase/vertexai').getGenerativeModel.mockReturnValue(mockModel);
    });

    describe('generateResponse', () => {
        it('debería procesar correctamente un mensaje con información completa', async () => {
            const mockResponse = {
                response: {
                    text: () => JSON.stringify({
                        date: "2025-03-19",
                        location: "domicilio titular",
                        description: "House fire",
                        injuries: false,
                        owner: true,
                        complete: true,
                        question: ""
                    })
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            const result = await generateResponse("Se me prende fuego mi casa, no hay nadie dentro");
            
            expect(result).toBeDefined();
            expect(mockModel.generateContent).toHaveBeenCalled();
            expect(JSON.parse(result)).toMatchObject({
                date: expect.any(String),
                location: expect.any(String),
                description: expect.any(String),
                injuries: expect.any(Boolean),
                owner: expect.any(Boolean),
                complete: expect.any(Boolean),
                question: expect.any(String)
            });
        });

        it('debería manejar errores correctamente', async () => {
            mockModel.generateContent.mockRejectedValue(new Error('Error de API'));

            await expect(generateResponse("test message")).rejects.toThrow('Error de API');
        });

        it('debería incluir el mensaje del usuario en el prompt', async () => {
            const userMessage = "test message";
            const mockResponse = {
                response: {
                    text: () => JSON.stringify({
                        date: "2025-03-19",
                        location: "domicilio titular",
                        description: "Test",
                        injuries: false,
                        owner: true,
                        complete: true,
                        question: ""
                    })
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            await generateResponse(userMessage);

            expect(mockModel.generateContent).toHaveBeenCalledWith(
                expect.stringContaining(userMessage)
            );
        });
    });
}); 