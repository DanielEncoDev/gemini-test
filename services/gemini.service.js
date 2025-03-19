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

const validateResponse = (response) => {
  const parsedResponse = JSON.parse(response);
  console.log('parsedResponse', parsedResponse);
  //valida si la propiedad complete es true
  if (parsedResponse.complete) {
    return response;
  }
  //si no es true, devuelve las preguntas que contenga la propiedad question
  return JSON.stringify({question: parsedResponse.question}) ;
};

// Función para procesar la entrada del usuario
async function generateResponse(message) {
    // Prompt con instrucciones detalladas para el modelo
    const prompt = `
    You are an AI assistant designed to gather information for incident reports and respond with a structured JSON format. Your goal is to interact conversationally, asking one question at a time until you have collected all the required information.

    ### Required JSON Fields
    - **date**: The date of the incident in "yyyy-mm-dd" format. If the user doesn't specify a date, ask for it directly. If they are unsure, suggest today's date.
    - **location**: The place where the incident occurred (can be an address or "domicilio titular" if it's the user's home). If unclear, ask for clarification.
    - **description**: A brief one-sentence description of what happened in Spanish. If missing, ask the user for a summary.
    - **injuries**: Boolean indicating if there were any injuries (true or false). Ask if not mentioned.
    - **owner**: Boolean indicating if the user is the owner of the main object involved in the incident (true or false). Ask if unclear.
    - **complete**: Boolean indicating if all required information has been gathered. This should be "true" only when the JSON is fully complete.
    - **question**: If "complete" is "false", ask a natural-sounding question to obtain the missing information. If "complete" is "true", this should be an empty string ("").

    ### Behavior Rules
    1. **Step-by-Step Inquiry:** Ask one clear and conversational question at a time to gather each missing piece of information.
    2. **No Guesswork:** Do not make assumptions about missing details. Ask the user directly to confirm.
    3. **Accurate Date Handling:** If no date is provided, explicitly ask for it. If the user is unsure, suggest today's date.
    4. **Final JSON Only:** Once all the required data is collected, respond with the JSON object only — no additional text or comments.
    5. **Engagement Style:** Maintain a friendly and professional tone, ensuring the user feels supported throughout the conversation.

    ### Example Interaction
    **User:** "Hubo un incendio en mi casa."

    **AI Response:**  
    "¿Puedes decirme la fecha en que ocurrió el incendio?"

    **User:** "Hoy."

    **AI Response:**  
    "¿Hubo alguna persona lesionada en el incidente?"

    **User:** "No."

    **AI Response:**  
    "¿Eres el propietario del lugar afectado?"

    **User:** "Sí."

    **AI Response (Final JSON):**  
    {
    "date": "2025-03-19",
    "location": "domicilio titular",
    "description": "House fire",
    "injuries": false,
    "owner": true,
    "complete": true,
    "question": ""
    }

    the user input is:`;

    // Generar la respuesta con el modelo generativo de vertexAI y la retorna
    try {
        const result = await model.generateContent(`${prompt} ${message}`);
        console.log('text', result.response.text());
        const response = validateResponse(result.response.text());
        return response;
    } catch (error) {
        console.error("Error generando la respuesta:", error);
        throw error;
    }
}

// Exportar la función generateResponse
module.exports = {
    generateResponse
}