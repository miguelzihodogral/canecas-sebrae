// Dados do vendedor temporário
const vendedor = { usuario: "teste", senha: "1234", expira: Date.now() + 24*60*60*1000 };

// Lista de pedidos (em memória para teste)
let pedidos = [];

// Elementos
const canecaDesc = document.getElementById('canecaDesc');
const canecaImg = document.getElementById('canecaImg');
const previewImg = document.getElementById('previewImg');
const pedidoForm = document.getElementById('pedidoForm');
const totalDiv = document.getElementById('totalDiv');
const justificativa = document.getElementById('justificativa');
const ticket = document.getElementById('ticket');
const ticketCodigo = document.getElementById('ticketCodigo');
const ticketTotal = document.getElementById('ticketTotal');
const ticketProdutos = document.getElementById('ticketProdutos');
const ticketEndereco = document.getElementById('ticketEndereco');
const ticketEmail = document.getElementById('ticketEmail');
const ticketDescricao = document.getElementById('ticketDescricao');
const qrcodeDiv = document.getElementById('qrcode');

const loginButton = document.getElementById('loginButton');
const vendedorSection = document.getElementById('vendedorSection');
const vendedorUser = document.getElementById('vendedorUser');
const pedidosTable = document.getElementById('pedidosTable');
const logoutButton = document.getElementById('logoutButton');
const clienteSection = document.getElementById('clienteSection');

// Preview da imagem
canecaImg.addEventListener('change', () => {
  const file = canecaImg.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
});

// Atualização do total
pedidoForm.addEventListener('change', atualizarTotal);
function atualizarTotal() {
  let total = 20; // Caneca
  let bolos = [];
  document.querySelectorAll('input[name="bolo"]:checked').forEach(b => {
    total += 20;
    bolos.push(b.value);
  });
  totalDiv.textContent = `Total: R$${total}`;
  justificativa.textContent = `Preço inicial inclui Caneca (R$20). Bolos opcionais adicionam R$${bolos.length*20} ao total.`;
}
atualizarTotal();

// Finalizar pedido
pedidoForm.addEventListener('submit', e => {
  e.preventDefault();
  // Validação
  const enderecoVal = document.getElementById('endereco').value.trim();
  const emailVal = document.getElementById('email').value.trim();
  const entrega = document.getElementById('entrega').value;

  if (!canecaDesc.value && !canecaImg.files.length) {
    alert('Insira descrição ou imagem da caneca');
    return;
  }
  if (!enderecoVal.match(/\d+/)) {
    alert('Endereço deve conter número');
    return;
  }
  if (!emailVal.includes('@')) {
    alert('Email inválido');
    return;
  }

  const codigo = Math.random().toString(36).substring(2,8).toUpperCase();
  const total = totalDiv.textContent.split('R$')[1];
  const bolos = Array.from(document.querySelectorAll('input[name="bolo"]:checked')).map(b => b.value).join(', ') || 'Nenhum';

  const pedido = {
    codigo,
    total,
    produtos: `Caneca + ${bolos}`,
    endereco: enderecoVal,
    email: emailVal,
    descricao: canecaDesc.value || 'Imagem enviada',
    entrega,
    resgatado: false
  };
  pedidos.push(pedido);

  // Mostrar ticket
  ticketCodigo.textContent = `Código: ${codigo}`;
  ticketTotal.textContent = `Total: R$${total}`;
  ticketProdutos.textContent = `Produtos: ${pedido.produtos}`;
  ticketEndereco.textContent = `Endereço: ${pedido.endereco} | ${entrega}`;
  ticketEmail.textContent = `Email: ${pedido.email}`;
  ticketDescricao.textContent = `Descrição: ${pedido.descricao}`;
  ticket.style.display = "block";

  // Gera QR Code com o código
  qrcodeDiv.innerHTML = "";
  QRCode.toCanvas(qrcodeDiv, codigo, function (error) { if(error) console.error(error); });

  // Simula envio de email (log no console)
  console.log('Email simulado enviado para', pedido.email, 'com código', codigo);

  // Reset form
  pedidoForm.reset();
  previewImg.style.display = "none";
  atualizarTotal();

  alert('Pedido finalizado! Um email de teste foi "enviado" (veja o console).');
});

// Login do vendedor
loginButton.addEventListener('click', () => {
  const user = prompt("Usuário:");
  const pass = prompt("Senha:");
  if (user === vendedor.usuario && pass === vendedor.senha && Date.now() < vendedor.expira) {
    clienteSection.style.display = "none";
    vendedorSection.style.display = "block";
    vendedorUser.textContent = user;
    atualizarPedidosTable();
  } else {
    alert('Login inválido ou expirado');
  }
});

// Logout
logoutButton.addEventListener('click', () => {
  vendedorSection.style.display = "none";
  clienteSection.style.display = "block";
});

// Atualiza tabela de pedidos
function atualizarPedidosTable() {
  pedidosTable.innerHTML = '';
  pedidos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.email}</td>
      <td>${p.produtos}</td>
      <td>R$${p.total}</td>
      <td>${p.resgatado ? 'Resgatado' : 'Pendente'}</td>
      <td><button ${p.resgatado ? 'disabled' : ''} onclick="resgatarPedido('${p.codigo}')">Resgatar</button></td>
    `;
    pedidosTable.appendChild(tr);
  });
}

// Resgatar pedido
window.resgatarPedido = function(codigo) {
  const pedido = pedidos.find(p => p.codigo === codigo);
  if (pedido) {
    pedido.resgatado = true;
    atualizarPedidosTable();
    alert('Pedido resgatado!');
  }
};
