const Music = require('../models/Music');

const createMusic = async (req, res) => {
    try {
        const { titulo, artista, genero, duracao, dataLancamento, album } = req.body;

        const music = await Music.create({
            titulo,
            artista,
            genero,
            duracao,
            dataLancamento,
            album: album || null,
            usuario: req.user._id
        });

        await music.populate([
            { path: 'usuario', select: 'nome email' },
            { path: 'album', select: 'titulo artista' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Música criada com sucesso',
            data: music
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllMusics = async (req, res) => {
    try {
        const { page = 1, limit = 10, genero, artista } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (genero) filter.genero = genero;
        if (artista) filter.artista = new RegExp(artista, 'i');

        const musics = await Music.find(filter)
            .populate('usuario', 'nome email')
            .populate('album', 'titulo artista')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Music.countDocuments(filter);

        res.json({
            success: true,
            data: musics,
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

const getMusicById = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id)
            .populate('usuario', 'nome email')
            .populate('album', 'titulo artista');

        if (!music) {
            return res.status(404).json({
                success: false,
                message: 'Música não encontrada'
            });
        }

        res.json({
            success: true,
            data: music
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMusic = async (req, res) => {
    try {
        let music = await Music.findById(req.params.id);

        if (!music) {
            return res.status(404).json({
                success: false,
                message: 'Música não encontrada'
            });
        }

        if (music.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado para atualizar esta música'
            });
        }

        music = await Music.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('usuario', 'nome email').populate('album', 'titulo artista');

        res.json({
            success: true,
            message: 'Música atualizada com sucesso',
            data: music
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);

        if (!music) {
            return res.status(404).json({
                success: false,
                message: 'Música não encontrada'
            });
        }

        if (music.usuario.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado para deletar esta música'
            });
        }

        await Music.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Música deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMusic,
    getAllMusics,
    getMusicById,
    updateMusic,
    deleteMusic
};
