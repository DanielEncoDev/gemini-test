const jwt = require('jsonwebtoken');
const { login } = require('../auth');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

describe('Auth Controller', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar el mock de la respuesta
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockRes = {
            status: mockStatus,
            json: mockJson
        };

        // Configurar el mock del token
        jwt.sign.mockReturnValue('mock-token');
    });

    describe('login', () => {
        it('debería retornar un token y usuario cuando se proporcionan credenciales válidas', async () => {
            mockReq = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };

            await login(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                token: 'mock-token',
                user: 'test'
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                { user: 'test' },
                process.env.JWT_SECRET
            );
        });

        it('debería retornar error 400 cuando faltan credenciales', async () => {
            mockReq = {
                body: {
                    email: 'test@example.com'
                }
            };

            await login(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Email and password are required'
            });
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('debería retornar error 400 cuando no se proporciona email', async () => {
            mockReq = {
                body: {
                    password: 'password123'
                }
            };

            await login(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Email and password are required'
            });
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('debería extraer correctamente el nombre de usuario del email', async () => {
            mockReq = {
                body: {
                    email: 'usuario.test@example.com',
                    password: 'password123'
                }
            };

            await login(mockReq, mockRes);

            expect(jwt.sign).toHaveBeenCalledWith(
                { user: 'usuario.test' },
                process.env.JWT_SECRET
            );
        });
    });
}); 