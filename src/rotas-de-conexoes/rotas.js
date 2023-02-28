//IMPORTAR A BIBLIOTECA EXPRESS:
const express = require('express')

//IMPORTADO CONTROLADORES E INTERMEDIARIOS DE ROTAS:
const { listarCategorias } = require('../controladores-de-rotas/controladorCategorias')
const { cadastrarTransacao, listarTransacoesUsuario, extratoTransacoes, detalharTransacoesUsuario, atualizarTransacao, excluirTransacao } = require('../controladores-de-rotas/controladorTransacoes')
const { cadastroUsuario, detalharUsuario, atualizacaoCadastro } = require('../controladores-de-rotas/controladorUsuarios')
const { login } = require('../controladores-de-rotas/login')
const validacaoCamposDoLogin = require('../intermediarios/validacaoCamposDologin')
const validacaoCamposObrigatorios = require('../intermediarios/validacaoCamposObrigatoriosCadUsuario')
const { validacaoCamposObrigatoriosTransacoes } = require('../intermediarios/validacaoCamposTransacao')
const { validacaoIdUsuarioTransacao } = require('../intermediarios/validacaoIdUserTransacao')
const validarLogin = require('../intermediarios/validarLogin')


//CRIAR ROTAS A CONSTANTE ROTAS PARA ESTANCIAR O EXPRESS:
const rotas = express.Router();

//CRIAR AS ROTAS
rotas.post('/usuario', validacaoCamposObrigatorios, cadastroUsuario)
rotas.post('/login', validacaoCamposDoLogin, login)

// FUNÇÃO PARA VALIDAR USUARIO LOGADO:
rotas.use(validarLogin)

//ROTAS ACESSADAS ATRAVÉS DE LOGIN AUTENTICADO:
rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', validacaoCamposObrigatorios, atualizacaoCadastro)
rotas.get('/categoria', listarCategorias)
rotas.post('/transacao', validacaoCamposObrigatoriosTransacoes, cadastrarTransacao)
rotas.get('/transacao', listarTransacoesUsuario)
rotas.get('/transacao/extrato/', extratoTransacoes)
rotas.get('/transacao/:id', validacaoIdUsuarioTransacao, detalharTransacoesUsuario)
rotas.put('/transacao/:id', validacaoCamposObrigatoriosTransacoes, validacaoIdUsuarioTransacao, atualizarTransacao)
rotas.delete('/transacao/:id', validacaoIdUsuarioTransacao, excluirTransacao)


//EXPORTAR AS ROTAS:
module.exports = rotas;