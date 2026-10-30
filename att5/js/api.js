// URL base da API publica
const API_URL = 'https://dummyjson.com';

// Busca lista de produtos
async function fetchProducts(limit = 30) {
  try {
    const resposta = await fetch(`${API_URL}/products?limit=${limit}`);

    if (!resposta.ok) {
      throw new Error(`Erro na requisicao: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados.products || [];
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    throw new Error('Nao foi possivel carregar os produtos. Tente novamente.');
  }
}

// Pesquisa produtos pelo termo digitado
async function searchProducts(termo) {
  try {
    const resposta = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(termo)}`);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados.products || [];
  } catch (erro) {
    console.error('Erro na pesquisa:', erro);
    throw new Error('Nao foi possivel realizar a busca.');
  }
}

// Busca os detalhes de um produto especifico
async function fetchProductById(id) {
  try {
    const resposta = await fetch(`${API_URL}/products/${id}`);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar produto: ${resposta.status}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao buscar detalhes do produto:', erro);
    throw new Error('Nao foi possivel carregar os detalhes do produto.');
  }
}

// Busca as categorias disponiveis
async function fetchCategories() {
  try {
    const resposta = await fetch(`${API_URL}/products/categories`);
    if (!resposta.ok) return [];
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    return [];
  }
}

// Filtra produtos por categoria
async function fetchProductsByCategory(categoria) {
  try {
    const resposta = await fetch(`${API_URL}/products/category/${encodeURIComponent(categoria)}`);

    if (!resposta.ok) {
      throw new Error(`Erro ao filtrar categoria: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados.products || [];
  } catch (erro) {
    console.error('Erro ao filtrar produtos:', erro);
    throw new Error('Nao foi possivel carregar os produtos dessa categoria.');
  }
}
