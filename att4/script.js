// base cad-a7k9
// aluno: Sanchez

// Chave utilizada para persistência no localStorage
const STORAGE_KEY = 'registros_filmes';

// 3. Recuperar lista: getItem + JSON.parse (ou [] se estiver vazio)
// Na 1ª vez, getItem devolve null: comece com [] antes do parse
let registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Elementos da interface (DOM)
const formFilme = document.getElementById('form-filme');
const containerRegistros = document.getElementById('container-registros');
const listaVazia = document.getElementById('lista-vazia');
const btnLimpar = document.getElementById('btn-limpar');
const contadorBadge = document.getElementById('contador-badge');

// Função auxiliar para exibir notificações temporárias na tela
function exibirToast(mensagem, tipo = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = `toast toast-${tipo} show`;
  toast.innerHTML = `${tipo === 'success' ? '✅' : '🗑️'} ${mensagem}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 5. Mostrar: percorrer com for...of e desenhar no DOM
function renderizarRegistros() {
  // Limpa o conteúdo atual da lista
  containerRegistros.innerHTML = '';

  // Atualiza contador no cabeçalho
  const total = registros.length;
  contadorBadge.textContent = `${total} cadastrado${total === 1 ? '' : 's'}`;

  // Se não houver itens cadastrados, exibe o empty-state
  if (total === 0) {
    listaVazia.style.display = 'block';
    return;
  }

  // Oculta o empty-state quando há itens
  listaVazia.style.display = 'none';

  // Percorre o array de objetos utilizando for...of conforme solicitado
  for (const item of registros) {
    const card = document.createElement('article');
    card.className = 'item-card';

    // Cria a estrutura visual de cada registro
    card.innerHTML = `
      <div class="item-top">
        <div>
          <h3 class="item-title">${item.titulo}</h3>
          <div class="item-meta">
            <span class="tag-badge">${item.tipo}</span>
            <span class="tag-badge tag-genre">${item.genero}</span>
            <span class="tag-badge tag-year">${item.ano}</span>
          </div>
        </div>
        <div class="item-score-badge">
          ★ ${item.nota.toFixed(1)}
        </div>
      </div>

      ${item.sinopse ? `<p class="item-synopsis">"${item.sinopse}"</p>` : ''}

      <div class="item-footer">
        <button class="btn-delete-item" data-id="${item.id}" title="Excluir este item">
          Excluir
        </button>
      </div>
    `;

    // Evento para remover um registro individual
    const btnExcluir = card.querySelector('.btn-delete-item');
    btnExcluir.addEventListener('click', () => {
      removerRegistro(item.id);
    });

    // Adiciona o card ao container
    containerRegistros.appendChild(card);
  }
}

// 4. Adicionar e salvar: push() e depois JSON.stringify + setItem
function salvarRegistros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

// 1. Formulário: capturar valores no submit (com preventDefault)
formFilme.addEventListener('submit', function (event) {
  event.preventDefault();

  const tituloInput = document.getElementById('titulo');
  const tipoInput = document.getElementById('tipo');
  const generoInput = document.getElementById('genero');
  const anoInput = document.getElementById('ano');
  const notaInput = document.getElementById('nota');
  const sinopseInput = document.getElementById('sinopse');

  const titulo = tituloInput.value.trim();
  const tipo = tipoInput.value;
  const genero = generoInput.value;
  const anoValor = anoInput.value.trim();
  const notaValor = notaInput.value.trim();
  const sinopse = sinopseInput.value.trim();

  // Validação simples dos campos obrigatórios
  if (!titulo || !genero || !anoValor || !notaValor) {
    alert('Por favor, preencha todos os campos obrigatórios marcados com *!');
    return;
  }

  // 2. Criar objeto juntando os valores
  // Nota: o localStorage guarda sempre texto, por isso usamos Number() para números
  const novoRegistro = {
    id: Date.now(),
    titulo: titulo,
    tipo: tipo,
    genero: genero,
    ano: Number(anoValor),
    nota: Number(notaValor),
    sinopse: sinopse
  };

  // 4. Adicionar ao array com push() e salvar no localStorage
  registros.push(novoRegistro);
  salvarRegistros();

  // 5. Atualizar exibição no DOM
  renderizarRegistros();

  // Limpa o formulário e foca no primeiro campo
  formFilme.reset();
  tituloInput.focus();

  exibirToast(`"${novoRegistro.titulo}" adicionado com sucesso!`, 'success');
});

// Função para remover registro individual
function removerRegistro(id) {
  registros = registros.filter(item => item.id !== id);
  salvarRegistros();
  renderizarRegistros();
  exibirToast('Registro removido do catálogo.', 'danger');
}

// Botão para limpar todos os registros
btnLimpar.addEventListener('click', function () {
  if (registros.length === 0) {
    alert('A lista já está vazia!');
    return;
  }

  const confirmou = confirm('Tem certeza de que deseja apagar TODOS os registros cadastrados?');
  if (confirmou) {
    registros = [];
    localStorage.removeItem(STORAGE_KEY);
    renderizarRegistros();
    exibirToast('Todos os registros foram apagados.', 'danger');
  }
});

// 6. Persistir: chamar a exibição ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  renderizarRegistros();
});
