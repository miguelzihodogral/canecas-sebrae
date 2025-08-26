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
