// Importar la función generateResponse del servicio gemini.service.js
const { generateResponse } = require('../services/gemini.service');

// Función para generar la respuesta con el modelo generativo de vertexAI
exports.generateResponse = async (req, res) => {
    const { message } = req.body;
    // Se ejecuta la función generateResponse del servicio gemini.service.js;
    const response = await generateResponse(message);
    res.json(response);
};