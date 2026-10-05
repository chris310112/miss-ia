const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("."));

app.post("/perguntar", async (req, res) => {
  try {
    const resposta = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: [
            {
              role: "user",
              content: req.body.pergunta
            }
          ],
          max_tokens: 500
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(dados);
      return res.status(500).json({
        erro: "Erro ao consultar a IA."
      });
    }

    res.json({
      resposta: dados.choices[0].message.content
    });

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      erro: "Não consegui responder agora."
    });
  }
});

app.listen(process.env.PORT || 3000);
