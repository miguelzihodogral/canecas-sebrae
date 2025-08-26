const form=document.getElementById("pedidoForm");
const tipoEntrega=document.getElementById("tipoEntrega");
const totalDiv=document.getElementById("totalDiv");
const previewImg=document.getElementById("previewImg");
const imgCaneca=document.getElementById("imgCaneca");
const ticket=document.getElementById("ticket");
const codigoPedidoEl=document.getElementById("codigoPedido");
const nomeFinal=document.getElementById("nomeFinal");
const produtosFinal=document.getElementById("produtosFinal");
const totalFinal=document.getElementById("totalFinal");
const emailFinal=document.getElementById("emailFinal");
const telefoneFinal=document.getElementById("telefoneFinal");
const descFinal=document.getElementById("descFinal");
const imgFinal=document.getElementById("imgFinal");

const toggleBolosBtn = document.getElementById("toggleBolosBtn");
const bolosFieldset = document.getElementById("bolosFieldset");

// Toggle bolos
toggleBolosBtn.addEventListener("click",()=>{
    bolosFieldset.style.display = bolosFieldset.style.display==="none"?"block":"none";
});

// Preview imagem
imgCaneca.addEventListener("change",()=>{
    const f=imgCaneca.files[0];
    if(f){
        const r=new FileReader();
        r.onload=()=>{previewImg.src=r.result; previewImg.style.display="block";}
        r.readAsDataURL(f);
    }else{previewImg.src=""; previewImg.style.display="none";}
});

// Atualiza total
function atualizarTotal(){
    let total=20; // preço base da caneca
    let bolos=[];
    document.querySelectorAll('input[name="bolo"]:checked').forEach(b=>{
        total+=20;
        bolos.push(b.value);
    });
    if(tipoEntrega.value==="entrega") total+=10;
    let msg="O preço inicial inclui Caneca (R$20)";
    if(tipoEntrega.value==="entrega") msg+=" + Frete (R$10)";
    if(bolos.length>0) msg+=` + Bolos opcionais (${bolos.length} x R$20)`;
    totalDiv.textContent=`Total: R$${total}\n${msg}`;
}
form.addEventListener("change",atualizarTotal);
atualizarTotal();

// Gera código pedido
function gerarCodigo(entrega,telefone){
    if(entrega==="entrega") return Math.floor(10000+Math.random()*90000);
    else return "5"+telefone.slice(-4);
}

// Finalizar pedido
form.addEventListener("submit",e=>{
    e.preventDefault();
    let nome=document.getElementById("nomeCliente").value.trim();
    let email=document.getElementById("emailCliente").value.trim();
    let telefone=document.getElementById("telefoneCliente").value.trim();
    let desc=document.getElementById("descCaneca").value.trim();
    let imgFile=document.getElementById("imgCaneca").files[0];
    let entrega=tipoEntrega.value;
    let erro=false;
    document.getElementById("erroNome").textContent="";
    document.getElementById("erroEmail").textContent="";
    document.getElementById("erroTelefone").textContent="";
    if(nome===""){document.getElementById("erroNome").textContent="Nome obrigatório";erro=true;}
    if(email===""||!email.includes("@")){document.getElementById("erroEmail").textContent="Email inválido";erro=true;}
    if(entrega==="retirada" && (telefone===""||telefone.length<4)){document.getElementById("erroTelefone").textContent="Telefone inválido";erro=true;}
    
    // Validação: descrição ou imagem obrigatória
    if(desc==="" && !imgFile){
        alert("Você deve fornecer uma descrição da caneca ou enviar uma imagem.");
        erro = true;
    }

    if(erro) return;

    let produtos=["Caneca"];
    document.querySelectorAll('input[name="bolo"]:checked').forEach(b=>{produtos.push(b.value);});
    let total=20+document.querySelectorAll('input[name="bolo"]:checked').length*20;
    if(entrega==="entrega") total+=10;
    let codigo=gerarCodigo(entrega,telefone);
    let imgSrc=previewImg.src;
    codigoPedidoEl.textContent=codigo;
    nomeFinal.textContent=nome;
    produtosFinal.textContent=produtos.join(", ");
    totalFinal.textContent=total;
    emailFinal.textContent=email;
    telefoneFinal.textContent=telefone;
    descFinal.textContent=desc;
    if(imgSrc){imgFinal.src=imgSrc; imgFinal.style.display="block";}
    else imgFinal.style.display="none";
    ticket.style.display="block";
    form.reset();
    previewImg.style.display="none";
    atualizarTotal();
    alert("Pedido finalizado! Anote seu código: "+codigo);
});
