const { initializeApp } = require("firebase/app");
const { getVertexAI, getGenerativeModel, Schema } = require("firebase/vertexai");

// Configuración de firebase
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

// Inicializar firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializar vertexAI
const vertexAI = getVertexAI(firebaseApp);

// Define el esquema JSON para el formato específico requerido
const incidentSchema = Schema.object({
  properties: {
    date: Schema.string(),
    location: Schema.string(),
    description: Schema.string(),
    injuries: Schema.boolean(),
    owner: Schema.boolean(),
    complete: Schema.boolean(),
    question: Schema.string()
  },
  required: ["date", "location", "description", "injuries", "owner", "complete", "question"]
});

// Inicializar el modelo generativo
const model = getGenerativeModel(vertexAI, {
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: incidentSchema,
    temperature: 0.2 
  },
});

// Función para procesar la entrada del usuario
async function generateResponse(message) {
    // Prompt con instrucciones detalladas para el modelo
    const prompt = `
    You are an AI assistant designed to analyze incident descriptions and extract key information in a specific JSON format. Your task is to carefully read user input describing an incident and respond with a structured JSON that identifies the following variables:

    1. date: The date of the incident in yyyy-mm-dd format. If not specified, use today's date.
    2. location: The place where the incident occurred (can be an address or "domicilio titular" if it's the user's home).
    3. description: A brief one-sentence description of what happened.
    4. injuries: Boolean indicating if there were any injuries (true or false).
    5. owner: Boolean indicating if the user is the owner of the main object involved in the incident (true or false).
    6. complete: Boolean indicating if all necessary information has been provided (true or false).
    7. question: If complete is false, include a natural-sounding question to obtain the missing information. If complete is true, this should be an empty string ("").

    Always respond with a valid JSON object containing exactly these seven fields. Do not include any explanations, additional text, or markdown formatting outside the JSON object.

    If any information is missing or unclear, set "complete" to false and include a specific question in the "question" field to obtain the missing information. The question should be natural and conversational.

    Example:
    If a user says "Se me prende fuego mi casa, no hay nadie dentro," your response should be:
    {
    "date": "2025-03-17",
    "location": "domicilio titular",
    "description": "House fire",
    "injuries": false,
    "owner": true, 
    "complete": true,
    "question": ""
    }

    If information is missing, for example if they don't mention a date or location, ask for it specifically in the question field and mark complete as false.

    the user input is:`;

    // Generar la respuesta con el modelo generativo de vertexAI y la retorna
    try {
        const result = await model.generateContent(`${prompt} ${message}`);
        console.log('result', result);
        console.log('text', result.response.text());
        return result.response.text();
    } catch (error) {
        console.error("Error generando la respuesta:", error);
        throw error;
    }
}

// Exportar la función generateResponse
module.exports = {
    generateResponse
}