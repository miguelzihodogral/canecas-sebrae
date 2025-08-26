
let pedidos = [];
let vendedor = {usuario:"teste",senha:"1234",expira:Date.now()+24*60*60*1000};
const form = document.getElementById("pedidoForm");
const tipoEntrega = document.getElementById("tipoEntrega");
const totalDiv = document.getElementById("totalDiv");
const previewImg = document.getElementById("previewImg");
const imgCaneca = document.getElementById("imgCaneca");
const ticket = document.getElementById("ticket");
const codigoPedidoEl = document.getElementById("codigoPedido");
const nomeFinal = document.getElementById("nomeFinal");
const produtosFinal = document.getElementById("produtosFinal");
const totalFinal = document.getElementById("totalFinal");
const emailFinal = document.getElementById("emailFinal");
const telefoneFinal = document.getElementById("telefoneFinal");
const descFinal = document.getElementById("descFinal");
const imgFinal = document.getElementById("imgFinal");
const loginBtn = document.getElementById("loginBtn");
const vendedorSection = document.getElementById("vendedorSection");
const vendedorHeader = document.getElementById("vendedorHeader");
const vendedorName = document.getElementById("vendedorName");
const logoutBtn = document.getElementById("logoutBtn");
const trocarSenhaBtn = document.getElementById("trocarSenhaBtn");
const pedidosTable = document.querySelector("#pedidosTable tbody");

// Preview da imagem
imgCaneca.addEventListener("change",()=>{const f=imgCaneca.files[0];if(f){const r=new FileReader();r.onload=()=>{previewImg.src=r.result;previewImg.style.display="block";};r.readAsDataURL(f);}else{previewImg.src="";previewImg.style.display="none";}});

// Atualiza total
function atualizarTotal(){
  let total=20;
  document.querySelectorAll('input[name="bolo"]:checked').forEach(b=>{total+=20;});
  if(tipoEntrega.value==="entrega") total+=10;
  totalDiv.textContent="Total: R$"+total;
}
form.addEventListener("change",atualizarTotal);
atualizarTotal();

// Gerar código aleatório
function gerarCodigo(entrega,telefone){
  if(entrega==="entrega"){return Math.floor(10000+Math.random()*90000);} 
  else {return "5"+telefone.slice(-4);}
}

// Finalizar pedido
form.addEventListener("submit",e=>{
  e.preventDefault();
  let nome=document.getElementById("nomeCliente").value.trim();
  let email=document.getElementById("emailCliente").value.trim();
  let telefone=document.getElementById("telefoneCliente").value.trim();
  let desc=document.getElementById("descCaneca").value.trim();
  let entrega=tipoEntrega.value;
  let erro=false;
  document.getElementById("erroNome").textContent="";
  document.getElementById("erroEmail").textContent="";
  document.getElementById("erroTelefone").textContent="";
  if(nome===""){document.getElementById("erroNome").textContent="Nome obrigatório";erro=true;}
  if(email===""||!email.includes("@")){document.getElementById("erroEmail").textContent="Email inválido";erro=true;}
  if(entrega==="retirada" && (telefone===""||telefone.length<4)){document.getElementById("erroTelefone").textContent="Telefone inválido";erro=true;}
  if(erro) return;
  let produtos=["Caneca"];
  document.querySelectorAll('input[name="bolo"]:checked').forEach(b=>{produtos.push(b.value);});
  let total=20+document.querySelectorAll('input[name="bolo"]:checked').length*20;
  if(entrega==="entrega") total+=10;
  let codigo=gerarCodigo(entrega,telefone);
  let imgSrc=previewImg.src;
  pedidos.push({codigo,nome,email,telefone,produtos,total,desc,imgSrc,entrega,resgatado:false});
  codigoPedidoEl.textContent=codigo;
  nomeFinal.textContent=nome;
  produtosFinal.textContent=produtos.join(", ");
  totalFinal.textContent=total;
  emailFinal.textContent=email;
  telefoneFinal.textContent=telefone;
  descFinal.textContent=desc;
  if(imgSrc){imgFinal.src=imgSrc; imgFinal.style.display="block";} else {imgFinal.style.display="none";}
  ticket.style.display="block";
  alert("Pedido finalizado! Email simulado enviado com código.");
  form.reset();
  previewImg.style.display="none";
  atualizarTotal();
  atualizarTabela();
});

function atualizarTabela(){
  pedidosTable.innerHTML="";
  pedidos.forEach((p,i)=>{
    let tr=document.createElement("tr");
    tr.innerHTML=`<td>${p.nome}</td><td>${p.email}</td><td>${p.produtos.join(", ")}</td><td>R$${p.total}</td><td>${p.resgatado?"Resgatado":"Pendente"}</td>
    <td><button onclick="resgatarPedido(${i})">Ver/Resgatar</button></td>`;
    pedidosTable.appendChild(tr);
  });
}

window.resgatarPedido=function(i){
  let codigoPrompt=prompt("Digite o código do cliente:");
  if(codigoPrompt==pedidos[i].codigo){
    pedidos[i].resgatado=true;
    alert("Pedido resgatado!");
    atualizarTabela();
  } else {alert("Código incorreto!");}
}
