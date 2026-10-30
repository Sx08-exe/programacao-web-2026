# Catálogo de Produtos - Trabalho 1

Trabalho em grupo desenvolvido para a disciplina de **Programação Web**.
A aplicação é um catálogo de produtos interativo feito em HTML, CSS e JavaScript puro (Frontend), integrado à API pública da [DummyJSON](https://dummyjson.com/products).

---

## Integrantes do Grupo

* **Sebastião Castilho Sanches Neto** - Matrícula: 2025013648
* **Thiago Carvalho Viana** - Matrícula: 2025014153
* **Ryan Guilherme Aguiar Cavalcante** - Matrícula: 2024008877 

---

## Funcionalidades

- **Listagem de produtos:** exibição em cards com imagem, nome, categoria, nota e preço formatado em Real (R$).
- **Pesquisa por nome:** campo de busca que consulta a API DummyJSON com o endpoint de busca.
- **Filtro por categoria e ordenação:** opções para filtrar por categorias e ordenar por preço (menor/maior), avaliação ou ordem alfabética.
- **Detalhes do produto:** modal que abre ao clicar no card, com fotos adicionais, estoque, garantia, política de devolução e descrição completa.
- **Favoritos com persistência:** permite favoritar e desfavoritar produtos. Os favoritos ficam salvos no navegador pelo `localStorage` (usando `JSON.stringify` e `JSON.parse`), mantendo a lista salva mesmo após recarregar a página.
- **Painel de favoritos:** gaveta lateral que lista todos os itens favoritados com botão para remover ou limpar tudo.
- **Tratamento de erros e loading:** mensagem visual com spinner enquanto os dados carregam e mensagem de aviso com botão de tentar novamente caso a conexão falhe.

---

## Tecnologias utilizadas

- **HTML5:** estrutura semântica (header, main, section, article, aside, footer).
- **CSS3:** estilização própria (sem frameworks como Bootstrap), com layout responsivo usando Flexbox e Grid.
- **JavaScript (Vanilla):** manipulação do DOM, Fetch API com async/await e persistência em localStorage.
- **API:** [DummyJSON Products API](https://dummyjson.com/products).

---

## Como executar

Basta abrir o arquivo `index.html` em qualquer navegador web (Google Chrome, Microsoft Edge, etc.) ou utilizar a extensão **Live Server** do VS Code.
