const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    artista: {
        type: String,
        required: [true, 'Artista é obrigatório'],
        trim: true
    },
    genero: {
        type: String,
        required: [true, 'Gênero é obrigatório'],
        enum: ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'R&B', 'Country', 'Metal', 'Reggae', 'Blues', 'Other']
    },
    dataLancamento: {
        type: Date,
        required: [true, 'Data de lançamento é obrigatória']
    },
    descricao: {
        type: String,
        trim: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avaliacao: {
        media: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Album', albumSchema);
