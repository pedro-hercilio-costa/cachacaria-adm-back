const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');// usado apenas pelo Guilherme

const app = express();
const port = process.env.PORT || 3001;

//  Importe as rotas
const userRoutes = require('./routes/userRoutes');
const authRouter = require('./routes/authController');

const clientesRoutes = require('./routes/clientesRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes.js');
const maquinarioRoutes = require('./routes/maquinarioRoutes');
const manutencoesRoutes = require('./routes/manutencoesRoutes');
const tiposManutencaoRoutes = require('./routes/tiposManutencaoRoutes');
const locaisRoutes = require('./routes/locaisRoutes');

const productRoute = require('./routes/productRoutes')
const unidadeRoutes = require('./routes/unidadeRoutes');
const saborRoutes = require('./routes/saborRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const composicaoRoutes = require('./routes/composicaoRoute');
const producaoRoutes = require('./routes/producaoRoutes.js');
const compravendaRoutes = require('./routes/compra_vendaRoutes.js');
const estoqueRoutes = require('./routes/estoqueRoutes.js');
const relatoriosRoutes = require('./routes/relatorios');

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

        // Aanexar dados do usuário à requisição, se quiser
        req.userId = decoded.id;
        req.userRole = decoded.role; // se tiver role no token
        next();
    });
}

// Teste simples protegido com autenticação
app.get('/', verifyJWT, (req, res) => {
    res.send('Servidor está funcionando e você está autenticado!');
});




// Usar as rotas
app.use('/relatorios', relatoriosRoutes);
app.use('/auth', authRouter);
app.use('/api/users', userRoutes);

app.use('/api/clientes', clientesRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/maquinario', maquinarioRoutes);
app.use('/api/manutencoes', manutencoesRoutes);
app.use('/api/tipos-manutencao', tiposManutencaoRoutes);
app.use('/api', locaisRoutes);

app.use('/api/products', productRoute);
app.use('/api/unidades', unidadeRoutes);
app.use('/api/sabores', saborRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/composicao', composicaoRoutes);
app.use('/api/producao', producaoRoutes);
app.use('/api/compravenda', compravendaRoutes);
app.use('/api/estoque', estoqueRoutes);


app.listen(port, () => {
        pool.query('SELECT NOW()')
      .then(res => {
        console.log('Conectado ao banco! Hora:', res.rows[0].now);
      })
      .catch(err => {
        console.error('Erro ao conectar ao banco:', err);
      });
    console.log(`Servidor rodando em http://localhost:${port}`);
});
