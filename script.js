// Seleção dos elementos principais
const form = document.getElementById("pedidoForm");
const entrega = document.getElementById("entrega");
const telefone = document.getElementById("telefone");
const descricao = document.getElementById("descricao");
const imagem = document.getElementById("imagem");

// Ajusta campo de telefone conforme a entrega
entrega.addEventListener("change", () => {
  if (entrega.value === "retirada") {
    telefone.placeholder = "4 últimos dígitos";
    telefone.maxLength = 4;
  } else {
    telefone.placeholder = "XX XXXXX-XXXX";
    telefone.maxLength = 15;
  }
});

// Validação no envio do formulário
form.addEventListener("submit", (e) => {
  // precisa descrição OU imagem
  if (descricao.value.trim() === "" && imagem.files.length === 0) {
    alert("Você precisa enviar a descrição da caneca ou uma imagem (pode os dois).");
    e.preventDefault();
    return;
  }

  // valida telefone quando for retirada
  if (entrega.value === "retirada" && telefone.value.length !== 4) {
    alert("Para retirada, informe apenas os 4 últimos dígitos do telefone.");
    e.preventDefault();
    return;
  }
});

// Abre acompanhamentos (simples por enquanto)
function abrirAcompanhamentos() {
  alert("Aqui você pode escolher os acompanhamentos (em breve uma listinha estilizada).");
}
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Config do transporte de email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codigoscanecas@gmail.com",
    pass: "12345678910111213141516" // senha de app do Gmail
  }
});

// Rota para enviar email
app.post("/enviar-email", async (req, res) => {
  const { emailCliente, codigoPedido } = req.body;

  try {
    await transporter.sendMail({
      from: '"Canecas Personalizadas 🎁" <codigoscanecas@gmail.com>',
      to: emailCliente,
      subject: "Seu código de retirada / entrega",
      text: `Obrigado pelo pedido! 🎉\n\nSeu código é: ${codigoPedido}\n\nGuarde bem esse código, ele será necessário para confirmar sua retirada ou entrega.`
    });

    res.status(200).json({ message: "Email enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ message: "Erro ao enviar email" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
