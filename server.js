const express = require('express');  // Importando o express
const cors = require('cors');  // Importando o cors
const app = express();  // Inicializando o express

const port = 3001;

//Importa as rotas aqui
//const firstRoute = require('./routes/firstRoute');


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

//Use nas rotas aqui
//app.use('/firstRoute', firstRoute);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});