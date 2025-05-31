# Biblioteca IBT

Esse projeto tem como intuito fornecer um sistema capaz de controlar os empréstimos realizados na biblioteca da Igreja
Batista Trindade.

# Pré-requisitos

Como pré-requisito, você precisará ter instalado o [NodeJS](https://nodejs.org/en/download) em sua máquina.

# Configuração

Para realizar a configuração do projeto, você precisará realizar os seguintes passos:

1. Instalar as dependências necessárias com `npm install`
2. Criar um arquivo `.env` na pasta raiz do projeto e configurar a variável de ambiente `VITE_API_BASE_URL`.
    - Essa variável de ambiente se refere a URL base da API que o front-end consome.
3. Após isso, rode o projeto com o comando:

```shell
npm run dev
```

# Guia de Uso

## Acesso ao Sistema

* Login: Use seu email e senha cadastrados
* Registro: Novos usuários podem se cadastrar como leitores
* Perfis: O sistema possui 3 tipos de usuários:
    * Leitor: Pode pesquisar livros e gerenciar seus empréstimos
    * Bibliotecário: Pode gerenciar livros e empréstimos
    * Administrador: Todas as funções anteriores + gerenciamento dos usuários

## Navegação Principal

* Painel: Visão geral com estatísticas e atividades recentes
* Catálogo: Pesquisa e visualização de todos os livros
* Empréstimos: Gerenciamento de empréstimos ativos e histórico
* Usuários: Visualização e gerenciamento de usuários (bibliotecários/admins)
* Perfil: Editar dados pessoais e ver histórico de empréstimos

## Funcionalidades por Perfil

### 👤 Leitores

* Pesquisar livros no catálogo
* Ver detalhes dos livros
* Solicitar empréstimos (através de bibliotecário)
* Visualizar seus empréstimos ativos
* Editar perfil pessoal

### 📖 Bibliotecários

* Todas as funcionalidades de leitor +
* Adicionar novos livros ao sistema
* Editar informações de livros existentes
* Criar e gerenciar empréstimos
* Estender prazos de empréstimos
* Processar devoluções
* Visualizar todos os empréstimos do sistema

### 🔧 Administradores

* Todas as funcionalidades anteriores +
* Gerenciar usuários do sistema
* Alterar perfis de usuários
* Acesso completo a todas as estatísticas

### Dicas Importantes

* 🌙 Use o botão de tema para alternar entre modo claro/escuro
* 📱 O sistema é responsivo e funciona em dispositivos móveis
* 🔍 A pesquisa no catálogo é em tempo real
* ⏰ Empréstimos em atraso são destacados em vermelho
* 📊 O painel mostra estatísticas atualizadas do sistema

# Evidências

A seguir, evidências da apresentação e treinamento de uso do sistema aos líderes da igreja.

<div align="center">
   <img src="./20250525_201202.jpg" width="49%">
   <img src="./20250525_201021.jpg" width="49%">
</div>
