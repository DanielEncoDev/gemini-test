const router = require('express').Router();
const { generateResponse } = require('../controllers/gemini');
const { validateToken } = require('../controllers/auth');
// Ruta para generar la respuesta con el modelo generativo de vertexAI
router.post('/', validateToken, generateResponse);

module.exports = router;