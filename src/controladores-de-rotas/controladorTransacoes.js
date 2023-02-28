//REQUERENDO AS BIBLIOTECAS A SEREM UTILIZADAS NO PROJETO
const pool = require('../conexao-banco-de-dados/conexao')

//Função cadastrar transação
const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body

    try {
        //verifica se a categoria existe
        const verificarCategoriaId = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [categoria_id])

        if (verificarCategoriaId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'A categoria informada é inexistente' })
        }
        //faz o cadastro da transação
        const cadastrandoTransacao = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, tipo,usuario_id)
        VALUES
        ($1, $2, $3, $4, $5, $6) returning* `, [descricao, valor, data, categoria_id, tipo, req.usuario.id])


        const resposta = {
            ...cadastrandoTransacao.rows[0],
            categoria_nome: verificarCategoriaId.rows[0].descricao
        }

        return res.status(201).json(resposta)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

// Função listar transações do usuario
const listarTransacoesUsuario = async (req, res) => {

    const { filtro } = req.query

    try {

        let resultado = []

        // se não passar o filtro, retorna lista completa
        if (!filtro) {
            const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t INNER JOIN categorias c ON c.id = t.categoria_id WHERE t.usuario_id = $1`, [req.usuario.id])

            return res.status(201).json(transacoesUsuario.rows)
        }
        // valida o retorno caso seja objeto
        if (typeof (filtro) == "object") {
            for (let item of filtro) {
                const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t INNER JOIN categorias c ON c.id = t.categoria_id WHERE t.usuario_id = $1 and c.descricao = $2`, [req.usuario.id, item])

                resultado.push(...transacoesUsuario.rows)
            }
        } else {
            const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t INNER JOIN categorias c ON c.id = t.categoria_id WHERE t.usuario_id = $1 and c.descricao = $2`, [req.usuario.id, filtro])

            resultado = transacoesUsuario.rows
        }


        return res.status(201).json(resultado)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

// Função detalhar transação usuario
const detalharTransacoesUsuario = async (req, res) => {

    const { id } = req.params

    try {

        const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t INNER JOIN categorias c ON c.id = t.categoria_id WHERE t.id = $1`, [id])

        return res.status(201).json(transacoesUsuario.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

//Função atualizar transação
const atualizarTransacao = async (req, res) => {

    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {

        //execulta atualização da transação
        await pool.query(`UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE usuario_id = $6 and id = $7`, [descricao, valor, data, categoria_id, tipo, req.usuario.id, id])


        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

//Função excluir transação

const excluirTransacao = async (req, res) => {
    const { id } = req.params

    try {
        //execulta a exclusão da transação
        await pool.query(`DELETE FROM transacoes WHERE id = $1 `, [id])

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

// Função extrato de transações
const extratoTransacoes = async (req, res) => {

    try {

        // Procura os valores referente as entradas e faz a soma
        const entradas = await pool.query(`SELECT COALESCE(SUM(valor), 0)AS entrada FROM transacoes WHERE tipo = 'entrada' AND usuario_id = $1`, [req.usuario.id])

        // Procura os valores referente as saidas e faz a soma
        const saidas = await pool.query(`SELECT COALESCE(SUM(valor), 0)AS saida FROM transacoes WHERE tipo = 'saida' AND usuario_id = $1 `, [req.usuario.id])


        const extrato = {
            entrada: entradas.rows[0].entrada,
            saida: saidas.rows[0].saida
        }


        return res.status(201).json(extrato)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = {
    cadastrarTransacao,
    listarTransacoesUsuario,
    detalharTransacoesUsuario,
    atualizarTransacao,
    excluirTransacao,
    extratoTransacoes,
}