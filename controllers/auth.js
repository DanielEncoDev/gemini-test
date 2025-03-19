const jwt = require('jsonwebtoken');

// Función para el login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    // Generar usuario apartir del email
    const user = email.split('@')[0];
    // Generar un token JWT
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    // Retornar el token y el usuario
    res.status(200).json({ token, user });
};
// Función para validar el token
exports.validateToken = async (req, res, next) => {
    // Obtener el token de los headers
    const token = req.headers.authorization;
    // Si no existe el token, retornar un error 401
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Agregar el usuario al request
    req.user = decoded.user;
    // Pasar al siguiente middleware
    next();
};
