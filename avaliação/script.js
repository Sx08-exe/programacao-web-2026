/* ==========================================================================
   ARQUIVO DE SCRIPTS JAVASCRIPT PURO (SEM FRAMEWORKS / SEM BACKEND / SEM FETCH)
   Atividade: Landing Page Interativa - Concurso de Simulação de Carteiras
   ========================================================================== */

// Aguarda o carregamento completo do documento DOM antes de executar as funções
document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================================
       1. SELEÇÃO DE ELEMENTOS DO DOM (getElementById e querySelector)
       ====================================================================== */

    if(JSON.parse(localStorage.getItem("darkmode"))){
        document.body.classList.add("dark-mode");
    }
    
    // Seleciona o botão de alternar tema claro/escuro pelo ID
    const botaoTema = document.getElementById("btn-tema");
    
    // Seleciona o elemento de texto que exibe o ícone e nome do tema atual
    const textoTema = document.getElementById("texto-tema");
    
    // Seleciona o botão de curtir pelo ID
    const botaoCurtir = document.getElementById("btn-curtir");
    
    // Seleciona o elemento onde o total de curtidas é exibido
    const contadorCurtidas = document.getElementById("contador-curtidas");
    
    // Seleciona o campo de busca de ativos pelo ID
    const campoBusca = document.getElementById("campo-busca");
    
    // Seleciona os botões de filtro rápido da tabela
    const botaoFiltroTodos = document.getElementById("filtro-todos");
    const botaoFiltroAcoes = document.getElementById("filtro-acoes");
    const botaoFiltroFiis = document.getElementById("filtro-fiis");
    
    // Seleciona todas as linhas de ativos dentro do corpo da tabela
    const linhasTabela = document.querySelectorAll("#tabela-ativos tbody tr");
    
    // Seleciona o elemento que exibe a contagem de ativos encontrados
    const textoResultadoBusca = document.getElementById("resultado-busca");
    
    // Seleciona os campos do simulador de alocação de carteira
    const inputCapital = document.getElementById("sim-capital");
    const inputPctAcoes = document.getElementById("sim-pct-acoes");
    const rotuloPctAcoes = document.getElementById("rotulo-pct-acoes");
    const rotuloPctFiis = document.getElementById("rotulo-pct-fiis");
    const valorAlocadoAcoes = document.getElementById("valor-alocado-acoes");
    const valorAlocadoFiis = document.getElementById("valor-alocado-fiis");
    const barraAcoes = document.getElementById("barra-progresso-acoes");
    const barraFiis = document.getElementById("barra-progresso-fiis");
    
    // Seleciona os elementos do formulário de inscrição
    const formularioInscricao = document.getElementById("form-inscricao");
    const inputNome = document.getElementById("campo-nome");
    const inputEmail = document.getElementById("campo-email");
    const inputQtdAtivos = document.getElementById("campo-qtd-ativos");
    const inputEstrategia = document.getElementById("campo-estrategia");
    const painelMensagem = document.getElementById("mensagem-confirmacao");
    
    // Seleciona o botão de expandir/ocultar material complementar
    const botaoToggleDicas = document.getElementById("btn-toggle-dicas");
    const containerDicas = document.getElementById("dicas-adicionais");


    /* ======================================================================
       2. RECURSO 1: ALTERNÂNCIA DE TEMA CLARO / ESCURO (Evento 'click')
       ====================================================================== */
    
    // Registra o evento de clique no botão de tema usando addEventListener
    botaoTema.addEventListener("click", function () {
        // Alterna a classe 'dark-mode' no corpo da página
        document.body.classList.toggle("dark-mode");

        const darkModeAtivado = document.body.classList.contains("dark-mode")

        localStorage.setItem("darkmode", JSON.stringify(darkModeAtivado))

        // Verifica se a classe dark-mode está ativa no momento
        const estaNoModoEscuro = document.body.classList.contains("dark-mode");

        // Se estiver no modo escuro, altera o texto e o ícone com textContent
        if (estaNoModoEscuro) {
            textoTema.textContent = "☀️ Modo Claro";
            // Altera diretamente o estilo de cor da borda via .style
            botaoTema.style.borderColor = "#3b82f6";
        } else {
            // Caso contrário, volta para o texto de modo escuro
            textoTema.textContent = "🌙 Modo Escuro";
            // Restaura o estilo de borda
            botaoTema.style.borderColor = "";
        }
    });


    /* ======================================================================
       3. RECURSO 2: CONTADOR INTERATIVO DE CURTIDAS (Evento 'click')
       ====================================================================== */
    
    // Variável de controle com o número inicial de curtidas
    let totalCurtidas = 42;

    // Registra o evento de clique no botão de curtir
    botaoCurtir.addEventListener("click", function () {
        // Incrementa em 1 a contagem de curtidas
        totalCurtidas = totalCurtidas + 1;

        // Atualiza o conteúdo exibido na tela usando textContent
        contadorCurtidas.textContent = totalCurtidas;

        // Efeito visual via .style para destacar temporariamente o clique
        botaoCurtir.style.transform = "scale(1.1)";
        botaoCurtir.style.backgroundColor = "#10b981";
        botaoCurtir.style.color = "#ffffff";

        // Retorna a aparência normal após 200 milissegundos
        setTimeout(function () {
            botaoCurtir.style.transform = "scale(1)";
            botaoCurtir.style.backgroundColor = "";
            botaoCurtir.style.color = "";
        }, 200);
    });


    /* ======================================================================
       4. RECURSO 3: BUSCA E FILTRO EM TEMPO REAL NA TABELA (Evento 'input' e 'click')
       ====================================================================== */
    
    // Variável para armazenar a categoria ativa ("todos", "acoes", "fiis")
    let categoriaSelecionada = "todos";

    // Função central responsável por filtrar as linhas da tabela
    function filtrarTabela() {
        // Lê o valor digitado pelo usuário no campo de busca usando .value
        const termoDigitado = campoBusca.value.toLowerCase().trim();
        
        // Contador para saber quantas linhas ficaram visíveis
        let linhasVisiveis = 0;

        // Percorre cada linha da tabela de ativos
        linhasTabela.forEach(function (linha) {
            // Obtém o texto do setor e do código do ativo contidos na linha
            const textoLinha = linha.textContent.toLowerCase();
            
            // Verifica o tipo do ativo baseado na classe ou atributo data-tipo
            const tipoLinha = linha.getAttribute("data-tipo");

            // Verifica se o termo digitado está presente na linha
            const correspondeBusca = textoLinha.includes(termoDigitado);
            
            // Verifica se a linha pertence à categoria selecionada no filtro
            const correspondeCategoria = (categoriaSelecionada === "todos") || (tipoLinha === categoriaSelecionada);

            // Se cumprir ambos os critérios, exibe a linha alterando o .style.display
            if (correspondeBusca && correspondeCategoria) {
                linha.style.display = ""; // Linha visível
                linhasVisiveis = linhasVisiveis + 1; // Incrementa o contador
            } else {
                linha.style.display = "none"; // Oculta a linha
            }
        });

        // Atualiza a mensagem com a quantidade de resultados encontrados usando textContent
        if (linhasVisiveis === 0) {
            textoResultadoBusca.textContent = "Nenhum ativo encontrado para os filtros aplicados.";
            // Altera a cor do texto para vermelho via .style
            textoResultadoBusca.style.color = "#ef4444";
        } else {
            textoResultadoBusca.textContent = "Exibindo " + linhasVisiveis + " de " + linhasTabela.length + " ativos cadastrados.";
            // Altera a cor do texto para o padrão
            textoResultadoBusca.style.color = "";
        }
    }

    // Registra o evento 'input' no campo de busca para disparar a cada letra digitada
    campoBusca.addEventListener("input", function () {
        filtrarTabela();
    });

    // Função auxiliar para atualizar o botão visualmente ativo no filtro
    function definirBotaoAtivo(botaoAtivo) {
        // Remove a classe ativo de todos os botões de filtro
        botaoFiltroTodos.classList.remove("ativo");
        botaoFiltroAcoes.classList.remove("ativo");
        botaoFiltroFiis.classList.remove("ativo");

        // Adiciona a classe ativo apenas no botão clicado
        botaoAtivo.classList.add("ativo");
    }

    // Evento de clique para o filtro de TODOS os ativos
    botaoFiltroTodos.addEventListener("click", function () {
        categoriaSelecionada = "todos";
        definirBotaoAtivo(botaoFiltroTodos);
        filtrarTabela();
    });

    // Evento de clique para o filtro apenas de AÇÕES
    botaoFiltroAcoes.addEventListener("click", function () {
        categoriaSelecionada = "acao";
        definirBotaoAtivo(botaoFiltroAcoes);
        filtrarTabela();
    });

    // Evento de clique para o filtro apenas de FUNDOS IMOBILIÁRIOS (FIIs)
    botaoFiltroFiis.addEventListener("click", function () {
        categoriaSelecionada = "fii";
        definirBotaoAtivo(botaoFiltroFiis);
        filtrarTabela();
    });


    /* ======================================================================
       5. RECURSO 4: SIMULADOR DE ALOCAÇÃO DE CARTEIRA (Eventos 'input' e 'change')
       ====================================================================== */
    
    // Função para recalcular os valores e atualizar a barra gráfica
    function atualizarSimulador() {
        // Lê o capital total digitado pelo usuário usando .value e converte para número
        let capitalTotal = parseFloat(inputCapital.value);

        // Se o valor for inválido ou menor que zero, adota o valor padrão de 10000
        if (isNaN(capitalTotal) || capitalTotal <= 0) {
            capitalTotal = 10000;
        }

        // Lê a porcentagem de ações escolhida no controle deslizante usando .value
        const pctAcoes = parseInt(inputPctAcoes.value, 10);
        
        // A porcentagem de FIIs é o restante para completar 100%
        const pctFiis = 100 - pctAcoes;

        // Calcula os montantes em reais (R$) para cada categoria
        const valorAcoes = (capitalTotal * pctAcoes) / 100;
        const valorFiis = (capitalTotal * pctFiis) / 100;

        // Atualiza os rótulos de porcentagem na interface com textContent
        rotuloPctAcoes.textContent = pctAcoes + "%";
        rotuloPctFiis.textContent = pctFiis + "%";

        // Formata e exibe os valores em reais usando textContent
        valorAlocadoAcoes.textContent = valorAcoes.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        valorAlocadoFiis.textContent = valorFiis.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        // Atualiza a largura visual das barras de progresso via .style.width
        barraAcoes.style.width = pctAcoes + "%";
        barraFiis.style.width = pctFiis + "%";
    }

    // Registra evento 'input' no campo de capital
    inputCapital.addEventListener("input", function () {
        atualizarSimulador();
    });

    // Registra evento 'input' no slider de porcentagem de ações
    inputPctAcoes.addEventListener("input", function () {
        atualizarSimulador();
    });

    // Executa uma vez no início para calibrar os valores iniciais
    atualizarSimulador();


    /* ======================================================================
       6. RECURSO 5: FORMULÁRIO DE INSCRIÇÃO COM VALIDAÇÃO (Evento 'submit')
       ====================================================================== */
    
    // Registra o evento de submit no formulário com addEventListener
    formularioInscricao.addEventListener("submit", function (evento) {
        // Impede o recarregamento padrão da página conforme regra obrigatória
        evento.preventDefault();

        // Lê os valores digitados pelo usuário com .value
        const nomeDigitado = inputNome.value.trim();
        const emailDigitado = inputEmail.value.trim();
        const qtdAtivosDigitada = parseInt(inputQtdAtivos.value, 10);
        const estrategiaDigitada = inputEstrategia.value.trim();

        // Validação: verifica se os campos obrigatórios foram preenchidos
        if (nomeDigitado === "" || emailDigitado === "") {
            // Exibe a caixa de mensagem alterando o estilo via .style.display
            painelMensagem.style.display = "block";
            // Remove a classe de sucesso se existir e adiciona classe de erro
            painelMensagem.className = "mensagem-feedback mensagem-erro";
            // Insere o aviso de erro com textContent
            painelMensagem.textContent = "⚠️ Por favor, preencha o seu Nome Completo e seu E-mail para confirmar a inscrição.";
            // Destaca a borda do campo com .style
            inputNome.style.borderColor = "#ef4444";
            return;
        }

        // Validação: verifica se a quantidade de ativos está no limite permitido pelas regras (7 a 17)
        if (isNaN(qtdAtivosDigitada) || qtdAtivosDigitada < 7 || qtdAtivosDigitada > 17) {
            painelMensagem.style.display = "block";
            painelMensagem.className = "mensagem-feedback mensagem-erro";
            painelMensagem.textContent = "⚠️ A quantidade total de ativos deve ser entre 7 e 17 ativos, conforme o regulamento.";
            inputQtdAtivos.style.borderColor = "#ef4444";
            return;
        }

        // Se passar por todas as validações, restaura os estilos das bordas
        inputNome.style.borderColor = "";
        inputEmail.style.borderColor = "";
        inputQtdAtivos.style.borderColor = "";

        // Altera a classe da caixa de feedback para a mensagem de sucesso
        painelMensagem.className = "mensagem-feedback mensagem-sucesso";
        // Altera o estilo para tornar o painel visível via .style.display
        painelMensagem.style.display = "block";

        // Cria o resumo personalizado da inscrição utilizando innerHTML
        painelMensagem.innerHTML = "<strong>✅ Inscrição Realizada com Sucesso!</strong><br>" +
            "Parabéns, <strong>" + nomeDigitado + "</strong>! Sua pré-inscrição no Concurso de Carteiras foi confirmada.<br>" +
            "Um e-mail de confirmação foi encaminhado para <em>" + emailDigitado + "</em>.<br>" +
            "Sua meta de montagem é de <strong>" + qtdAtivosDigitada + " ativos</strong>. " +
            (estrategiaDigitada ? "<br>Estratégia informada: <em>\"" + estrategiaDigitada + "\"</em>." : "") +
            "<br><br><small>Lembre-se: O início das cotações é em 22 de setembro e a apuração final em 20 de novembro de 2026. Boa sorte!</small>";

        // Limpa os campos do formulário para nova entrada
        formularioInscricao.reset();
        
        // Recalibra o simulador após limpar
        atualizarSimulador();
    });


    /* ======================================================================
       7. RECURSO 6: MOSTRAR / OCULTAR MATERIAL EXTRA (Evento 'click')
       ====================================================================== */
    
    // Registra o evento de clique no botão de expandir/recolher
    botaoToggleDicas.addEventListener("click", function () {
        // Verifica se o container está atualmente visível verificando o .style.display
        if (containerDicas.style.display === "none" || containerDicas.style.display === "") {
            // Altera a visibilidade para exibição em bloco via .style
            containerDicas.style.display = "block";
            // Altera o texto do botão com textContent
            botaoToggleDicas.textContent = "🔼 Ocultar Dicas de Ferramentas e Cotações";
        } else {
            // Oculta a caixa novamente alterando .style.display
            containerDicas.style.display = "none";
            // Restaura o texto original do botão
            botaoToggleDicas.textContent = "🔽 Ver Onde Consultar Cotações Gratuitamente";
        }
    });

});
