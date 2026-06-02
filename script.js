// Variáveis de estado do jogo
let safra = 1;
let produtividade = 100;
let abelhas = 100;
let predadores = 100;
let nivelPragas = "Normal"; // Normal, Alto, Crítico

// Elementos da tela (DOM)
const txtSafra = document.getElementById("safra-atual");
const txtProdutividade = document.getElementById("produtividade");
const txtPragas = document.getElementById("status-pragas");
const txtAbelhas = document.getElementById("txt-abelhas");
const txtPredadores = document.getElementById("txt-predadores");

const barAbelhas = document.getElementById("bar-abelhas");
const barPredadores = document.getElementById("bar-predadores");
const telaMensagem = document.getElementById("mensagem-diario");

const btnQuimico = document.getElementById("btn-quimico");
const btnMip = document.getElementById("btn-mip");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Eventos dos botões
btnQuimico.addEventListener("click", () => rodada("quimico"));
btnMip.addEventListener("click", () => rodada("mip"));
btnReiniciar.addEventListener("click", reiniciarJogo);

function rodada(escolha) {
    if (escolha === "quimico") {
        // O químico mata as pragas na hora, mas destrói o ecossistema
        abelhas -= 40;
        predadores -= 50;
        
        if (nivelPragas === "Crítico") {
            // Pragas criaram resistência!
            produtividade -= 20;
            nivelPragas = "Crítico";
            telaMensagem.innerHTML = "<strong>Efeito Rebote!</strong> O defensivo químico comum não fez efeito porque as pragas ficaram resistentes. Além disso, as abelhas e polinizadores sumiram da fazenda!";
        } else {
            produtividade = Math.max(70, produtividade - 5); // Sem polinização a produtividade cai um pouco
            nivelPragas = "Alto"; // Elas vão voltar mais fortes na próxima porque não há inimigos naturais
            telaMensagem.innerHTML = "Você eliminou as pragas temporariamente, mas o veneno forte eliminou quase todas as abelhas e joaninhas. O ecossistema está desequilibrado.";
        }
    } 
    else if (escolha === "mip") {
        // O MIP usa biologia, preserva polinizadores e controla as pragas a longo prazo
        abelhas = Math.min(100, abelhas + 10);
        predadores = Math.min(100, predadores + 15);
        
        if (nivelPragas === "Crítico" || nivelPragas === "Alto") {
            nivelPragas = "Normal";
            produtividade = Math.min(100, produtividade + 15);
            telaMensagem.innerHTML = "<strong>Sucesso Ecológico!</strong> Usando armadilhas e vespas biológicas, você controlou as pragas. As abelhas voltaram e ajudaram a polinizar, subindo sua produtividade!";
        } else {
            nivelPragas = "Normal";
            produtividade = Math.min(100, produtividade + 5);
            telaMensagem.innerHTML = "Você aplicou o MIP preventivo. Os inimigos naturais (joaninhas) mantiveram a lavoura limpa e as abelhas aumentaram a qualidade dos grãos.";
        }
    }

    // Impedir que os valores fiquem abaixo de zero
    abelhas = Math.max(0, abelhas);
    predadores = Math.max(0, predadores);

    // Se não há predadores, as pragas disparam na rodada seguinte
    if (predadores < 30 && escolha !== "mip") {
        nivelPragas = "Crítico";
    }

    // Atualizar a interface gráfica
    atualizarBarras();

    safra++;
    if (safra > 5) {
        fimDeJogo();
    } else {
        txtSafra.innerText = `${safra} / 5`;
    }
}

function atualizarBarras() {
    // Atualizar textos e números
    txtProdutividade.innerText = `${produtividade}%`;
    txtPragas.innerText = nivelPragas;
    txtAbelhas.innerText = `${abelhas}%`;
    txtPredadores.innerText = `${predadores}%`;

    // Atualizar cores do status de pragas
    if (nivelPragas === "Normal") txtPragas.className = "numero";
    if (nivelPragas === "Alto") txtPragas.className = "numero aviso";
    if (nivelPragas === "Crítico") {
        txtPragas.className = "numero"; 
        txtPragas.style.color = "#c62828";
    }

    // Atualizar o tamanho e cor das barras de progresso
    barAbelhas.style.width = `${abelhas}%`;
    barPredadores.style.width = `${predadores}%`;

    mudarCorBarra(barAbelhas, abelhas);
    mudarCorBarra(barPredadores, predadores);
}

function mudarCorBarra(barra, valor) {
    if (valor > 60) barra.className = "fill verde";
    else if (valor > 30) barra.className = "fill laranja";
    else barra.className = "fill vermelho";
}

function fimDeJogo() {
    // Esconder botões de ação e mostrar o de reiniciar
    btnQuimico.classList.add("escondido");
    btnMip.classList.add("escondido");
    btnReiniciar.classList.remove("escondido");

    txtSafra.innerText = "Fim!";

    // Avaliação final baseada nos resultados
    if (produtividade >= 90 && abelhas >= 70) {
        telaMensagem.innerHTML = `<strong>Parabéns! Você alcançou o Equilíbrio Perfeito!</strong><br>Sua produtividade final foi de ${produtividade}% e sua fazenda está cheia de vida. Você provou que um Agro Forte caminha junto com o Meio Ambiente!`;
        telaMensagem.style.background = "#d4edda";
    } else if (produtividade < 70) {
        telaMensagem.innerHTML = `<strong>A Fazenda Faliu!</strong><br>Sua produtividade caiu para ${produtividade}%. O uso excessivo de químicos gerou superpragas resistentes e destruiu a polinização das abelhas. É preciso mudar a estratégia!`;
        telaMensagem.style.background = "#f8d7da";
    } else {
        telaMensagem.innerHTML = `<strong>Resultado Mediano.</strong><br>Você terminou com ${produtividade}% de produtividade, mas o meio ambiente sofreu. Suas populações de abelhas ficaram em ${abelhas}%. Tente usar mais práticas de MIP na próxima vez!`;
        telaMensagem.style.background = "#fff3cd";
    }
}

function reiniciarJogo() {
    safra = 1;
    produtividade = 100;
    abelhas = 100;
    predadores = 100;
    nivelPragas = "Normal";

    txtSafra.innerText = "1 / 5";
    telaMensagem.innerHTML = "A sua lavoura está começando a sofrer com um ataque inicial de lagartas. Qual estratégia você vai adotar para esta safra?";
    telaMensagem.style.background = "#e8f5e9";

    atualizarBarras();

    btnQuimico.classList.remove("escondido");
    btnMip.classList.remove("escondido");
    btnReiniciar.classList.add("escondido");
}