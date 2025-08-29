document.addEventListener("DOMContentLoaded", function () {
    const acompanhamentosBtn = document.getElementById("acompanhamentosBtn");
    const acompanhamentosSection = document.getElementById("acompanhamentosSection");
    const entregaOptions = document.getElementById("entregaOptions");
    const descricaoInput = document.getElementById("descricao");
    const fotoInput = document.getElementById("foto");
    const form = document.getElementById("pedidoForm");

    // Botão de acompanhamentos (expandir/recolher)
    acompanhamentosBtn.addEventListener("click", function () {
        if (acompanhamentosSection.style.display === "none" || acompanhamentosSection.style.display === "") {
            acompanhamentosSection.style.display = "block";
        } else {
            acompanhamentosSection.style.display = "none";
        }
    });

    // Validação: descrição OU foto obrigatórios
    form.addEventListener("submit", function (e) {
        if (descricaoInput.value.trim() === "" && fotoInput.files.length === 0) {
            e.preventDefault();
            alert("Você precisa enviar uma descrição ou uma foto da caneca.");
            return;
        }
    });

    // Código de retirada: 4 últimos dígitos do telefone
    form.addEventListener("submit", function (e) {
        const telefone = document.getElementById("telefone").value.trim();
        if (telefone.length < 4) {
            e.preventDefault();
            alert("Digite um telefone válido (mínimo 4 dígitos).");
            return;
        }
        const codigo = telefone.slice(-4);
        document.getElementById("codigoRetirada").value = codigo;
    });
});
