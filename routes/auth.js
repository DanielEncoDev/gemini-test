const router = require('express').Router();
const { login } = require('../controllers/auth');

// Ruta para el login
router.post('/login', login);

module.exports = router;