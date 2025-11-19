const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 2 })
        .withMessage('Nome deve ter no mínimo 2 caracteres'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('senha')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres')
], handleValidationErrors, register);

router.post('/login', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória')
], handleValidationErrors, login);

module.exports = router;
