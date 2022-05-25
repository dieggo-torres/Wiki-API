const express = require("express")
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const colors = require("colors")
const porta = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

app.use(express.static("public"))

async function conectarDB() {
  try {
    const conexao = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(`MongoDB conectado com sucesso: ${conexao.connection.host}`.cyan.underline)
  } catch (erro) {
    console.log(erro)
    process.exit(1)
  }
}

conectarDB()

const artigoSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "Por favor, adicione um título."],
    },
    conteudo: {
      type: String,
      required: [true, "Por favor, adicione conteúdo."],
    }
  },
  {
    timestamps: true,
  }
)

const Artigo = mongoose.model("artigo", artigoSchema)

app.get("/artigos", (req, res) => {
  // Consulta o banco de dados para encontrar todos os artigos
  Artigo.find({}, (erros, artigosEncontrados) => {
    if (!erros) {
      if (artigosEncontrados) {
        res.send(artigosEncontrados)
      } else {
        res.send("Não há artigos para exibir.")
      }
    } else {
      res.send(erros)
    }
  })
})

app.post("/artigos", (req, res) => {
  // Cria um novo artigo
  const novoArtigo = new Artigo({
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
  })

  // Salva o artigo recém-criado na coleção de artigos
  novoArtigo.save((erros) => {
    if (!erros) {
      console.log("Novo artigo adicionado com sucesso.");
      res.redirect("/artigos")
    } else {
      console.log(erros);
    }
  })
})

app.delete("/artigos", (req, res) => {
  // Remove todos os artigos da coleção
  Artigo.deleteMany({}, (erros) => {
    if (!erros) {
      res.send("Todos os artigos foram removidos com sucesso.")
    } else {
      res.send(erros)
    }
  })
})

app.get("/artigos/:tituloArtigo", (req, res) => {
  // Consulta o banco de dados para verificar se existe um artigo com o título especificado
  Artigo.findOne({ título:  req.params.tituloArtigo }, (erros, artigoEncontrado) => {
    if (!erros) {
      if (artigoEncontrado) {
        res.send(artigoEncontrado)
      } else {
        res.send("Não existe nenhum artigo com o título especificado.")
      }
    } else {
      res.send(erros)
    }
  })
})

app.put("/artigos/:tituloArtigo", (req, res) => {
  // Consulta o banco de dados para encontrar o artigo a ser atualizado
  Artigo.findOneAndUpdate(
    { titulo: req.params.tituloArtigo },
    { titulo: req.body.titulo, conteudo: req.body.conteudo },
    (erros) => {
      if (!erros) {
        res.send("Artigo atualizado com sucesso.")
      } else {
        res.send(erros)
      }
    }
  )
})

app.patch("/artigos/:tituloArtigo", (req, res) => {
  // Consulta o banco de dados para encontrar um artigo e atualizar o campo especificado
  Artigo.findOneAndUpdate(
    { titulo: req.params.tituloArtigo },
    { $set: req.body },
    (erros) => {
      if (!erros) {
        res.send("Artigo atualizado com sucesso.")
      } else {
        res.send(erros)
      }
    }
  )
})

app.delete("/artigos/:tituloArtigo", (req, res) => {
  // Consulta o banco de dados para remover o artigo cujo título foi especificado
  Artigo.deleteOne(
    { titulo: req.params.tituloArtigo },
    (erros) => {
      if (!erros) {
        res.send("Artigo removido com sucesso.")
      } else {
        res.send(erros)
      }
    }
  )
})

app.listen(porta, () => {
  console.log(`Servidor Express ouvindo na porta ${porta}.`);
})