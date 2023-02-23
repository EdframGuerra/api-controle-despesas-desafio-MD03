// 1º PASSO: IMPORTAR A BIBLIOTECA EXPRESS:
const express = require('express')
const { cadastroUsuario } = require('../controladores-de-rotas/controladorUsuarios')

//importar os controladores

// 3º PASSO: CRIAR A CONSTANTE ROTAS PARA ESTANCIAR O EXPRESS:
const rotas = express.Router();

// 4º PASSO: CRIAR A ROTA, colocar após a vírgula o nome da função criada para rota:

rotas.post('/usuario', cadastroUsuario)

// 5º PASSO: EXPORTAR A ROTA:
module.exports = rotas;