// importar a biblioteca jsonwebtoken:
const jwt = require('jsonwebtoken')
const pool = require('../conexao-banco-de-dados/conexao')

// importa a senha jwt passando o caminho do arquivo:
const senhaJwt = require('../senhajwt/senhaJwt')

const validarLogin = async (req, res, next) => {
    const { authorization } = req.headers // pega o autorization dessetruturado do Bearer token

    //faz validação se o authorization existe
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }

    //EXTRAIR O TOKEN DO BEARER 
    const token = authorization.split(' ')[1];

    try {
        // para pegar o token pelo ID, deetrutura o jwt, passando o id que vem do payload como parametro usando o metodo verify, exemplo abaixo:
        const { id } = jwt.verify(token, senhaJwt)  // metodo verify é uma função com 2 parametros: token e senhajwt (senhaJwt é uma forma segura de informar a senha de autenticação do tokem)

        //criar uma variavel desetruturada passando o rows e rowcount igualando a query de modo a pegar o usuario pelo id que vem do token, exemplo abaixo:

        const { rows, rowCount } = await pool.query(`SELECT * FROM usuarios WHERE id= $1`, [id])
        //faz validação de modo que se o rowCount for igual a zero o usuario nao existe:
        if (rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }
        //desetrutura o rows o usuario dentro da requisição conforme exemplo abaixo:
        const { senha, ...usuario } = rows[0]
        req.usuario = usuario

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Não autorizado!!!' })
    }
}

module.exports = validarLogin
