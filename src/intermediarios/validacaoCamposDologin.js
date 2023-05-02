const validacaoCamposDoLogin = (req, res, next) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo e-mail deve existir e ser preenchidos' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo e-mail deve existir e ser preenchidos' })
    }

    if (!email.trim()) {
        return res.status(400).json({ mensagem: 'O campo e-mail deve ser preenchidos' })
    }

    if (!senha.trim()) {
        return res.status(400).json({ mensagem: 'O campo senha deve ser preenchidos' })
    }
    next()
}
module.exports = validacaoCamposDoLogin