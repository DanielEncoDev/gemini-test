# Gemini Server

Server that uses Google's Gemini API to process and analyze incident descriptions, providing structured responses in JSON format.

## 🚀 Features

- Incident description processing using generative AI
- JWT authentication
- Structured JSON responses
- Input data validation
- Robust error handling

## 🛠️ Technologies Used

- Node.js
- Express.js
- Firebase Vertex AI (Gemini)
- JWT for authentication
- Jest for unit testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud account with Vertex AI access
- Firebase credentials

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/DanielEncoDev/gemini-test.git
cd gemini-server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the project root with the following variables:
```env
# Firebase Config
API_KEY=your_api_key
AUTH_DOMAIN=your_auth_domain
PROJECT_ID=your_project_id
STORAGE_BUCKET=your_storage_bucket
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
MEASUREMENT_ID=your_measurement_id

# JWT
JWT_SECRET=your_jwt_secret
```

## 🚀 Usage

1. Start the server in development mode:
```bash
npm run dev
```

2. Start the server in production mode:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

## 📝 API Endpoints

### POST /api/auth/login
User authentication.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password"
}
```

**Response:**
```json
{
    "token": "jwt_token",
    "user": "user"
}
```

### POST /api/gemini
Process an incident description.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
    "message": "My house caught fire, no one is inside"
}
```

**Response:**
```json
{
    "date": "2024-03-20",
    "location": "owner's residence",
    "description": "House fire",
    "injuries": false,
    "owner": true,
    "complete": true,
    "question": ""
}
```

## 🔍 Technical Decisions

### 1. Vertex AI (Gemini) Choice
- Vertex AI was chosen for its native Firebase integration
- Gemini 2.0 Flash model offers excellent performance for text processing tasks
- Temperature setting of 0.2 ensures consistent and structured responses

### 2. Project Structure
```
gemini-server/
├── controllers/     # Business logic
├── routes/         # Route definitions
├── services/       # External services
├── __tests__/      # Unit tests
└── config/         # Configurations
```

### 3. Authentication
- JWT implementation for stateless authentication
- Token validation middleware for protecting sensitive routes
- Username extraction from email for simplification

### 4. Data Handling
- Defined JSON schema for response standardization
- Input data validation
- Descriptive error handling

## 🧪 Testing

The project includes unit tests for:
- Authentication controller
- Gemini service
- Response validation

To run the tests:
```bash
npm test
```

## 🔒 Security

- JWT tokens for authentication
- Environment variables for sensitive credentials
- Input data validation
- Secure error handling

## 📦 Main Dependencies

- express: ^4.21.2
- firebase: ^11.4.0
- jsonwebtoken: ^9.0.2
- jest: ^29.7.0 (dev)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. 

## 👥 Authors

    - @danielencodev 

## 🤝 Support

For support, email daniel.enco12@gmail.com or open an issue in the repository.