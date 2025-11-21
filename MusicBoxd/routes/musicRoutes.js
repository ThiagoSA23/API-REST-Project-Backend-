const express = require('express');
const { body } = require('express-validator');
const {
    createMusic,
    getAllMusics,
    getMusicById,
    updateMusic,
    deleteMusic
} = require('../controllers/musicController');
const { protect } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validações comuns
const musicValidation = [
    body('titulo')
        .trim()
        .notEmpty()
        .withMessage('Título é obrigatório'),
    body('artista')
        .trim()
        .notEmpty()
        .withMessage('Artista é obrigatório'),
    body('genero')
        .isIn(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other'])
        .withMessage('Gênero inválido'),
    body('duracao')
        .isInt({ min: 1 })
        .withMessage('Duração deve ser um número inteiro maior que 0'),
    body('dataLancamento')
        .isISO8601()
        .withMessage('Data de lançamento deve estar em formato ISO8601')
];

router.get('/', getAllMusics);
router.get('/:id', getMusicById);

router.post('/', protect, musicValidation, handleValidationErrors, createMusic);
router.put('/:id', protect, musicValidation, handleValidationErrors, updateMusic);
router.delete('/:id', protect, deleteMusic);

module.exports = router;
