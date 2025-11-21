require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✓ MongoDB conectado');
}).catch(err => {
    console.error('✗ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
});

try {
    const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✓ Swagger disponível em /api-docs');
} catch (error) {
    console.warn('⚠ Swagger não encontrado:', error.message);
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/musicas', require('./routes/musicRoutes'));

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'MusicBoxd API rodando' });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;
