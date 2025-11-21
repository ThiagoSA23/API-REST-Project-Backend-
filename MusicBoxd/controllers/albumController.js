const Album = require('../models/Album');

const createAlbum = async (req, res) => {
    try {
        const { titulo, artista, genero, dataLancamento, descricao } = req.body;

        const album = await Album.create({
            titulo,
            artista,
            genero,
            dataLancamento,
            descricao,
            usuario: req.user._id
        });

        await album.populate('usuario', 'nome email');

        res.status(201).json({
            success: true,
            message: 'Álbum criado com sucesso',
            data: album
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAlbums = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const albums = await Album.find()
            .populate('usuario', 'nome email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Album.countDocuments();

        res.json({
            success: true,
            data: albums,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAlbumById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('usuario', 'nome email');

        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Álbum não encontrado'
            });
        }

        res.json({
            success: true,
            data: album
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAlbum = async (req, res) => {
    try {
        let album = await Album.findById(req.params.id);

        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Álbum não encontrado'
            });
        }

        if (album.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado para atualizar este álbum'
            });
        }

        album = await Album.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('usuario', 'nome email');

        res.json({
            success: true,
            message: 'Álbum atualizado com sucesso',
            data: album
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);

        if (!album) {
            return res.status(404).json({
                success: false,
                message: 'Álbum não encontrado'
            });
        }

        if (album.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado para deletar este álbum'
            });
        }

        await Album.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Álbum deletado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAlbum,
    getAllAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum
};
