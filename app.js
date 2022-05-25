const express = require("express")
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const colors = require("colors")
const porta = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.send("<h1>Olá, mundo!</h1>")
})

app.listen(porta, () => {
  console.log(`Servidor Express ouvindo na porta ${porta}.`);
})