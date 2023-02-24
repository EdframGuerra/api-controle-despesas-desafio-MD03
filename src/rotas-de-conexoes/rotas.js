// 1º PASSO: IMPORTAR A BIBLIOTECA EXPRESS:
const express = require('express')
const { cadastroUsuario, login, detalharUsuario } = require('../controladores-de-rotas/controladorUsuarios')
const validacaoCamposDoLogin = require('../intermediarios/validacaoCamposDologin')
const validacaoCamposObrigatorios = require('../intermediarios/validacaoCamposObrigatorios')
const validarLogin  = require('../intermediarios/validarLogin')

//importar os controladores

// 3º PASSO: CRIAR A CONSTANTE ROTAS PARA ESTANCIAR O EXPRESS:
const rotas = express.Router();

// 4º PASSO: CRIAR A ROTA, colocar após a vírgula o nome da função criada para rota:

rotas.post('/usuario', validacaoCamposObrigatorios, cadastroUsuario)
rotas.post('/login', validacaoCamposDoLogin, login)

rotas.use(validarLogin)

rotas.get('/usuario',detalharUsuario)


// 5º PASSO: EXPORTAR A ROTA:
module.exports = rotas;