//REQUERENDO AS BIBLIOTECAS A SEREM UTILIZADAS NO PROJETO
const pool = require('../conexao-banco-de-dados/conexao')

const validacaoIdUsuarioTransacao = async (req, res, next) => {
    const { id } = req.params

    const selectId = await pool.query(`SELECT id, usuario_id from transacoes WHERE id = $1`, [id])

    if (selectId.rowCount == 0) {
        return res.status(404).json({ mensagem: 'Transação não encontrada' })
    }

    if (selectId.rows[0].usuario_id !== req.usuario.id) {
        return res.status(401).json({ mensagem: 'Transação não autorizada' })
    }

       next()
}

module.exports = {
    validacaoIdUsuarioTransacao
}