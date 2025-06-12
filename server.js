const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ Importe as rotas
const userRoutes = require('./routes/userRoutes');
const authRouter = require('./routes/authController');

app.use(cors());
app.use(express.json());

// Middleware para verificar token JWT
function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
        }

        // Você pode anexar dados do usuário à requisição, se quiser
        req.userId = decoded.id;
        req.userRole = decoded.role; // se tiver role no token
        next();
    });
}

// Teste simples protegido com autenticação
app.get('/', verifyJWT, (req, res) => {
    res.send('Servidor está funcionando e você está autenticado!');
});

// ✅ Use as rotas
app.use('/auth', authRouter);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
