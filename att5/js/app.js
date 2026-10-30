document.addEventListener('DOMContentLoaded', () => {
  // Estado geral
  let produtosAtuais = [];

  // Elementos do DOM
  const gridProdutos = document.getElementById('products-grid');
  const feedbackContainer = document.getElementById('feedback-container');
  const tituloCatalogo = document.getElementById('catalog-title');
  const contadorResultados = document.getElementById('results-count');
  const logo = document.getElementById('brand-logo');

  // Busca e filtros
  const formBusca = document.getElementById('search-form');
  const inputBusca = document.getElementById('search-input');
  const btnLimparBusca = document.getElementById('btn-clear-search');
  const selectCategoria = document.getElementById('category-select');
  const selectOrdenacao = document.getElementById('sort-select');

  // Modal
  const modalProduto = document.getElementById('product-modal');
  const modalConteudo = document.getElementById('modal-content-body');
  const btnFecharModal = document.getElementById('modal-close-btn');

  // Painel de favoritos
  const btnAbrirFavoritos = document.getElementById('btn-open-favorites');
  const drawerFavoritos = document.getElementById('favorites-drawer');
  const overlayFavoritos = document.getElementById('favorites-overlay');
  const btnFecharFavoritos = document.getElementById('drawer-close-btn');
  const listaFavoritos = document.getElementById('favorites-list-container');
  const badgeFavoritos = document.getElementById('fav-counter-badge');
  const drawerContador = document.getElementById('drawer-fav-count');
  const btnLimparTudo = document.getElementById('btn-clear-all-favs');

  const toast = document.getElementById('toast');

  // Inicializacao
  iniciar();

  async function iniciar() {
    configurarEventos();
    atualizarContadorFavoritos();
    await carregarCategorias();
    await carregarProdutos();
  }

  // Eventos de clique e formulario
  function configurarEventos() {
    // Voltar para a lista inicial ao clicar no logo
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      resetarCatalogo();
    });

    // Submissao da pesquisa
    formBusca.addEventListener('submit', async (e) => {
      e.preventDefault();
      const termo = inputBusca.value.trim();
      if (!termo) return;
      await buscarProdutos(termo);
    });

    // Mostra/oculta botao de limpar pesquisa
    inputBusca.addEventListener('input', () => {
      if (inputBusca.value.length > 0) {
        btnLimparBusca.classList.add('visible');
      } else {
        btnLimparBusca.classList.remove('visible');
      }
    });

    // Limpar o input de busca
    btnLimparBusca.addEventListener('click', () => {
      inputBusca.value = '';
      btnLimparBusca.classList.remove('visible');
      resetarCatalogo();
    });

    // Filtrar por categoria selecionada
    selectCategoria.addEventListener('change', async (e) => {
      const categoria = e.target.value;
      if (categoria) {
        await filtrarPorCategoria(categoria);
      } else {
        await carregarProdutos();
      }
    });

    // Ordenacao dos cards
    selectOrdenacao.addEventListener('change', () => {
      ordenarProdutos();
    });

    // Fechar modal
    btnFecharModal.addEventListener('click', fecharModal);
    modalProduto.addEventListener('click', (e) => {
      if (e.target === modalProduto) {
        fecharModal();
      }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        fecharModal();
        fecharFavoritos();
      }
    });

    // Abrir e fechar favoritos
    btnAbrirFavoritos.addEventListener('click', abrirFavoritos);
    btnFecharFavoritos.addEventListener('click', fecharFavoritos);
    overlayFavoritos.addEventListener('click', fecharFavoritos);

    // Limpar todos os favoritos
    btnLimparTudo.addEventListener('click', () => {
      if (confirm('Deseja realmente remover todos os favoritos?')) {
        saveFavorites([]);
        atualizarContadorFavoritos();
        renderizarListaFavoritos();
        renderizarProdutos(produtosAtuais);
        mostrarToast('Favoritos removidos.');
      }
    });
  }

  // Busca os produtos da API
  async function carregarProdutos() {
    mostrarCarregando('Carregando produtos...');
    tituloCatalogo.textContent = 'Todos os Produtos';
    selectCategoria.value = '';

    try {
      const produtos = await fetchProducts(30);
      produtosAtuais = produtos;

      if (produtos.length === 0) {
        mostrarVazio('Nenhum produto disponivel no momento.');
      } else {
        esconderFeedback();
        ordenarProdutos();
      }
    } catch (erro) {
      mostrarErro(erro.message, () => carregarProdutos());
    }
  }

  // Carrega as categorias no select
  async function carregarCategorias() {
    try {
      const categorias = await fetchCategories();
      selectCategoria.innerHTML = '<option value="">Todas as Categorias</option>';

      categorias.forEach(cat => {
        const option = document.createElement('option');
        if (typeof cat === 'object') {
          option.value = cat.slug;
          option.textContent = cat.name;
        } else {
          option.value = cat;
          option.textContent = formatarNomeCategoria(cat);
        }
        selectCategoria.appendChild(option);
      });
    } catch (erro) {
      console.warn('Erro ao carregar categorias:', erro);
    }
  }

  // Realiza a pesquisa
  async function buscarProdutos(termo) {
    mostrarCarregando(`Buscando por "${termo}"...`);
    tituloCatalogo.textContent = `Resultados para: "${termo}"`;

    try {
      const produtos = await searchProducts(termo);
      produtosAtuais = produtos;

      if (produtos.length === 0) {
        mostrarVazio(`Nenhum produto encontrado para "${termo}".`);
      } else {
        esconderFeedback();
        ordenarProdutos();
      }
    } catch (erro) {
      mostrarErro(erro.message, () => buscarProdutos(termo));
    }
  }

  // Filtra por categoria
  async function filtrarPorCategoria(categoria) {
    mostrarCarregando(`Carregando produtos de ${formatarNomeCategoria(categoria)}...`);
    tituloCatalogo.textContent = `Categoria: ${formatarNomeCategoria(categoria)}`;

    try {
      const produtos = await fetchProductsByCategory(categoria);
      produtosAtuais = produtos;

      if (produtos.length === 0) {
        mostrarVazio('Nenhum produto encontrado nesta categoria.');
      } else {
        esconderFeedback();
        ordenarProdutos();
      }
    } catch (erro) {
      mostrarErro(erro.message, () => filtrarPorCategoria(categoria));
    }
  }

  // Reseta os filtros e volta ao catalogo completo
  function resetarCatalogo() {
    inputBusca.value = '';
    btnLimparBusca.classList.remove('visible');
    selectOrdenacao.value = 'default';
    carregarProdutos();
  }

  // Renderiza os produtos na tela
  function renderizarProdutos(produtos) {
    gridProdutos.innerHTML = '';
    contadorResultados.textContent = `${produtos.length} produtos encontrados`;

    if (produtos.length === 0) return;

    produtos.forEach(produto => {
      const card = criarCardProduto(produto);
      gridProdutos.appendChild(card);
    });
  }

  // Cria o HTML do card de um produto
  function criarCardProduto(produto) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', produto.id);

    const favoritado = isFavorite(produto.id);
    const precoFormatado = formatCurrency(produto.price);
    const imagem = produto.thumbnail || (produto.images && produto.images[0]) || '';

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${imagem}" alt="${produto.title}" class="card-img" loading="lazy">
        <button type="button" class="btn-card-fav ${favoritado ? 'is-favorite' : ''}" title="${favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          ${favoritado ? '❤️' : '🤍'}
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="category-tag">${produto.category || 'Geral'}</span>
          <span class="rating-tag">⭐ ${produto.rating ? Number(produto.rating).toFixed(1) : 'N/A'}</span>
        </div>

        <h3 class="card-title" title="${produto.title}">
          ${produto.title}
        </h3>

        <div class="card-price-row">
          <span class="product-price">${precoFormatado}</span>
          ${produto.discountPercentage ? `<span class="discount-badge">-${Math.round(produto.discountPercentage)}%</span>` : ''}
        </div>

        <button type="button" class="btn btn-view-details">
          Ver Detalhes
        </button>
      </div>
    `;

    // Botao de favoritar no card
    const btnFav = card.querySelector('.btn-card-fav');
    btnFav.addEventListener('click', (e) => {
      e.stopPropagation();
      alternarFavorito(produto, btnFav);
    });

    // Botao de detalhes
    const btnDetalhes = card.querySelector('.btn-view-details');
    btnDetalhes.addEventListener('click', () => {
      abrirModal(produto.id);
    });

    // Clique no card tambem abre detalhes
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-card-fav')) {
        abrirModal(produto.id);
      }
    });

    return card;
  }

  // Ordena os produtos de acordo com o select
  function ordenarProdutos() {
    const opcao = selectOrdenacao.value;
    const lista = [...produtosAtuais];

    if (opcao === 'price-asc') {
      lista.sort((a, b) => a.price - b.price);
    } else if (opcao === 'price-desc') {
      lista.sort((a, b) => b.price - a.price);
    } else if (opcao === 'rating-desc') {
      lista.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (opcao === 'title-asc') {
      lista.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderizarProdutos(lista);
  }

  // Abre o modal de detalhes do produto
  async function abrirModal(id) {
    modalConteudo.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <div class="spinner"></div>
        <p>Carregando informacoes do produto...</p>
      </div>
    `;
    modalProduto.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
      const produto = await fetchProductById(id);
      renderizarConteudoModal(produto);
    } catch (erro) {
      modalConteudo.innerHTML = `
        <div class="feedback-box">
          <p style="color: var(--danger); font-weight: bold;">Erro ao carregar detalhes.</p>
          <p>${erro.message}</p>
        </div>
      `;
    }
  }

  // Renderiza as informacoes no modal
  function renderizarConteudoModal(produto) {
    const favoritado = isFavorite(produto.id);
    const preco = formatCurrency(produto.price);
    const principal = produto.images && produto.images.length > 0 ? produto.images[0] : (produto.thumbnail || '');
    const galeria = produto.images && produto.images.length > 1 ? produto.images : [principal];

    modalConteudo.innerHTML = `
      <div class="modal-grid">
        <div class="modal-gallery">
          <div class="modal-main-img-box">
            <img id="modal-main-img" src="${principal}" alt="${produto.title}">
          </div>
          ${galeria.length > 1 ? `
            <div class="modal-thumbs-row">
              ${galeria.map((url, i) => `
                <img src="${url}" class="modal-thumb ${i === 0 ? 'active' : ''}" alt="Foto ${i + 1}">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="modal-info">
          <span class="modal-brand">${produto.brand || produto.category || 'Geral'}</span>
          <h2 class="modal-title">${produto.title}</h2>
          
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem;">
            <span class="rating-tag">⭐ ${produto.rating || 'N/A'} / 5.0</span>
            <span class="category-tag">${produto.category || 'Geral'}</span>
            ${produto.availabilityStatus ? `<span class="badge" style="background:#10b981;">${produto.availabilityStatus}</span>` : ''}
          </div>

          <p class="modal-desc">${produto.description || 'Sem descricao disponivel.'}</p>

          <div class="modal-specs-list">
            <div class="modal-spec-item">
              <strong>Estoque:</strong>
              <span>${produto.stock ? `${produto.stock} unidades` : 'Disponivel'}</span>
            </div>
            <div class="modal-spec-item">
              <strong>Garantia:</strong>
              <span>${produto.warrantyInformation || 'Garantia padrao'}</span>
            </div>
            <div class="modal-spec-item">
              <strong>Envio:</strong>
              <span>${produto.shippingInformation || 'Pronta entrega'}</span>
            </div>
            <div class="modal-spec-item">
              <strong>Devolucao:</strong>
              <span>${produto.returnPolicy || '30 dias'}</span>
            </div>
          </div>

          <div class="modal-price-area">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Preco:</span>
              <span class="modal-price-val">${preco}</span>
            </div>
            <button type="button" id="modal-fav-btn" class="btn ${favoritado ? 'btn-favorites' : 'btn-primary'}">
              ${favoritado ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Troca de foto na galeria
    const thumbs = modalConteudo.querySelectorAll('.modal-thumb');
    const fotoPrincipal = modalConteudo.querySelector('#modal-main-img');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        fotoPrincipal.src = thumb.src;
      });
    });

    // Favoritar pelo modal
    const btnFavModal = modalConteudo.querySelector('#modal-fav-btn');
    btnFavModal.addEventListener('click', () => {
      alternarFavorito(produto, btnFavModal, true);
    });
  }

  function fecharModal() {
    modalProduto.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Alterna o estado de favorito
  function alternarFavorito(produto, botao, noModal = false) {
    const virouFavorito = toggleFavorite(produto);

    atualizarContadorFavoritos();

    if (noModal) {
      if (virouFavorito) {
        botao.className = 'btn btn-favorites';
        botao.textContent = '❤️ Remover dos Favoritos';
      } else {
        botao.className = 'btn btn-primary';
        botao.textContent = '🤍 Adicionar aos Favoritos';
      }
    }

    // Atualiza os botoes nos cards da vitrine
    const cards = gridProdutos.querySelectorAll(`[data-id="${produto.id}"] .btn-card-fav`);
    cards.forEach(btn => {
      if (virouFavorito) {
        btn.classList.add('is-favorite');
        btn.textContent = '❤️';
      } else {
        btn.classList.remove('is-favorite');
        btn.textContent = '🤍';
      }
    });

    if (drawerFavoritos.classList.contains('active')) {
      renderizarListaFavoritos();
    }

    mostrarToast(virouFavorito ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');
  }

  // Atualiza os badges de contador
  function atualizarContadorFavoritos() {
    const qtd = getFavorites().length;
    badgeFavoritos.textContent = qtd;
    drawerContador.textContent = qtd;
    btnLimparTudo.disabled = qtd === 0;
  }

  // Renderiza os favoritos no painel lateral
  function renderizarListaFavoritos() {
    const favoritos = getFavorites();
    listaFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
      listaFavoritos.innerHTML = `
        <div class="drawer-empty">
          <div class="drawer-empty-icon">❤️</div>
          <p><strong>Nenhum produto favoritado ainda</strong></p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Clique no coracao dos produtos para salva-los aqui.</p>
        </div>
      `;
      return;
    }

    favoritos.forEach(item => {
      const card = document.createElement('div');
      card.className = 'fav-item-card';

      card.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" class="fav-thumb">
        <div class="fav-info">
          <h4 class="fav-title" title="${item.title}">${item.title}</h4>
          <div class="fav-price">${formatCurrency(item.price)}</div>
        </div>
        <button type="button" class="btn-remove-fav" title="Remover dos favoritos">
          🗑️
        </button>
      `;

      // Remover item individual
      const btnRemover = card.querySelector('.btn-remove-fav');
      btnRemover.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFavorite(item.id);
        atualizarContadorFavoritos();
        renderizarListaFavoritos();
        renderizarProdutos(produtosAtuais);
        mostrarToast('Produto removido dos favoritos.');
      });

      // Clicar no item abre o modal dele
      card.addEventListener('click', () => {
        fecharFavoritos();
        abrirModal(item.id);
      });

      listaFavoritos.appendChild(card);
    });
  }

  function abrirFavoritos() {
    renderizarListaFavoritos();
    drawerFavoritos.classList.add('active');
    overlayFavoritos.classList.add('active');
  }

  function fecharFavoritos() {
    drawerFavoritos.classList.remove('active');
    overlayFavoritos.classList.remove('active');
  }

  // Estados de feedback visual
  function mostrarCarregando(msg) {
    gridProdutos.innerHTML = '';
    contadorResultados.textContent = 'Carregando...';
    feedbackContainer.innerHTML = `
      <div class="feedback-box">
        <div class="spinner"></div>
        <h3 class="feedback-title">${msg}</h3>
      </div>
    `;
    feedbackContainer.style.display = 'block';
  }

  function mostrarErro(msg, callbackTentarNovamente) {
    gridProdutos.innerHTML = '';
    contadorResultados.textContent = 'Erro';
    feedbackContainer.innerHTML = `
      <div class="feedback-box" style="border-color: #fca5a5;">
        <div class="feedback-icon">⚠️</div>
        <h3 class="feedback-title" style="color: var(--danger);">Ocorreu um erro</h3>
        <p class="feedback-desc">${msg}</p>
        <button type="button" id="btn-tentar-novamente" class="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    `;
    feedbackContainer.style.display = 'block';

    const btnTentar = document.getElementById('btn-tentar-novamente');
    if (btnTentar && callbackTentarNovamente) {
      btnTentar.addEventListener('click', callbackTentarNovamente);
    }
  }

  function mostrarVazio(msg) {
    gridProdutos.innerHTML = '';
    contadorResultados.textContent = '0 produtos';
    feedbackContainer.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-icon">🔍</div>
        <h3 class="feedback-title">Nenhum resultado</h3>
        <p class="feedback-desc">${msg}</p>
        <button type="button" id="btn-voltar-inicio" class="btn btn-primary">
          Ver Todos os Produtos
        </button>
      </div>
    `;
    feedbackContainer.style.display = 'block';

    const btnVoltar = document.getElementById('btn-voltar-inicio');
    if (btnVoltar) {
      btnVoltar.addEventListener('click', resetarCatalogo);
    }
  }

  function esconderFeedback() {
    feedbackContainer.innerHTML = '';
    feedbackContainer.style.display = 'none';
  }

  // Notificacao toast
  let timerToast;
  function mostrarToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Formata valor em Real (BRL)
  function formatCurrency(valor) {
    const preco = Number(valor) || 0;
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatarNomeCategoria(texto) {
    if (!texto) return '';
    return texto.replace(/-/g, ' ');
  }
});
