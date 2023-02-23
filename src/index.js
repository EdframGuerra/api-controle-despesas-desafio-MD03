// 1º PASSO: IMPORTAR O SERVIDOR => passar o caminho do arquivo servidor;
const app = require('./servidor')

// 2º PASSO: ABRIR A PORTA DE ESCUTA/EXECUÇÃO DO SERVIDOR:
app.listen(3000, () => {
    console.log('http://localhost:3000')
});