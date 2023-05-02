require('dotenv').config()

const express = require('express')

const rotas = require('./rotas-de-conexoes/rotas')

const app = express()

app.use(express.json())

app.use(rotas)

module.exports =app

