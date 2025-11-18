const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Título da música é obrigatório'],
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
    duracao: {
        type: Number,
        required: [true, 'Duração é obrigatória (em segundos)'],
        min: 0
    },
    dataLancamento: {
        type: Date,
        required: [true, 'Data de lançamento é obrigatória']
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        default: null
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

module.exports = mongoose.model('Music', musicSchema);
