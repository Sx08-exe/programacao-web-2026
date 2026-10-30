// Chave usada no localStorage
const STORAGE_KEY = 'catalogo_favoritos';

// Pega a lista de favoritos do localStorage
function getFavorites() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (!dados) return [];
    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao ler favoritos:', erro);
    return [];
  }
}

// Salva a lista de favoritos no localStorage
function saveFavorites(favoritos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  } catch (erro) {
    console.error('Erro ao salvar favoritos:', erro);
  }
}

// Verifica se o produto ja esta favoritado
function isFavorite(id) {
  const favoritos = getFavorites();
  return favoritos.some(item => Number(item.id) === Number(id));
}

// Adiciona um produto aos favoritos
function addFavorite(produto) {
  const favoritos = getFavorites();
  const id = Number(produto.id);

  if (isFavorite(id)) return false;

  const itemFavorito = {
    id: id,
    title: produto.title,
    price: produto.price,
    thumbnail: produto.thumbnail || (produto.images && produto.images[0]) || '',
    category: produto.category || 'Geral'
  };

  favoritos.push(itemFavorito);
  saveFavorites(favoritos);
  return true;
}

// Remove um produto dos favoritos pelo ID
function removeFavorite(id) {
  const favoritos = getFavorites();
  const novaLista = favoritos.filter(item => Number(item.id) !== Number(id));
  
  if (novaLista.length !== favoritos.length) {
    saveFavorites(novaLista);
    return true;
  }
  return false;
}

// Alterna entre favoritar e desfavoritar
function toggleFavorite(produto) {
  if (isFavorite(produto.id)) {
    removeFavorite(produto.id);
    return false;
  } else {
    addFavorite(produto);
    return true;
  }
}
