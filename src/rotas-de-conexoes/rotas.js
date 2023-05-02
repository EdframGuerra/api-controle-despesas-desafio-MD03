const express = require('express')

const { listarCategorias } = require('../controladores-de-rotas/controladorCategorias')
const { cadastrarTransacao, listarTransacoesUsuario, extratoTransacoes, detalharTransacoesUsuario, atualizarTransacao, excluirTransacao } = require('../controladores-de-rotas/controladorTransacoes')
const { cadastroUsuario, detalharUsuario, atualizacaoCadastro } = require('../controladores-de-rotas/controladorUsuarios')
const { login } = require('../controladores-de-rotas/login')
const validacaoCamposDoLogin = require('../intermediarios/validacaoCamposDologin')
const validacaoCamposObrigatorios = require('../intermediarios/validacaoCamposObrigatoriosCadUsuario')
const { validacaoCamposObrigatoriosTransacoes } = require('../intermediarios/validacaoCamposTransacao')
const { validacaoIdUsuarioTransacao } = require('../intermediarios/validacaoIdUserTransacao')
const validarLogin = require('../intermediarios/validarLogin')

const rotas = express.Router();

rotas.post('/usuario', validacaoCamposObrigatorios, cadastroUsuario)
rotas.post('/login', validacaoCamposDoLogin, login)


rotas.use(validarLogin)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', validacaoCamposObrigatorios, atualizacaoCadastro)
rotas.get('/categoria', listarCategorias)
rotas.post('/transacao', validacaoCamposObrigatoriosTransacoes, cadastrarTransacao)
rotas.get('/transacao', listarTransacoesUsuario)
rotas.get('/transacao/extrato/', extratoTransacoes)
rotas.get('/transacao/:id', validacaoIdUsuarioTransacao, detalharTransacoesUsuario)
rotas.put('/transacao/:id', validacaoCamposObrigatoriosTransacoes, validacaoIdUsuarioTransacao, atualizarTransacao)
rotas.delete('/transacao/:id', validacaoIdUsuarioTransacao, excluirTransacao)

module.exports = rotas;