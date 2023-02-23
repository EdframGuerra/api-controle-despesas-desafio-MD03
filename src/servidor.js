// 1º PASSO: IMPORTAR AS BIBLIOTECAS UTILIZADAS NO PROJETO(UMA A UMA SEMPRE QUE NECESSARIO);
const express = require('express')

// 2º PASSO: IMPORTAR AS ROTAS=>passar o caminho do arquivo rota;
const rotas = require('./rotas-de-conexoes/rotas')

// 3º PASSO: INSTANCIAR O express:
const app = express()

// 4º PASSO: ESTANCIAR O MIDLEWARE express.json(), PARA RECEBER AS REQUISIÇÕES EM FORMATO DE OBJETO:
app.use(express.json())

// 5ºPASSO: ESTANCIAR O MIDLEWARE ROTAS DO 6º PASSO;
app.use(rotas)

// 6º PASSO: exportar servidor:
module.exports =app

