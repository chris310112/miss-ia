const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/perguntar", async (req, res) => {
  try {
    const resposta = await client.responses.create({
      model: "gpt-5-mini",
      input: req.body.pergunta
    });

    res.json({
      resposta: resposta.output_text
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: "Não consegui responder agora."
    });
  }
});

app.listen(process.env.PORT || 3000);
