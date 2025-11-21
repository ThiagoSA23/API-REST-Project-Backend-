const express = require('express');
const { body } = require('express-validator');
const {
    createAlbum,
    getAllAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum
} = require('../controllers/albumController');
const { protect } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

const albumValidation = [
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
    body('dataLancamento')
        .isISO8601()
        .withMessage('Data de lançamento deve estar em formato ISO8601')
];

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);

router.post('/', protect, albumValidation, handleValidationErrors, createAlbum);
router.put('/:id', protect, albumValidation, handleValidationErrors, updateAlbum);
router.delete('/:id', protect, deleteAlbum);

module.exports = router;
