const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config();

// Inicializar la aplicación express
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const geminiRoutes = require('./routes/gemini');

app.use('/v1/auth', authRoutes);
app.use('/v1/gemini', geminiRoutes);

// Manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejar errores internos del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});