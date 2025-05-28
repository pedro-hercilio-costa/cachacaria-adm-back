const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// ✅ Importe as rotas
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());

// Teste simples
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

// ✅ Use a rota com o prefixo /api/users
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
