# 🏆 Concurso de Simulação de Carteiras de Investimentos

> **Landing Page Interativa desenvolvida para a disciplina de Programação Web.**  
> Integração completa de **HTML5 Semântico**, **CSS3 Externo com Design Moderno**, **Manipulação do DOM** e **Eventos com JavaScript Puro** (Vanilla JS).

---

## 📌 Sobre o Projeto

Este projeto consiste em uma landing page interativa de apresentação e engajamento para o **Concurso de Simulação de Carteiras de Investimentos (IBOV & IFIX)**. O objetivo da competição é desafiar os participantes a montar uma carteira teórica de R$ 10.000,00 distribuída entre Ações e Fundos Imobiliários durante 60 dias, disputando o prêmio do livro *"A Psicologia Financeira"* de Morgan Housel.

A página foi construída atendendo 100% dos requisitos do edital da atividade prática, sem uso de frameworks, APIs externas ou bibliotecas pesadas.

---

## 🎯 Cumprimento dos Requisitos da Atividade

### 3.1 HTML: Estrutura
- [x] Arquivo `index.html` com estrutura completa (`<!DOCTYPE html>`, `<head>` e `<body>`).
- [x] Conteúdo temático completo: Título, prazos, regras de alocação, tabela oficial de ativos de exemplo, simulador, formulário e material educativo.
- [x] Utilização de tags semânticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- [x] Campos de entrada (`<input>`, `<textarea>`) e múltiplos botões (`<button>`).

### 3.2 CSS: Estilização
- [x] CSS externo no arquivo `estilo.css`, vinculado via `<link rel="stylesheet">`.
- [x] Aplicação de paleta de cores temática moderna (tons de azul financeiro, verde esmeralda e destaques), espaçamentos consistentes, sombras suaves e tipografia moderna.
- [x] Uso de múltiplos seletores CSS:
  - **Por tag**: `body`, `h1`, `h2`, `table`, `th`, `td`, `footer`, etc.
  - **Por classe**: `.hero-section`, `.card`, `.btn-primary`, `.badge-tipo`, `.tabela-container`, etc.
  - **Por id**: `#btn-tema`, `#campo-busca`, `#simulador`, `#mensagem-confirmacao`, etc.
- [x] **Suporte a Tema Escuro e Claro** completo via classes e variáveis CSS (`:root` e `.dark-mode`).
- [x] Layout 100% responsivo para celulares, tablets e computadores.

### 3.3 DOM: Manipulação da Página
- [x] Seleção de elementos com `document.getElementById()` e `document.querySelectorAll()`.
- [x] Alteração dinâmica de texto com `.textContent` (contadores, mensagens de busca, alternância de texto do tema e do botão expansor).
- [x] Alteração dinâmica de conteúdo com `.innerHTML` (card detalhado de confirmação de inscrição).
- [x] Leitura de valores digitados pelo usuário com `.value` (campo de busca, capital simulado, percentual de ações, formulário de inscrição).
- [x] Alteração de aparência e estilos em tempo real via `.style` (ex.: `.style.display`, `.style.borderColor`, `.style.width`, `.style.transform`, `.style.color`).

### 3.4 Eventos: Interação com o Usuário
- [x] Registro de eventos exclusivamente via `addEventListener()`.
- [x] Eventos implementados:
  1. **`click`**: Alternância de Tema Claro / Escuro (`#btn-tema`).
  2. **`click`**: Contador interativo de curtidas/apoios (`#btn-curtir`).
  3. **`click`**: Filtros rápidos de categoria de ativos (Todos / Ações / FIIs).
  4. **`click`**: Expandir / recolher material complementar de cotações (`#btn-toggle-dicas`).
  5. **`input`**: Filtro e busca em tempo real na tabela de ativos (`#campo-busca`).
  6. **`input` / `change`**: Recálculo dinâmico da alocação de carteira e barra de progresso no simulador.
  7. **`submit`**: Envio do formulário de inscrição com interceptação obrigatória via `event.preventDefault()` e validação interativa.

---

## 📂 Estrutura de Arquivos

```text
pg_web/
├── index.html        # Estrutura HTML5 semântica e acessível
├── estilo.css        # Folha de estilos externa com temas claro/escuro e responsividade
├── script.js         # Lógica JavaScript pura (DOM, eventos e interações)
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Documentação e instruções de uso
```

---

## 🚀 Como Executar Localmente

Como o projeto foi desenvolvido em **HTML, CSS e JavaScript puro**:

1. Basta dar um **duplo clique no arquivo `index.html`** no seu computador.
2. A página abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

---

## 🌐 Publicação no GitHub e Deploy na Vercel

### 1. Inicializar e Subir para o GitHub:
```bash
# Inicializar o repositório local
git init

# Adicionar todos os arquivos
git add .

# Realizar o primeiro commit
git commit -m "feat: landing page interativa do concurso de carteiras de investimentos"

# Conectar ao seu repositório remoto do GitHub
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git

# Enviar os arquivos
git push -u origin main
```

### 2. Hospedar na Vercel:
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Importe o repositório que você acabou de criar no GitHub.
4. O framework preset será detectado automaticamente como **"Other"** (HTML estático).
5. Clique em **"Deploy"**. Em segundos sua landing page estará online com link seguro (`https://...vercel.app`).

---

## 📦 Envio da Atividade (SIGAA)

Para a entrega no SIGAA:
1. Renomeie a pasta ou crie uma pasta com seu nome conforme o edital (ex.: `landing-page-seu-nome`).
2. Garanta que dentro dela estão `index.html`, `estilo.css` e `script.js`.
3. Compacte em formato `.zip`.
4. Envie o arquivo `.zip` na tarefa do SIGAA e compartilhe o link do repositório no GitHub e na Vercel.
